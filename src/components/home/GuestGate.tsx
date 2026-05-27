"use client";

import { useState } from "react";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

type GuestGateProps = {
  open: boolean;
  onClose: () => void;
};

export function GuestGate({ open, onClose }: GuestGateProps) {
  const [email, setEmail] = useState("");

  if (!open) {
    return null;
  }

  const authHref = email.trim()
    ? `/gr/authentication?email=${encodeURIComponent(email.trim())}`
    : "/gr/authentication";
  const registerHref = email.trim()
    ? `/gr/registration?email=${encodeURIComponent(email.trim())}`
    : "/gr/registration";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-gate-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Fermer"
      />
      <div className="relative w-[520px] max-w-full bg-white px-10 py-10 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-lg text-veepee-muted hover:text-black"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h2 id="guest-gate-title" className="mx-auto max-w-[380px] text-lg font-semibold leading-snug">
          Connectez vous ou créez un compte pour voir les ventes du jour
        </h2>
        <p className="mt-2 text-xs text-veepee-muted">
          Entrez votre email pour vérifier l&apos;existence de votre compte ou vous inscrire
        </p>

        <div className="mt-6 text-left">
          <label htmlFor="guest-email" className="text-xs font-medium text-veepee-muted">
            Email*
          </label>
          <input
            id="guest-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
            autoFocus
          />
        </div>

        <Link
          href={authHref}
          onClick={onClose}
          className={`mt-4 block w-full py-3 text-sm font-medium ${
            email.trim()
              ? "bg-veepee-pink text-white hover:opacity-90"
              : "bg-gray-100 text-veepee-muted hover:bg-gray-200"
          }`}
        >
          Continuer avec un email
        </Link>

        <div className="mt-6 flex items-center gap-3 text-xs text-veepee-muted">
          <div className="h-px flex-1 bg-veepee-border" />
          ou
          <div className="h-px flex-1 bg-veepee-border" />
        </div>

        <p className="mt-4 text-xs text-veepee-muted">Continuer avec</p>
        <div className="mt-3">
          <SocialAuthButtons />
        </div>

        <p className="mt-6 text-xs text-veepee-muted">
          Pas encore membre ?{" "}
          <Link href={registerHref} onClick={onClose} className="font-semibold text-veepee-pink hover:underline">
            S&apos;inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  );
}
