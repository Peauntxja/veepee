"use client";

import Link from "next/link";
import { SafeImg } from "@/components/common/SafeImg";
import type { SaleEvent } from "@/lib/mock/types";

type SaleCardProps = {
  sale: SaleEvent;
  blurred?: boolean;
  onLockedClick?: () => void;
};

export function SaleCard({ sale, blurred = false, onLockedClick }: SaleCardProps) {
  const href = sale.href ?? "/gr/h/maison";
  const content = (
    <article
      className={`group relative overflow-hidden bg-black/20 shadow-lg ${
        blurred ? "pointer-events-none" : ""
      }`}
    >
      <div className="relative aspect-[2/1] w-full">
        <SafeImg
          src={sale.bannerUrl}
          alt={sale.brand}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            blurred ? "blur-md" : ""
          }`}
        />
        {sale.isPinkCard && (
          <span className="absolute left-3 top-3 bg-veepee-pink px-3 py-1 text-xs font-bold uppercase text-white">
            Carte Rose
          </span>
        )}
        {sale.status === "upcoming" && (
          <span className="absolute right-3 top-3 bg-black px-3 py-1 text-xs font-bold text-white">
            Bientôt · 19h
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
      <div className={`p-4 text-white ${blurred ? "blur-sm" : ""}`}>
        <p className="text-xs font-semibold uppercase tracking-wide">
          {sale.discountLabel}
        </p>
        <h3 className="mt-1 text-lg font-bold">{sale.brand}</h3>
        <p className="text-sm opacity-90">{sale.title}</p>
      </div>
    </article>
  );

  if (blurred) {
    return (
      <button
        type="button"
        className="w-full cursor-pointer text-left"
        onClick={onLockedClick}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
