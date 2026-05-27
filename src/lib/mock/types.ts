export type SaleStatus = "live" | "upcoming";

export type SaleEvent = {
  id: string;
  brand: string;
  title: string;
  bannerUrl: string;
  discountLabel: string;
  categoryTab: string;
  opensAt: string;
  endsAt: string;
  status: SaleStatus;
  isPinkCard?: boolean;
  href?: string;
};

export type Product = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  categoryId: string;
  colors?: string[];
  sizes?: string[];
};

export type CategoryTab = {
  id: string;
  label: string;
  href: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type SortOption = "pertinence" | "price-asc" | "price-desc";

export type ProductFilters = {
  sort: SortOption;
  brand: string;
  color: string;
  minPrice: number;
  maxPrice: number;
};
