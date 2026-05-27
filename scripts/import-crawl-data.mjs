#!/usr/bin/env node
/**
 * Importe data/api-snapshots/raw/crawl-live-*.json (crawl navigateur)
 * vers home.json, catalog.json, navigation.json
 *
 * Usage:
 *   npm run crawl:import
 *   npm run crawl:import -- data/api-snapshots/raw/crawl-live-2026-05-27.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_DIR = path.join(ROOT, "data", "api-snapshots");
const RAW_DIR = path.join(SNAPSHOT_DIR, "raw");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function findLatestCrawlFile() {
  const arg = process.argv[2];
  if (arg) return path.resolve(arg);

  const files = fs
    .readdirSync(RAW_DIR)
    .filter((name) => (name.startsWith("crawl-live") || name.startsWith("crawl-playwright")) && name.endsWith(".json"))
    .map((name) => ({ name, mtime: fs.statSync(path.join(RAW_DIR, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    throw new Error("Aucun fichier crawl-live-*.json dans data/api-snapshots/raw/");
  }
  return path.join(RAW_DIR, files[0].name);
}

function mediaIdFromUrl(url) {
  if (!url) return null;
  const match = url.match(/\/media\/([a-f0-9-]+)/i);
  return match ? `media-${match[1].slice(0, 8)}` : null;
}

function mergeHubBackgrounds(hubs, rawResults, categoryOperations) {
  if (!rawResults) return hubs;
  const merged = { ...hubs };

  for (const [key, page] of Object.entries(rawResults)) {
    if (!page?.backgroundImageUrl) continue;
    const categoryId =
      page.categoryId ??
      (categoryOperations?.[key] ? key : null) ??
      (merged[key] ? key : null);
    if (!categoryId) continue;

    const bgLocalId = mediaIdFromUrl(page.backgroundImageUrl);
    if (!bgLocalId) continue;

    merged[categoryId] = {
      ...(merged[categoryId] ?? {}),
      backgroundLocalId: bgLocalId,
      ...(page.valuePropositions?.length
        ? { valuePropositions: page.valuePropositions }
        : {}),
    };
  }

  return merged;
}

function mergeCatalogOperations(existing, importedByCategory) {
  const byId = new Map(existing.operations.map((op) => [op.operationId, op]));

  for (const ops of Object.values(importedByCategory)) {
    for (const op of ops) {
      byId.set(op.operationId, { ...byId.get(op.operationId), ...op });
    }
  }

  return {
    ...existing,
    operations: [...byId.values()],
  };
}

function normalizeNavHref(href) {
  const map = {
    "/gr/home/default": "/gr/home",
    "/gr/voyage/default": "/gr/h/voyage",
    "/gr/h/mode-enfant": "/gr/h/enfant",
    "/gr/h/mode-chaussures": "/gr/h/chaussures",
    "/gr/h/beaute-et-bien-etre": "/gr/h/beaute",
    "/gr/h/mode-sportswear": "/gr/h/sport",
    "/gr/h/vin-et-epicerie": "/gr/h/vin",
    "/gr/h/loisirs": "/gr/h/loisir",
    "/gr/h/rosedeals-coupons": "/gr/h/rosedeals",
    "/gr/home/brandsplace": "/gr/h/the-place",
  };
  return map[href] ?? href;
}

function normalizeNavigationTabs(tabs) {
  return tabs
    .filter((tab) => tab.label !== "Publicité" && tab.label !== "Les univers Veepee")
    .map((tab, index) => ({
      id:
        tab.id ??
        (tab.label.toLowerCase().replace(/\s+/g, "-").slice(0, 24) || `tab-${index}`),
      label: tab.label,
      href: normalizeNavHref(tab.href),
    }));
}

function main() {
  const crawlPath = findLatestCrawlFile();
  const crawl = readJson(crawlPath);
  const fetchedAt = crawl.meta?.fetchedAt ?? new Date().toISOString();

  if (
    process.argv.includes("--import-home") &&
    crawl.home &&
    (crawl.home.operations?.length ?? 0) > 0
  ) {
    const homePath = path.join(SNAPSHOT_DIR, "home.json");
    const home = {
      meta: {
        ...crawl.home.meta,
        source: `${crawl.meta?.source ?? "browser crawl"} → ${path.basename(crawlPath)}`,
        fetchedAt,
      },
      operations: crawl.home.operations,
      valuePropositions: crawl.home.valuePropositions,
    };
    writeJson(homePath, home);
    console.log(`✓ home.json (${home.operations.length} opérations)`);
  }

  if (crawl.home?.memberOperations?.length) {
    const homePath = path.join(SNAPSHOT_DIR, "home.json");
    const existing = readJson(homePath);
    writeJson(homePath, {
      ...existing,
      memberOperations: crawl.home.memberOperations,
      meta: {
        ...existing.meta,
        source: `${existing.meta?.source ?? ""} + member crawl → ${path.basename(crawlPath)}`.trim(),
        fetchedAt,
        memberOperationCount: crawl.home.memberOperations.length,
      },
    });
    console.log(`✓ home.json memberOperations (${crawl.home.memberOperations.length})`);
  }

  if (crawl.hubs || crawl.categoryOperations) {
    const catalogPath = path.join(SNAPSHOT_DIR, "catalog.json");
    const existing = readJson(catalogPath);
    let catalog = {
      ...existing,
      meta: {
        ...existing.meta,
        source: `${existing.meta.source} + ${crawl.meta?.source ?? "browser crawl"}`,
        fetchedAt,
      },
      hubs: mergeHubBackgrounds(
        { ...existing.hubs, ...crawl.hubs },
        crawl.raw,
        crawl.categoryOperations,
      ),
    };

    if (crawl.categoryOperations) {
      catalog = mergeCatalogOperations(catalog, crawl.categoryOperations);
    }

    writeJson(catalogPath, catalog);
    console.log(`✓ catalog.json (${catalog.operations.length} ops, ${Object.keys(catalog.hubs).length} hubs)`);
  }

  if (crawl.navigation?.tabs?.some((t) => t.label === "Accueil" || t.label === "Mode")) {
    const navPath = path.join(SNAPSHOT_DIR, "navigation.json");
    writeJson(navPath, {
      meta: { source: crawl.meta?.source, fetchedAt },
      tabs: normalizeNavigationTabs(crawl.navigation.tabs),
    });
    console.log(`✓ navigation.json (${crawl.navigation.tabs.length} onglets)`);
  }

  if (crawl.searchOverlay) {
    const searchPath = path.join(SNAPSHOT_DIR, "search-overlay.json");
    writeJson(searchPath, {
      meta: { source: crawl.meta?.source, fetchedAt },
      ...crawl.searchOverlay,
    });
    console.log(`✓ search-overlay.json`);
  }

  if (process.argv.includes("--sync-media")) {
    console.log("\nLancement api:sync-media…");
    execSync("node scripts/sync-snapshot-media.mjs", { cwd: ROOT, stdio: "inherit" });
  }

  console.log(`\nSource: ${crawlPath}`);
}

main();
