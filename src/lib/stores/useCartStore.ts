"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNextReservationExpiry } from "@/lib/cart/reservation";
import { getProductById } from "@/lib/mock/products";
import type { Product } from "@/lib/mock/types";

export type CartLine = {
  product: Product;
  quantity: number;
};

export type AddItemMeta = {
  sizeLabel?: string;
  promoThreshold?: number;
  showMiniCart?: boolean;
};

type MiniCartState = {
  productId: string;
  sizeLabel: string;
  promoRemaining?: number;
};

type CartState = {
  items: Record<string, number>;
  reservationExpiresAt: number | null;
  miniCart: MiniCartState | null;
  addItem: (productId: string, quantity?: number, meta?: AddItemMeta) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  hideMiniCart: () => void;
  getLines: () => CartLine[];
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

function computeCartTotal(items: Record<string, number>): number {
  return Object.entries(items).reduce((sum, [productId, quantity]) => {
    const product = getProductById(productId);
    return product ? sum + product.price * quantity : sum;
  }, 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      reservationExpiresAt: null,
      miniCart: null,

      addItem: (productId, quantity = 1, meta) => {
        const current = get().items[productId] ?? 0;
        const nextItems = {
          ...get().items,
          [productId]: current + quantity,
        };
        const total = computeCartTotal(nextItems);
        const showMiniCart = meta?.showMiniCart !== false;

        set({
          items: nextItems,
          reservationExpiresAt: getNextReservationExpiry(get().reservationExpiresAt),
          miniCart: showMiniCart
            ? {
                productId,
                sizeLabel: meta?.sizeLabel ?? "Taille unique",
                promoRemaining:
                  meta?.promoThreshold !== undefined
                    ? Math.max(0, meta.promoThreshold - total)
                    : undefined,
              }
            : get().miniCart,
        });
      },

      removeItem: (productId) => {
        const nextItems = { ...get().items };
        delete nextItems[productId];
        const hasItems = Object.keys(nextItems).length > 0;
        set({
          items: nextItems,
          reservationExpiresAt: hasItems ? get().reservationExpiresAt : null,
          miniCart: get().miniCart?.productId === productId ? null : get().miniCart,
        });
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

      clearCart: () =>
        set({
          items: {},
          reservationExpiresAt: null,
          miniCart: null,
        }),

      hideMiniCart: () => set({ miniCart: null }),

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

      getTotalPrice: () => computeCartTotal(get().items),
    }),
    {
      name: "veepee-cart",
      partialize: (state) => ({
        items: state.items,
        reservationExpiresAt: state.reservationExpiresAt,
      }),
    },
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
