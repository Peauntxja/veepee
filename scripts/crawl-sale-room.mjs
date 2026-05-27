#!/usr/bin/env node
/**
 * Crawl sale room /gr/catalog/{operationId}/{catalogId} (requires member session for full data).
 *
 * Usage:
 *   npm run crawl:sale-room -- --operation 903484 --catalog 24707502
 *   npm run crawl:sale-room -- --headed --login
 *   npm run crawl:sale-room -- --storage .veepee-auth.json
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "api-snapshots", "raw");
const SNAPSHOT_PATH = path.join(ROOT, "data", "api-snapshots", "sale-rooms.json");

function parseArgs() {
  const opIdx = process.argv.indexOf("--operation");
  const catIdx = process.argv.indexOf("--catalog");
  const storageIdx = process.argv.indexOf("--storage");
  return {
    operationId: opIdx >= 0 ? process.argv[opIdx + 1] : "903484",
    catalogId: catIdx >= 0 ? process.argv[catIdx + 1] : "24707502",
    headed: process.argv.includes("--headed") || process.argv.includes("--login"),
    login: process.argv.includes("--login"),
    storagePath: storageIdx >= 0 ? path.resolve(process.argv[storageIdx + 1]) : null,
    saveStorage: process.argv.includes("--save-storage"),
  };
}

function waitForEnter(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(message, () => {
      rl.close();
      resolve();
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function extractSaleRoom(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const sidebar = [...document.querySelectorAll("aside a, nav a, [role='navigation'] a")]
      .map((a) => ({
        label: a.textContent?.trim() ?? "",
        href: a.getAttribute("href") ?? "",
      }))
      .filter((item) => item.label.length > 2 && item.label.length < 80)
      .slice(0, 20);

    const cards = [...document.querySelectorAll("article, [data-testid*='product']")].slice(0, 40);
    const products = cards
      .map((card, index) => {
        const img = card.querySelector("img");
        const brand =
          card.querySelector("[data-testid='product-brand']")?.textContent?.trim() ??
          img?.alt?.split(" ")[0] ??
          "";
        const name =
          card.querySelector("[data-testid='product-description']")?.textContent?.trim() ??
          img?.alt ??
          `Product ${index + 1}`;
        const priceText =
          card.querySelector("[data-testid='product-price']")?.textContent?.trim() ?? "";
        const priceMatch = priceText.match(/([\d]+[,.][\d]{2})/);
        return {
          id: `crawled-${index + 1}`,
          brand,
          name,
          imageUrl: (img?.currentSrc || img?.src || "").split("?")[0],
          priceText,
          price: priceMatch ? Number.parseFloat(priceMatch[1].replace(",", ".")) : 0,
        };
      })
      .filter((item) => item.imageUrl.includes("media.veepee") || item.name.length > 3);

    return {
      url: location.href,
      title: document.title,
      brandName: h1?.textContent?.trim() ?? "",
      sidebar,
      products,
    };
  });
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright requis");
    process.exit(1);
  }

  const { operationId, catalogId, headed, login, storagePath, saveStorage } = parseArgs();
  const catalogUrl = `https://www.veepee.fr/gr/catalog/${operationId}/${catalogId}`;
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const storageState = storagePath && fs.existsSync(storagePath) ? storagePath : undefined;
  const browser = await chromium
    .launch({
      headless: !headed,
      channel: process.platform === "darwin" ? "chrome" : undefined,
    })
    .catch(() => chromium.launch({ headless: !headed }));

  const context = await browser.newContext({
    locale: "fr-FR",
    storageState,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  if (login && !storageState) {
    await page.goto("https://www.veepee.fr/gr/authentication", { waitUntil: "domcontentloaded" });
    await waitForEnter("Connectez-vous dans le navigateur, puis appuyez sur Entrée… ");
    if (saveStorage) {
      await context.storageState({ path: path.join(ROOT, ".veepee-auth.json") });
      console.log("✓ Session → .veepee-auth.json");
    }
  }

  console.log(`→ ${catalogUrl}`);
  await page.goto(catalogUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(4000);

  for (let step = 0; step < 6; step += 1) {
    await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.85)));
    await page.waitForTimeout(900);
  }

  const extracted = await extractSaleRoom(page);
  console.log(`  ✓ ${extracted.brandName || extracted.title}`);
  console.log(`  ✓ ${extracted.products.length} produits`);

  if (extracted.url.includes("/authentication")) {
    console.warn("  ⚠ Redirigé vers login — utilisez --login ou --storage .veepee-auth.json");
  }

  await browser.close();

  const stamp = new Date().toISOString().slice(0, 10);
  const rawPath = path.join(OUT_DIR, `sale-room-${operationId}-${stamp}.json`);
  fs.writeFileSync(
    rawPath,
    `${JSON.stringify({ meta: { catalogUrl, fetchedAt: new Date().toISOString() }, ...extracted }, null, 2)}\n`,
  );
  console.log(`✓ ${rawPath}`);

  if (extracted.products.length > 0 && !extracted.url.includes("/authentication")) {
    const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
    const key = `${operationId}:${catalogId}`;
    snapshot.operationCatalogMap[operationId] = catalogId;
    snapshot.rooms[key] = {
      operationId,
      catalogId,
      brandName: extracted.brandName || "Vente",
      categoryTab: "mode",
      sidebar: extracted.sidebar.slice(0, 8).map((item, index) => ({
        id: slugify(item.label) || `cat-${index}`,
        label: item.label,
        active: index === 0,
      })),
      products: extracted.products.slice(0, 24).map((item) => ({
        id: item.id,
        brand: item.brand || extracted.brandName,
        name: item.name,
        description: item.name,
        imageUrl: item.imageUrl,
        pricing: {
          price: item.price || 12.99,
          retailPrice: item.price ? item.price * 2.5 : 34.9,
          discount: 60,
        },
        defaultSize: "Taille unique",
        sizeOptions: [{ id: "tu", name: "Taille unique", stockLabel: "Disponible" }],
      })),
    };
    snapshot.meta = {
      source: `crawl-sale-room.mjs → ${path.basename(rawPath)}`,
      fetchedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
    console.log(`✓ sale-rooms.json mis à jour (${key})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
