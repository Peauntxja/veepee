"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useCartStore } from "@/lib/stores/useCartStore";
import { VeepeeLogo } from "./VeepeeLogo";
import { CategoryTabs } from "./CategoryTabs";

export function SiteHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);
  const totalItems = useCartStore((state) =>
    Object.values(state.items).reduce((sum, qty) => sum + qty, 0),
  );

  return (
    <header className="sticky top-0 z-50 border-b border-veepee-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <VeepeeLogo />
        <CategoryTabs />
        <div className="flex items-center gap-4">
          <Link
            href="/gr/cart"
            className="relative text-sm font-medium text-black hover:text-veepee-pink"
          >
            Panier
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-veepee-pink text-xs text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-veepee-muted sm:inline">
                Mon compte
                {email ? ` · ${email.split("@")[0]}` : ""}
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-black hover:text-veepee-pink"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              href="/gr/authentication"
              className="rounded-full bg-veepee-pink px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              S&apos;identifier
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
