import { SiteShell } from "@/components/layout/SiteShell";
import { AccountShell } from "@/components/account/AccountShell";
import { SafeImg } from "@/components/common/SafeImg";

export default function FavouritesPage() {
  return (
    <SiteShell>
      <AccountShell title="Mes marques favorites">
        <div className="rounded border border-veepee-border bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-veepee-muted">
              Ces marques que vous aimez tant.
            </p>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded border border-veepee-pink px-5 py-2 text-xs font-semibold text-veepee-pink hover:bg-pink-50"
            >
              Gérer mes préférences
            </button>
          </div>

          <div className="mt-6 rounded border border-veepee-border bg-white px-4 py-2">
            <input
              className="w-full text-sm outline-none placeholder:text-veepee-muted"
              placeholder="Rechercher une marque"
            />
          </div>

          <div className="mt-8 text-center">
            <div className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded bg-gray-100">
              <SafeImg
                src="/mock/image?seed=favourites&w=900&h=560&text=Veepee"
                alt="Marques favorites"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <p className="mt-6 text-sm font-semibold">
              Vous n&apos;avez pas encore de marques favorites ?
            </p>
            <p className="mt-1 text-sm text-veepee-muted">
              Découvrez vite ces marques qui ont tout pour vous séduire.
            </p>
          </div>
        </div>
      </AccountShell>
    </SiteShell>
  );
}

