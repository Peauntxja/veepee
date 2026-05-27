"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SafeImg } from "@/components/common/SafeImg";
import {
  SEARCH_CONTINUE_PRODUCT,
  SEARCH_MEMBER_TRENDS,
  type SearchTrendIcon,
} from "@/lib/mock/searchOverlay";
import { formatPrice } from "@/lib/utils/formatPrice";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  topOffset?: string;
};

function TrendIcon({ type }: { type: SearchTrendIcon }) {
  if (type === "butterfly") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3c-2 3-5 4-5 7a5 5 0 0010 0c0-3-3-4-5-7zM4 14c2 2 4 2 6 4s4 2 6 0 2-4 4-6"
          stroke="#ec008c"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "arch") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 20V10a7 7 0 0114 0v10M8 20h8"
          stroke="#ec008c"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" stroke="#ec008c" strokeWidth="1.5" />
      <rect x="13" y="4" width="7" height="7" stroke="#ec008c" strokeWidth="1.5" />
      <rect x="4" y="13" width="7" height="7" stroke="#ec008c" strokeWidth="1.5" />
      <rect x="13" y="13" width="7" height="7" stroke="#ec008c" strokeWidth="1.5" />
    </svg>
  );
}

export function SearchOverlay({
  open,
  onClose,
  query,
  onQueryChange,
  onSubmit,
  topOffset = "7.5rem",
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const product = SEARCH_CONTINUE_PRODUCT;

  return (
    <div className="fixed inset-0 z-[60]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Fermer la recherche"
      />

      <div
        className="pointer-events-none absolute inset-x-0 px-6"
        style={{ top: topOffset }}
      >
        <div
          className="pointer-events-auto mx-auto w-full max-w-[1120px] overflow-hidden rounded-lg bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Recherche"
        >
          <div className="border-b border-veepee-border px-6 py-4">
            <div className="flex items-center rounded-full border border-gray-300 px-5 py-3">
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
                ref={inputRef}
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onSubmit();
                    onClose();
                  }
                }}
                placeholder="Recherchez une marque, un produit..."
                className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-10 px-8 py-8 md:grid-cols-2 md:gap-12">
            <section>
              <h2 className="text-lg font-bold text-black">Inspiré de nos membres</h2>
              <p className="mt-1 text-sm text-veepee-muted">Les tendances du jour</p>
              <ul className="mt-5 space-y-4">
                {SEARCH_MEMBER_TRENDS.map((trend) => (
                  <li key={trend.id}>
                    <Link
                      href={trend.href}
                      onClick={onClose}
                      className="group flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                        <TrendIcon type={trend.icon} />
                      </span>
                      <span className="min-w-0">
                        <span className="font-semibold text-black group-hover:text-veepee-pink">
                          {trend.title}
                        </span>{" "}
                        <span className="text-sm text-veepee-muted">{trend.subtitle}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black">Continuez vos achats</h2>
              <Link
                href={product.href}
                onClick={onClose}
                className="group mt-5 inline-block max-w-[220px]"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <SafeImg
                    src={product.imageUrl}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-bold text-veepee-pink">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-veepee-muted line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
