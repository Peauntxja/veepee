"use client";

import { useMemo, useState } from "react";
import { getMemberHomeSales } from "@/lib/mock/sales";
import { getHomePageMeta } from "@/lib/api/loadSnapshot";
import { HomeSaleCard } from "./HomeSaleCard";
import type { SaleEvent } from "@/lib/mock/types";
import {
  HOME_HERO_INTRO,
  HOME_HERO_SUBTITLE,
  HOME_HERO_TITLE,
  HOME_PAGE_BOTTOM,
  HOME_SALE_GRID,
} from "./homeLayout";

const homeMeta = getHomePageMeta();

type HomeFilter = "all" | "new" | "last-days" | "upcoming";

const FILTERS: Array<{ id: HomeFilter; label: string }> = [
  { id: "all", label: "Toutes les ventes" },
  { id: "new", label: "Nouveautés" },
  { id: "last-days", label: "Derniers jours" },
  { id: "upcoming", label: "Prochainement" },
];

function filterMemberSales(sales: SaleEvent[], filter: HomeFilter): SaleEvent[] {
  if (filter === "all") return sales;
  if (filter === "upcoming") return sales.filter((sale) => sale.status === "upcoming");
  if (filter === "new") return sales.filter((sale) => sale.status === "live").slice(0, 8);
  return sales.filter((sale) => sale.status === "live").slice(-8);
}

export function HomeMemberContent() {
  const memberSales = useMemo(() => getMemberHomeSales(), []);
  const [filter, setFilter] = useState<HomeFilter>("all");
  const visibleSales = useMemo(
    () => filterMemberSales(memberSales, filter),
    [memberSales, filter],
  );

  return (
    <div className={HOME_PAGE_BOTTOM}>
      <div className={HOME_HERO_INTRO}>
        <header>
          <h1 className={HOME_HERO_TITLE}>{homeMeta.title}</h1>
          <p className={HOME_HERO_SUBTITLE}>{homeMeta.subtitle}</p>
        </header>
      </div>

      <div className={HOME_SALE_GRID}>
        {visibleSales.map((sale) => (
          <HomeSaleCard key={sale.id} sale={sale} />
        ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-8 z-30 hidden justify-center md:flex">
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-full border border-veepee-border bg-white px-3 py-2 shadow-lg">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === item.id
                  ? "bg-black text-white"
                  : "text-veepee-muted hover:bg-gray-100 hover:text-black"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
