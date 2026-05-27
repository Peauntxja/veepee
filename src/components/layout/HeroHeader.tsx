"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORY_TABS } from "@/lib/mock/categories";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useCartStore } from "@/lib/stores/useCartStore";
import { VeepeeLogo } from "./VeepeeLogo";

type HeroHeaderProps = {
  onMenuClick?: () => void;
};

export function HeroHeader({ onMenuClick }: HeroHeaderProps) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const totalItems = useCartStore((state) =>
    Object.values(state.items).reduce((sum, qty) => sum + qty, 0),
  );
  const [query, setQuery] = useState("");

  const tabs = useMemo(() => CATEGORY_TABS, []);

  return (
    <header className="absolute left-0 right-0 top-0 z-40 text-white">
      <div className="mx-auto flex max-w-6xl items-start justify-between px-6 pt-5">
        <button
          type="button"
          onClick={onMenuClick}
          className="text-left text-xs font-medium leading-none opacity-90 hover:opacity-100"
        >
          Menu
        </button>

        <div className="flex flex-col items-center">
          <div className="translate-y-1 scale-95 text-white">
            <VeepeeLogo className="text-white [&_span]:text-white" />
          </div>

          <div className="mt-3 w-[720px] max-w-[85vw]">
            <div className="rounded-full bg-white/30 px-5 py-2 backdrop-blur">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher une marque, un produit..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/80 focus:outline-none"
              />
            </div>
          </div>

          <nav className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {tabs.map((tab) => {
              const isActive =
                pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur ${
                    isActive
                      ? "bg-white text-black"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 pt-1 text-xs font-medium">
          {isAuthenticated && (
            <>
              <span className="opacity-90">Notifications</span>
              <span className="opacity-90">Parrainage</span>
            </>
          )}
          <Link
            href="/gr/cart"
            className="relative inline-flex items-center gap-1 rounded border border-white/60 px-2 py-1 hover:border-white"
          >
            Panier
            {totalItems > 0 && (
              <span className="ml-1 rounded-full bg-veepee-pink px-1.5 py-0.5 text-[10px] text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {!isAuthenticated && (
            <Link
              href="/gr/authentication"
              className="rounded border border-white/60 px-2 py-1 hover:border-white"
            >
              S&apos;identifier
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

