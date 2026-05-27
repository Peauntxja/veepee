"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  PLP_PAGE_SIZE,
  PLP_TOTAL_COUNT,
  getProductsByCategory,
  getUniqueBrands,
  getUniqueColors,
} from "@/lib/mock/products";
import { getSalesByCategory } from "@/lib/mock/sales";
import { HUB_CONTENT } from "@/lib/mock/categories";
import type { Product, ProductFilters } from "@/lib/mock/types";
import { SaleCard } from "@/components/home/SaleCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterBar } from "@/components/catalog/FilterBar";
import { Pagination } from "@/components/catalog/Pagination";
import { ValueStrip } from "@/components/home/ValueStrip";

type HubContentProps = {
  category: string;
};

function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.brand) {
    result = result.filter((product) => product.brand === filters.brand);
  }
  if (filters.color) {
    result = result.filter((product) =>
      product.colors?.includes(filters.color),
    );
  }
  if (filters.maxPrice < 9999) {
    result = result.filter((product) => product.price <= filters.maxPrice);
  }

  if (filters.sort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}

export function HubContent({ category }: HubContentProps) {
  const content = HUB_CONTENT[category] ?? HUB_CONTENT.maison;
  const sales = getSalesByCategory(category);
  const products = getProductsByCategory("maison");
  const featuredProducts = products.slice(0, 6);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold md:text-4xl">{content.title}</h1>
        <p className="mt-2 text-lg text-veepee-muted">{content.subtitle}</p>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-veepee-muted">
          {content.description}
        </p>
      </section>

      {sales.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10">
          <h2 className="mb-6 text-xl font-bold">
            Nos ventes {category} éphémères
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Quelques articles qui pourraient vous plaire :
          </h2>
          {category === "maison" && (
            <Link
              href="/gr/p/maison/mobilier-123"
              className="text-sm font-semibold text-veepee-pink hover:underline"
            >
              Voir tout
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} categorySlug={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <h2 className="mb-4 text-xl font-bold">Suivez le guide</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Comment choisir son matelas",
            "Idées déco pour le salon",
            "Aménager un petit espace",
          ].map((title) => (
            <article
              key={title}
              className="border border-veepee-border p-6 hover:border-veepee-pink"
            >
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-veepee-muted">
                Conseils d&apos;experts Veepee pour acheter malin à prix doux.
              </p>
            </article>
          ))}
        </div>
      </section>

      <ValueStrip />
    </>
  );
}

export function PlpContent({ category }: { category: string }) {
  const allProducts = getProductsByCategory("maison");
  const brands = getUniqueBrands(allProducts);
  const colors = getUniqueColors(allProducts);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({
    sort: "pertinence",
    brand: "",
    color: "",
    minPrice: 0,
    maxPrice: 9999,
  });

  const filteredProducts = useMemo(
    () => filterProducts(allProducts, filters),
    [allProducts, filters],
  );

  const visibleProducts = filteredProducts.slice(0, page * PLP_PAGE_SIZE);
  const hasMore = visibleProducts.length < filteredProducts.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 text-xs text-veepee-muted">
        <Link href={`/gr/h/${category}`} className="hover:text-veepee-pink">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
        <span className="mx-2">/</span>
        <span>Mobilier</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <div className="sticky top-28 rounded border border-veepee-border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold">Filtres</h2>
            <div className="mt-4">
              <FilterBar
                filters={filters}
                brands={brands}
                colors={colors}
                onChange={(next) => {
                  setFilters(next);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <h1 className="text-2xl font-bold">Mobilier & décoration</h1>
          <p className="mt-2 text-sm text-veepee-muted">
            Flânez parmi notre sélection d&apos;articles maison à prix doux.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categorySlug={category}
              />
            ))}
          </div>

          {visibleProducts.length === 0 && (
            <p className="py-12 text-center text-veepee-muted">
              Aucun produit ne correspond à vos filtres.
            </p>
          )}

          <Pagination
            currentCount={visibleProducts.length}
            totalCount={PLP_TOTAL_COUNT}
            pageSize={PLP_PAGE_SIZE}
            hasMore={hasMore}
            onLoadMore={() => setPage((current) => current + 1)}
          />
        </section>
      </div>
    </div>
  );
}
