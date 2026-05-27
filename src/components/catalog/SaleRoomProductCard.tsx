"use client";

import Link from "next/link";
import { SafeImg } from "@/components/common/SafeImg";
import type { Product } from "@/lib/mock/types";
import { formatPrice } from "@/lib/utils/formatPrice";

type SaleRoomProductCardProps = {
  product: Product;
  categorySlug: string;
  defaultSize?: string;
  onExpressBuy: (product: Product) => void;
};

export function SaleRoomProductCard({
  product,
  categorySlug,
  defaultSize,
  onExpressBuy,
}: SaleRoomProductCardProps) {
  const pdpHref = `/gr/p/${categorySlug}/${product.slug}/${product.id}`;

  return (
    <article className="flex h-full flex-col border border-veepee-border bg-white">
      <Link href={pdpHref} className="relative block aspect-[4/5] bg-gray-50">
        <SafeImg
          src={product.imageUrl}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs font-semibold uppercase tracking-wide">{product.brand}</p>
        <Link href={pdpHref} className="mt-1 line-clamp-2 text-sm hover:text-veepee-pink">
          {product.title}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-bold">{formatPrice(product.price)}</span>
          <span className="text-xs text-veepee-muted line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>
        {defaultSize ? (
          <p className="mt-1 text-[11px] text-veepee-muted">{defaultSize}</p>
        ) : null}
        <div className="mt-auto flex gap-2 pt-4">
          <Link
            href={pdpHref}
            className="flex-1 border border-veepee-border px-2 py-2 text-center text-xs font-semibold hover:border-black"
          >
            En savoir plus
          </Link>
          <button
            type="button"
            onClick={() => onExpressBuy(product)}
            className="flex-1 bg-veepee-pink px-2 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            Achat express
          </button>
        </div>
      </div>
    </article>
  );
}
