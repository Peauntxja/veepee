"use client";

import { getProductById } from "@/lib/mock/products";
import { useCartStore } from "@/lib/stores/useCartStore";
import { MiniCartPopover } from "@/components/catalog/MiniCartPopover";

export function CartMiniHost() {
  const miniCart = useCartStore((state) => state.miniCart);
  const hideMiniCart = useCartStore((state) => state.hideMiniCart);

  if (!miniCart) {
    return null;
  }

  const product = getProductById(miniCart.productId);
  if (!product) {
    return null;
  }

  return (
    <MiniCartPopover
      product={product}
      sizeLabel={miniCart.sizeLabel}
      promoRemaining={miniCart.promoRemaining}
      onClose={hideMiniCart}
    />
  );
}
