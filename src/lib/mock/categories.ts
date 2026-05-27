import type { CategoryTab } from "./types";

export const CATEGORY_TABS: CategoryTab[] = [
  { id: "mode", label: "Mode", href: "/gr/h/mode" },
  { id: "maison", label: "Maison", href: "/gr/h/maison" },
  { id: "voyage", label: "Voyage", href: "/gr/h/voyage" },
  { id: "enfant", label: "Enfant", href: "/gr/h/enfant" },
  { id: "beaute", label: "Beauté", href: "/gr/h/beaute" },
  { id: "sport", label: "Sport", href: "/gr/h/sport" },
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
  voyage: {
    title: "Voyagez autrement avec Veepee",
    subtitle: "Des séjours à prix exclusifs",
    description:
      "Hôtels, croisières et escapades sélectionnés par nos experts voyage à des tarifs exceptionnels.",
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
};
