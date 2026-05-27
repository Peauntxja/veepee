"use client";

import { useEffect, useState } from "react";

const PROMOS = [
  {
    title: "Plutôt du soir ou du matin ?",
    description: "Tous les jours, de nouvelles ventes à 7 h et à 19 h.",
  },
  {
    title: "Mode, Voyage ou Maison ?",
    description: "Il y en a pour tous les goûts : à vous de choisir!",
  },
  {
    title: "Jusqu'à - 70 % de réduction…",
    description: "...sur vos marques préférées: il y a de quoi vous faire plaisir!",
  },
];

export function AuthPromoPanel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % PROMOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const promo = PROMOS[activeIndex];

  return (
    <div className="flex flex-col justify-center bg-gray-50 p-8 md:p-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-veepee-pink">
        Qui sommes nous ?
      </p>
      <h2 className="mt-4 text-2xl font-bold">{promo.title}</h2>
      <p className="mt-3 text-veepee-muted">{promo.description}</p>
      <div className="mt-8 flex gap-2">
        {PROMOS.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex
                ? "w-8 bg-veepee-pink"
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
