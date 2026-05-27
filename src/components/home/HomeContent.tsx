"use client";

import { useMemo, useState } from "react";
import { SALES, getVisibleSalesForGuest } from "@/lib/mock/sales";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { SaleCard } from "./SaleCard";
import { GuestGate } from "./GuestGate";

type HomeContentProps = {
  onLockedClick?: () => void;
};

export function HomeContent({ onLockedClick }: HomeContentProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [guestGateOpen, setGuestGateOpen] = useState(false);

  const visibleSales = useMemo(() => {
    return isAuthenticated ? SALES : getVisibleSalesForGuest();
  }, [isAuthenticated]);

  const lockedSales = useMemo(() => {
    if (isAuthenticated) {
      return [];
    }
    const visibleIds = new Set(getVisibleSalesForGuest().map((sale) => sale.id));
    return SALES.filter((sale) => !visibleIds.has(sale.id)).slice(0, 6);
  }, [isAuthenticated]);

  return (
    <>
      <div className="mx-auto mt-[160px] max-w-6xl px-6 text-white">
        <h1 className="text-3xl font-semibold leading-tight">
          Ça va vous plaire
        </h1>
        <p className="mt-1 text-sm opacity-90">Coup de foudre inévitable.</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <div className="grid grid-cols-2 gap-6">
          {visibleSales.slice(0, 6).map((sale) => (
            <SaleCard key={sale.id} sale={sale} />
          ))}

          {!isAuthenticated &&
            lockedSales.map((sale) => (
              <SaleCard
                key={sale.id}
                sale={sale}
                blurred
                onLockedClick={() => {
                  setGuestGateOpen(true);
                  onLockedClick?.();
                }}
              />
            ))}
        </div>
      </div>

      <GuestGate open={guestGateOpen} onClose={() => setGuestGateOpen(false)} />
    </>
  );
}
