import type { Product } from "./types";

const BRANDS = [
  "RECA BEDDING",
  "KOCOON",
  "NAZAR HOME",
  "IKEA STYLE",
  "LUMINARC",
  "TEFAL",
  "PHILIPS",
  "ROWENTA",
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
    imageUrl: `https://picsum.photos/seed/${id}/400/500`,
    categoryId: "maison",
    colors: [COLORS[index % COLORS.length], COLORS[(index + 2) % COLORS.length]],
    sizes: index % 3 === 0 ? SIZES : undefined,
  };
}

export const PRODUCTS: Product[] = Array.from({ length: 60 }, (_, i) =>
  buildProduct(i),
);

export const PLP_TOTAL_COUNT = 15297;
export const PLP_PAGE_SIZE = 48;

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((product) => product.categoryId === categoryId);
}

export function getUniqueBrands(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.brand))].sort();
}

export function getUniqueColors(products: Product[]): string[] {
  const colors = products.flatMap((product) => product.colors ?? []);
  return [...new Set(colors)].sort();
}
