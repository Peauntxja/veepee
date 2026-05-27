"use client";

import Link from "next/link";

type GuestGateProps = {
  onUnlockClick?: () => void;
};

export function GuestGate({ onUnlockClick }: GuestGateProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-lg border border-veepee-border bg-gradient-to-b from-pink-50 to-white p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">
          Vous n&apos;avez encore rien vu
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-veepee-muted">
          Si, seulement 10% des ventes du jour. Rejoignez-nous pour voir la suite !
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/gr/registration"
            onClick={onUnlockClick}
            className="rounded-full bg-veepee-pink px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            S&apos;inscrire
          </Link>
          <Link
            href="/gr/authentication"
            onClick={onUnlockClick}
            className="rounded-full border border-black px-8 py-3 text-sm font-semibold hover:bg-gray-50"
          >
            S&apos;identifier
          </Link>
        </div>
      </div>
    </section>
  );
}
