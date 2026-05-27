import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-veepee-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-lg font-bold">On s&apos;habitue vite aux prix doux</h3>
            <p className="text-sm text-veepee-muted">
              Chez Veepee, les plus grandes marques affichent jusqu&apos;à -70% toute
              l&apos;année.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-bold">Les surprises, c&apos;est notre quotidien</h3>
            <p className="text-sm text-veepee-muted">
              Et la toute première vous attend après votre inscription chez nous.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-bold">Plutôt du soir ou du matin ?</h3>
            <p className="text-sm text-veepee-muted">
              Tous les jours, de nouvelles ventes à 7 h et à 19 h.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-veepee-border pt-6 sm:flex-row">
          <p className="text-xs text-veepee-muted">
            © {new Date().getFullYear()} Veepee — Réplique locale à des fins de démonstration
          </p>
          <Link
            href="/gr/authentication"
            className="text-sm font-semibold text-veepee-pink hover:underline"
          >
            S&apos;identifier
          </Link>
        </div>
      </div>
    </footer>
  );
}
