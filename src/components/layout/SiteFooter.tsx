import Link from "next/link";
import { VeepeeLogo } from "./VeepeeLogo";

const FOOTER_COLUMNS = [
  {
    title: "Veepee",
    links: [
      { label: "Qui sommes-nous ?", href: "/gr/home" },
      { label: "Recrutement", href: "/gr/home" },
      { label: "Presse", href: "/gr/home" },
      { label: "Le Club", href: "/gr/le-club" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Centre d'aide", href: "/gr/home" },
      { label: "Contact", href: "/gr/home" },
      { label: "Livraison", href: "/gr/home" },
      { label: "Retours", href: "/gr/home" },
    ],
  },
  {
    title: "Informations légales",
    links: [
      { label: "CGU", href: "/gr/home" },
      { label: "Politique de confidentialité", href: "/gr/home" },
      { label: "Cookies", href: "/gr/home" },
      { label: "Mentions légales", href: "/gr/home" },
    ],
  },
  {
    title: "Mon compte",
    links: [
      { label: "Mes commandes", href: "/gr/my-orders" },
      { label: "Marques favorites", href: "/gr/favourites" },
      { label: "Préférences", href: "/gr/preferences" },
      { label: "Parrainage", href: "/gr/parrainage" },
    ],
  },
];

const PAYMENT_LABELS = ["CB", "Visa", "Mastercard", "PayPal", "Apple Pay"];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-veepee-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">On s&apos;habitue vite aux prix doux</h3>
            <p className="mt-2 text-sm text-veepee-muted">
              Chez Veepee, les plus grandes marques affichent jusqu&apos;à -70% toute
              l&apos;année.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Les surprises, c&apos;est notre quotidien</h3>
            <p className="mt-2 text-sm text-veepee-muted">
              Et la toute première vous attend après votre inscription chez nous.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Plutôt du soir ou du matin ?</h3>
            <p className="mt-2 text-sm text-veepee-muted">
              Tous les jours, de nouvelles ventes à 7 h et à 19 h.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-veepee-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-bold">{column.title}</h4>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-veepee-muted hover:text-veepee-pink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-veepee-border pt-8">
          <span className="text-xs font-semibold text-veepee-muted">Paiement sécurisé</span>
          {PAYMENT_LABELS.map((label) => (
            <span
              key={label}
              className="rounded border border-veepee-border px-2 py-1 text-[10px] font-medium text-veepee-muted"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 border-t border-veepee-border pt-8 sm:flex-row sm:items-center">
          <VeepeeLogo variant="black" />
          <div className="flex flex-wrap items-center gap-4 text-xs text-veepee-muted">
            <span>France</span>
            <span>·</span>
            <span>Français</span>
            <span>·</span>
            <Link href="/gr/authentication" className="font-semibold text-veepee-pink hover:underline">
              S&apos;identifier
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-veepee-muted">
          © {new Date().getFullYear()} Veepee — Réplique locale à des fins de démonstration
        </p>
      </div>
    </footer>
  );
}
