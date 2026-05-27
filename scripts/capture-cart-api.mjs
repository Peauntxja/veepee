#!/usr/bin/env node
/**
 * Capture les requêtes réseau lors d'un « Achat express » sur veepee.fr
 *
 * Usage:
 *   npm run crawl:capture-cart
 *   npm run crawl:capture-cart -- --headed --login
 *   npm run crawl:capture-cart -- --storage .veepee-auth.json
 *   npm run crawl:capture-cart -- --url https://www.veepee.fr/gr/catalog/903484/24707502
 *
 * Mode --login : ouvre Chrome visible, connectez-vous manuellement puis appuyez Entrée.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "api-snapshots", "raw");

const DEFAULT_CATALOG_URL =
  "https://www.veepee.fr/gr/catalog/903484/24707502";

function parseArgs() {
  const urlIdx = process.argv.indexOf("--url");
  const storageIdx = process.argv.indexOf("--storage");
  return {
    catalogUrl: urlIdx >= 0 ? process.argv[urlIdx + 1] : DEFAULT_CATALOG_URL,
    headed: process.argv.includes("--headed") || process.argv.includes("--login"),
    login: process.argv.includes("--login"),
    storagePath: storageIdx >= 0 ? path.resolve(process.argv[storageIdx + 1]) : null,
    saveStorage: process.argv.includes("--save-storage"),
  };
}

function isInterestingRequest(url, method) {
  const u = url.toLowerCase();
  const keywords = [
    "cart",
    "basket",
    "panier",
    "checkout",
    "order",
    "catalog",
    "item",
    "line",
    "express",
    "reservation",
    "stock",
    "orderpipe",
    "commerce",
    "vpgrp",
    "gbs",
    "graphql",
  ];
  if (method !== "GET") return true;
  return keywords.some((kw) => u.includes(kw));
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return typeof text === "string" ? text.slice(0, 8000) : null;
  }
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

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright requis");
    process.exit(1);
  }

  const { catalogUrl, headed, login, storagePath, saveStorage } = parseArgs();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const stamp = new Date().toISOString().slice(0, 10);
  const harPath = path.join(OUT_DIR, `cart-flow-${stamp}.har`);
  const captured = [];
  const allApiHosts = new Set();

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
    recordHar: { path: harPath, mode: "minimal", content: "embed" },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  page.on("response", async (response) => {
    const request = response.request();
    const url = request.url();
    const method = request.method();

    if (!isInterestingRequest(url, method)) return;
    if (/\.(jpg|jpeg|png|webp|woff2?|svg|ico)(\?|$)/i.test(url)) return;
    if (url.includes("sentry.veepee") || url.includes("datadome") || url.includes("frontendlogger")) {
      return;
    }

    try {
      const host = new URL(url).host;
      allApiHosts.add(host);
    } catch {
      /* ignore */
    }

    let responseBody = null;
    try {
      const contentType = response.headers()["content-type"] ?? "";
      if (contentType.includes("json") || contentType.includes("text/plain")) {
        const text = await response.text();
        responseBody = safeJsonParse(text);
      }
    } catch {
      responseBody = null;
    }

    captured.push({
      method,
      url,
      status: response.status(),
      resourceType: request.resourceType(),
      postData: request.postData() ?? null,
      responseBody,
      timestamp: new Date().toISOString(),
    });
  });

  if (login && !storageState) {
    console.log("→ Ouvrez la fenêtre Chrome, connectez-vous sur veepee.fr");
    console.log(`→ Puis naviguez vers: ${catalogUrl}`);
    await page.goto("https://www.veepee.fr/gr/authentication", {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await waitForEnter("Appuyez sur Entrée une fois connecté et sur la page catalog… ");
  }

  console.log(`→ ${catalogUrl}`);
  await page.goto(catalogUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(5000);

  const pageState = await page.evaluate(() => ({
    title: document.title,
    url: location.href,
    onAuth: location.pathname.includes("authentication"),
    expressCount: [...document.querySelectorAll("button, a, [role='button']")].filter((el) =>
      /achat express/i.test(el.textContent ?? ""),
    ).length,
  }));

  console.log(
    `  page: "${pageState.title}" | auth redirect: ${pageState.onAuth} | express: ${pageState.expressCount}`,
  );

  let clickResult = { clicked: false, reason: "" };

  if (!pageState.onAuth) {
    const expressBtn = page.locator("button:has-text('Achat express'), a:has-text('Achat express')").first();
    try {
      if (await expressBtn.isVisible({ timeout: 8000 })) {
        await expressBtn.click({ timeout: 10000 });
        clickResult = { clicked: true, target: "achat express" };
        await page.waitForTimeout(4000);
      } else {
        clickResult = { clicked: false, reason: "Bouton Achat express introuvable" };
      }
    } catch (error) {
      clickResult = { clicked: false, reason: String(error) };
    }
  } else {
    clickResult = {
      clicked: false,
      reason: "Redirigé vers login — utilisez --login ou --storage .veepee-auth.json",
    };
  }

  const miniCart = await page.evaluate(() => ({
    hasConservé: document.body.innerText.includes("Conservé dans le panier"),
    hasAccederPanier: document.body.innerText.includes("Accéder au panier"),
    cartBadge: document.body.innerText.match(/\d{1,2}:\d{2}/)?.[0] ?? null,
  }));

  if (saveStorage || login) {
    const outStorage = storagePath ?? path.join(ROOT, ".veepee-auth.json");
    await context.storageState({ path: outStorage });
    console.log(`✓ session sauvegardée → ${outStorage}`);
  }

  await context.close();
  await browser.close();

  const outPath = path.join(OUT_DIR, `cart-api-capture-${stamp}.json`);
  const postRequests = captured.filter((r) => r.method !== "GET");

  const payload = {
    meta: {
      source: "capture-cart-api.mjs",
      capturedAt: new Date().toISOString(),
      catalogUrl,
      clickResult,
      miniCart,
      pageState,
      apiHosts: [...allApiHosts],
      harPath: path.relative(ROOT, harPath),
      requestCount: captured.length,
      postCount: postRequests.length,
      note: "Orderpipe (panier Veepee) est interne vpgrp — nécessite session membre authentifiée",
    },
    requests: captured,
  };

  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`\n✓ ${outPath}`);
  console.log(`✓ HAR → ${harPath}`);
  console.log(`✓ ${captured.length} requêtes (${postRequests.length} POST/PUT/PATCH/DELETE)`);

  if (postRequests.length > 0) {
    console.log("\nCandidats add-to-cart:");
    for (const req of postRequests.slice(0, 20)) {
      console.log(`  ${req.method} ${req.status} ${req.url}`);
    }
    console.log(`\nImport: npm run crawl:import-har -- ${harPath}`);
  } else if (pageState.onAuth) {
    console.log("\n⚠ Pas de requête panier — relancez avec session:");
    console.log("  npm run crawl:capture-cart -- --headed --login");
    console.log("  npm run crawl:capture-cart -- --storage .veepee-auth.json");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
