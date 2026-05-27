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
import { HEADER_EDGE_PADDING } from "./headerLayout";

type StandardHeaderProps = {
  onMenuClick?: () => void;
  sticky?: boolean;
  /** @deprecated mobile layout is always compact */
  compactMobile?: boolean;
};

const SEARCH_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
  </svg>
);

const CART_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
  </svg>
);

export function StandardHeader({
  onMenuClick,
  sticky = true,
}: StandardHeaderProps) {
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
        topOffset="4.5rem"
      />
      <header
        className={`z-50 w-full border-b border-veepee-border bg-white ${sticky ? "sticky top-0" : ""}`}
      >
        {/* ——— Mobile : Menu · loupe · Logo · cloche · panier ——— */}
        <div className={`md:hidden ${HEADER_EDGE_PADDING}`}>
          <div className="relative flex h-[52px] items-center justify-between">
            <div className="z-10 flex items-center gap-5">
              <button
                type="button"
                onClick={onMenuClick}
                className="flex items-center justify-center text-black"
                aria-label="Menu"
              >
                <svg width="20" height="14" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                  <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={openSearch}
                className="flex items-center justify-center text-black"
                aria-label="Rechercher"
              >
                {SEARCH_ICON}
              </button>
            </div>

            <div className="pointer-events-none absolute inset-x-0 flex justify-center">
              <div className="pointer-events-auto">
                <VeepeeLogo variant="black" className="[&_img]:h-[26px]" />
              </div>
            </div>

            <div className="z-10 flex items-center gap-4">
              {isAuthenticated ? (
                <HeaderIconLink
                  href="/gr/notifications"
                  label="Notifications"
                  hideLabelOnMobile
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  }
                />
              ) : null}
              <HeaderCartLink variant="standard" icon={CART_ICON} />
            </div>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 pb-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex w-max min-w-full flex-nowrap items-center gap-1.5">
              {CATEGORY_TABS.map((tab) => {
                if (!tab.href) return null;
                const isActive =
                  pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap ${
                      isActive
                        ? "border border-black bg-white text-black"
                        : "border border-gray-300 bg-white text-black"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
              <span className="w-2 shrink-0" aria-hidden="true" />
            </nav>
          </div>
        </div>

        {/* ——— Desktop : barre complète ——— */}
        <div className={`hidden md:block ${HEADER_EDGE_PADDING}`}>
          <div className="relative flex items-end justify-between pb-3 pt-4">
            <div className="flex min-w-0 flex-1 items-end gap-4 pr-6 lg:pr-10">
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
                className="flex min-w-0 max-w-[560px] flex-1 items-center rounded-full border border-gray-300 bg-white px-4 py-2.5 lg:max-w-[640px]"
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

            <div className="flex flex-1 items-end justify-end gap-4 pl-6 lg:pl-10">
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
              <HeaderCartLink variant="standard" icon={CART_ICON} />
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
