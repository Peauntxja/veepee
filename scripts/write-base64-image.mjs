#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [destArg, base64] = process.argv.slice(2);
if (!destArg || !base64) {
  console.error("Usage: write-base64-image.mjs <dest-path> <base64>");
  process.exit(1);
}

const dest = path.resolve(destArg);
fs.mkdirSync(path.dirname(dest), { recursive: true });
const buffer = Buffer.from(base64, "base64");
if (buffer.length < 512) {
  console.error(`File too small: ${buffer.length} bytes`);
  process.exit(1);
}
fs.writeFileSync(dest, buffer);
console.log(`Wrote ${dest} (${buffer.length} bytes)`);
