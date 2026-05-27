"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, groupCartLinesByBrand } from "@/lib/stores/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";

export function CartContent() {
  const lines = useCartStore((state) => state.getLines());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const groupedLines = groupCartLinesByBrand(lines);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Votre panier est vide</h1>
        <p className="mt-3 text-veepee-muted">
          Découvrez nos ventes privées et ajoutez vos articles favoris.
        </p>
        <Link
          href="/gr/home"
          className="mt-6 inline-block rounded-full bg-veepee-pink px-8 py-3 text-sm font-semibold text-white"
        >
          Voir les ventes
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    alert("Commande simulée avec succès ! Merci pour votre achat Veepee.");
    clearCart();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Mon panier</h1>
      <p className="mt-2 text-sm text-veepee-muted">
        Chaque marque est expédiée séparément avec ses propres frais de livraison.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {Object.entries(groupedLines).map(([brand, brandLines]) => (
            <section key={brand} className="border border-veepee-border p-6">
              <h2 className="mb-4 text-lg font-bold">{brand}</h2>
              <p className="mb-4 text-xs text-veepee-muted">
                Livraison estimée : 5-8 jours ouvrés · Frais de port : 4,99 €
              </p>
              <ul className="space-y-4">
                {brandLines.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    className="flex gap-4 border-b border-veepee-border pb-4 last:border-0"
                  >
                    <div className="relative h-24 w-20 shrink-0 bg-gray-100">
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/gr/p/maison/${product.slug}/${product.id}`}
                          className="text-sm font-medium hover:text-veepee-pink"
                        >
                          {product.title}
                        </Link>
                        <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center border border-veepee-border"
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span className="text-sm">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center border border-veepee-border"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="ml-auto text-sm text-veepee-muted hover:text-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="h-fit border border-veepee-border p-6">
          <h2 className="text-lg font-bold">Récapitulatif</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-veepee-muted">
              <span>Livraison (estimée)</span>
              <span>4,99 €</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-veepee-border pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(totalPrice + 4.99)}</span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="mt-6 w-full bg-veepee-pink py-4 text-sm font-semibold text-white hover:opacity-90"
          >
            Commander
          </button>
        </aside>
      </div>
    </div>
  );
}
