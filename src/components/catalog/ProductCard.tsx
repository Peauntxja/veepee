import Link from "next/link";
import { SafeImg } from "@/components/common/SafeImg";
import type { Product } from "@/lib/mock/types";
import { formatPrice } from "@/lib/utils/formatPrice";
import { calcDiscountPercent } from "@/lib/utils/calcDiscount";

type ProductCardProps = {
  product: Product;
  categorySlug?: string;
};

export function ProductCard({
  product,
  categorySlug = "maison",
}: ProductCardProps) {
  const discount = calcDiscountPercent(product.price, product.originalPrice);
  const href = `/gr/p/${categorySlug}/${product.slug}/${product.id}`;

  return (
    <Link href={href} className="group block">
      <article>
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <SafeImg
            src={product.imageUrl}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute left-2 top-2 bg-veepee-pink px-2 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        </div>
        <div className="py-3">
          <p className="text-xs font-semibold uppercase tracking-wide">
            {product.brand}
          </p>
          <p className="mt-1 text-xs text-veepee-muted">À partir de</p>
          <h3 className="mt-1 line-clamp-2 text-sm">{product.title}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-bold">{formatPrice(product.price)}</span>
            <span className="text-sm text-veepee-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
