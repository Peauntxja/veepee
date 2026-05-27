"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById } from "@/lib/mock/products";
import type { Product } from "@/lib/mock/types";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: Record<string, number>;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getLines: () => CartLine[];
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},

      addItem: (productId, quantity = 1) => {
        const current = get().items[productId] ?? 0;
        set({
          items: {
            ...get().items,
            [productId]: current + quantity,
          },
        });
      },

      removeItem: (productId) => {
        const nextItems = { ...get().items };
        delete nextItems[productId];
        set({ items: nextItems });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: {
            ...get().items,
            [productId]: quantity,
          },
        });
      },

      clearCart: () => set({ items: {} }),

      getLines: () => {
        return Object.entries(get().items)
          .map(([productId, quantity]) => {
            const product = getProductById(productId);
            if (!product) {
              return null;
            }
            return { product, quantity };
          })
          .filter((line): line is CartLine => line !== null);
      },

      getTotalItems: () => {
        return Object.values(get().items).reduce((sum, qty) => sum + qty, 0);
      },

      getTotalPrice: () => {
        return get()
          .getLines()
          .reduce((sum, line) => sum + line.product.price * line.quantity, 0);
      },
    }),
    { name: "veepee-cart" },
  ),
);

export function groupCartLinesByBrand(lines: CartLine[]): Record<string, CartLine[]> {
  return lines.reduce<Record<string, CartLine[]>>((groups, line) => {
    const brand = line.product.brand;
    if (!groups[brand]) {
      groups[brand] = [];
    }
    groups[brand].push(line);
    return groups;
  }, {});
}
