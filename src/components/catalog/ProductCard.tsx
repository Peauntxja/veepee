import Image from "next/image";
import Link from "next/link";
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
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <span className="absolute left-2 top-2 bg-veepee-pink px-2 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        </div>
        <div className="py-3">
          <p className="text-xs font-semibold uppercase tracking-wide">
            {product.brand}
          </p>
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
