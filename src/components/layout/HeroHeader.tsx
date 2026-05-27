"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORY_TABS } from "@/lib/mock/categories";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { VeepeeLogo } from "./VeepeeLogo";
import { HeaderCartLink, HeaderIconLink } from "./HeaderCartLink";
import { SearchOverlay } from "./SearchOverlay";
import { useHeaderSearch } from "./useHeaderSearch";
import { HEADER_EDGE_PADDING, HEADER_SEARCH_MAX_WIDTH } from "./headerLayout";

type HeroHeaderProps = {
  onMenuClick?: () => void;
};

const HEADER_BOXED_CLASS =
  "rounded border border-white/80 px-2.5 py-1.5 text-[10px] font-medium leading-none opacity-95 hover:opacity-100";

export function HeroHeader({ onMenuClick }: HeroHeaderProps) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { query, setQuery, submitSearch, handleKeyDown } = useHeaderSearch();
  const [searchOpen, setSearchOpen] = useState(false);
  const tabs = useMemo(() => CATEGORY_TABS, []);

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
        topOffset="9.5rem"
      />
      <header className="absolute inset-x-0 top-0 z-40 w-full text-white">
        <div className={`w-full ${HEADER_EDGE_PADDING}`}>
          {/* Ligne 1 : Menu · Logo · actions (sans recherche) */}
          <div className="relative flex items-end justify-between pt-4 pb-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="flex flex-col items-center gap-1 text-[10px] font-medium leading-none opacity-95 hover:opacity-100"
              aria-label="Menu"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Menu
            </button>

            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2">
              <div className="pointer-events-auto">
                <VeepeeLogo variant="white" />
              </div>
            </div>

            <div className="flex items-end gap-4 md:gap-5">
              {isAuthenticated ? (
                <>
                  <HeaderIconLink
                    href="/gr/notifications"
                    label="Notifications"
                    variant="hero"
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                      </svg>
                    }
                  />
                  <HeaderIconLink
                    href="/gr/parrainage"
                    label="Parrainage"
                    variant="hero"
                    icon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" />
                      </svg>
                    }
                  />
                </>
              ) : null}
              <HeaderCartLink
                variant="hero"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M6 6h15l-1.5 9h-12L6 6zM6 6L5 3H2M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                }
              />
              {!isAuthenticated ? (
                <Link href="/gr/authentication" className={HEADER_BOXED_CLASS}>
                  S&apos;identifier
                </Link>
              ) : null}
            </div>
          </div>

          {/* Ligne 2 : recherche centrée, pleine largeur */}
          <div
            className={`mx-auto flex w-full ${HEADER_SEARCH_MAX_WIDTH} items-center rounded-full bg-white px-5 py-3 shadow-sm`}
            onClick={openSearch}
          >
            <svg
              className="mr-3 h-4 w-4 shrink-0 text-gray-500"
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
              className="w-full cursor-text bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          {/* Ligne 3 : navigation pills */}
          <nav className="mt-3 flex flex-nowrap items-center justify-center gap-1 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              if (!tab.href) return null;
              const isActive =
                pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "border border-white/40 bg-white/15 text-white hover:bg-white/25"
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
