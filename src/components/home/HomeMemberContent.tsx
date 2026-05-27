"use client";

import { useMemo, useState } from "react";
import { getMemberHomeSales } from "@/lib/mock/sales";
import { getHomePageMeta } from "@/lib/api/loadSnapshot";
import { HomeSaleCard } from "./HomeSaleCard";
import type { SaleEvent } from "@/lib/mock/types";

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
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-[188px]">
      <header className="mb-5 text-white">
        <h1 className="text-[34px] font-normal leading-tight tracking-tight">
          {homeMeta.title}
        </h1>
        <p className="mt-0.5 text-[15px] font-normal opacity-95">{homeMeta.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[18px]">
        {visibleSales.map((sale) => (
          <HomeSaleCard key={sale.id} sale={sale} />
        ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center">
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
