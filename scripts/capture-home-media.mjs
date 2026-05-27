#!/usr/bin/env node
/**
 * Télécharge les visuels homepage depuis veepee.fr via Playwright (session navigateur).
 *
 * Usage:
 *   npm run crawl:capture-home
 *   npm run crawl:capture-home -- --force
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "assets", "images");
const MANIFEST_PATH = path.join(__dirname, "image-manifest.json");
const HOME_PATH = path.join(ROOT, "data", "api-snapshots", "home.json");
const RAW_DIR = path.join(ROOT, "data", "api-snapshots", "raw");
const FORCE = process.argv.includes("--force");
const HOME_URL = "https://www.veepee.fr/gr/home/default";

const BRAND_LOCAL_IDS = {
  fortuneo: "sale-fortuneo",
  "happy hours": "sale-happy-hours",
  "petit bateau": "sale-petit-bateau",
  backsun: "sale-backsun",
  villages: "sale-villages",
  ooni: "sale-ooni",
  geox: "sale-geox",
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function upsertManifestEntry(manifest, entry) {
  const index = manifest.images.findIndex((item) => item.id === entry.id);
  if (index >= 0) manifest.images[index] = { ...manifest.images[index], ...entry };
  else manifest.images.push(entry);
}

function guessLocalId(brandName, operationId) {
  const key = brandName.toLowerCase();
  for (const [needle, id] of Object.entries(BRAND_LOCAL_IDS)) {
    if (key.includes(needle)) return id;
  }
  return `sale-op-${operationId}`;
}

async function fetchBase64InPage(page, url) {
  return page.evaluate(async (targetUrl) => {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }, url);
}

async function saveImage(page, manifest, { id, url, relPath }) {
  const dest = path.join(OUT_DIR, relPath);
  if (fs.existsSync(dest) && !FORCE) {
    console.log(`skip  ${id}`);
    return dest;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const base64 = await fetchBase64InPage(page, url);
  const buffer = Buffer.from(base64, "base64");
  if (buffer.length < 512) {
    throw new Error("file too small");
  }
  fs.writeFileSync(dest, buffer);

  upsertManifestEntry(manifest, {
    id,
    url,
    path: relPath,
    referer: "https://www.veepee.fr/",
    note: "Captured via Playwright session",
  });

  console.log(`ok    ${id} → ${relPath} (${buffer.length} bytes)`);
  return dest;
}

function parseBrandFromAlt(alt) {
  if (!alt) return { brandName: "", subtitle: "" };
  const parts = alt.trim().split(/\s{2,}/);
  if (parts.length >= 2) {
    return { brandName: parts[0], subtitle: parts.slice(1).join(" ") };
  }
  const firstSpace = alt.indexOf(" ");
  if (firstSpace < 0) return { brandName: alt, subtitle: "" };
  return {
    brandName: alt.slice(0, firstSpace),
    subtitle: alt.slice(firstSpace + 1).trim(),
  };
}

function buildOperationFromBanner(banner) {
  const operationId = banner.operationId;
  const parsed = parseBrandFromAlt(banner.alt);
  const brandName =
    operationId === "19531"
      ? "Fortuneo Banque"
      : operationId === "20355"
        ? "Villages Clubs du Soleil"
        : parsed.brandName || `Operation ${operationId}`;
  const subtitle =
    operationId === "19531"
      ? "J'aime ma banque"
      : operationId === "20355"
        ? "Séjours tout compris"
        : parsed.subtitle || "";

  const localId = guessLocalId(brandName, operationId);
  const operation = {
    operationId,
    brandName,
    subtitle,
    bannerImageUrl: banner.srcBase,
    bannerLocalId: localId,
    categoryTab: "home",
    status: "live",
  };

  if (operationId === "19531" || operationId === "20355") {
    operation.tags = [
      { type: "PUBLICITE", label: "Publicité", position: "topRight" },
    ];
  }
  if (operationId === "900361") {
    operation.tags = [
      { type: "SHIPPING", label: "Expédié en 72h", position: "topRight" },
    ];
  }
  if (operationId === "907320") {
    operation.discountLabel = "-80%";
  }
  if (operationId === "894462") {
    operation.href = "/gr/h/maison";
  }
  if (operationId === "903937") {
    operation.href = "/gr/h/mode-enfant";
  }

  return operation;
}

async function extractHomeData(page) {
  return page.evaluate(() => {
    const banners = [...document.querySelectorAll('[data-testid^="banner-link-"]')].map((link) => {
      const img = link.querySelector("img");
      const src = img?.currentSrc || img?.src || "";
      return {
        testId: link.getAttribute("data-testid"),
        operationId: link.getAttribute("data-testid")?.replace("banner-link-", "") ?? "",
        alt: img?.alt ?? "",
        src,
        srcBase: src.split("?")[0],
      };
    });

    const backgroundImage = [...document.querySelectorAll("*")]
      .map((el) => getComputedStyle(el).backgroundImage)
      .find((bg) => bg.includes("media.veepee"));

    const bgMatch = backgroundImage?.match(/url\("([^"]+)"\)/);
    const h1 = document.querySelector("h1");

    return {
      url: location.href,
      title: h1?.textContent?.trim() ?? "",
      subtitle: h1?.nextElementSibling?.textContent?.trim() ?? "",
      backgroundImageUrl: bgMatch?.[1] ?? null,
      banners,
    };
  });
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright non installé. Exécutez:");
    console.error("  npm install -D playwright");
    console.error("  npx playwright install chromium");
    process.exit(1);
  }

  const manifest = readJson(MANIFEST_PATH);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "fr-FR",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  console.log(`→ ${HOME_URL}`);
  await page.goto(HOME_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  // Guest wall blurs banners — they exist in DOM but fail Playwright "visible" checks.
  await page.waitForSelector('[data-testid^="banner-link-"]', { state: "attached", timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  const extracted = await extractHomeData(page);
  console.log(`  ✓ ${extracted.banners.length} bannières, background: ${extracted.backgroundImageUrl ? "yes" : "no"}`);

  if (extracted.backgroundImageUrl) {
    await saveImage(page, manifest, {
      id: "home-jungle",
      url: extracted.backgroundImageUrl,
      relPath: "backgrounds/home-jungle.jpg",
    });
  }

  const operations = [];
  for (const banner of extracted.banners) {
    if (!banner.srcBase) continue;
    const operation = buildOperationFromBanner(banner);
    const relPath = `sales/${operation.bannerLocalId.replace(/^sale-/, "")}.jpg`;
    await saveImage(page, manifest, {
      id: operation.bannerLocalId,
      url: banner.srcBase,
      relPath,
    });
    operations.push(operation);
  }

  await browser.close();

  writeJson(MANIFEST_PATH, manifest);

  const home = readJson(HOME_PATH);
  home.meta = {
    ...home.meta,
    title: extracted.title || home.meta.title,
    subtitle: extracted.subtitle || home.meta.subtitle,
    guestVisibleRatio: home.meta.guestVisibleRatio ?? 0.1,
    guestVisibleMin: 2,
    source: "playwright capture-home-media.mjs",
    fetchedAt: new Date().toISOString(),
  };
  home.operations = operations.length > 0 ? operations : home.operations;
  writeJson(HOME_PATH, home);

  const rawPath = path.join(
    RAW_DIR,
    `crawl-live-${new Date().toISOString().slice(0, 10)}.json`,
  );
  writeJson(rawPath, {
    meta: {
      source: "playwright capture-home-media",
      fetchedAt: new Date().toISOString(),
    },
    home: {
      meta: home.meta,
      backgroundImageUrl: extracted.backgroundImageUrl,
      operations: home.operations,
      valuePropositions: home.valuePropositions,
    },
  });

  console.log(`\n✓ home.json (${home.operations.length} opérations)`);
  console.log(`✓ ${rawPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
