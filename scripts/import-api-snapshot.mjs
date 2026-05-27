#!/usr/bin/env node
/**
 * Importe des réponses API veepee depuis:
 *   - un fichier JSON collé depuis DevTools (Copy response)
 *   - un export HAR Chrome (--har export.har)
 *   - un dossier raw/ (--dir data/api-snapshots/raw)
 *
 * Usage:
 *   npm run api:import -- data/api-snapshots/raw/home-api.json
 *   npm run api:import -- --har ~/Downloads/veepee.har
 *   npm run api:import -- --dir data/api-snapshots/raw
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_DIR = path.join(ROOT, "data", "api-snapshots");
const HOME_PATH = path.join(SNAPSHOT_DIR, "home.json");
const PRODUCT_CATALOG_PATH = path.join(SNAPSHOT_DIR, "product-catalog.json");
const CATEGORY_CATALOG_PATH = path.join(SNAPSHOT_DIR, "catalog.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function extractOperations(payload) {
  const candidates = [];

  if (Array.isArray(payload?.operations)) candidates.push(payload.operations);
  if (Array.isArray(payload?.sales)) candidates.push(payload.sales);
  if (Array.isArray(payload?.data?.operations)) candidates.push(payload.data.operations);
  if (Array.isArray(payload?.data?.sales)) candidates.push(payload.data.sales);
  if (Array.isArray(payload?.content?.operations)) {
    candidates.push(payload.content.operations);
  }

  for (const list of candidates) {
    if (list.length > 0 && list.some((item) => item.brandName || item.brand || item.title)) {
      return list;
    }
  }

  return null;
}

function normalizeOperation(raw, index) {
  const brandName = raw.brandName ?? raw.brand ?? raw.name ?? `Operation ${index + 1}`;
  const subtitle = raw.subtitle ?? raw.title ?? raw.description ?? "";
  const operationId = String(raw.operationId ?? raw.id ?? raw.saleId ?? `import-${index + 1}`);

  const bannerImageUrl =
    raw.bannerImageUrl ??
    raw.bannerUrl ??
    raw.imageUrl ??
    raw.media?.url ??
    raw.medias?.[0]?.url ??
    "";

  const tags = [];
  if (raw.topLeftTag || raw.isPinkCard) {
    tags.push({
      type: "CARTE_ROSE",
      label: raw.topLeftTag ?? "CARTE ROSE",
      position: "topLeft",
    });
  }
  if (raw.topRightTag) {
    tags.push({ type: "SHIPPING", label: raw.topRightTag, position: "topRight" });
  }
  if (Array.isArray(raw.tags)) {
    for (const tag of raw.tags) {
      tags.push({
        type: tag.type ?? "TAG",
        label: tag.label ?? tag.text ?? String(tag),
        position: tag.position,
      });
    }
  }

  return {
    operationId,
    brandName,
    subtitle,
    bannerImageUrl,
    categoryTab: raw.categoryTab ?? raw.category ?? "home",
    status: raw.status === "upcoming" ? "upcoming" : "live",
    href: raw.href ?? raw.link,
    tags: tags.length > 0 ? tags : undefined,
    discountLabel: raw.discountLabel ?? raw.discount,
  };
}

function extractProducts(payload) {
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  if (payload?.id && payload?.pricing) return [payload];
  return null;
}

function normalizeProduct(raw) {
  if (!raw.pricing?.price?.value) return null;

  return {
    url: raw.url ?? `https://www.veepee.fr/gr/product/${raw.saleId}/${raw.id}`,
    id: String(raw.id),
    saleId: String(raw.saleId ?? ""),
    catalogId: String(raw.catalogId ?? ""),
    brand: raw.brand ?? raw.brandName ?? "",
    name: raw.name ?? raw.title ?? "",
    description: raw.description ?? raw.name ?? "",
    isLocked: Boolean(raw.isLocked),
    displayMode: raw.displayMode ?? 1,
    saleSource: raw.saleSource ?? 1,
    pricing: raw.pricing,
    medias: raw.medias ?? [],
    models: raw.models,
  };
}

function mergeHomeOperations(existing, imported) {
  const byBrand = new Map(existing.operations.map((op) => [op.brandName.toLowerCase(), op]));

  for (const op of imported) {
    const key = op.brandName.toLowerCase();
    if (byBrand.has(key)) {
      byBrand.set(key, { ...byBrand.get(key), ...op });
    } else {
      byBrand.set(key, op);
    }
  }

  return {
    ...existing,
    meta: {
      ...existing.meta,
      source: `${existing.meta.source} + import DevTools ${new Date().toISOString()}`,
      fetchedAt: new Date().toISOString(),
    },
    operations: [...byBrand.values()],
  };
}

function mergeProducts(existing, imported) {
  const byId = new Map(existing.products.map((p) => [p.id, p]));
  for (const product of imported) {
    if (product) byId.set(product.id, { ...byId.get(product.id), ...product });
  }

  return {
    ...existing,
    meta: {
      ...existing.meta,
      source: `${existing.meta.source} + import DevTools`,
      fetchedAt: new Date().toISOString(),
      totalCount: Math.max(existing.meta.totalCount, byId.size),
    },
    products: [...byId.values()],
  };
}

function parseHar(harPath) {
  const har = readJson(harPath);
  const entries = har?.log?.entries ?? [];
  const payloads = [];

  for (const entry of entries) {
    const text = entry?.response?.content?.text;
    const mime = entry?.response?.content?.mimeType ?? "";
    if (!text || !mime.includes("json")) continue;

    try {
      payloads.push(JSON.parse(text));
    } catch {
      // ignore non-json bodies
    }
  }

  return payloads;
}

function processPayload(payload, state) {
  const operations = extractOperations(payload);
  if (operations?.length) {
    for (const raw of operations) {
      const normalized = normalizeOperation(raw, state.homeOps.length + state.categoryOps.length);
      if (normalized.categoryTab === "home") {
        state.homeOps.push(normalized);
      } else {
        state.categoryOps.push(normalized);
      }
    }
  }

  const products = extractProducts(payload);
  if (products?.length) {
    for (const raw of products) {
      const normalized = normalizeProduct(raw);
      if (normalized) state.products.push(normalized);
    }
  }

  if (payload?.meta?.title && payload?.meta?.subtitle) {
    state.homeMeta = payload.meta;
  }
  if (payload?.valuePropositions) {
    state.valuePropositions = payload.valuePropositions;
  }
  if (payload?.hubs && typeof payload.hubs === "object") {
    state.hubs = { ...state.hubs, ...payload.hubs };
  }
}

function collectFromPath(inputPath, state) {
  const stat = fs.statSync(inputPath);
  if (stat.isDirectory()) {
    for (const file of fs.readdirSync(inputPath)) {
      if (file.startsWith("_")) continue;
      collectFromPath(path.join(inputPath, file), state);
    }
    return;
  }

  if (inputPath.endsWith(".har")) {
    for (const payload of parseHar(inputPath)) {
      processPayload(payload, state);
    }
    return;
  }

  const payload = readJson(inputPath);
  processPayload(payload, state);
}

function main() {
  const args = process.argv.slice(2);
  const harIdx = args.indexOf("--har");
  const dirIdx = args.indexOf("--dir");

  const state = {
    homeOps: [],
    categoryOps: [],
    products: [],
    homeMeta: null,
    valuePropositions: null,
    hubs: null,
  };

  if (harIdx >= 0) {
    collectFromPath(path.resolve(args[harIdx + 1]), state);
  } else if (dirIdx >= 0) {
    collectFromPath(path.resolve(args[dirIdx + 1] ?? path.join(SNAPSHOT_DIR, "raw")), state);
  } else if (args[0]) {
    collectFromPath(path.resolve(args[0]), state);
  } else {
    collectFromPath(path.join(SNAPSHOT_DIR, "raw"), state);
  }

  if (state.homeOps.length === 0 && state.categoryOps.length === 0 && state.products.length === 0) {
    console.log("Aucune opération / produit détecté dans les fichiers fournis.");
    console.log("Astuce: copiez la réponse JSON home/catalog depuis DevTools.");
    process.exit(0);
  }

  if (state.homeOps.length > 0) {
    const existing = readJson(HOME_PATH);
    let merged = mergeHomeOperations(existing, state.homeOps);
    if (state.homeMeta) {
      merged = { ...merged, meta: { ...merged.meta, ...state.homeMeta } };
    }
    if (state.valuePropositions && state.homeOps.length > 0) {
      merged = { ...merged, valuePropositions: state.valuePropositions };
    }
    writeJson(HOME_PATH, merged);
    console.log(`✓ home.json mis à jour (${merged.operations.length} opérations)`);
  }

  if (state.categoryOps.length > 0 || state.hubs) {
    const existing = readJson(CATEGORY_CATALOG_PATH);
    let merged = existing;
    if (state.categoryOps.length > 0) {
      merged = mergeHomeOperations(
        { ...existing, operations: existing.operations ?? [] },
        state.categoryOps,
      );
    }
    if (state.hubs) {
      merged = {
        ...merged,
        hubs: { ...existing.hubs, ...state.hubs },
      };
    }
    writeJson(CATEGORY_CATALOG_PATH, merged);
    console.log(`✓ catalog.json mis à jour (${merged.operations.length} opérations catégorie)`);
  }

  if (state.products.length > 0) {
    const existing = readJson(PRODUCT_CATALOG_PATH);
    const merged = mergeProducts(existing, state.products);
    writeJson(PRODUCT_CATALOG_PATH, merged);
    console.log(`✓ product-catalog.json mis à jour (${merged.products.length} produits)`);
  }

  const shouldSyncMedia = process.argv.includes("--sync-media");
  if (shouldSyncMedia) {
    console.log("\nLancement api:sync-media…");
    execSync("node scripts/sync-snapshot-media.mjs", { cwd: ROOT, stdio: "inherit" });
  }
}

main();
