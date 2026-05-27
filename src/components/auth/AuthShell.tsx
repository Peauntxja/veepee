"use client";

import Link from "next/link";
import { VeepeeLogo } from "@/components/layout/VeepeeLogo";

type AuthShellProps = {
  mode: "login" | "register";
  children: React.ReactNode;
};

export function AuthShell({ mode, children }: AuthShellProps) {
  const topRight =
    mode === "login" ? (
      <Link
        href="/gr/registration"
        className="rounded border border-white/60 px-3 py-1 text-xs font-medium text-white hover:border-white"
      >
        S&apos;inscrire
      </Link>
    ) : (
      <Link
        href="/gr/authentication"
        className="rounded border border-white/60 px-3 py-1 text-xs font-medium text-white hover:border-white"
      >
        Déjà membre ?
      </Link>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(https://picsum.photos/seed/veepee-auth/1600/900)",
      }}
    >
      <div className="min-h-screen bg-black/30">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-white">
          <div className="w-20" />
          <div className="text-white">
            <VeepeeLogo className="text-white" />
          </div>
          <div className="w-20 text-right">{topRight}</div>
        </header>

        <main className="mx-auto max-w-3xl px-6 pb-16 pt-2">{children}</main>
      </div>
    </div>
  );
}

