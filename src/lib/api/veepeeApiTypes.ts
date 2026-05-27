/** Shapes alignés sur les réponses observées (Apify / DevTools veepee.fr) */

export type VeepeeApiTag = {
  type: string;
  label: string;
  position?: "topLeft" | "topRight";
};

export type VeepeeHomeOperation = {
  operationId: string;
  brandName: string;
  subtitle: string;
  bannerImageUrl: string;
  bannerLocalId?: string;
  categoryTab: string;
  status: "live" | "upcoming";
  href?: string;
  tags?: VeepeeApiTag[];
  discountLabel?: string;
};

export type VeepeeHomeSnapshot = {
  meta: {
    title: string;
    subtitle: string;
    guestVisibleRatio: number;
    guestVisibleMin?: number;
    source: string;
    fetchedAt: string;
  };
  operations: VeepeeHomeOperation[];
  memberOperations?: VeepeeHomeOperation[];
  valuePropositions: Array<{ title: string; description: string }>;
};

export type VeepeeProductMedia = {
  thumb: string;
  url: string;
  type: number;
  zoomable?: boolean;
};

export type VeepeeProductPricing = {
  currency: { symbol: string; code: string };
  price: { value: number; postfix: string };
  retailPrice: { value: number; postfix: string; tooltip?: { description: string } };
  discount: number;
};

export type VeepeeProductSnapshot = {
  url: string;
  id: string;
  saleId: string;
  catalogId: string;
  brand: string;
  name: string;
  description: string;
  isLocked: boolean;
  displayMode: number;
  saleSource: number;
  pricing: VeepeeProductPricing;
  medias: VeepeeProductMedia[];
  models?: Array<{
    id: string;
    name: string;
    stockLabel: string;
    quantity: number;
  }>;
};

export type VeepeeProductCatalogSnapshot = {
  meta: { source: string; fetchedAt: string; totalCount: number };
  products: VeepeeProductSnapshot[];
};

export type VeepeeHubContent = {
  title: string;
  subtitle: string;
  description: string;
  backgroundLocalId?: string;
  valuePropositions?: Array<{ title: string; description: string }>;
};

export type VeepeeCatalogSnapshot = {
  meta: { source: string; fetchedAt: string };
  hubs: Record<string, VeepeeHubContent>;
  operations: VeepeeHomeOperation[];
};

export type VeepeeSaleRoomSidebarItem = {
  id: string;
  label: string;
  active?: boolean;
};

export type VeepeeSaleRoomProduct = {
  id: string;
  brand: string;
  name: string;
  description: string;
  imageLocalId?: string;
  imageUrl?: string;
  sidebarId?: string;
  pricing: {
    price: number;
    retailPrice: number;
    discount: number;
  };
  defaultSize: string;
  sizeOptions: Array<{
    id: string;
    name: string;
    stockLabel: string;
  }>;
};

export type VeepeeSaleRoom = {
  operationId: string;
  catalogId: string;
  brandName: string;
  subtitle?: string;
  categoryTab: string;
  bannerLocalId?: string;
  sidebar: VeepeeSaleRoomSidebarItem[];
  promoThreshold?: number;
  products: VeepeeSaleRoomProduct[];
};

export type VeepeeSaleRoomsSnapshot = {
  meta: { source: string; fetchedAt: string };
  operationCatalogMap: Record<string, string>;
  rooms: Record<string, VeepeeSaleRoom>;
};
