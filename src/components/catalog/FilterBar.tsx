"use client";

import type { ProductFilters } from "@/lib/mock/types";

type FilterBarProps = {
  filters: ProductFilters;
  brands: string[];
  colors: string[];
  onChange: (filters: ProductFilters) => void;
};

export function FilterBar({ filters, brands, colors, onChange }: FilterBarProps) {
  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-veepee-muted">
          Genre
        </span>
        <select
          value=""
          disabled
          className="mt-2 w-full border border-veepee-border bg-gray-50 px-3 py-2 text-sm text-veepee-muted"
        >
          <option value="">Tous</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-veepee-muted">
          Catégorie
        </span>
        <select
          value=""
          disabled
          className="mt-2 w-full border border-veepee-border bg-gray-50 px-3 py-2 text-sm text-veepee-muted"
        >
          <option value="">Toutes</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-veepee-muted">
          Trier par
        </span>
        <select
          value={filters.sort}
          onChange={(event) =>
            updateFilter("sort", event.target.value as ProductFilters["sort"])
          }
          className="mt-2 w-full border border-veepee-border px-3 py-2 text-sm"
        >
          <option value="pertinence">Pertinence</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-veepee-muted">
          Couleur
        </span>
        <select
          value={filters.color}
          onChange={(event) => updateFilter("color", event.target.value)}
          className="mt-2 w-full border border-veepee-border px-3 py-2 text-sm"
        >
          <option value="">Toutes</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-veepee-muted">
          Marque
        </span>
        <select
          value={filters.brand}
          onChange={(event) => updateFilter("brand", event.target.value)}
          className="mt-2 w-full border border-veepee-border px-3 py-2 text-sm"
        >
          <option value="">Toutes</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-veepee-muted">
          Prix max
        </span>
        <input
          type="number"
          min={0}
          value={filters.maxPrice}
          onChange={(event) =>
            updateFilter("maxPrice", Number(event.target.value) || 9999)
          }
          className="mt-2 w-full border border-veepee-border px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}
