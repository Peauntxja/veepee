#!/usr/bin/env node
/**
 * Exporte les images homepage depuis le navigateur MCP (CDP) vers public/assets/images/
 * Usage interne — lit les URLs depuis data/api-snapshots/home.json + background crawl
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "assets", "images");
const MANIFEST = path.join(__dirname, "image-manifest.json");

const IMAGE_JOBS = [
  {
    id: "home-jungle",
    url: "https://media.veepee.com/v1/media/c067011f-8294-40a0-8c41-72a57f1dd2cb",
    relPath: "backgrounds/home-jungle.jpg",
  },
  {
    id: "sale-fortuneo",
    url: "https://media.veepee.com/v1/media/8efd0e99-9aaa-4287-bf3d-39b5d099a5f5",
    relPath: "sales/fortuneo.jpg",
  },
  {
    id: "sale-happy-hours",
    url: "https://media.veepee.com/v1/media/e03681dd-6a45-46d5-b880-fa880a06cedb",
    relPath: "sales/happy-hours.jpg",
  },
  {
    id: "sale-petit-bateau",
    url: "https://media.veepee.com/v1/media/9b485bcf-f86d-4eff-9429-b311688368da",
    relPath: "sales/petit-bateau.jpg",
  },
  {
    id: "sale-villages",
    url: "https://media.veepee.com/v1/media/3c23eb22-d552-4597-a0fa-92653d84ff9e",
    relPath: "sales/villages.jpg",
  },
  {
    id: "sale-backsun",
    url: "https://media.veepee.com/v1/media/5b1fccf0-8a73-434d-8478-81be0f7bc0fe",
    relPath: "sales/backsun.jpg",
  },
  {
    id: "sale-ooni",
    url: "https://media.veepee.com/v1/media/f79c3fb0-f4e6-47af-b412-7c0a068c98d6",
    relPath: "sales/ooni.jpg",
  },
];

function upsertManifest(manifest, entry) {
  const idx = manifest.images.findIndex((item) => item.id === entry.id);
  if (idx >= 0) manifest.images[idx] = { ...manifest.images[idx], ...entry };
  else manifest.images.push(entry);
}

async function fetchBase64(page, url) {
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

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright required");
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    channel: process.platform === "darwin" ? "chrome" : undefined,
  }).catch(() => chromium.launch({ headless: true }));

  const page = await browser.newPage();
  await page.goto("https://www.veepee.fr/gr/home/default", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(3000);

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

  for (const job of IMAGE_JOBS) {
    try {
      const base64 = await fetchBase64(page, job.url);
      const dest = path.join(OUT, job.relPath);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const buffer = Buffer.from(base64, "base64");
      fs.writeFileSync(dest, buffer);
      upsertManifest(manifest, {
        id: job.id,
        url: job.url,
        path: job.relPath,
        referer: "https://www.veepee.fr/",
        note: "Browser session export",
      });
      console.log(`ok  ${job.id} (${buffer.length} bytes)`);
    } catch (error) {
      console.log(`fail ${job.id}: ${error.message}`);
    }
  }

  await browser.close();
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
}

main();
