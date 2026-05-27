"use client";

import { useMemo, useState } from "react";
import { SALES } from "@/lib/mock/sales";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { SaleCard } from "./SaleCard";
import { GuestGate } from "./GuestGate";

type HomeContentProps = {
  onLockedClick?: () => void;
};

export function HomeContent({ onLockedClick }: HomeContentProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [guestGateOpen, setGuestGateOpen] = useState(false);

  const homeSales = useMemo(() => {
    return SALES.filter((sale) => sale.categoryTab === "home").slice(0, 6);
  }, []);

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
          {homeSales.map((sale) => (
            <SaleCard
              key={sale.id}
              sale={sale}
              blurred={!isAuthenticated}
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
