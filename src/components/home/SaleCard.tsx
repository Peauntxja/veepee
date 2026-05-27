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
    <article className="group relative overflow-hidden bg-black/20 shadow-lg">
      <div className="relative aspect-[2/1] w-full">
        <SafeImg
          src={sale.bannerUrl}
          alt={sale.brand}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            blurred ? "blur-md scale-105" : ""
          }`}
        />
        {(sale.topLeftTag || sale.isPinkCard) && (
          <span className="absolute left-3 top-3 z-10 bg-veepee-pink px-3 py-1 text-[11px] font-bold uppercase text-white">
            {sale.topLeftTag ?? "CARTE ROSE"}
          </span>
        )}
        {sale.topRightTag && (
          <span
            className={`absolute right-3 top-3 z-10 px-3 py-1 text-[11px] font-semibold ${
              sale.topRightTag.toLowerCase().includes("expédié")
                ? "border border-veepee-pink bg-white/95 text-veepee-pink"
                : "bg-black/70 text-white"
            }`}
          >
            {sale.topRightTag}
          </span>
        )}
        {sale.status === "upcoming" && (
          <span className="absolute right-3 top-3 z-10 bg-black px-3 py-1 text-xs font-bold text-white">
            Bientôt · 19h
          </span>
        )}
        {blurred && (
          <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center bg-black/25">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xl">
              🔒
            </span>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white">
              Réservé aux membres
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
      <div className={`p-4 text-white ${blurred ? "blur-sm" : ""}`}>
        {sale.discountLabel ? (
          <p className="text-xs font-semibold uppercase tracking-wide">
            {sale.discountLabel}
          </p>
        ) : (
          <div className="h-4" />
        )}
        <h3 className="mt-1 text-base font-bold uppercase tracking-wide">
          {sale.brand}
        </h3>
        <p className="text-xs opacity-90">{sale.title}</p>
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
