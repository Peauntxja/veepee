#!/usr/bin/env node
/**
 * Télécharge les URLs externes des snapshots vers public/assets/images/
 * et met à jour image-manifest.json + chemins locaux dans les snapshots.
 *
 * Usage: npm run api:sync-media
 *        npm run api:sync-media -- --force
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import http from "node:http";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_DIR = path.join(ROOT, "data", "api-snapshots");
const MANIFEST_PATH = path.join(__dirname, "image-manifest.json");
const OUT_DIR = path.join(ROOT, "public", "assets", "images");
const FORCE = process.argv.includes("--force");
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function downloadFile(url, dest, referer) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);

    proto
      .get(
        url,
        {
          headers: {
            "User-Agent": USER_AGENT,
            Accept: "image/*,*/*;q=0.8",
            Referer: referer ?? "https://www.veepee.fr/",
          },
        },
        (response) => {
          if (
            response.statusCode &&
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            file.close();
            fs.unlink(dest, () => {});
            downloadFile(response.headers.location, dest, referer).then(resolve).catch(reject);
            return;
          }

          if (response.statusCode !== 200) {
            file.close();
            fs.unlink(dest, () => {});
            reject(new Error(`HTTP ${response.statusCode}`));
            return;
          }

          response.pipe(file);
          file.on("finish", () => {
            file.close(resolve);
          });
        },
      )
      .on("error", (error) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(error);
      });
  });
}

function collectRemoteUrls(home, catalog, products) {
  const items = [];

  for (const operation of [...home.operations, ...catalog.operations]) {
    if (operation.bannerImageUrl?.startsWith("http")) {
      items.push({
        kind: "sale",
        id: `sale-import-${slugify(operation.brandName)}`,
        url: operation.bannerImageUrl,
        subdir: "sales",
        target: operation,
        field: "bannerImageUrl",
        localIdField: "bannerLocalId",
      });
    }
  }

  for (const product of products.products) {
    product.medias?.forEach((media, index) => {
      if (media.url?.startsWith("http")) {
        items.push({
          kind: "product",
          id: `product-api-${product.id}-${index + 1}`,
          url: media.url,
          subdir: "products",
          target: media,
          field: "url",
          thumbField: "thumb",
        });
      }
    });
  }

  return items;
}

async function syncItem(item, manifest) {
  const ext = item.url.includes(".png") ? "png" : "jpg";
  const relPath = `${item.subdir}/${item.id}.${ext}`;
  const dest = path.join(OUT_DIR, relPath);
  const publicPath = `/assets/images/${relPath}`;

  if (fs.existsSync(dest) && !FORCE) {
    console.log(`skip  ${item.id}`);
    return { id: item.id, publicPath, ok: true };
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });

  try {
    await downloadFile(item.url, dest, "https://www.veepee.fr/");
    const stat = fs.statSync(dest);
    if (stat.size < 512) throw new Error("file too small");

    const existing = manifest.images.find((entry) => entry.id === item.id);
    const entry = {
      id: item.id,
      url: item.url,
      path: relPath,
      referer: "https://www.veepee.fr/",
    };

    if (existing) Object.assign(existing, entry);
    else manifest.images.push(entry);

    if (item.kind === "sale") {
      item.target[item.field] = publicPath;
      item.target[item.localIdField] = item.id;
    } else {
      item.target[item.field] = publicPath;
      if (item.thumbField) {
        item.target[item.thumbField] = publicPath;
      }
    }

    console.log(`ok    ${item.id} → ${relPath} (${stat.size} bytes)`);
    return { id: item.id, publicPath, ok: true };
  } catch (error) {
    console.log(`fail  ${item.id}: ${error.message}`);
    return { id: item.id, ok: false };
  }
}

async function main() {
  const homePath = path.join(SNAPSHOT_DIR, "home.json");
  const catalogPath = path.join(SNAPSHOT_DIR, "catalog.json");
  const productsPath = path.join(SNAPSHOT_DIR, "product-catalog.json");

  const home = readJson(homePath);
  const catalog = readJson(catalogPath);
  const products = readJson(productsPath);
  const manifest = readJson(MANIFEST_PATH);
  const items = collectRemoteUrls(home, catalog, products);

  if (items.length === 0) {
    console.log("Aucune URL externe dans les snapshots.");
    return;
  }

  console.log(`Sync ${items.length} média(s) depuis les snapshots…\n`);

  const results = [];
  for (const item of items) {
    results.push(await syncItem(item, manifest));
  }

  writeJson(MANIFEST_PATH, manifest);
  writeJson(homePath, home);
  writeJson(catalogPath, catalog);
  writeJson(productsPath, products);

  const okCount = results.filter((result) => result.ok).length;
  console.log(`\n${okCount}/${items.length} médias synchronisés.`);

  if (okCount > 0) {
    execSync("node scripts/download-images.mjs", { cwd: ROOT, stdio: "inherit" });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
