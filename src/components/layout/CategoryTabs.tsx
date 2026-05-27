"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_TABS } from "@/lib/mock/categories";

export function CategoryTabs() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 lg:flex" aria-label="Catégories">
      {CATEGORY_TABS.map((tab) => {
        if (!tab.href) return null;
        const isActive =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`whitespace-nowrap text-sm font-medium transition-colors ${
              isActive
                ? "text-veepee-pink"
                : "text-black hover:text-veepee-pink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileCategoryMenu() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-3 overflow-x-auto border-b border-veepee-border px-4 py-3 lg:hidden"
      aria-label="Catégories mobile"
    >
      {CATEGORY_TABS.map((tab) => {
        if (!tab.href) return null;
        const isActive =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
              isActive
                ? "bg-veepee-pink text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
