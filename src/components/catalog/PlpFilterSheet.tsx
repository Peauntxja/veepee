"use client";

import type { ProductFilters } from "@/lib/mock/types";
import { FilterBar } from "./FilterBar";

type PlpFilterSheetProps = {
  open: boolean;
  onClose: () => void;
  filters: ProductFilters;
  brands: string[];
  colors: string[];
  onChange: (filters: ProductFilters) => void;
  activeFilterCount: number;
  resultCount: number;
};

export function PlpFilterSheet({
  open,
  onClose,
  filters,
  brands,
  colors,
  onChange,
  activeFilterCount,
  resultCount,
}: PlpFilterSheetProps) {
  if (!open) {
    return null;
  }

  const handleReset = () => {
    onChange({
      sort: filters.sort,
      brand: "",
      color: "",
      minPrice: 0,
      maxPrice: 9999,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Fermer les filtres"
      />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between border-b border-veepee-border px-4 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">Filtres</h2>
            {activeFilterCount > 0 ? (
              <span className="rounded-full bg-veepee-pink px-2 py-0.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-veepee-muted hover:text-black"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4">
          <FilterBar filters={filters} brands={brands} colors={colors} onChange={onChange} />
        </div>

        <div className="flex gap-3 border-t border-veepee-border px-4 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 border border-veepee-border py-3 text-sm font-medium hover:bg-gray-50"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-[2] bg-black py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Voir {resultCount} article{resultCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
