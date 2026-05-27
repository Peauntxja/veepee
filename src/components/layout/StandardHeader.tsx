"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORY_TABS } from "@/lib/mock/categories";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { VeepeeLogo } from "./VeepeeLogo";
import { HeaderCartLink, HeaderIconLink } from "./HeaderCartLink";
import { SearchOverlay } from "./SearchOverlay";
import { useHeaderSearch } from "./useHeaderSearch";

type StandardHeaderProps = {
  onMenuClick?: () => void;
};

export function StandardHeader({ onMenuClick }: StandardHeaderProps) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { query, setQuery, submitSearch, handleKeyDown } = useHeaderSearch();
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  return (
    <>
      <SearchOverlay
        open={searchOpen}
        onClose={closeSearch}
        query={query}
        onQueryChange={setQuery}
        onSubmit={submitSearch}
        topOffset="6.5rem"
      />
      <header className="sticky top-0 z-50 border-b border-veepee-border bg-white">
        <div className="mx-auto w-full max-w-[1120px] px-6">
          {/* Ligne 1 — Menu / recherche / logo / actions (aligné veepee.fr) */}
          <div className="relative flex items-end justify-between pb-3 pt-4">
            <div className="flex min-w-0 flex-1 items-end gap-4 pr-4">
              <button
                type="button"
                onClick={onMenuClick}
                className="flex shrink-0 flex-col items-center gap-1 text-[10px] font-medium leading-none text-veepee-muted hover:text-black"
                aria-label="Menu"
              >
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                  <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>Menu</span>
              </button>

              <div
                className="flex min-w-0 max-w-[340px] flex-1 items-center rounded-full border border-gray-300 bg-white px-4 py-2.5"
                onClick={openSearch}
              >
                <svg
                  className="mr-2 h-4 w-4 shrink-0 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={openSearch}
                  onKeyDown={(event) => {
                    handleKeyDown(event);
                    if (event.key === "Enter") {
                      closeSearch();
                    }
                  }}
                  placeholder="Recherchez une marque, un produit..."
                  className="w-full min-w-0 cursor-text bg-transparent text-sm text-black placeholder:text-veepee-muted focus:outline-none"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2">
              <div className="pointer-events-auto">
                <VeepeeLogo variant="black" />
              </div>
            </div>

            <div className="flex flex-1 items-end justify-end gap-4 pl-4">
              {isAuthenticated ? (
                <>
                  <HeaderIconLink
                    href="/gr/notifications"
                    label="Notifications"
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                      </svg>
                    }
                  />
                  <HeaderIconLink
                    href="/gr/parrainage"
                    label="Parrainage"
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" />
                      </svg>
                    }
                  />
                </>
              ) : null}
              <HeaderCartLink
                variant="standard"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M6 6h15l-1.5 9h-12L6 6zM6 6L5 3H2M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                }
              />
              {!isAuthenticated ? (
                <Link
                  href="/gr/authentication"
                  className="rounded border border-veepee-border px-2.5 py-1.5 text-[10px] font-medium hover:border-veepee-pink"
                >
                  S&apos;identifier
                </Link>
              ) : null}
            </div>
          </div>

          {/* Ligne 2 — navigation en une seule rangée */}
          <nav className="flex flex-nowrap items-center justify-center gap-1 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_TABS.map((tab) => {
              if (!tab.href) return null;
              const isActive =
                pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-black text-white"
                      : "border border-gray-300 bg-white text-black hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
