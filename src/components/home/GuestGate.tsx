"use client";

import { useState } from "react";
import Link from "next/link";

type GuestGateProps = {
  open: boolean;
  onClose: () => void;
};

export function GuestGate({ open, onClose }: GuestGateProps) {
  const [email, setEmail] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="relative w-[520px] max-w-full bg-white px-12 py-10 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-sm text-veepee-muted hover:text-black"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h2 className="mx-auto max-w-[380px] text-lg font-semibold">
          Connectez vous ou créez un compte pour voir les ventes du jour
        </h2>
        <p className="mt-2 text-xs text-veepee-muted">
          Entrez votre email pour vérifier l&apos;existence de votre compte ou vous inscrire
        </p>

        <div className="mt-6 text-left">
          <label className="text-xs font-medium text-veepee-muted">Email*</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
          />
        </div>

        <Link
          href="/gr/authentication"
          className="mt-4 block w-full bg-gray-100 py-3 text-sm font-medium text-veepee-muted hover:bg-gray-200"
        >
          Continuer avec un email
        </Link>

        <div className="mt-6 flex items-center gap-3 text-xs text-veepee-muted">
          <div className="h-px flex-1 bg-veepee-border" />
          ou
          <div className="h-px flex-1 bg-veepee-border" />
        </div>

        <p className="mt-4 text-xs text-veepee-muted">Continuer avec</p>

        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-veepee-border"
            aria-label="Google"
          >
            G
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-veepee-border"
            aria-label="Apple"
          >
            
          </button>
        </div>
      </div>
    </div>
  );
}
