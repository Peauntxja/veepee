"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SafeImg } from "@/components/common/SafeImg";
import { getProductById } from "@/lib/mock/products";
import { useCartStore } from "@/lib/stores/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { calcDiscountPercent } from "@/lib/utils/calcDiscount";

type ProductDetailProps = {
  productId: string;
  category: string;
};

export function ProductDetail({ productId, category }: ProductDetailProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const product = getProductById(productId);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? "");
  const [showToast, setShowToast] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Produit introuvable</h1>
        <Link href={`/gr/h/${category}`} className="mt-4 inline-block text-veepee-pink">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const discount = calcDiscountPercent(product.price, product.originalPrice);

  const handleAddToCart = () => {
    addItem(product.id, 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 text-sm text-veepee-muted">
        <Link href={`/gr/h/${category}`} className="hover:text-veepee-pink">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/gr/p/${category}/mobilier-123`} className="hover:text-veepee-pink">
          Mobilier
        </Link>
        <span className="mx-2">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] bg-gray-100">
          <SafeImg
            src={product.imageUrl}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            {product.brand}
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">{product.title}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            <span className="text-lg text-veepee-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="bg-veepee-pink px-2 py-1 text-sm font-bold text-white">
              -{discount}%
            </span>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Couleur</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`border px-4 py-2 text-sm ${
                      selectedColor === color
                        ? "border-veepee-pink text-veepee-pink"
                        : "border-veepee-border"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Taille</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 text-sm ${
                      selectedSize === size
                        ? "border-veepee-pink text-veepee-pink"
                        : "border-veepee-border"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-4 text-sm text-orange-600">Plus que quelques articles disponibles</p>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-6 w-full bg-veepee-pink py-4 text-sm font-semibold text-white hover:opacity-90 md:w-auto md:px-12"
          >
            Ajouter au panier
          </button>

          <button
            type="button"
            onClick={() => router.push("/gr/cart")}
            className="mt-3 block text-sm font-medium text-veepee-pink hover:underline"
          >
            Voir le panier
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-6 py-3 text-sm text-white shadow-lg">
          Produit ajouté au panier
        </div>
      )}
    </div>
  );
}
