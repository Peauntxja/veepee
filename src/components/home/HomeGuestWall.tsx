"use client";

import Link from "next/link";

type HomeGuestWallProps = {
  onJoinClick?: () => void;
};

export function HomeGuestWall({ onJoinClick }: HomeGuestWallProps) {
  return (
    <section className="relative overflow-hidden rounded-sm border border-white/25 bg-black/35 px-8 py-10 text-center backdrop-blur-md md:px-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
      <div className="relative">
        <h2 className="text-xl font-semibold text-white md:text-2xl">
          Vous n&apos;avez encore rien vu
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/90">
          Si, seulement 10% des ventes du jour.
          <br />
          Rejoignez-nous pour voir la suite !
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onJoinClick}
            className="min-w-[200px] bg-veepee-pink px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            S&apos;identifier
          </button>
          <Link
            href="/gr/registration"
            className="min-w-[200px] border border-white/80 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </section>
  );
}
