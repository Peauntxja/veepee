import saleRoomsSnapshot from "../../../data/api-snapshots/sale-rooms.json";
import catalogSnapshot from "../../../data/api-snapshots/catalog.json";
import homeSnapshot from "../../../data/api-snapshots/home.json";
import type {
  VeepeeHomeOperation,
  VeepeeHomeSnapshot,
  VeepeeSaleRoom,
  VeepeeSaleRoomProduct,
  VeepeeSaleRoomsSnapshot,
  VeepeeCatalogSnapshot,
} from "./veepeeApiTypes";
import { resolveImage } from "@/lib/assets/resolveImage";
import type { LocalImageId } from "@/lib/assets/localImages";
import type { Product } from "@/lib/mock/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getSaleRoomsSnapshot(): VeepeeSaleRoomsSnapshot {
  return saleRoomsSnapshot as VeepeeSaleRoomsSnapshot;
}

export function getSaleRoomKey(operationId: string, catalogId: string): string {
  return `${operationId}:${catalogId}`;
}

export function getCatalogIdForOperation(operationId: string): string | undefined {
  return getSaleRoomsSnapshot().operationCatalogMap[operationId];
}

export function getSaleRoom(
  operationId: string,
  catalogId: string,
): VeepeeSaleRoom | undefined {
  const key = getSaleRoomKey(operationId, catalogId);
  return getSaleRoomsSnapshot().rooms[key];
}

function findOperation(operationId: string): VeepeeHomeOperation | undefined {
  const catalog = catalogSnapshot as VeepeeCatalogSnapshot;
  const home = homeSnapshot as VeepeeHomeSnapshot;
  const fromCatalog = catalog.operations.find((op) => op.operationId === operationId);
  if (fromCatalog) return fromCatalog;
  const fromHome = home.operations.find((op) => op.operationId === operationId);
  if (fromHome) return fromHome;
  return home.memberOperations?.find((op) => op.operationId === operationId);
}

function buildFallbackProducts(
  operation: VeepeeHomeOperation,
  count = 8,
): VeepeeSaleRoomProduct[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `fallback-${index + 1}`,
    brand: operation.brandName,
    name: `${operation.brandName} — sélection ${index + 1}`,
    description: `${operation.brandName} — sélection ${index + 1}`,
    imageLocalId: `product-${String((index % 12) + 1).padStart(2, "0")}`,
    sidebarId: index % 2 === 0 ? "all" : "selection",
    pricing: {
      price: 19.99 + index * 5,
      retailPrice: 59.99 + index * 10,
      discount: 55,
    },
    defaultSize: "Taille unique",
    sizeOptions: [{ id: "tu", name: "Taille unique", stockLabel: "Disponible" }],
  }));
}

function buildFallbackRoom(
  operationId: string,
  catalogId: string,
  operation: VeepeeHomeOperation,
): VeepeeSaleRoom {
  const categoryTab = operation.categoryTab === "home" ? "mode" : operation.categoryTab;
  const sidebar = [
    { id: "all", label: "Tout voir", active: true },
    { id: "selection", label: "Sélection", active: false },
  ];

  return {
    operationId,
    catalogId,
    brandName: operation.brandName,
    subtitle: operation.subtitle,
    categoryTab,
    bannerLocalId: operation.bannerLocalId,
    sidebar,
    promoThreshold: 40,
    products: buildFallbackProducts(operation),
  };
}

export function getSaleRoomWithFallback(
  operationId: string,
  catalogId: string,
): VeepeeSaleRoom | null {
  const existing = getSaleRoom(operationId, catalogId);
  if (existing) return existing;

  const operation = findOperation(operationId);
  if (!operation) return null;
  return buildFallbackRoom(operationId, catalogId, operation);
}

export function mapSaleRoomProductToProduct(
  room: VeepeeSaleRoom,
  item: VeepeeSaleRoomProduct,
): Product {
  const imageUrl = item.imageUrl
    ? item.imageUrl
    : item.imageLocalId
      ? resolveImage(item.imageLocalId as LocalImageId, {
          seed: item.id,
          w: 700,
          h: 875,
          text: item.brand,
        })
      : resolveImage("product-01", {
          seed: item.id,
          w: 700,
          h: 875,
          text: item.brand,
        });

  return {
    id: `sale-${room.operationId}-${item.id}`,
    slug: slugify(`${item.brand}-${item.name}-${item.id}`),
    brand: item.brand,
    title: item.name,
    price: item.pricing.price,
    originalPrice: item.pricing.retailPrice,
    imageUrl,
    categoryId: room.categoryTab,
    sizes: item.sizeOptions.map((option) => option.name),
    sizeOptions: item.sizeOptions.map((option) => ({
      name: option.name,
      stockLabel: option.stockLabel,
    })),
    saleId: room.operationId,
    catalogId: room.catalogId,
    discountPercent: item.pricing.discount,
  };
}

export function getSaleRoomProducts(operationId: string, catalogId: string): Product[] {
  const room = getSaleRoom(operationId, catalogId);
  if (!room) return [];
  return room.products.map((item) => mapSaleRoomProductToProduct(room, item));
}

export function getSaleRoomProductById(
  operationId: string,
  catalogId: string,
  productId: string,
): Product | undefined {
  return getSaleRoomProducts(operationId, catalogId).find(
    (product) => product.id === productId,
  );
}

export function findProductInSaleRooms(productId: string): Product | undefined {
  const match = productId.match(/^sale-(\d+)-(.+)$/);
  if (!match) return undefined;

  const operationId = match[1];
  const catalogCandidates = new Set<string>();
  const mapped = getCatalogIdForOperation(operationId);
  if (mapped) catalogCandidates.add(mapped);
  catalogCandidates.add(`${operationId}01`);

  for (const catalogId of catalogCandidates) {
    const room = getSaleRoomWithFallback(operationId, catalogId);
    if (!room) continue;
    for (const item of room.products) {
      const product = mapSaleRoomProductToProduct(room, item);
      if (product.id === productId) return product;
    }
  }

  return undefined;
}

export function getAllSaleRoomProducts(): Product[] {
  const snapshot = getSaleRoomsSnapshot();
  return Object.values(snapshot.rooms).flatMap((room) =>
    room.products.map((item) => mapSaleRoomProductToProduct(room, item)),
  );
}
