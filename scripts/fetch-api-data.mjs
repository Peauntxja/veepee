#!/usr/bin/env node
/**
 * Tente de récupérer les endpoints veepee.fr listés dans scripts/api-manifest.json.
 * Les réponses brutes vont dans data/api-snapshots/raw/
 *
 * Usage: npm run api:fetch
 *        npm run api:fetch -- --endpoint home-default
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(__dirname, "api-manifest.json");
const RAW_DIR = path.join(ROOT, "data", "api-snapshots", "raw");

const filterName = (() => {
  const idx = process.argv.indexOf("--endpoint");
  return idx >= 0 ? process.argv[idx + 1] : null;
})();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function fetchEndpoint(entry, headers) {
  const response = await fetch(entry.url, {
    headers: {
      ...headers,
      Accept: entry.accept ?? headers.Accept,
    },
    redirect: "follow",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  let ext = "txt";
  if (contentType.includes("json")) ext = "json";
  else if (contentType.includes("html")) ext = "html";

  const outPath = path.join(RAW_DIR, `${entry.name}.${ext}`);
  fs.writeFileSync(outPath, body, "utf8");

  return {
    name: entry.name,
    status: response.status,
    contentType,
    bytes: body.length,
    outPath,
  };
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  ensureDir(RAW_DIR);

  let endpoints = manifest.endpoints ?? [];
  if (filterName) {
    endpoints = endpoints.filter((entry) => entry.name === filterName);
    if (endpoints.length === 0) {
      console.error(`Endpoint inconnu: ${filterName}`);
      process.exit(1);
    }
  }

  console.log(`Tentative de ${endpoints.length} endpoint(s)…\n`);

  const results = [];
  for (const entry of endpoints) {
    try {
      const result = await fetchEndpoint(entry, manifest.defaultHeaders ?? {});
      results.push(result);
      const ok = result.status >= 200 && result.status < 300;
      console.log(
        `${ok ? "✓" : "✗"} ${entry.name}: HTTP ${result.status} (${result.bytes} bytes) → ${path.relative(ROOT, result.outPath)}`,
      );
      if (entry.note) console.log(`  note: ${entry.note}`);
    } catch (error) {
      results.push({ name: entry.name, error: String(error) });
      console.log(`✗ ${entry.name}: ${error.message ?? error}`);
    }
  }

  const summaryPath = path.join(RAW_DIR, "_fetch-summary.json");
  fs.writeFileSync(
    summaryPath,
    JSON.stringify({ fetchedAt: new Date().toISOString(), results }, null, 2),
  );

  console.log(`\nRésumé: ${summaryPath}`);
  console.log(
    "Si bloqué (403 Cloudflare), exportez DevTools → Network → Copy response",
  );
  console.log("puis: npm run api:import -- data/api-snapshots/raw/home-api.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
