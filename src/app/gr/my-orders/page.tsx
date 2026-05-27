import { SiteShell } from "@/components/layout/SiteShell";
import { AccountShell } from "@/components/account/AccountShell";
import { SafeImg } from "@/components/common/SafeImg";

export default function MyOrdersPage() {
  return (
    <SiteShell>
      <AccountShell title="Mes commandes">
        <div className="rounded border border-veepee-border bg-white p-8 shadow-sm">
          <div className="mx-auto max-w-lg text-center">
            <div className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded bg-gray-100">
              <SafeImg
                src="/mock/image?seed=orders&w=900&h=560&text=Veepee"
                alt="Mes commandes"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <h2 className="mt-6 text-lg font-bold">
              Profitez de nombreux bons plans !
            </h2>
            <p className="mt-2 text-sm text-veepee-muted">
              Les meilleures marques à tout petits prix ! Dès votre commande passée,
              elle apparaîtra sur cette page.
            </p>
            <button
              type="button"
              className="mt-6 bg-veepee-pink px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Trouver l&apos;inspiration
            </button>
          </div>
        </div>
      </AccountShell>
    </SiteShell>
  );
}

