import type { SaleEvent } from "./types";

const now = new Date();
const todayMorning = new Date(now);
todayMorning.setHours(7, 0, 0, 0);
const todayEvening = new Date(now);
todayEvening.setHours(19, 0, 0, 0);
const tomorrowMorning = new Date(todayMorning);
tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);

export const SALES: SaleEvent[] = [
  {
    id: "sale-1",
    brand: "Fortuneo Banque",
    title: "J'aime ma banque",
    bannerUrl: `/mock/image?variant=banner&seed=fortuneo&w=1200&h=600&text=${encodeURIComponent(
      "fortuneo banque",
    )}`,
    discountLabel: "",
    categoryTab: "home",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
    isPinkCard: true,
    topLeftTag: "CARTE ROSE",
    topRightTag: "Publicité",
  },
  {
    id: "sale-2",
    brand: "Backsun",
    title: "ET PLUS DE MARQUES",
    bannerUrl: `/mock/image?variant=banner&seed=backsun&w=1200&h=600&text=${encodeURIComponent(
      "BACKSUN",
    )}`,
    discountLabel: "",
    categoryTab: "home",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
    topRightTag: "Expédié en 72h",
    href: "/gr/p/maison/mobilier-123",
  },
  {
    id: "sale-3",
    brand: "Billowy",
    title: "ET PLUS DE MARQUES",
    bannerUrl: `/mock/image?variant=banner&seed=billowy&w=1200&h=600&text=${encodeURIComponent(
      "BILLOWY",
    )}`,
    discountLabel: "",
    categoryTab: "home",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
    topRightTag: "Expédié en 72h",
  },
  {
    id: "sale-4",
    brand: "Villages Clubs du Soleil",
    title: "Séjours tout compris",
    bannerUrl: `/mock/image?variant=banner&seed=villages&w=1200&h=600&text=${encodeURIComponent(
      "VILLAGES CLUBS DU SOLEIL",
    )}`,
    discountLabel: "",
    categoryTab: "home",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
    topLeftTag: "CARTE ROSE",
    topRightTag: "Publicité",
  },
  {
    id: "sale-5",
    brand: "GEOX",
    title: "Chaussures",
    bannerUrl: `/mock/image?variant=banner&seed=geox&w=1200&h=600&text=${encodeURIComponent(
      "GEOX",
    )}`,
    discountLabel: "",
    categoryTab: "home",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
    href: "/gr/h/mode",
  },
  {
    id: "sale-6",
    brand: "Ooni",
    title: "Two days · 1 marque, 2 jours",
    bannerUrl: `/mock/image?variant=banner&seed=ooni&w=1200&h=600&text=${encodeURIComponent(
      "ooni",
    )}`,
    discountLabel: "",
    categoryTab: "home",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
    href: "/gr/h/maison",
  },
  {
    id: "sale-7",
    brand: "NAZAR HOME",
    title: "Décoration tendance",
    bannerUrl:
      "/mock/image?seed=nazar&w=800&h=400&text=" +
      encodeURIComponent("NAZAR HOME"),
    discountLabel: "-50%",
    categoryTab: "maison",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
    href: "/gr/h/maison",
  },
  {
    id: "sale-8",
    brand: "Veepee Camp",
    title: "Spring Camp — jusqu'à -80%",
    bannerUrl:
      "/mock/image?seed=camp&w=800&h=400&text=" +
      encodeURIComponent("VEEPEE CAMP"),
    discountLabel: "-80%",
    categoryTab: "maison",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
  },
  {
    id: "sale-9",
    brand: "Club Med",
    title: "Séjours tout compris",
    bannerUrl:
      "/mock/image?seed=clubmed&w=800&h=400&text=" +
      encodeURIComponent("CLUB MED"),
    discountLabel: "-55%",
    categoryTab: "voyage",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
  },
  {
    id: "sale-10",
    brand: "Oxybul",
    title: "Jouets & puériculture",
    bannerUrl:
      "/mock/image?seed=oxybul&w=800&h=400&text=" + encodeURIComponent("OXYBUL"),
    discountLabel: "-45%",
    categoryTab: "enfant",
    opensAt: todayMorning.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "live",
  },
  {
    id: "sale-11",
    brand: "Lancôme",
    title: "Soins & parfums",
    bannerUrl:
      "/mock/image?seed=lancome&w=800&h=400&text=" +
      encodeURIComponent("LANCÔME"),
    discountLabel: "-50%",
    categoryTab: "beaute",
    opensAt: todayEvening.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "upcoming",
  },
  {
    id: "sale-12",
    brand: "Nike",
    title: "Running & fitness",
    bannerUrl:
      "/mock/image?seed=nike&w=800&h=400&text=" + encodeURIComponent("NIKE"),
    discountLabel: "-55%",
    categoryTab: "sport",
    opensAt: todayEvening.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "upcoming",
  },
  {
    id: "sale-13",
    brand: "Maje",
    title: "Femme — collection printemps",
    bannerUrl:
      "/mock/image?seed=maje&w=800&h=400&text=" + encodeURIComponent("MAJE"),
    discountLabel: "-62%",
    categoryTab: "mode",
    opensAt: todayEvening.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "upcoming",
  },
  {
    id: "sale-14",
    brand: "Dyson",
    title: "Électroménager premium",
    bannerUrl:
      "/mock/image?seed=dyson&w=800&h=400&text=" + encodeURIComponent("DYSON"),
    discountLabel: "-35%",
    categoryTab: "maison",
    opensAt: todayEvening.toISOString(),
    endsAt: tomorrowMorning.toISOString(),
    status: "upcoming",
  },
];

export function getSalesByCategory(categoryId: string): SaleEvent[] {
  return SALES.filter((sale) => sale.categoryTab === categoryId);
}

export function getVisibleSalesForGuest(): SaleEvent[] {
  const visibleCount = Math.max(2, Math.ceil(SALES.length * 0.1));
  return SALES.slice(0, visibleCount);
}
