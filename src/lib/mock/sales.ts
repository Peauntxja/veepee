import type { SaleEvent } from "./types";
import {
  getCategorySalesFromSnapshot,
  getHomeSalesFromSnapshot,
  getMemberHomeSalesFromSnapshot,
} from "@/lib/api/loadSnapshot";

/** Accueil invité depuis data/api-snapshots/home.json */
const HOME_SALES = getHomeSalesFromSnapshot();

/** Accueil membre (scroll / catalog) depuis home.json memberOperations */
const MEMBER_HOME_SALES = getMemberHomeSalesFromSnapshot();

/** Catégories depuis data/api-snapshots/catalog.json */
const CATEGORY_SALES = getCategorySalesFromSnapshot();

export const SALES: SaleEvent[] = [...HOME_SALES, ...CATEGORY_SALES];

export function getHomeSales(): SaleEvent[] {
  return HOME_SALES;
}

export function getMemberHomeSales(): SaleEvent[] {
  return MEMBER_HOME_SALES;
}

export function getSalesByCategory(categoryId: string): SaleEvent[] {
  const categorySales = SALES.filter((sale) => sale.categoryTab === categoryId);
  const crawled = categorySales.filter((sale) => !/^884\d{3}$/.test(sale.id));
  return crawled.length > 0 ? crawled : categorySales;
}

export function getVisibleSalesForGuest(): SaleEvent[] {
  const visibleCount = Math.max(2, Math.ceil(SALES.length * 0.1));
  return SALES.slice(0, visibleCount);
}
