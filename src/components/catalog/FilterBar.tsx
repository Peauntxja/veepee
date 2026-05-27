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
    <div className="flex flex-wrap items-center gap-3 border-b border-veepee-border pb-4">
      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium">Trier par</span>
        <select
          value={filters.sort}
          onChange={(event) =>
            updateFilter("sort", event.target.value as ProductFilters["sort"])
          }
          className="border border-veepee-border px-3 py-1.5 text-sm"
        >
          <option value="pertinence">Pertinence</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium">Couleur</span>
        <select
          value={filters.color}
          onChange={(event) => updateFilter("color", event.target.value)}
          className="border border-veepee-border px-3 py-1.5 text-sm"
        >
          <option value="">Toutes</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium">Marque</span>
        <select
          value={filters.brand}
          onChange={(event) => updateFilter("brand", event.target.value)}
          className="border border-veepee-border px-3 py-1.5 text-sm"
        >
          <option value="">Toutes</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium">Prix max</span>
        <input
          type="number"
          min={0}
          value={filters.maxPrice}
          onChange={(event) =>
            updateFilter("maxPrice", Number(event.target.value) || 9999)
          }
          className="w-24 border border-veepee-border px-3 py-1.5 text-sm"
        />
      </label>
    </div>
  );
}
