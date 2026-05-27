"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useAuthStore";

const ITEMS = [
  { href: "/gr/my-account", label: "Mon compte" },
  { href: "/gr/my-orders", label: "Mes commandes" },
  { href: "/gr/notifications", label: "Notifications" },
  { href: "/gr/favourites", label: "Marques favorites" },
  { href: "/gr/preferences", label: "Préférences de communication" },
  { href: "/gr/parrainage", label: "Parrainage" },
  { href: "/gr/le-club", label: "Le Club" },
];

export function AccountShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const email = useAuthStore((state) => state.email);
  const username = email?.split("@")[0] ?? "membre";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside>
          <div className="rounded border border-veepee-border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold">Bonjour {username}</p>
            <p className="mt-1 text-xs text-veepee-muted">Ravi de vous revoir</p>

            <nav className="mt-6 space-y-1 text-sm">
              {ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded px-3 py-2 ${
                      active
                        ? "bg-pink-50 text-veepee-pink"
                        : "text-veepee-muted hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}

