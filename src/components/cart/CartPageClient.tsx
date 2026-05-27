"use client";

import { useAuthStore } from "@/lib/stores/useAuthStore";
import { SiteShell } from "@/components/layout/SiteShell";
import { CartGate } from "@/components/cart/CartGate";

export function CartPageClient() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <CartGate />;
  }

  return (
    <SiteShell>
      <CartGate />
    </SiteShell>
  );
}
