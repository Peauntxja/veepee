"use client";

import { useEffect, useState } from "react";
import { formatReservationCountdown } from "@/lib/cart/reservation";

export function useReservationCountdown(expiresAt: number | null): string | null {
  const [label, setLabel] = useState<string | null>(() =>
    formatReservationCountdown(expiresAt),
  );

  useEffect(() => {
    const tick = () => {
      setLabel(formatReservationCountdown(expiresAt));
    };

    tick();
    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, [expiresAt]);

  return label;
}
