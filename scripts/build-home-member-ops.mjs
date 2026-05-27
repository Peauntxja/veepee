#!/usr/bin/env node
/**
 * Agrège home.json operations + catalog.json → memberOperations
 * Usage: node scripts/build-home-member-ops.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HOME_PATH = path.join(ROOT, "data", "api-snapshots", "home.json");
const CATALOG_PATH = path.join(ROOT, "data", "api-snapshots", "catalog.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function main() {
  const home = readJson(HOME_PATH);
  const catalog = readJson(CATALOG_PATH);

  const byId = new Map();

  for (const op of home.operations ?? []) {
    byId.set(op.operationId, { ...op, categoryTab: "home" });
  }

  for (const op of catalog.operations ?? []) {
    if (!op.bannerImageUrl?.startsWith("/assets/")) continue;
    if (byId.has(op.operationId)) continue;
    byId.set(op.operationId, {
      ...op,
      categoryTab: op.categoryTab ?? "home",
    });
  }

  const memberOperations = [...byId.values()];

  writeJson(HOME_PATH, {
    ...home,
    memberOperations,
    meta: {
      ...home.meta,
      memberOperationCount: memberOperations.length,
    },
  });

  console.log(`✓ home.json memberOperations: ${memberOperations.length}`);
}

main();
