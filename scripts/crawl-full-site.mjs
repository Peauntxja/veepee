#!/usr/bin/env node
/**
 * Crawl complet veepee.fr : données + téléchargement médias (session navigateur).
 *
 * Usage:
 *   npm run crawl:full
 *   npm run crawl:full -- --pages home,mode,maison
 *   npm run crawl:full -- --skip-media
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "api-snapshots", "raw");
const IMG_OUT = path.join(ROOT, "public", "assets", "images");
const MANIFEST_PATH = path.join(__dirname, "image-manifest.json");
const SKIP_MEDIA = process.argv.includes("--skip-media");

/** official URL → clé locale catalog / categoryTab */
const SITE_PAGES = {
  home: {
    url: "https://www.veepee.fr/gr/home/default",
    kind: "home",
  },
  mode: {
    url: "https://www.veepee.fr/gr/h/mode",
    kind: "hub",
    categoryId: "mode",
  },
  maison: {
    url: "https://www.veepee.fr/gr/h/maison",
    kind: "hub",
    categoryId: "maison",
  },
  voyage: {
    url: "https://www.veepee.fr/gr/voyage/default",
    kind: "hub",
    categoryId: "voyage",
  },
  enfant: {
    url: "https://www.veepee.fr/gr/h/mode-enfant",
    kind: "hub",
    categoryId: "enfant",
  },
  chaussures: {
    url: "https://www.veepee.fr/gr/h/mode-chaussures",
    kind: "hub",
    categoryId: "chaussures",
  },
  beaute: {
    url: "https://www.veepee.fr/gr/h/beaute-et-bien-etre",
    kind: "hub",
    categoryId: "beaute",
  },
  sport: {
    url: "https://www.veepee.fr/gr/h/mode-sportswear",
    kind: "hub",
    categoryId: "sport",
  },
  vin: {
    url: "https://www.veepee.fr/gr/h/vin-et-epicerie",
    kind: "hub",
    categoryId: "vin",
  },
  loisir: {
    url: "https://www.veepee.fr/gr/h/loisirs",
    kind: "hub",
    categoryId: "loisir",
  },
  rosedeals: {
    url: "https://www.veepee.fr/gr/h/rosedeals-coupons",
    kind: "hub",
    categoryId: "rosedeals",
  },
  "the-place": {
    url: "https://www.veepee.fr/gr/home/brandsplace",
    kind: "hub",
    categoryId: "the-place",
  },
  auth: {
    url: "https://www.veepee.fr/gr/authentication",
    kind: "auth",
  },
  registration: {
    url: "https://www.veepee.fr/gr/registration",
    kind: "auth",
  },
};

function parsePageFilter() {
  const idx = process.argv.indexOf("--pages");
  if (idx < 0) return Object.keys(SITE_PAGES);
  return process.argv[idx + 1].split(",").map((s) => s.trim());
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function mediaIdFromUrl(url) {
  const match = url.match(/\/media\/([a-f0-9-]+)/i);
  return match ? `media-${match[1].slice(0, 8)}` : `media-${slugify(url).slice(0, 24)}`;
}

function parseBrandFromAlt(alt, operationId) {
  const known = {
    19531: { brandName: "Fortuneo Banque", subtitle: "J'aime ma banque" },
    20355: { brandName: "Villages Clubs du Soleil", subtitle: "Séjours tout compris" },
    907320: { brandName: "Happy Hours", subtitle: "Femme, homme et enfant" },
    903937: { brandName: "Petit Bateau", subtitle: "Prêt-à-porter pour bébés, enfants et femmes" },
    907343: {
      brandName: "Les Tropeziennes par M.Belarbi",
      subtitle: "Une référence intemporelle depuis plus de 40 ans",
    },
    894462: { brandName: "Ooni", subtitle: "" },
    900361: { brandName: "Backsun", subtitle: "Des chaussures pour profiter de vos vacances" },
  };
  if (known[operationId]) return known[operationId];

  if (!alt) {
    return { brandName: `Operation ${operationId}`, subtitle: "" };
  }

  const doubleSpace = alt.trim().split(/\s{2,}/);
  if (doubleSpace.length >= 2) {
    return { brandName: doubleSpace[0], subtitle: doubleSpace.slice(1).join(" ") };
  }

  const knownPrefixes = [
    ["Happy Hours", 11],
    ["Petit Bateau", 12],
    ["Les Tropeziennes", 16],
    ["Villages Clubs du Soleil", 24],
    ["Fortuneo Banque", 15],
  ];
  for (const [prefix, len] of knownPrefixes) {
    if (alt.startsWith(prefix)) {
      return { brandName: prefix, subtitle: alt.slice(len).trim() };
    }
  }

  const idx = alt.indexOf(" ");
  if (idx < 0) return { brandName: alt, subtitle: "" };
  return { brandName: alt.slice(0, idx), subtitle: alt.slice(idx + 1).trim() };
}

function buildOperation(banner, categoryTab) {
  const operationId = banner.operationId;
  const parsed = parseBrandFromAlt(banner.alt, operationId);
  const srcBase = (banner.src || "").split("?")[0];
  const brandSlug = slugify(parsed.brandName || "");
  const localId =
    brandSlug && !/^operation-\d+$/i.test(brandSlug)
      ? `sale-${brandSlug}`
      : `sale-op-${operationId}`;

  const op = {
    operationId,
    brandName: parsed.brandName,
    subtitle: parsed.subtitle,
    bannerImageUrl: srcBase,
    bannerLocalId: localId,
    categoryTab,
    status: "live",
  };

  if (banner.href) {
    try {
      op.href = banner.href.startsWith("http")
        ? new URL(banner.href).pathname
        : banner.href;
    } catch {
      op.href = banner.href;
    }
  }

  if (["19531", "20355"].includes(operationId)) {
    op.tags = [{ type: "PUBLICITE", label: "Publicité", position: "topRight" }];
  }
  if (operationId === "900361") {
    op.tags = [{ type: "SHIPPING", label: "Expédié en 72h", position: "topRight" }];
  }
  if (operationId === "907320") op.discountLabel = "-80%";

  return op;
}

async function extractHomeWithScroll(page) {
  const collected = new Map();

  async function collectBanners() {
    const extracted = await extractPage(page);
    for (const banner of extracted.banners) {
      if (banner.operationId) collected.set(banner.operationId, banner);
    }
    return extracted;
  }

  let extracted = await collectBanners();

  for (let step = 0; step < 14; step += 1) {
    await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.85)));
    await page.waitForTimeout(900);
    extracted = await collectBanners();
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  return {
    ...extracted,
    banners: [...collected.values()],
  };
}

async function extractHubWithScroll(page) {
  const collected = new Map();

  async function collectBanners() {
    const extracted = await extractPage(page);
    for (const banner of extracted.banners) {
      if (banner.operationId) collected.set(banner.operationId, banner);
    }
    return extracted;
  }

  await page
    .waitForSelector('[data-testid="sale-banner"], [data-testid^="banner-link-"]', {
      state: "attached",
      timeout: 20000,
    })
    .catch(() => {});

  let extracted = await collectBanners();

  for (let step = 0; step < 10; step += 1) {
    await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.85)));
    await page.waitForTimeout(1000);
    extracted = await collectBanners();
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  return {
    ...extracted,
    banners: [...collected.values()],
  };
}

async function extractPage(page) {
  return page.evaluate(() => {
    const banners = [];
    const seen = new Set();

    function pushBanner(entry) {
      const key = entry.operationId || entry.testId || entry.src;
      if (!key || seen.has(key)) return;
      seen.add(key);
      banners.push(entry);
    }

    for (const link of document.querySelectorAll('[data-testid^="banner-link-"]')) {
      const img = link.querySelector("img");
      const src = img?.currentSrc || img?.src || "";
      pushBanner({
        testId: link.getAttribute("data-testid"),
        operationId: link.getAttribute("data-testid")?.replace("banner-link-", "") ?? "",
        alt: img?.alt ?? "",
        src,
        href: link.getAttribute("href") || link.href || "",
      });
    }

    for (const el of document.querySelectorAll('[data-testid="sale-banner"], [data-testid="campaign-banner"]')) {
      const img = el.querySelector("img");
      if (!img?.src?.includes("media.veepee")) continue;
      const link = el.closest("a") || el.querySelector("a");
      pushBanner({
        testId: el.getAttribute("data-testid"),
        operationId: el.getAttribute("data-operation-id") ?? "",
        alt: img.alt || el.getAttribute("title") || "",
        src: img.currentSrc || img.src,
        href: link?.getAttribute("href") || link?.href || "",
      });
    }

    const h1 = document.querySelector("h1");
    const introEl = h1?.nextElementSibling;
    const descEl = introEl?.nextElementSibling;

    const bgImage = [...document.querySelectorAll("*")]
      .map((el) => getComputedStyle(el).backgroundImage)
      .find((bg) => bg.includes("media.veepee"));
    const bgMatch = bgImage?.match(/url\("([^"]+)"\)/);

    const navTabs = [...document.querySelectorAll("a")]
      .filter((a) => {
        const text = a.textContent?.trim() ?? "";
        const href = a.pathname ?? "";
        const known = [
          "Accueil",
          "Mode",
          "Voyage",
          "Maison",
          "Enfant",
          "Chaussures",
          "Beauté",
          "Sport",
          "Vin et Epicerie",
          "Loisir",
          "Rosedeals",
          "The Place",
        ];
        return known.includes(text) && /^\/gr\//.test(href);
      })
      .map((a) => ({ text: a.textContent?.trim(), href: a.pathname }));

    const uniqueTabs = [...new Map(navTabs.map((t) => [t.href, t])).values()].slice(0, 14);

    const imgs = [...document.querySelectorAll('[data-testid^="banner-link-"] img')]
      .map((img) => img.currentSrc || img.src)
      .filter((src) => src.includes("media.veepee"));

    const valueProps = [...document.querySelectorAll("h2")]
      .filter((h2) => {
        const t = h2.textContent?.trim() ?? "";
        return t.includes("prix doux") || t.includes("surprises") || t.includes("soir ou du matin");
      })
      .map((h2) => ({
        title: h2.textContent?.trim() ?? "",
        description: h2.nextElementSibling?.textContent?.trim() ?? "",
      }));

    return {
      url: location.href,
      title: document.title,
      h1: h1?.textContent?.trim() ?? "",
      subtitle: introEl?.textContent?.trim() ?? "",
      description: descEl?.textContent?.trim() ?? "",
      backgroundImageUrl: bgMatch?.[1] ?? null,
      banners,
      navigationTabs: uniqueTabs,
      mediaUrls: [...new Set(imgs.map((u) => u.split("?")[0]))],
      valuePropositions: valueProps,
    };
  });
}

async function fetchBase64InPage(page, url) {
  return page.evaluate(async (targetUrl) => {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }, url);
}

function upsertManifest(manifest, entry) {
  const index = manifest.images.findIndex((item) => item.id === entry.id);
  if (index >= 0) manifest.images[index] = { ...manifest.images[index], ...entry };
  else manifest.images.push(entry);
}

async function downloadMedia(page, manifest, mediaMap, url, localId, subdir = "sales") {
  const cleanUrl = url.split("?")[0];
  if (mediaMap.has(cleanUrl)) return mediaMap.get(cleanUrl);

  const fileName =
    localId === "home-jungle"
      ? "home-jungle.jpg"
      : `${localId.replace(/^sale-/, "")}.jpg`;
  const fixedPath = subdir === "backgrounds" ? `backgrounds/${fileName}` : `sales/${fileName}`;
  const dest = path.join(IMG_OUT, fixedPath);

  try {
    if (!fs.existsSync(dest) || process.argv.includes("--force-media")) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const base64 = await fetchBase64InPage(page, cleanUrl);
      const buffer = Buffer.from(base64, "base64");
      if (buffer.length < 256) throw new Error("too small");
      fs.writeFileSync(dest, buffer);
      console.log(`    ↓ ${localId} (${buffer.length}b)`);
    } else {
      console.log(`    skip ${localId}`);
    }

    upsertManifest(manifest, {
      id: localId,
      url: cleanUrl,
      path: fixedPath,
      referer: "https://www.veepee.fr/",
      note: "crawl-full-site",
    });

    const publicPath = `/assets/images/${fixedPath}`;
    mediaMap.set(cleanUrl, { localId, publicPath, path: fixedPath });
    return mediaMap.get(cleanUrl);
  } catch (error) {
    console.log(`    ✗ ${localId}: ${error.message}`);
    return null;
  }
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright requis: npm install -D playwright");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const pageKeys = parsePageFilter();
  const manifest = readJsonSafe(MANIFEST_PATH, { images: [] });
  const mediaMap = new Map();

  const browser = await chromium
    .launch({
      headless: true,
      channel: process.platform === "darwin" ? "chrome" : undefined,
    })
    .catch(() => chromium.launch({ headless: true }));

  const context = await browser.newContext({
    locale: "fr-FR",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  const rawResults = {};
  const hubs = {};
  const categoryOperations = {};
  let home = null;
  let navigation = null;

  for (const key of pageKeys) {
    const cfg = SITE_PAGES[key];
    if (!cfg) {
      console.warn(`Page inconnue: ${key}`);
      continue;
    }

    console.log(`→ ${key}: ${cfg.url}`);
    try {
      await page.goto(cfg.url, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForTimeout(3500);
      const extracted =
        cfg.kind === "home"
          ? await extractHomeWithScroll(page)
          : cfg.kind === "hub"
            ? await extractHubWithScroll(page)
            : await extractPage(page);
      rawResults[key] = extracted;
      console.log(`  ✓ ${extracted.banners.length} bannières, h1="${extracted.h1.slice(0, 40)}"`);

      if (cfg.kind === "home") {
        const guestOps = extracted.banners.slice(0, 6).map((b) => buildOperation(b, "home"));
        const memberOps = extracted.banners.map((b) => buildOperation(b, "home"));

        home = {
          meta: {
            title: extracted.h1 || "Ça va vous plaire",
            subtitle: extracted.subtitle || "Coup de foudre inévitable.",
            guestVisibleRatio: 0.1,
            guestVisibleMin: 2,
          },
          backgroundImageUrl: extracted.backgroundImageUrl,
          operations: guestOps,
          memberOperations: memberOps,
          valuePropositions:
            extracted.valuePropositions.length > 0
              ? extracted.valuePropositions
              : undefined,
        };

        if (extracted.navigationTabs?.length) {
          navigation = {
            tabs: extracted.navigationTabs.map((tab, i) => ({
              id: slugify(tab.text) || `tab-${i}`,
              label: tab.text,
              href: tab.href,
            })),
          };
        }
      }

      if (cfg.kind === "hub" && cfg.categoryId) {
        const bgLocalId = extracted.backgroundImageUrl
          ? mediaIdFromUrl(extracted.backgroundImageUrl.split("?")[0])
          : undefined;
        hubs[cfg.categoryId] = {
          title: extracted.h1,
          subtitle: extracted.subtitle,
          description: extracted.description || extracted.subtitle,
          ...(bgLocalId ? { backgroundLocalId: bgLocalId } : {}),
          ...(extracted.valuePropositions?.length
            ? { valuePropositions: extracted.valuePropositions }
            : {}),
        };
        categoryOperations[cfg.categoryId] = extracted.banners.map((b) =>
          buildOperation(b, cfg.categoryId),
        );
      }

      if (!SKIP_MEDIA) {
        const urls = new Set([
          ...(extracted.backgroundImageUrl ? [extracted.backgroundImageUrl.split("?")[0]] : []),
          ...extracted.banners.map((b) => (b.src || "").split("?")[0]).filter(Boolean),
        ]);

        for (const url of urls) {
          if (!url.includes("media.veepee")) continue;
          const op = extracted.banners.find((b) => b.src?.startsWith(url));
          const localId = op
            ? buildOperation(op, cfg.categoryId || "home").bannerLocalId
            : cfg.kind === "home" && url === extracted.backgroundImageUrl?.split("?")[0]
              ? "home-jungle"
              : cfg.kind === "auth"
                ? "auth-bg"
                : mediaIdFromUrl(url);
          const subdir =
            localId === "home-jungle" ||
            localId === "auth-bg" ||
            url === extracted.backgroundImageUrl?.split("?")[0]
              ? "backgrounds"
              : "sales";
          await downloadMedia(page, manifest, mediaMap, url, localId, subdir);
        }
      }
    } catch (error) {
      console.log(`  ✗ ${error.message}`);
      rawResults[key] = { error: String(error), url: cfg.url };
    }
  }

  await browser.close();

  if (home?.operations) {
    for (const op of home.operations) {
      const saved = mediaMap.get(op.bannerImageUrl);
      if (saved) {
        op.bannerImageUrl = saved.publicPath;
        op.bannerLocalId = saved.localId;
      }
    }
  }

  if (home?.memberOperations) {
    for (const op of home.memberOperations) {
      const saved = mediaMap.get(op.bannerImageUrl);
      if (saved) {
        op.bannerImageUrl = saved.publicPath;
        op.bannerLocalId = saved.localId;
      }
    }
  }

  for (const ops of Object.values(categoryOperations)) {
    for (const op of ops) {
      const saved = mediaMap.get(op.bannerImageUrl);
      if (saved) {
        op.bannerImageUrl = saved.publicPath;
        op.bannerLocalId = saved.localId;
      }
    }
  }

  writeJson(MANIFEST_PATH, manifest);

  const stamp = new Date().toISOString().slice(0, 10);
  const outPath = path.join(OUT_DIR, `crawl-live-${stamp}.json`);
  const payload = {
    meta: {
      source: "crawl-full-site.mjs (playwright + chrome)",
      fetchedAt: new Date().toISOString(),
      pages: pageKeys,
      mediaDownloaded: mediaMap.size,
    },
    navigation,
    home,
    hubs,
    categoryOperations,
    raw: rawResults,
  };

  writeJson(outPath, payload);
  console.log(`\n✓ ${outPath}`);
  console.log(`✓ ${mediaMap.size} médias locaux`);
  console.log("\nImport: npm run crawl:import --", outPath);
  console.log("Assets: node scripts/download-images.mjs");

  try {
    execSync("node scripts/download-images.mjs", { cwd: ROOT, stdio: "inherit" });
  } catch {
    /* optional */
  }
}

function readJsonSafe(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
