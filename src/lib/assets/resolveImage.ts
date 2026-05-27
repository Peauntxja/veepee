import { LOCAL_IMAGES, type LocalImageId } from "./localImages";

export function resolveLocalImage(id: LocalImageId): string {
  return LOCAL_IMAGES[id];
}

export function resolveImage(
  id: LocalImageId,
  mockParams?: { seed?: string; w?: number; h?: number; variant?: string; text?: string },
): string {
  const local = LOCAL_IMAGES[id];
  if (local) {
    return local;
  }

  const seed = mockParams?.seed ?? id;
  const w = mockParams?.w ?? 800;
  const h = mockParams?.h ?? 400;
  const variant = mockParams?.variant;
  const text = mockParams?.text ?? seed;

  const params = new URLSearchParams({
    seed,
    w: String(w),
    h: String(h),
    text,
  });
  if (variant) {
    params.set("variant", variant);
  }
  return `/mock/image?${params.toString()}`;
}

export function resolveProductImage(index: number, brand: string): string {
  const slot = (index % 12) + 1;
  const id = `product-${String(slot).padStart(2, "0")}` as LocalImageId;
  return resolveImage(id, {
    seed: `${brand}-${index}`,
    w: 400,
    h: 500,
    text: brand,
  });
}
