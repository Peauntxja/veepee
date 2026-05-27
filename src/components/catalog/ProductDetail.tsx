"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SafeImg } from "@/components/common/SafeImg";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getProductById, getRelatedProducts } from "@/lib/mock/products";
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
  const relatedProducts = getRelatedProducts(productId, 4);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? "");
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl ?? "");
  const [showRetailTooltip, setShowRetailTooltip] = useState(false);

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

  const discount = product.discountPercent ?? calcDiscountPercent(product.price, product.originalPrice);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const galleryImages = product.imageUrls ?? [product.imageUrl];
  const selectedSizeOption = product.sizeOptions?.find(
    (option) => option.name === selectedSize,
  );
  const stockMessage =
    selectedSizeOption?.stockLabel === "Bientôt épuisé"
      ? "Bientôt épuisé — plus que quelques articles"
      : selectedSizeOption?.quantity !== undefined && selectedSizeOption.quantity <= 3
        ? "Plus que quelques articles disponibles"
        : null;

  const handleAddToCart = () => {
    addItem(product.id, 1, {
      sizeLabel: selectedSize || product.sizeOptions?.[0]?.name || "Taille unique",
    });
  };

  const saleRoomHref =
    product.saleId && product.catalogId
      ? `/gr/catalog/${product.saleId}/${product.catalogId}`
      : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 text-xs text-veepee-muted">
        <Link href={`/gr/h/${category}`} className="hover:text-veepee-pink">
          {categoryLabel}
        </Link>
        <span className="mx-2">/</span>
        {saleRoomHref ? (
          <>
            <Link href={saleRoomHref} className="hover:text-veepee-pink">
              {product.brand}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : (
          <>
            <Link
              href={`/gr/p/${category}/${category}-selection`}
              className="hover:text-veepee-pink"
            >
              Sélection
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span>{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/5] bg-gray-100">
            <SafeImg
              src={selectedImage}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {galleryImages.map((image, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square border ${
                    selectedImage === image
                      ? "border-veepee-pink"
                      : "border-veepee-border"
                  }`}
                >
                  <SafeImg
                    src={image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            {product.brand}
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">{product.title}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            <span className="relative text-lg text-veepee-muted line-through">
              {formatPrice(product.originalPrice)}
              {product.retailPriceTooltip && (
                <button
                  type="button"
                  aria-label="Information prix conseillé"
                  onClick={() => setShowRetailTooltip((current) => !current)}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-veepee-muted text-[10px] not-italic no-underline"
                >
                  i
                </button>
              )}
              {showRetailTooltip && product.retailPriceTooltip && (
                <span className="absolute left-0 top-full z-10 mt-2 w-56 rounded border border-veepee-border bg-white p-2 text-left text-xs font-normal normal-case text-veepee-muted shadow-sm">
                  {product.retailPriceTooltip}
                </span>
              )}
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
                {product.sizes.map((size) => {
                  const option = product.sizeOptions?.find((item) => item.name === size);
                  const lowStock = option?.stockLabel === "Bientôt épuisé";
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`border px-4 py-2 text-sm ${
                        selectedSize === size
                          ? "border-veepee-pink text-veepee-pink"
                          : "border-veepee-border"
                      } ${lowStock ? "opacity-80" : ""}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {stockMessage && (
            <p className="mt-4 text-sm text-orange-600">{stockMessage}</p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-veepee-pink px-10 py-4 text-sm font-semibold text-white hover:opacity-90"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={() => router.push("/gr/cart")}
              className="text-sm font-medium text-veepee-pink hover:underline"
            >
              Voir le panier
            </button>
          </div>

          <div className="mt-8 space-y-3 border-t border-veepee-border pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-veepee-muted">Livraison estimée</span>
              <span className="font-medium">5 à 8 jours ouvrés</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-veepee-muted">Frais de port</span>
              <span className="font-medium">À partir de 4,99 €</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-veepee-muted">Retours</span>
              <span className="font-medium">Sous 14 jours</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["CB", "Visa", "Mastercard", "PayPal"].map((method) => (
              <span
                key={method}
                className="rounded border border-veepee-border px-2 py-1 text-[10px] font-medium text-veepee-muted"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-veepee-border pt-10">
          <h2 className="text-xl font-bold">Vous pourriez aussi aimer</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard
                key={related.id}
                product={related}
                categorySlug={category}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
