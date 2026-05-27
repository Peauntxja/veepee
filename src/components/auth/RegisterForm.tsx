"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { AuthPromoPanel } from "./AuthPromoPanel";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { usePrefillEmail } from "./usePrefillEmail";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const prefillEmail = usePrefillEmail();
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!isAdult) {
      setError("Vous devez avoir 18 ans ou plus.");
      return;
    }
    if (!acceptTerms) {
      setError("Vous devez accepter les CGU.");
      return;
    }

    const result = register(email, password);
    if (result.success) {
      router.push("/gr/home");
      return;
    }
    setError(result.error ?? "Une erreur est survenue.");
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
      <section className="bg-white px-8 py-10 shadow-2xl md:px-10">
        <h1 className="text-center text-xs font-bold uppercase tracking-widest text-veepee-muted">
          DEVENEZ MEMBRE VEEPEE
        </h1>
        <p className="mt-3 text-center text-sm text-veepee-muted">
          Inscrivez-vous gratuitement pour accéder aux ventes
        </p>

        <div className="mt-5">
          <SocialAuthButtons />
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs text-veepee-muted">
          <div className="h-px flex-1 bg-veepee-border" />
          OU
          <div className="h-px flex-1 bg-veepee-border" />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            id="reg-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
            placeholder="Email*"
          />
          <input
            id="reg-password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
            placeholder="Mot de passe*"
          />
          <input
            id="reg-confirm"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
            placeholder="Confirmer le mot de passe*"
          />
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAdult}
              onChange={(event) => setIsAdult(event.target.checked)}
              className="mt-1"
            />
            J&apos;ai 18 ans ou plus
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) => setAcceptTerms(event.target.checked)}
              className="mt-1"
            />
            J&apos;accepte les Conditions Générales d&apos;Utilisation
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs leading-relaxed text-veepee-muted">
            En validant ce formulaire, je déclare avoir lu et accepté les Conditions
            Générales d&apos;Utilisation et certifie être âgé(e) d&apos;au moins 18 ans.
          </p>
          <button
            type="submit"
            className="w-full bg-veepee-pink py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Je m&apos;inscris
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          Déjà membre ?{" "}
          <Link href="/gr/authentication" className="font-semibold text-veepee-pink">
            S&apos;identifier
          </Link>
        </p>
      </section>

      <AuthPromoPanel />
    </div>
  );
}
