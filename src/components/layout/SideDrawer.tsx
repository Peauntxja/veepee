"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/useAuthStore";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const NAV_ITEMS = [
  { href: "/gr/my-account", label: "Mon compte" },
  { href: "/gr/my-orders", label: "Mes commandes" },
  { href: "/gr/favourites", label: "Marques favorites" },
  { href: "/gr/preferences", label: "Préférences de communication" },
  { href: "/gr/le-club", label: "Le Club" },
  { href: "/gr/home", label: "Aide et contact" },
];

export function SideDrawer({ open, onClose }: SideDrawerProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);

  if (!open) {
    return null;
  }

  const username = email?.split("@")[0] ?? "membre";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Fermer"
      />
      <aside className="relative h-full w-[320px] bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-veepee-muted">Bonjour {username}</p>
            <p className="mt-1 text-xs text-veepee-muted">
              {isAuthenticated ? "Ravi de vous revoir" : "Connectez-vous pour accéder à tout"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-veepee-muted hover:text-black"
          >
            ✕
          </button>
        </div>

        <nav className="mt-6 space-y-3 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block hover:text-veepee-pink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-veepee-border pt-6">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-sm text-veepee-muted hover:text-black"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              href="/gr/authentication"
              onClick={onClose}
              className="text-sm font-semibold text-veepee-pink hover:underline"
            >
              S&apos;identifier
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
