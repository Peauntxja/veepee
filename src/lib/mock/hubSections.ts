export type HubUniverseLink = {
  label: string;
  href: string;
};

export type HubSectionCopy = {
  categoryLabel: string;
  intro?: string;
  salesTitle: string;
  salesFilterLabel: string;
  catalogTitle: string;
  catalogSubtitle: string;
  universTitle: string;
  showThePlace?: boolean;
  universeLinks: HubUniverseLink[];
};

const DEFAULT_UNIVERSE: HubUniverseLink[] = [
  { label: "Les univers Veepee", href: "/gr/home" },
];

export const HUB_SECTION_COPY: Record<string, HubSectionCopy> = {
  mode: {
    categoryLabel: "mode",
    intro:
      "Chaque jour, de nouvelles ventes mode à prix doux : prêt-à-porter femme, homme, enfant, lingerie et accessoires.",
    salesTitle: "Nos ventes éphémères mode",
    salesFilterLabel: "Toutes les ventes privées mode",
    catalogTitle: "Notre catalogue mode",
    catalogSubtitle: "Pour explorer nos articles selon vos envies.",
    universTitle: "Les univers mode",
    showThePlace: true,
    universeLinks: [
      { label: "Prêt-à-porter femme", href: "/gr/h/mode" },
      { label: "Sacs et maroquinerie", href: "/gr/h/chaussures" },
      { label: "Mode enfant", href: "/gr/h/enfant" },
      { label: "Lingerie", href: "/gr/h/mode" },
    ],
  },
  maison: {
    categoryLabel: "maison",
    intro:
      "Décoration, mobilier, électroménager et art de la table : des marques reconnues jusqu'à -70%.",
    salesTitle: "Nos ventes éphémères maison",
    salesFilterLabel: "Toutes les ventes privées maison",
    catalogTitle: "Notre catalogue maison",
    catalogSubtitle: "Pour explorer nos articles selon vos envies.",
    universTitle: "Les univers maison",
    universeLinks: [
      { label: "Décoration", href: "/gr/h/maison" },
      { label: "Mobilier", href: "/gr/h/maison" },
      { label: "Art de la table", href: "/gr/h/maison" },
    ],
  },
  voyage: {
    categoryLabel: "voyage",
    salesTitle: "Nos ventes éphémères voyage",
    salesFilterLabel: "Toutes les ventes privées voyage",
    catalogTitle: "Notre catalogue voyage",
    catalogSubtitle: "Week-ends, séjours et croisières à prix doux.",
    universTitle: "Encore plus d'univers",
    universeLinks: [
      { label: "France", href: "/gr/h/voyage" },
      { label: "Europe", href: "/gr/h/voyage" },
      { label: "Club Med", href: "/gr/h/voyage" },
    ],
  },
  enfant: {
    categoryLabel: "enfant",
    salesTitle: "Nos ventes éphémères enfant",
    salesFilterLabel: "Toutes les ventes privées enfant",
    catalogTitle: "Notre catalogue enfant",
    catalogSubtitle: "Mode, jouets et puériculture à prix doux.",
    universTitle: "Les univers enfant",
    universeLinks: [
      { label: "Mode enfant", href: "/gr/h/enfant" },
      { label: "Jouets", href: "/gr/h/enfant" },
    ],
  },
  chaussures: {
    categoryLabel: "chaussures",
    salesTitle: "Nos ventes éphémères chaussures",
    salesFilterLabel: "Toutes les ventes privées chaussures",
    catalogTitle: "Notre catalogue chaussures",
    catalogSubtitle: "Chaussures et accessoires pour toute la famille.",
    universTitle: "Les univers chaussures",
    universeLinks: DEFAULT_UNIVERSE,
  },
  beaute: {
    categoryLabel: "beauté",
    salesTitle: "Nos ventes éphémères beauté",
    salesFilterLabel: "Toutes les ventes privées beauté",
    catalogTitle: "Notre catalogue beauté",
    catalogSubtitle: "Parfums, soins et maquillage à prix doux.",
    universTitle: "Les univers beauté",
    universeLinks: DEFAULT_UNIVERSE,
  },
  sport: {
    categoryLabel: "sport",
    salesTitle: "Nos ventes éphémères sport",
    salesFilterLabel: "Toutes les ventes privées sport",
    catalogTitle: "Notre catalogue sport",
    catalogSubtitle: "Sportswear et équipement à prix doux.",
    universTitle: "Les univers sport",
    universeLinks: DEFAULT_UNIVERSE,
  },
  vin: {
    categoryLabel: "vin et épicerie",
    salesTitle: "Nos ventes éphémères vin et épicerie",
    salesFilterLabel: "Toutes les ventes privées vin et épicerie",
    catalogTitle: "Notre catalogue gourmand",
    catalogSubtitle: "Vins, épicerie fine et produits frais livrés chez vous.",
    universTitle: "Encore plus d'univers",
    universeLinks: [
      { label: "Vins", href: "/gr/h/vin" },
      { label: "Épicerie fine", href: "/gr/h/vin" },
      { label: "Produits frais", href: "/gr/h/vin" },
    ],
  },
  loisir: {
    categoryLabel: "loisir",
    salesTitle: "Nos ventes éphémères loisir",
    salesFilterLabel: "Toutes les ventes privées loisir",
    catalogTitle: "Notre catalogue high-tech et loisir",
    catalogSubtitle: "High-tech, billetterie et expériences à prix doux.",
    universTitle: "Encore plus d'univers",
    universeLinks: [
      { label: "High-tech", href: "/gr/h/loisir" },
      { label: "Billetterie", href: "/gr/h/loisir" },
    ],
  },
  rosedeals: {
    categoryLabel: "rosedeals",
    salesTitle: "Nos Rosedeals",
    salesFilterLabel: "Tous les Rosedeals",
    catalogTitle: "Notre sélection Rosedeals",
    catalogSubtitle: "Coupons et offres partenaires exclusives.",
    universTitle: "Encore plus d'univers",
    universeLinks: DEFAULT_UNIVERSE,
  },
  "the-place": {
    categoryLabel: "The Place",
    salesTitle: "Nos ventes The Place",
    salesFilterLabel: "Toutes les ventes The Place",
    catalogTitle: "Notre catalogue The Place",
    catalogSubtitle: "Marques premium sélectionnées pour vous.",
    universTitle: "Les univers The Place",
    universeLinks: [{ label: "The Place", href: "/gr/h/the-place" }],
  },
};

export function getHubSectionCopy(categoryId: string): HubSectionCopy {
  return (
    HUB_SECTION_COPY[categoryId] ?? {
      categoryLabel: categoryId,
      salesTitle: `Nos ventes éphémères ${categoryId}`,
      salesFilterLabel: `Toutes les ventes privées ${categoryId}`,
      catalogTitle: `Notre catalogue ${categoryId}`,
      catalogSubtitle: "Pour explorer nos articles selon vos envies.",
      universTitle: "Encore plus d'univers",
      universeLinks: DEFAULT_UNIVERSE,
    }
  );
}
