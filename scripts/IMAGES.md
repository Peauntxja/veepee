# Image assets

Run `npm run assets:download` to refresh local files from `image-manifest.json`.

## Strategy

1. **Official CDN** (`static.vente-privee.com`) — logos, favicon. Downloaded once; no runtime hotlink.
2. **Curated stock photos** (Unsplash / Picsum) — sale banners and product shots in `public/assets/images/`.
3. **Runtime fallback** — `resolveImage()` and `SafeImg` fall back to `/mock/image` SVG if a file is missing.

## Adding real Veepee URLs from DevTools

1. Open veepee.fr in browser → Network → filter Img.
2. Copy URLs (`media.veepee.com/v1/media/{uuid}?width=...` or static CDN).
3. Add to `scripts/image-manifest.json` with optional `"referer": "https://www.veepee.fr/"`.
4. Run `npm run assets:download -- --force`.

Note: `media.veepee.com` media IDs expire when sales end — download immediately after capture.
