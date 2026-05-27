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
import { getHubSectionCopy } from "@/lib/mock/hubSections";
import { getHubContent } from "@/lib/api/loadSnapshot";
import { getLocalImage, type LocalImageId } from "@/lib/assets/localImages";
import type { Product, ProductFilters } from "@/lib/mock/types";
import { HomeSaleCard } from "@/components/home/HomeSaleCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterBar } from "@/components/catalog/FilterBar";
import { Pagination } from "@/components/catalog/Pagination";
import { PlpFilterSheet } from "@/components/catalog/PlpFilterSheet";
import {
  HUB_CATALOG_GRID,
  HUB_SALE_GRID,
  HUB_SECTION_PADDING,
  HUB_SECTION_SUBTITLE,
  HUB_SECTION_TITLE,
} from "@/components/catalog/hubLayout";

type HubContentProps = {
  category: string;
};

function HubHero({ category }: { category: string }) {
  const content = getHubContent(category);
  const bgId = content.backgroundLocalId as LocalImageId | undefined;
  const bgUrl = bgId ? getLocalImage(bgId) : null;

  return (
    <section
      className="relative bg-veepee-dark bg-cover bg-center"
      style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      <div className="bg-gradient-to-b from-black/45 via-black/35 to-black/55">
        <div className={`py-10 md:py-20 ${HUB_SECTION_PADDING}`}>
          <h1 className="max-w-3xl text-[26px] font-bold leading-tight text-white md:text-[34px] md:font-normal">
            {content.title}
          </h1>
          {content.subtitle ? (
            <p className="mt-2 max-w-2xl text-[15px] text-white/90 md:text-lg">
              {content.subtitle}
            </p>
          ) : null}
          {content.description ? (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80 md:mt-4 md:text-base">
              {content.description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

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
  const sales = getSalesByCategory(category);
  const products = getProductsByCategory(category);
  const featuredProducts = products.slice(0, 6);
  const plpHref = `/gr/p/${category}/${category}-selection`;
  const sectionCopy = getHubSectionCopy(category);
  const [salesFilter, setSalesFilter] = useState<"all" | "live">("all");

  const visibleSales =
    salesFilter === "live" ? sales.filter((sale) => sale.status === "live") : sales;

  return (
    <>
      <HubHero category={category} />

      {visibleSales.length > 0 && (
        <section className="pb-8 md:pb-10">
          <div className={`mb-5 pt-8 md:mb-6 md:pt-10 ${HUB_SECTION_PADDING}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className={HUB_SECTION_TITLE}>{sectionCopy.salesTitle}</h2>
              <button
                type="button"
                onClick={() => setSalesFilter("all")}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                  salesFilter === "all"
                    ? "border-black bg-black text-white"
                    : "border-veepee-border bg-white text-black hover:border-black"
                }`}
              >
                {sectionCopy.salesFilterLabel}
              </button>
            </div>
          </div>
          <div className={HUB_SALE_GRID}>
            {visibleSales.map((sale) => (
              <HomeSaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        </section>
      )}

      <section className={`pb-8 md:pb-10 ${HUB_SECTION_PADDING}`}>
        <div className="mb-5 md:mb-6">
          <h2 className={HUB_SECTION_TITLE}>{sectionCopy.catalogTitle}</h2>
          <p className={HUB_SECTION_SUBTITLE}>{sectionCopy.catalogSubtitle}</p>
        </div>
        <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-veepee-muted">
            Quelques articles qui pourraient vous plaire :
          </p>
          {featuredProducts.length > 0 && (
            <Link
              href={plpHref}
              className="text-sm font-semibold text-veepee-pink hover:underline"
            >
              Voir tout
            </Link>
          )}
        </div>
        <div className={HUB_CATALOG_GRID}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} categorySlug={category} />
          ))}
        </div>
      </section>

      {sectionCopy.showThePlace ? (
        <section className={`pb-8 md:pb-10 ${HUB_SECTION_PADDING}`}>
          <div className="flex flex-col gap-4 border border-veepee-border bg-gray-50 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <h2 className="text-lg font-bold">Découvrez The Place</h2>
              <p className="mt-1 text-sm text-veepee-muted">
                Des marques premium sélectionnées, disponibles en continu.
              </p>
            </div>
            <Link
              href="/gr/h/the-place"
              className="inline-block bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
            >
              Explorer The Place
            </Link>
          </div>
        </section>
      ) : null}

      <section className={`pb-8 md:pb-10 ${HUB_SECTION_PADDING}`}>
        <h2 className="text-lg font-bold">{sectionCopy.universTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {sectionCopy.universeLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full border border-veepee-border px-4 py-2 text-xs font-medium hover:border-black hover:text-veepee-pink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <HubValueStrip category={category} />
    </>
  );
}

function HubValueStrip({ category }: { category: string }) {
  const content = getHubContent(category);
  const items = content.valuePropositions ?? [];

  return (
    <section className="border-y border-veepee-border bg-gray-50">
      <div className={`grid gap-6 py-8 md:grid-cols-3 md:gap-8 md:py-10 ${HUB_SECTION_PADDING}`}>
        {items.map((item) => (
          <div key={item.title}>
            <h3 className="text-base font-bold">{item.title}</h3>
            <p className="mt-2 text-sm text-veepee-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PlpContent({ category }: { category: string }) {
  const allProducts = getProductsByCategory(category);
  const brands = getUniqueBrands(allProducts);
  const colors = getUniqueColors(allProducts);
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
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
  const activeFilterCount = [
    filters.brand,
    filters.color,
    filters.maxPrice < 9999 ? "price" : "",
  ].filter(Boolean).length;

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  const handleFiltersChange = (next: ProductFilters) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <nav className="mb-4 text-xs text-veepee-muted md:mb-6">
        <Link href={`/gr/h/${category}`} className="hover:text-veepee-pink">
          {categoryLabel}
        </Link>
        <span className="mx-2">/</span>
        <span>Sélection</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded border border-veepee-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Filtres</h2>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-veepee-pink px-2 py-0.5 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="mt-4">
              <FilterBar
                filters={filters}
                brands={brands}
                colors={colors}
                onChange={handleFiltersChange}
              />
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <h1 className="text-xl font-bold md:text-2xl">{categoryLabel} — sélection du moment</h1>
          <p className="mt-2 text-sm text-veepee-muted">
            Flânez parmi notre sélection d&apos;articles à prix doux.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-veepee-border py-3 text-sm lg:mt-6">
            <p className="text-veepee-muted">
              <span className="font-semibold text-black">{filteredProducts.length}</span>{" "}
              {filteredProducts.length <= 1 ? "article affiché" : "articles affichés"}
              {filteredProducts.length < PLP_TOTAL_COUNT && (
                <span className="text-veepee-muted">
                  {" "}
                  sur {PLP_TOTAL_COUNT.toLocaleString("fr-FR")}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterSheetOpen(true)}
                className="relative flex items-center gap-2 border border-veepee-border px-3 py-1.5 text-xs font-medium lg:hidden"
              >
                Filtres
                {activeFilterCount > 0 ? (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-veepee-pink px-1 text-[9px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
              <label className="flex items-center gap-2 text-xs">
                <span className="text-veepee-muted">Trier</span>
                <select
                  value={filters.sort}
                  onChange={(event) =>
                    handleFiltersChange({
                      ...filters,
                      sort: event.target.value as ProductFilters["sort"],
                    })
                  }
                  className="border border-veepee-border px-2 py-1"
                >
                  <option value="pertinence">Pertinence</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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

      <PlpFilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        brands={brands}
        colors={colors}
        onChange={handleFiltersChange}
        activeFilterCount={activeFilterCount}
        resultCount={filteredProducts.length}
      />
    </div>
  );
}
