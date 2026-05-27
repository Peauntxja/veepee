"use client";

import Link from "next/link";
import { SafeImg } from "@/components/common/SafeImg";
import type { Product } from "@/lib/mock/types";
import { formatPrice } from "@/lib/utils/formatPrice";

type MiniCartPopoverProps = {
  product: Product;
  sizeLabel: string;
  promoRemaining?: number;
  onClose: () => void;
};

export function MiniCartPopover({
  product,
  sizeLabel,
  promoRemaining,
  onClose,
}: MiniCartPopoverProps) {
  return (
    <div className="fixed right-4 top-20 z-[60] w-[min(360px,calc(100vw-2rem))] border border-veepee-border bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between border-b border-veepee-border px-4 py-3">
        <p className="text-sm font-bold">Conservé dans le panier</p>
        <button
          type="button"
          onClick={onClose}
          className="text-lg leading-none text-veepee-muted hover:text-black"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
      <div className="flex gap-3 px-4 py-4">
        <div className="relative h-20 w-16 shrink-0 bg-gray-50">
          <SafeImg
            src={product.imageUrl}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase">{product.brand}</p>
          <p className="mt-1 line-clamp-2 text-sm">{product.title}</p>
          <p className="mt-1 text-[11px] text-veepee-muted">1 × {sizeLabel}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-bold">{formatPrice(product.price)}</span>
            <span className="text-xs text-veepee-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
        </div>
      </div>
      {promoRemaining !== undefined && promoRemaining > 0 ? (
        <p className="border-t border-veepee-border px-4 py-3 text-xs text-veepee-muted">
          Plus que {formatPrice(promoRemaining).replace(/\s/g, "")} d&apos;achat Veepee pour
          profiter de la promotion.
        </p>
      ) : null}
      <div className="px-4 pb-4">
        <Link
          href="/gr/cart"
          className="block w-full bg-veepee-pink py-3 text-center text-sm font-semibold text-white hover:opacity-90"
        >
          Accéder au panier
        </Link>
      </div>
    </div>
  );
}
