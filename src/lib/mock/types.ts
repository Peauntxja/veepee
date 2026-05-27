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
  topRightTag?: string;
  topLeftTag?: string;
  href?: string;
};

export type ProductSizeOption = {
  name: string;
  stockLabel?: string;
  quantity?: number;
};

export type Product = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  imageUrls?: string[];
  categoryId: string;
  colors?: string[];
  sizes?: string[];
  sizeOptions?: ProductSizeOption[];
  saleId?: string;
  catalogId?: string;
  retailPriceTooltip?: string;
  discountPercent?: number;
  sourceUrl?: string;
  isLocked?: boolean;
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
