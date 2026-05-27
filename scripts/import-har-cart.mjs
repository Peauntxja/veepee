#!/usr/bin/env node
/**
 * Extrait les requêtes panier/catalog d'un fichier HAR (DevTools → Export HAR)
 *
 * Usage:
 *   npm run crawl:import-har -- ~/Downloads/veepee-cart.har
 *   npm run crawl:import-har -- data/api-snapshots/raw/cart-flow-2026-05-27.har
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "api-snapshots", "raw");

const KEYWORDS = /cart|basket|panier|orderpipe|reservation|checkout|catalog.*item|line.*item|express|commerce/i;

function parseArgs() {
  const arg = process.argv[2];
  if (!arg) {
    throw new Error("Usage: npm run crawl:import-har -- <path-to.har>");
  }
  return path.resolve(arg);
}

function getHeader(headers, name) {
  const found = headers?.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return found?.value ?? null;
}

function safeJsonParse(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text.slice(0, 8000);
  }
}

function main() {
  const harPath = parseArgs();
  const har = JSON.parse(fs.readFileSync(harPath, "utf8"));
  const entries = har?.log?.entries ?? [];

  const filtered = entries
    .map((entry) => {
      const req = entry.request;
      const res = entry.response;
      const url = req.url;
      const method = req.method;

      if (!KEYWORDS.test(url) && method === "GET") return null;
      if (/sentry|datadome|frontendlogger|google|facebook|apple/i.test(url)) return null;

      const postData = req.postData?.text ?? null;
      const responseText = res.content?.text ?? null;

      return {
        method,
        url,
        status: res.status,
        contentType: getHeader(res.headers, "content-type"),
        postData: postData ? safeJsonParse(postData) : null,
        responseBody: responseText ? safeJsonParse(responseText) : null,
        startedDateTime: entry.startedDateTime,
      };
    })
    .filter(Boolean);

  const stamp = new Date().toISOString().slice(0, 10);
  const outPath = path.join(OUT_DIR, `cart-api-from-har-${stamp}.json");

  const payload = {
    meta: {
      source: "import-har-cart.mjs from " + path.basename(harPath),
      importedAt: new Date().toISOString(),
      totalEntries: entries.length,
      matchedEntries: filtered.length,
    },
    requests: filtered,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log("ok " + outPath);
  console.log("ok " + filtered.length + " requetes panier/catalog sur " + entries.length + " entrees HAR");

  const mutations = filtered.filter((r) => r.method !== "GET");
  if (mutations.length > 0) {
    console.log("\nMutations (add-to-cart candidates):");
    for (const req of mutations) {
      console.log(`  ${req.method} ${req.status} ${req.url}`);
    }
  }
}

main();
