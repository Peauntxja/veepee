"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { SALES, getVisibleSalesForGuest } from "@/lib/mock/sales";
import { SaleCard } from "./SaleCard";
import { GuestGate } from "./GuestGate";
import { ValueStrip } from "./ValueStrip";

const TABS = [
  { id: "all", label: "Toutes" },
  { id: "mode", label: "Mode" },
  { id: "maison", label: "Maison" },
  { id: "voyage", label: "Voyage" },
  { id: "enfant", label: "Enfant" },
  { id: "beaute", label: "Beauté" },
  { id: "sport", label: "Sport" },
];

export function HomeContent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeTab, setActiveTab] = useState("all");
  const [showGuestModal, setShowGuestModal] = useState(false);

  const filteredSales = useMemo(() => {
    const base = isAuthenticated ? SALES : getVisibleSalesForGuest();
    if (activeTab === "all") {
      return base;
    }
    return base.filter((sale) => sale.categoryTab === activeTab);
  }, [isAuthenticated, activeTab]);

  const lockedSales = useMemo(() => {
    if (isAuthenticated) {
      return [];
    }
    const visibleIds = new Set(getVisibleSalesForGuest().map((sale) => sale.id));
    return SALES.filter((sale) => !visibleIds.has(sale.id)).slice(0, 8);
  }, [isAuthenticated]);

  return (
    <>
      <section className="bg-black px-4 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-widest text-veepee-pink">
            Vente du jour
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-6xl">Ça va vous plaire</h1>
          <p className="mt-4 text-xl text-gray-300 md:text-2xl">
            Coup de foudre inévitable.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-veepee-pink/80 to-purple-900/80" />
          <div className="relative px-6 py-10 md:px-10 md:py-14">
            <p className="text-sm font-semibold uppercase tracking-wide">Re-turn</p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Vos retours à prix plus doux
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-200">
              Découvrez une sélection de retours et produits reconditionnés à prix
              exceptionnels.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-veepee-pink text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSales.map((sale) => (
            <SaleCard key={sale.id} sale={sale} />
          ))}
        </div>

        {!isAuthenticated && lockedSales.length > 0 && (
          <>
            <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lockedSales.map((sale) => (
                <SaleCard
                  key={sale.id}
                  sale={sale}
                  blurred
                  onLockedClick={() => setShowGuestModal(true)}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white" />
            </div>
            <GuestGate />
          </>
        )}
      </section>

      <ValueStrip />

      {showGuestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-md rounded-lg bg-white p-8 text-center">
            <h3 className="text-xl font-bold">Rejoignez Veepee</h3>
            <p className="mt-3 text-sm text-veepee-muted">
              Inscrivez-vous gratuitement pour accéder à toutes les ventes du jour.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/gr/registration"
                className="rounded-full bg-veepee-pink px-6 py-3 text-sm font-semibold text-white"
              >
                S&apos;inscrire
              </a>
              <button
                type="button"
                onClick={() => setShowGuestModal(false)}
                className="text-sm text-veepee-muted hover:text-black"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
