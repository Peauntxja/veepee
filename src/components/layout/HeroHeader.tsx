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
import {
  HEADER_EDGE_PADDING,
  HEADER_SEARCH_MAX_WIDTH,
} from "./headerLayout";

type HeroHeaderProps = {
  onMenuClick?: () => void;
};

const HEADER_BOXED_CLASS =
  "hidden rounded border border-white/80 px-2.5 py-1.5 text-[10px] font-medium leading-none opacity-95 hover:opacity-100 md:inline-flex";

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
        topOffset="8.75rem"
      />
      <header className="absolute inset-x-0 top-0 z-40 w-full text-white">
        <div className={`w-full ${HEADER_EDGE_PADDING}`}>
          <div className="relative flex items-center justify-between pt-3 pb-2 md:items-end md:pt-4 md:pb-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="flex shrink-0 items-center justify-center p-0.5 opacity-95 hover:opacity-100 md:flex-col md:gap-1 md:p-0"
              aria-label="Menu"
            >
              <svg width="20" height="14" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="hidden text-[10px] font-medium leading-none sm:inline">Menu</span>
            </button>

            <div className="pointer-events-none absolute left-1/2 top-2.5 -translate-x-1/2 md:top-4">
              <div className="pointer-events-auto">
                <VeepeeLogo variant="white" className="max-md:[&_img]:h-[26px]" />
              </div>
            </div>

            <div className="flex items-center gap-2 md:items-end md:gap-5">
              {isAuthenticated ? (
                <>
                  <HeaderIconLink
                    href="/gr/notifications"
                    label="Notifications"
                    variant="hero"
                    hideLabelOnMobile
                    className="hidden md:flex"
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
                    hideLabelOnMobile
                    className="hidden md:flex"
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
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
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

          <div
            className={`mx-auto flex w-full ${HEADER_SEARCH_MAX_WIDTH} items-center rounded-full bg-white px-4 py-2.5 shadow-sm md:px-5 md:py-3`}
            onClick={openSearch}
          >
            <svg
              className="mr-2.5 h-4 w-4 shrink-0 text-gray-500 md:mr-3"
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
              className="w-full min-w-0 cursor-text bg-transparent text-[13px] text-gray-800 placeholder:text-gray-500 focus:outline-none md:text-sm"
            />
          </div>
        </div>

        <div className="-mx-0 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 md:px-10 lg:px-14 xl:px-[4.5rem] [&::-webkit-scrollbar]:hidden">
          <nav className="mt-2.5 flex w-max min-w-full flex-nowrap items-center gap-1.5 md:mt-3 md:w-full md:justify-center md:gap-1">
            {tabs.map((tab) => {
              if (!tab.href) return null;
              const isActive =
                pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap md:px-2.5 md:py-1 md:text-[10px] ${
                    isActive
                      ? "bg-white text-black shadow-sm md:bg-white md:text-black"
                      : "bg-white/95 text-black md:border md:border-white/40 md:bg-white/15 md:text-white md:hover:bg-white/25"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
            <span className="w-2 shrink-0 md:hidden" aria-hidden="true" />
          </nav>
        </div>
      </header>
    </>
  );
}
