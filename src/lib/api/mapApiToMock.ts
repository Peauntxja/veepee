import type {
  VeepeeHomeOperation,
  VeepeeHomeSnapshot,
  VeepeeProductCatalogSnapshot,
  VeepeeProductSnapshot,
} from "./veepeeApiTypes";
import { getCatalogIdForOperation } from "./saleRooms";
import type { Product, ProductSizeOption, SaleEvent } from "@/lib/mock/types";
import { resolveImage } from "@/lib/assets/resolveImage";
import type { LocalImageId } from "@/lib/assets/localImages";

const API_PRODUCT_IMAGE_SLOTS: LocalImageId[] = [
  "product-api-massimo",
  "product-01",
  "product-02",
  "product-03",
  "product-04",
];

function saleDateRange() {
  const now = new Date();
  const opensAt = new Date(now);
  opensAt.setHours(7, 0, 0, 0);
  const endsAt = new Date(opensAt);
  endsAt.setDate(endsAt.getDate() + 1);
  return { opensAt: opensAt.toISOString(), endsAt: endsAt.toISOString() };
}

function resolveBannerUrl(operation: VeepeeHomeOperation): string {
  if (operation.bannerImageUrl?.startsWith("/")) {
    return operation.bannerImageUrl;
  }
  if (operation.bannerLocalId) {
    return resolveImage(operation.bannerLocalId as LocalImageId, {
      variant: "banner",
      seed: operation.brandName,
      w: 1200,
      h: 600,
      text: operation.brandName,
    });
  }
  if (operation.bannerImageUrl) {
    return operation.bannerImageUrl;
  }
  const seed = operation.brandName.toLowerCase().replace(/\s+/g, "-");
  return resolveImage("sale-fortuneo", {
    variant: "banner",
    seed,
    w: 1200,
    h: 600,
    text: operation.brandName,
  });
}

export function resolveCatalogHref(operation: VeepeeHomeOperation): string | undefined {
  const mapped = getCatalogIdForOperation(operation.operationId);
  const catalogId = mapped ?? `${operation.operationId}01`;
  return `/gr/catalog/${operation.operationId}/${catalogId}`;
}

export function mapOperationToSaleEvent(operation: VeepeeHomeOperation): SaleEvent {
  const { opensAt, endsAt } = saleDateRange();
  const topLeftTag = operation.tags?.find((tag) => tag.position === "topLeft")?.label;
  const topRightTag = operation.tags?.find((tag) => tag.position === "topRight")?.label;
  const href =
    operation.href ??
    resolveCatalogHref(operation) ??
    (operation.categoryTab && operation.categoryTab !== "home"
      ? `/gr/h/${operation.categoryTab}`
      : undefined);

  return {
    id: operation.operationId,
    brand: operation.brandName,
    title: operation.subtitle,
    bannerUrl: resolveBannerUrl(operation),
    discountLabel: operation.discountLabel ?? "",
    categoryTab: operation.categoryTab,
    opensAt,
    endsAt,
    status: operation.status,
    isPinkCard: topLeftTag?.toUpperCase().includes("CARTE ROSE"),
    topLeftTag,
    topRightTag,
    href,
  };
}

export function mapHomeSnapshotToSales(snapshot: VeepeeHomeSnapshot): SaleEvent[] {
  return snapshot.operations.map(mapOperationToSaleEvent);
}

export function mapApiProductToProduct(
  apiProduct: VeepeeProductSnapshot,
  categoryId = "mode",
): Product {
  const imageUrls = apiProduct.medias.map((_, index) =>
    resolveImage(API_PRODUCT_IMAGE_SLOTS[index] ?? "product-api-massimo", {
      seed: `${apiProduct.id}-${index}`,
      w: 700,
      h: 700,
      text: apiProduct.brand,
    }),
  );
  const imageUrl = imageUrls[0] ?? resolveImage("product-api-massimo", {
    seed: apiProduct.id,
    w: 700,
    h: 700,
    text: apiProduct.brand,
  });

  const slug = `${apiProduct.brand}-${apiProduct.name}-${apiProduct.id}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const sizeOptions: ProductSizeOption[] | undefined = apiProduct.models?.map(
    (model) => ({
      name: model.name,
      stockLabel: model.stockLabel,
      quantity: model.quantity,
    }),
  );

  return {
    id: apiProduct.id,
    slug,
    brand: apiProduct.brand,
    title: apiProduct.name,
    price: apiProduct.pricing.price.value,
    originalPrice: apiProduct.pricing.retailPrice.value,
    imageUrl,
    imageUrls: imageUrls.length > 1 ? imageUrls : undefined,
    categoryId,
    sizes: sizeOptions?.map((option) => option.name),
    sizeOptions,
    saleId: apiProduct.saleId,
    catalogId: apiProduct.catalogId,
    retailPriceTooltip: apiProduct.pricing.retailPrice.tooltip?.description,
    discountPercent: apiProduct.pricing.discount,
    sourceUrl: apiProduct.url,
    isLocked: apiProduct.isLocked,
  };
}

export function mapProductCatalogSnapshot(snapshot: VeepeeProductCatalogSnapshot): Product[] {
  return snapshot.products.map((product) => mapApiProductToProduct(product));
}

export function getGuestVisibleRatio(snapshot: VeepeeHomeSnapshot): number {
  return snapshot.meta.guestVisibleRatio ?? 0.1;
}

export function getGuestVisibleMin(snapshot: VeepeeHomeSnapshot): number {
  return snapshot.meta.guestVisibleMin ?? 2;
}
