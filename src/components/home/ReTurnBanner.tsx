"use client";

import Link from "next/link";
import { SafeImg } from "@/components/common/SafeImg";
import { resolveImage } from "@/lib/assets/resolveImage";

type ReTurnBannerProps = {
  onLockedClick?: () => void;
  locked?: boolean;
};

export function ReTurnBanner({ onLockedClick, locked = false }: ReTurnBannerProps) {
  const bannerUrl = resolveImage("sale-retturn", {
    seed: "retturn",
    w: 1400,
    h: 520,
    text: "Re-turn",
  });

  const content = (
    <article className="group relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <div className="relative aspect-[2.7/1] w-full max-md:aspect-[2.1/1]">
        <SafeImg
          src={bannerUrl}
          alt="Re-turn"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
          <p className="text-2xl font-light tracking-wide md:text-3xl">Re-turn</p>
          <p className="mt-1 text-sm font-medium opacity-95 md:text-base">
            Vos retours à prix plus doux
          </p>
        </div>
      </div>
    </article>
  );

  if (locked) {
    return (
      <button type="button" className="w-full text-left" onClick={onLockedClick}>
        {content}
      </button>
    );
  }

  return (
    <Link href="/gr/h/mode" className="block">
      {content}
    </Link>
  );
}
