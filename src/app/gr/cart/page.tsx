import { SiteShell } from "@/components/layout/SiteShell";
import { CartGate } from "@/components/cart/CartGate";

export default function CartPage() {
  return (
    <SiteShell>
      <CartGate />
    </SiteShell>
  );
}
