"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SafeImg } from "@/components/common/SafeImg";
import {
  getSaleRoomWithFallback,
  mapSaleRoomProductToProduct,
} from "@/lib/api/saleRooms";
import type { VeepeeSaleRoomProduct } from "@/lib/api/veepeeApiTypes";
import { getLocalImage, type LocalImageId } from "@/lib/assets/localImages";
import { useCartStore } from "@/lib/stores/useCartStore";
import type { Product } from "@/lib/mock/types";
import { ExpressSizeModal } from "@/components/catalog/ExpressSizeModal";
import { SaleRoomProductCard } from "@/components/catalog/SaleRoomProductCard";

type SaleRoomContentProps = {
  operationId: string;
  catalogId: string;
};

type SortOption = "pertinence" | "price-asc" | "price-desc";

function findRoomProduct(
  roomProducts: VeepeeSaleRoomProduct[],
  product: Product,
): VeepeeSaleRoomProduct | undefined {
  const suffix = product.id.replace(/^sale-\d+-/, "");
  return roomProducts.find((item) => item.id === suffix);
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products];
  if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
  return copy;
}

export function SaleRoomContent({ operationId, catalogId }: SaleRoomContentProps) {
  const room = getSaleRoomWithFallback(operationId, catalogId);
  const addItem = useCartStore((state) => state.addItem);
  const [activeSidebarId, setActiveSidebarId] = useState(
    room?.sidebar.find((item) => item.active)?.id ?? room?.sidebar[0]?.id ?? "all",
  );
  const [sort, setSort] = useState<SortOption>("pertinence");
  const [sizeModalProduct, setSizeModalProduct] = useState<Product | null>(null);
  const [sizeModalDefault, setSizeModalDefault] = useState<string | undefined>();

  const filteredProducts = useMemo(() => {
    if (!room) return [];
    const bySidebar = room.products.filter((item) => {
      if (activeSidebarId === "all" || !item.sidebarId) return true;
      return item.sidebarId === activeSidebarId;
    });
    const mapped = bySidebar.map((item) => mapSaleRoomProductToProduct(room, item));
    return sortProducts(mapped, sort);
  }, [room, activeSidebarId, sort]);

  if (!room) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Vente introuvable</h1>
        <Link href="/gr/home" className="mt-4 inline-block text-veepee-pink">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const bannerUrl = room.bannerLocalId
    ? getLocalImage(room.bannerLocalId as LocalImageId)
    : null;

  const confirmAddToCart = (product: Product, sizeLabel: string) => {
    addItem(product.id, 1, {
      sizeLabel,
      promoThreshold: room.promoThreshold,
    });
    setSizeModalProduct(null);
  };

  const handleExpressBuy = (product: Product, defaultSize?: string) => {
    const roomItem = findRoomProduct(room.products, product);
    const sizeCount = product.sizeOptions?.length ?? 0;
    if (sizeCount > 1) {
      setSizeModalProduct(product);
      setSizeModalDefault(roomItem?.defaultSize ?? defaultSize);
      return;
    }
    confirmAddToCart(
      product,
      roomItem?.defaultSize ?? product.sizeOptions?.[0]?.name ?? "Taille unique",
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <nav className="mb-6 text-xs text-veepee-muted">
        <Link href={`/gr/h/${room.categoryTab}`} className="hover:text-veepee-pink">
          {room.categoryTab.charAt(0).toUpperCase() + room.categoryTab.slice(1)}
        </Link>
        <span className="mx-2">/</span>
        <span>{room.brandName}</span>
      </nav>

      {bannerUrl ? (
        <section className="relative mb-8 aspect-[760/257] max-h-[280px] w-full overflow-hidden bg-gray-100">
          <SafeImg
            src={bannerUrl}
            alt={room.brandName}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-2xl font-bold md:text-3xl">{room.brandName}</h1>
            {room.subtitle ? (
              <p className="mt-1 text-sm text-white/90">{room.subtitle}</p>
            ) : null}
          </div>
        </section>
      ) : (
        <header className="mb-8 border-b border-veepee-border pb-6">
          <h1 className="text-2xl font-bold md:text-3xl">{room.brandName}</h1>
          {room.subtitle ? (
            <p className="mt-1 text-sm text-veepee-muted">{room.subtitle}</p>
          ) : null}
        </header>
      )}

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-1 border border-veepee-border bg-white p-4">
            {room.sidebar.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSidebarId(item.id)}
                className={`block w-full px-3 py-2 text-left text-sm ${
                  activeSidebarId === item.id
                    ? "bg-black font-semibold text-white"
                    : "text-veepee-muted hover:bg-gray-50 hover:text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-veepee-muted">
              <span className="font-semibold text-black">{filteredProducts.length}</span> articles
            </p>
            <label className="flex items-center gap-2 text-xs">
              <span className="text-veepee-muted">Trier</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="border border-veepee-border px-2 py-1"
                aria-label="Trier"
              >
                <option value="pertinence">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const roomItem = findRoomProduct(room.products, product);
              return (
                <SaleRoomProductCard
                  key={product.id}
                  product={product}
                  categorySlug={room.categoryTab}
                  defaultSize={roomItem?.defaultSize}
                  onExpressBuy={(item) => handleExpressBuy(item, roomItem?.defaultSize)}
                />
              );
            })}
          </div>
        </section>
      </div>

      {sizeModalProduct ? (
        <ExpressSizeModal
          product={sizeModalProduct}
          defaultSize={sizeModalDefault}
          onClose={() => setSizeModalProduct(null)}
          onConfirm={(sizeLabel) => confirmAddToCart(sizeModalProduct, sizeLabel)}
        />
      ) : null}
    </div>
  );
}
