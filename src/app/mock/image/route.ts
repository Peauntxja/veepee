import { NextRequest } from "next/server";

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function buildHsl(hash: number, offset: number): string {
  const hue = (hash + offset) % 360;
  const sat = 60 + ((hash >> 3) % 20);
  const light = 45 + ((hash >> 7) % 18);
  return `hsl(${hue} ${sat}% ${light}%)`;
}

const BRAND_PALETTES: Record<string, [string, string, string]> = {
  fortuneo: ["hsl(45 85% 42%)", "hsl(38 70% 28%)", "hsl(50 60% 18%)"],
  backsun: ["hsl(35 55% 78%)", "hsl(28 45% 62%)", "hsl(22 40% 48%)"],
  billowy: ["hsl(200 35% 88%)", "hsl(205 30% 72%)", "hsl(210 25% 55%)"],
  villages: ["hsl(195 70% 55%)", "hsl(200 60% 42%)", "hsl(205 50% 30%)"],
  geox: ["hsl(0 0% 18%)", "hsl(0 0% 28%)", "hsl(0 0% 12%)"],
  ooni: ["hsl(15 75% 52%)", "hsl(8 65% 38%)", "hsl(0 55% 22%)"],
};

function resolvePalette(seed: string, hash: number): [string, string, string] {
  const key = Object.keys(BRAND_PALETTES).find((brand) =>
    seed.toLowerCase().includes(brand),
  );
  if (key) {
    return BRAND_PALETTES[key];
  }
  return [buildHsl(hash, 10), buildHsl(hash, 140), buildHsl(hash, 260)];
}

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const seed = (searchParams.get("seed") ?? "veepee").slice(0, 80);
  const width = clampNumber(Number(searchParams.get("w") ?? 800), 120, 2000);
  const height = clampNumber(Number(searchParams.get("h") ?? 400), 120, 2000);
  const label = (searchParams.get("text") ?? seed).slice(0, 60);
  const variant = (searchParams.get("variant") ?? "default").slice(0, 20);

  const hash = hashSeed(seed);
  const [c1, c2, c3] = resolvePalette(seed, hash);

  const safeLabel = escapeXml(label);
  const isJungle = variant === "jungle";
  const isBanner = variant === "banner";

  const bg = isJungle
    ? `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(120 35% 22%)"/>
        <stop offset="0.55" stop-color="hsl(95 40% 18%)"/>
        <stop offset="1" stop-color="hsl(160 35% 16%)"/>
      </linearGradient>
      <filter id="jungleNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="${hash % 99}"/>
        <feColorMatrix type="matrix"
          values="0.2 0 0 0 0
                  0 0.6 0 0 0
                  0 0 0.2 0 0
                  0 0 0 0.9 0"/>
      </filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.06"/>
        </feComponentTransfer>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" filter="url(#jungleNoise)" opacity="0.9"/>
    <rect width="100%" height="100%" filter="url(#grain)"/>
    <rect width="100%" height="100%" fill="rgba(0,0,0,0.18)"/>
  `
    : `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="0.55" stop-color="${c2}"/>
        <stop offset="1" stop-color="${c3}"/>
      </linearGradient>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.07"/>
        </feComponentTransfer>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" filter="url(#noise)"/>
  `;

  const bannerOverlay = isBanner
    ? `<rect x="0" y="${Math.round(height * 0.62)}" width="${width}" height="${Math.round(
        height * 0.38,
      )}" fill="rgba(0,0,0,0.18)"/>`
    : `<rect x="24" y="24" width="${Math.max(0, width - 48)}" height="${Math.max(
        0,
        height - 48,
      )}" fill="rgba(0,0,0,0.12)"/>`;

  const showMockHint = variant !== "banner";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${bg}
  ${bannerOverlay}
  <text x="40" y="${Math.max(56, Math.round(height * 0.72))}"
        font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        font-size="${Math.max(18, Math.round(Math.min(width, height) * 0.06))}"
        fill="rgba(255,255,255,0.92)"
        font-weight="700">${safeLabel}</text>
  ${
    showMockHint
      ? `<text x="40" y="${Math.max(80, Math.round(height * 0.72) + 28)}"
        font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        font-size="${Math.max(12, Math.round(Math.min(width, height) * 0.03))}"
        fill="rgba(255,255,255,0.78)"
        font-weight="500">mock · ${escapeXml(seed)}</text>`
      : ""
  }
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
