import type { CategoryTab } from "./types";

export const CATEGORY_TABS: CategoryTab[] = [
  { id: "home", label: "Accueil", href: "/gr/home" },
  { id: "mode", label: "Mode", href: "/gr/h/mode" },
  { id: "voyage", label: "Voyage", href: "/gr/h/voyage" },
  { id: "maison", label: "Maison", href: "/gr/h/maison" },
  { id: "vin", label: "Vin et Épicerie", href: "/gr/h/vin" },
  { id: "loisir", label: "Loisir", href: "/gr/h/loisir" },
  { id: "enfant", label: "Enfant", href: "/gr/h/enfant" },
  { id: "chaussures", label: "Chaussures", href: "/gr/h/chaussures" },
  { id: "beaute", label: "Beauté", href: "/gr/h/beaute" },
  { id: "sport", label: "Sport", href: "/gr/h/sport" },
  { id: "rosedeals", label: "Rosedeals", href: "/gr/h/rosedeals" },
  { id: "the-place", label: "The Place", href: "/gr/h/the-place" },
];

export const HUB_CONTENT: Record<
  string,
  { title: string; subtitle: string; description: string }
> = {
  maison: {
    title: "Notre catalogue maison à prix doux",
    subtitle: "Nos plus belles marques en ventes privées",
    description:
      "Depuis plus de 20 ans, Veepee collabore avec de nombreuses marques expertes de la maison et de la literie pour vous proposer une sélection d'articles de déco, jardin, mobilier et cuisine accessibles en ventes privées.",
  },
  mode: {
    title: "Notre sélection mode à prix doux",
    subtitle: "Les plus grandes marques en ventes privées",
    description:
      "Découvrez chaque jour de nouvelles ventes mode : prêt-à-porter, chaussures et accessoires jusqu'à -70%.",
  },
  vin: {
    title: "Vin et Épicerie à prix doux",
    subtitle: "Gastronomie & vin en ventes privées",
    description:
      "Des événements quotidiens et une sélection de références à découvrir à prix doux.",
  },
  voyage: {
    title: "Voyagez autrement avec Veepee",
    subtitle: "Des séjours à prix exclusifs",
    description:
      "Hôtels, croisières et escapades sélectionnés par nos experts voyage à des tarifs exceptionnels.",
  },
  loisir: {
    title: "Loisir & divertissement à prix doux",
    subtitle: "Billetterie, expériences et idées sorties",
    description:
      "Des offres sélectionnées pour s'évader et se divertir, au meilleur prix.",
  },
  enfant: {
    title: "Tout pour les enfants à prix doux",
    subtitle: "Mode et puériculture en ventes privées",
    description:
      "Vêtements, jouets et équipement puériculture des meilleures marques en ventes éphémères.",
  },
  beaute: {
    title: "Beauté & bien-être à prix doux",
    subtitle: "Parfums, soins et maquillage",
    description:
      "Les plus belles marques beauté en ventes privées exclusives pour membres Veepee.",
  },
  sport: {
    title: "Sport & outdoor à prix doux",
    subtitle: "Équipement et vêtements techniques",
    description:
      "Running, fitness, outdoor : des marques sportives premium à prix réduits toute l'année.",
  },
  "super-surface": {
    title: "Super surface à prix doux",
    subtitle: "Le quotidien à petits prix",
    description:
      "Produits du quotidien et incontournables, disponibles toute l'année à prix doux.",
  },
};
