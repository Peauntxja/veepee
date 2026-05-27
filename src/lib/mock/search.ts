import { SALES } from "./sales";
import { PRODUCTS } from "./products";

export type SearchResult =
  | { type: "sale"; id: string; title: string; subtitle: string; href: string }
  | { type: "product"; id: string; title: string; subtitle: string; href: string };

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function searchCatalog(query: string): SearchResult[] {
  const q = normalizeQuery(query);
  if (!q) {
    return [];
  }

  const saleResults: SearchResult[] = SALES.filter(
    (sale) =>
      sale.brand.toLowerCase().includes(q) ||
      sale.title.toLowerCase().includes(q),
  ).map((sale) => ({
    type: "sale",
    id: sale.id,
    title: sale.brand,
    subtitle: sale.title,
    href: sale.href ?? `/gr/h/${sale.categoryTab}`,
  }));

  const productResults: SearchResult[] = PRODUCTS.filter(
    (product) =>
      product.brand.toLowerCase().includes(q) ||
      product.title.toLowerCase().includes(q),
  )
    .slice(0, 24)
    .map((product) => ({
      type: "product",
      id: product.id,
      title: product.title,
      subtitle: product.brand,
      href: `/gr/p/${product.categoryId}/${product.slug}/${product.id}`,
    }));

  return [...saleResults, ...productResults];
}
