import type { Product } from "./types";
import { resolveProductImage } from "@/lib/assets/resolveImage";
import {
  getApiProductsFromSnapshot,
  getCatalogTotalCount,
} from "@/lib/api/loadSnapshot";
import { getAllSaleRoomProducts, findProductInSaleRooms } from "@/lib/api/saleRooms";
import { SEARCH_CONTINUE_PRODUCT } from "@/lib/mock/searchOverlay";

const BRANDS = [
  "RECA BEDDING",
  "KOCOON",
  "NAZAR HOME",
  "IKEA STYLE",
  "LUMINARC",
  "TEFAL",
  "PHILIPS",
  "ROWENTA",
  "GEOX",
  "MAJE",
  "NIKE",
  "LANCÔME",
];

const TITLES = [
  "Housse de couette coton",
  "Canapé convertible 3 places",
  "Lampe de chevet design",
  "Set de casseroles inox",
  "Matelas mémoire de forme",
  "Table basse scandinave",
  "Rideaux occultants",
  "Plaid laine mérinos",
  "Coussin décoratif velours",
  "Armoire 2 portes",
  "Suspension industrielle",
  "Tapis berbère",
  "Boîte de rangement",
  "Miroir mural rond",
  "Étagère murale",
];

const COLORS = ["Blanc", "Gris", "Beige", "Noir", "Bleu", "Rose"];
const SIZES = ["S", "M", "L", "XL", "Unique"];

const CATEGORY_IDS = [
  "maison",
  "mode",
  "beaute",
  "sport",
  "enfant",
  "chaussures",
  "vin",
  "voyage",
  "loisir",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildProduct(index: number): Product {
  const brand = BRANDS[index % BRANDS.length];
  const title = TITLES[index % TITLES.length];
  const categoryId = CATEGORY_IDS[index % CATEGORY_IDS.length];
  const originalPrice = 50 + (index % 20) * 45 + (index % 7) * 10;
  const discountPercent = 30 + (index % 5) * 5;
  const price = Math.round(originalPrice * (1 - discountPercent / 100) * 100) / 100;
  const id = `prod-${index + 1}`;

  return {
    id,
    slug: slugify(`${brand}-${title}-${id}`),
    brand,
    title: `${title} ${index + 1}`,
    price,
    originalPrice,
    imageUrl: resolveProductImage(index, brand),
    categoryId,
    colors: [COLORS[index % COLORS.length], COLORS[(index + 2) % COLORS.length]],
    sizes: index % 3 === 0 ? SIZES : undefined,
  };
}

const GENERATED_PRODUCTS: Product[] = Array.from({ length: 120 }, (_, i) =>
  buildProduct(i),
);

const CONTINUE_SHOPPING_PRODUCT: Product = {
  id: SEARCH_CONTINUE_PRODUCT.id,
  slug: "chaise-rembourree-continue-chair",
  brand: "Maison",
  title: SEARCH_CONTINUE_PRODUCT.title,
  price: SEARCH_CONTINUE_PRODUCT.price,
  originalPrice: SEARCH_CONTINUE_PRODUCT.originalPrice,
  imageUrl: SEARCH_CONTINUE_PRODUCT.imageUrl,
  categoryId: "maison",
};

/** Produits issus de data/api-snapshots/product-catalog.json (réponse API réelle) */
const API_PRODUCTS = getApiProductsFromSnapshot();
const SALE_ROOM_PRODUCTS = getAllSaleRoomProducts();

export const PRODUCTS: Product[] = [
  ...API_PRODUCTS,
  ...SALE_ROOM_PRODUCTS,
  CONTINUE_SHOPPING_PRODUCT,
  ...GENERATED_PRODUCTS,
];

export const PLP_TOTAL_COUNT = getCatalogTotalCount();
export const PLP_PAGE_SIZE = 48;

export function getProductById(id: string): Product | undefined {
  return (
    PRODUCTS.find((product) => product.id === id) ?? findProductInSaleRooms(id)
  );
}

export function getProductsByCategory(categoryId: string): Product[] {
  const categoryProducts = PRODUCTS.filter(
    (product) => product.categoryId === categoryId,
  );
  if (categoryProducts.length > 0) {
    return categoryProducts;
  }
  return PRODUCTS.filter((product) => product.categoryId === "maison");
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = getProductById(productId);
  if (!product) {
    return PRODUCTS.slice(0, limit);
  }
  return PRODUCTS.filter(
    (item) => item.categoryId === product.categoryId && item.id !== productId,
  ).slice(0, limit);
}

export function getUniqueBrands(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.brand))].sort();
}

export function getUniqueColors(products: Product[]): string[] {
  const colors = products.flatMap((product) => product.colors ?? []);
  return [...new Set(colors)].sort();
}
