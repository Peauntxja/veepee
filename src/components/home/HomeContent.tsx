"use client";

import { useMemo, useState } from "react";
import { getHomeSales } from "@/lib/mock/sales";
import { getHomePageMeta } from "@/lib/api/loadSnapshot";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { HomeSaleCard } from "./HomeSaleCard";
import { HomeGuestWall } from "./HomeGuestWall";
import { ReTurnBanner } from "./ReTurnBanner";
import { GuestGate } from "./GuestGate";

type HomeContentProps = {
  onLockedClick?: () => void;
};

const homeMeta = getHomePageMeta();

function getGuestVisibleCount(total: number, ratio: number, min: number): number {
  return Math.min(total, Math.max(min, Math.ceil(total * ratio)));
}

export function HomeContent({ onLockedClick }: HomeContentProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [guestGateOpen, setGuestGateOpen] = useState(false);

  const homeSales = useMemo(() => getHomeSales(), []);

  const guestVisibleCount = getGuestVisibleCount(
    homeSales.length,
    homeMeta.guestVisibleRatio,
    homeMeta.guestVisibleMin,
  );
  const showGuestWall = !isAuthenticated;

  const openGuestGate = () => {
    setGuestGateOpen(true);
    onLockedClick?.();
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-[188px]">
        <header className="mb-5 text-white">
          <h1 className="text-[34px] font-normal leading-tight tracking-tight">
            {homeMeta.title}
          </h1>
          <p className="mt-0.5 text-[15px] font-normal opacity-95">
            {homeMeta.subtitle}
          </p>
        </header>

        <section className="mb-5 text-white">
          <h2 className="text-lg font-bold tracking-tight">C&apos;est tout nouveau</h2>
          <p className="mt-0.5 text-sm opacity-90">Elles ont ouvert aujourd&apos;hui.</p>
        </section>

        <div className="relative">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[18px]">
            {homeSales.map((sale, index) => {
              const blurred = showGuestWall && index >= guestVisibleCount;
              return (
                <HomeSaleCard
                  key={sale.id}
                  sale={sale}
                  blurred={blurred}
                  onLockedClick={openGuestGate}
                />
              );
            })}

            {showGuestWall && (
              <div className="sm:col-span-2">
                <ReTurnBanner locked onLockedClick={openGuestGate} />
              </div>
            )}
          </div>

          {showGuestWall && guestVisibleCount < homeSales.length && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%] flex items-end justify-center bg-gradient-to-b from-transparent via-white/10 to-white/30 pb-2 pt-16">
              <div className="pointer-events-auto w-full">
                <HomeGuestWall onJoinClick={openGuestGate} />
              </div>
            </div>
          )}
        </div>
      </div>

      <GuestGate open={guestGateOpen} onClose={() => setGuestGateOpen(false)} />
    </>
  );
}
