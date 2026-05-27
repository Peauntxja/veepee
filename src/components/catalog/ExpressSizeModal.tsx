"use client";

import { useState } from "react";
import type { Product } from "@/lib/mock/types";

type ExpressSizeModalProps = {
  product: Product;
  defaultSize?: string;
  onConfirm: (sizeLabel: string) => void;
  onClose: () => void;
};

export function ExpressSizeModal({
  product,
  defaultSize,
  onConfirm,
  onClose,
}: ExpressSizeModalProps) {
  const sizes = product.sizeOptions?.length
    ? product.sizeOptions
    : [{ name: defaultSize ?? "Taille unique", stockLabel: "Disponible" }];
  const [selectedSize, setSelectedSize] = useState(
    sizes.find((s) => s.name === defaultSize)?.name ?? sizes[0]?.name ?? "Taille unique",
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="express-size-title"
    >
      <div className="w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-veepee-border px-4 py-3">
          <h2 id="express-size-title" className="text-sm font-bold">
            Choisir une taille
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-lg leading-none text-veepee-muted hover:text-black"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        <div className="px-4 py-4">
          <p className="text-xs font-semibold uppercase">{product.brand}</p>
          <p className="mt-1 text-sm">{product.title}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {sizes.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => setSelectedSize(option.name)}
                className={`border px-3 py-2 text-xs ${
                  selectedSize === option.name
                    ? "border-veepee-pink text-veepee-pink"
                    : "border-veepee-border hover:border-black"
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 border-t border-veepee-border px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-veepee-border py-3 text-sm font-semibold"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedSize)}
            className="flex-1 bg-veepee-pink py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Achat express
          </button>
        </div>
      </div>
    </div>
  );
}
