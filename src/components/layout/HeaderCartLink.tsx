"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/useCartStore";
import { useReservationCountdown } from "@/lib/cart/useReservationCountdown";

type HeaderCartLinkProps = {
  href?: string;
  label?: string;
  icon: ReactNode;
  variant?: "standard" | "hero";
};

export function HeaderCartLink({
  href = "/gr/cart",
  icon,
  variant = "standard",
}: HeaderCartLinkProps) {
  const totalItems = useCartStore((state) =>
    Object.values(state.items).reduce((sum, qty) => sum + qty, 0),
  );
  const reservationExpiresAt = useCartStore((state) => state.reservationExpiresAt);
  const countdown = useReservationCountdown(reservationExpiresAt);
  const timerLabel = countdown ?? "00:00";

  if (variant === "hero") {
    return (
      <Link
        href={href}
        className="relative flex min-w-[46px] flex-col items-center justify-center rounded border border-dashed border-white/90 px-2 py-1.5 text-[10px] font-medium leading-none opacity-95 hover:opacity-100 md:min-w-[52px] md:border-solid md:px-2.5"
      >
        {totalItems > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-veepee-pink px-0.5 text-[9px] font-bold text-white">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        ) : null}
        <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
        <span className="mt-0.5 tabular-nums">{timerLabel}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="relative flex min-w-[46px] flex-col items-center justify-center rounded border-2 border-veepee-pink px-2 py-1 text-[10px] font-medium leading-none hover:bg-pink-50/40 md:min-w-[56px] md:px-3 md:py-1.5"
    >
      {totalItems > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-veepee-pink px-0.5 text-[9px] font-bold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      ) : null}
      <span className="flex h-5 w-5 items-center justify-center text-black">{icon}</span>
      <span className="mt-0.5 text-[10px] font-medium tabular-nums text-black md:font-semibold md:text-veepee-pink">
        {timerLabel}
      </span>
    </Link>
  );
}

function HeaderIconLink({
  href,
  label,
  icon,
  variant = "standard",
  hideLabelOnMobile = false,
  className = "",
}: {
  href: string;
  label: string;
  icon: ReactNode;
  variant?: "standard" | "hero";
  hideLabelOnMobile?: boolean;
  className?: string;
}) {
  const linkClassName =
    variant === "hero"
      ? "flex flex-col items-center gap-1 text-[10px] font-medium leading-none text-white opacity-95 hover:opacity-100"
      : "flex flex-col items-center gap-0.5 text-[10px] font-medium leading-none text-black hover:text-veepee-pink md:gap-1 md:text-veepee-muted md:hover:text-black";

  return (
    <Link href={href} className={`${linkClassName} ${className}`.trim()}>
      <span className="flex h-5 w-5 items-center justify-center md:h-5 md:w-5">{icon}</span>
      <span className={hideLabelOnMobile ? "hidden md:inline" : ""}>{label}</span>
    </Link>
  );
}

export { HeaderIconLink };
