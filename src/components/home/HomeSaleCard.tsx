"use client";

import Link from "next/link";
import { SafeImg } from "@/components/common/SafeImg";
import type { SaleEvent } from "@/lib/mock/types";
import {
  HOME_SALE_CARD_ASPECT,
  HOME_SALE_CARD_IMAGE,
} from "./homeLayout";

type HomeSaleCardProps = {
  sale: SaleEvent;
  blurred?: boolean;
  onLockedClick?: () => void;
};

export function HomeSaleCard({ sale, blurred = false, onLockedClick }: HomeSaleCardProps) {
  const href = sale.href ?? "/gr/h/maison";
  const isAdvertisement =
    sale.topRightTag?.toLowerCase().includes("publicité") ||
    sale.brand.toLowerCase().includes("fortuneo");

  const card = (
    <article className="group relative overflow-hidden bg-black/10 max-md:rounded-none max-md:shadow-none sm:rounded-md sm:shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
      <div className={HOME_SALE_CARD_ASPECT}>
        <SafeImg
          src={sale.bannerUrl}
          alt={sale.brand}
          className={`${HOME_SALE_CARD_IMAGE} transition-transform duration-500 group-hover:scale-[1.015] ${
            blurred ? "scale-[1.02] blur-[6px] brightness-[0.92] saturate-[0.85]" : ""
          }`}
        />
        {blurred && (
          <div className="absolute inset-0 z-[5] bg-black/10" aria-hidden="true" />
        )}
        {(sale.topLeftTag || sale.isPinkCard) && (
          <span className="absolute left-0 top-0 z-10 bg-veepee-pink px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
            {sale.topLeftTag ?? "CARTE ROSE"}
          </span>
        )}
        {sale.topRightTag && (
          <span
            className={`absolute right-0 top-0 z-10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${
              sale.topRightTag.toLowerCase().includes("expédié")
                ? "border border-veepee-pink bg-white text-veepee-pink"
                : "bg-black/70 text-white"
            }`}
          >
            {sale.topRightTag}
          </span>
        )}
        {sale.status === "upcoming" && !sale.topRightTag && (
          <span className="absolute right-0 top-0 z-10 bg-black px-2.5 py-1 text-[9px] font-bold uppercase text-white">
            Bientôt · 19h
          </span>
        )}
        {!blurred && !isAdvertisement && (
          <span
            className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-light leading-none text-veepee-pink shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
            aria-hidden="true"
          >
            +
          </span>
        )}
      </div>
    </article>
  );

  if (blurred) {
    return (
      <button
        type="button"
        className="w-full cursor-pointer text-left"
        onClick={onLockedClick}
        aria-label={`Vente ${sale.brand} — réservée aux membres`}
      >
        {card}
      </button>
    );
  }

  return (
    <Link href={href} className="block">
      {card}
    </Link>
  );
}
