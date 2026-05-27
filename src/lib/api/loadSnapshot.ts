import homeSnapshot from "../../../data/api-snapshots/home.json";
import productCatalogSnapshot from "../../../data/api-snapshots/product-catalog.json";
import catalogSnapshot from "../../../data/api-snapshots/catalog.json";
import type {
  VeepeeCatalogSnapshot,
  VeepeeHomeSnapshot,
  VeepeeHubContent,
  VeepeeProductCatalogSnapshot,
} from "./veepeeApiTypes";
import {
  getGuestVisibleMin,
  getGuestVisibleRatio,
  mapHomeSnapshotToSales,
  mapOperationToSaleEvent,
  mapProductCatalogSnapshot,
} from "./mapApiToMock";
import { normalizeHubContent } from "./hubContent";
import type { Product, SaleEvent } from "@/lib/mock/types";

export function getHomeSnapshot(): VeepeeHomeSnapshot {
  return homeSnapshot as VeepeeHomeSnapshot;
}

export function getProductCatalogSnapshot(): VeepeeProductCatalogSnapshot {
  return productCatalogSnapshot as VeepeeProductCatalogSnapshot;
}

export function getCatalogSnapshot(): VeepeeCatalogSnapshot {
  return catalogSnapshot as VeepeeCatalogSnapshot;
}

export function getHomeSalesFromSnapshot(): SaleEvent[] {
  return mapHomeSnapshotToSales(getHomeSnapshot());
}

export function getMemberHomeSalesFromSnapshot(): SaleEvent[] {
  const snapshot = getHomeSnapshot();
  const memberOps = snapshot.memberOperations ?? snapshot.operations;
  return memberOps.map(mapOperationToSaleEvent);
}

export function getCategorySalesFromSnapshot(): SaleEvent[] {
  return getCatalogSnapshot().operations.map(mapOperationToSaleEvent);
}

export function getApiProductsFromSnapshot(): Product[] {
  return mapProductCatalogSnapshot(getProductCatalogSnapshot());
}

export function getHomePageMeta() {
  const snapshot = getHomeSnapshot();
  return {
    title: snapshot.meta.title,
    subtitle: snapshot.meta.subtitle,
    guestVisibleRatio: getGuestVisibleRatio(snapshot),
    guestVisibleMin: getGuestVisibleMin(snapshot),
    valuePropositions: snapshot.valuePropositions,
    source: snapshot.meta.source,
    fetchedAt: snapshot.meta.fetchedAt,
  };
}

export function getHubContent(categoryId: string): VeepeeHubContent {
  const hubs = getCatalogSnapshot().hubs;
  const raw = hubs[categoryId] ?? hubs.maison;
  return normalizeHubContent(categoryId, raw);
}

export function getCatalogTotalCount(): number {
  return getProductCatalogSnapshot().meta.totalCount;
}
