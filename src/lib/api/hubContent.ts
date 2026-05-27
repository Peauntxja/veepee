import type { VeepeeHubContent } from "./veepeeApiTypes";
import { getHubSectionCopy } from "@/lib/mock/hubSections";

const VALUE_PROP_DEFAULTS = [
  {
    title: "Plutôt du soir ou du matin ?",
    description: "Tous les jours, de nouvelles ventes à 7 h et à 19 h.",
  },
  {
    title: "On s'habitue vite aux prix doux",
    description:
      "Chez Veepee, les plus grandes marques affichent jusqu'à -70% toute l'année.",
  },
  {
    title: "Les surprises, c'est notre quotidien",
    description:
      "Et la toute première vous attend après votre inscription chez nous.",
  },
];

function normalizeCopy(text: string): string {
  return text
    .replace(/marquesaffichent/gi, "marques affichent")
    .replace(/attendaprès/gi, "attend après")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function normalizeHubContent(
  categoryId: string,
  content: VeepeeHubContent,
): VeepeeHubContent {
  const sectionCopy = getHubSectionCopy(categoryId);
  const description =
    normalizeCopy(content.description || content.subtitle || "") ||
    sectionCopy.intro ||
    "";

  const valuePropositions =
    content.valuePropositions && content.valuePropositions.length >= 3
      ? content.valuePropositions.map((item) => ({
          title: normalizeCopy(item.title),
          description: normalizeCopy(item.description),
        }))
      : VALUE_PROP_DEFAULTS;

  return {
    ...content,
    title: normalizeCopy(content.title),
    subtitle: normalizeCopy(content.subtitle),
    description,
    valuePropositions,
  };
}

export { VALUE_PROP_DEFAULTS };
