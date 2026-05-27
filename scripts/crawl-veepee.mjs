#!/usr/bin/env node
/**
 * Crawl veepee.fr via Playwright (nécessite: npm install -D playwright && npx playwright install chromium)
 *
 * Usage:
 *   npm run crawl:veepee
 *   npm run crawl:veepee -- --pages home,mode,maison
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "api-snapshots", "raw");

const PAGES = {
  home: "https://www.veepee.fr/gr/home/default",
  mode: "https://www.veepee.fr/gr/h/mode",
  maison: "https://www.veepee.fr/gr/h/maison",
  voyage: "https://www.veepee.fr/gr/voyage/default",
  enfant: "https://www.veepee.fr/gr/h/mode-enfant",
  chaussures: "https://www.veepee.fr/gr/h/mode-chaussures",
  beaute: "https://www.veepee.fr/gr/h/beaute-et-bien-etre",
  sport: "https://www.veepee.fr/gr/h/mode-sportswear",
  vin: "https://www.veepee.fr/gr/h/vin-et-epicerie",
  loisir: "https://www.veepee.fr/gr/h/loisirs",
  auth: "https://www.veepee.fr/gr/authentication",
};

function parsePageFilter() {
  const idx = process.argv.indexOf("--pages");
  if (idx < 0) return Object.keys(PAGES);
  return process.argv[idx + 1].split(",").map((s) => s.trim());
}

async function extractPage(page) {
  return page.evaluate(() => {
    const banners = [...document.querySelectorAll('[data-testid^="banner-link-"]')].map((a) => ({
      testId: a.getAttribute("data-testid"),
      operationId: a.getAttribute("data-testid")?.replace("banner-link-", ""),
      href: a.getAttribute("href") || a.href,
      target: a.getAttribute("target"),
      alt: a.querySelector("img")?.alt ?? "",
      src: a.querySelector("img")?.currentSrc || a.querySelector("img")?.src || "",
      articleText: a.closest("article")?.textContent?.trim().replace(/\s+/g, " ").slice(0, 250) ?? "",
    }));

    const tabs = [...document.querySelectorAll("a")].filter((a) =>
      /\/gr\/(home|h|voyage)/.test(a.href),
    ).map((a) => ({ text: a.textContent?.trim(), href: a.pathname }));

    const h1 = document.querySelector("h1");
    const intro = h1?.nextElementSibling?.textContent?.trim() ?? "";

    const bgImage = [...document.querySelectorAll("*")]
      .map((el) => getComputedStyle(el).backgroundImage)
      .find((bg) => bg.includes("media.veepee"));

    return {
      url: location.href,
      title: document.title,
      h1: h1?.textContent?.trim() ?? "",
      intro: intro.slice(0, 600),
      backgroundImage: bgImage ?? null,
      banners,
      tabs: [...new Map(tabs.filter((t) => t.text).map((t) => [t.href, t])).values()].slice(0, 15),
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

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const pageKeys = parsePageFilter();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "fr-FR",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  const results = {};
  for (const key of pageKeys) {
    const url = PAGES[key];
    if (!url) {
      console.warn(`Page inconnue: ${key}`);
      continue;
    }
    console.log(`→ ${key}: ${url}`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(2000);
      results[key] = await extractPage(page);
      console.log(`  ✓ ${results[key].banners.length} bannières`);
    } catch (error) {
      console.log(`  ✗ ${error.message}`);
      results[key] = { error: String(error), url };
    }
  }

  await browser.close();

  const stamp = new Date().toISOString().slice(0, 10);
  const outPath = path.join(OUT_DIR, `crawl-playwright-${stamp}.json`);
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        meta: { source: "playwright crawl", fetchedAt: new Date().toISOString(), pages: pageKeys },
        results,
      },
      null,
      2,
    ),
  );

  console.log(`\nÉcrit: ${outPath}`);
  console.log("Puis: npm run crawl:import --", outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
