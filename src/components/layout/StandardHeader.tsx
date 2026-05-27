"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORY_TABS } from "@/lib/mock/categories";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useCartStore } from "@/lib/stores/useCartStore";
import { VeepeeLogo } from "./VeepeeLogo";

export function StandardHeader() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const totalItems = useCartStore((state) =>
    Object.values(state.items).reduce((sum, qty) => sum + qty, 0),
  );
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-veepee-border bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex w-[240px] items-center gap-3">
          <button
            type="button"
            className="text-xs font-medium text-veepee-muted"
            aria-label="Menu"
          >
            Menu
          </button>
          <div className="flex-1 rounded-full bg-gray-100 px-4 py-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une marque, un produit..."
              className="w-full bg-transparent text-xs text-black placeholder:text-veepee-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-black">
            <VeepeeLogo />
          </div>
          <nav className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_TABS.map((tab) => {
              const isActive =
                pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                    isActive
                      ? "bg-gray-200 text-black"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex w-[240px] items-center justify-end gap-3 text-xs font-medium">
          {isAuthenticated && (
            <>
              <span className="text-veepee-muted">Notifications</span>
              <span className="text-veepee-muted">Parrainage</span>
            </>
          )}
          <Link
            href="/gr/cart"
            className="relative rounded border border-veepee-border px-3 py-1 hover:border-veepee-pink"
          >
            Panier
            {totalItems > 0 && (
              <span className="ml-2 rounded-full bg-veepee-pink px-1.5 py-0.5 text-[10px] text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {!isAuthenticated && (
            <Link
              href="/gr/authentication"
              className="rounded bg-veepee-pink px-3 py-1 text-white hover:opacity-90"
            >
              S&apos;identifier
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

