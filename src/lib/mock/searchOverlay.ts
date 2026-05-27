import { resolveImage } from "@/lib/assets/resolveImage";

export type SearchTrendIcon = "butterfly" | "arch" | "grid";

export type SearchMemberTrend = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: SearchTrendIcon;
};

export type SearchContinueProduct = {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  href: string;
};

/** Aligné sur veepee.fr — panneau recherche au focus */
export const SEARCH_MEMBER_TRENDS: SearchMemberTrend[] = [
  {
    id: "trend-playtex",
    title: "Playtex",
    subtitle: "Marque",
    href: "/gr/search?q=Playtex",
    icon: "butterfly",
  },
  {
    id: "trend-samsung",
    title: "Samsung",
    subtitle: "Marque",
    href: "/gr/search?q=Samsung",
    icon: "butterfly",
  },
  {
    id: "trend-corse",
    title: "Corse",
    subtitle: "Voyage",
    href: "/gr/h/voyage",
    icon: "arch",
  },
  {
    id: "trend-robes",
    title: "Robes et combinaisons",
    subtitle: "dans Mode femme",
    href: "/gr/h/mode",
    icon: "grid",
  },
];

export const SEARCH_CONTINUE_PRODUCT: SearchContinueProduct = {
  id: "continue-chair",
  title: "Chaise rembourrée",
  price: 489.99,
  originalPrice: 996,
  imageUrl: resolveImage("product-03", {
    seed: "continue-chair",
    w: 400,
    h: 400,
    text: "Chaise",
  }),
  href: "/gr/p/maison/chaise-rembourree-continue-chair/continue-chair",
};
