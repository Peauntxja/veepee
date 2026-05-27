"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { AuthPromoPanel } from "./AuthPromoPanel";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [email, setEmail] = useState("");
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
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold">Devenez membre de Veepee</h1>
        <p className="mt-2 text-sm text-veepee-muted">
          Inscrivez-vous gratuitement pour accéder aux ventes
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="reg-email" className="mb-1 block text-sm font-medium">
              Email*
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-1 block text-sm font-medium">
              Mot de passe*
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
            />
          </div>
          <div>
            <label
              htmlFor="reg-confirm"
              className="mb-1 block text-sm font-medium"
            >
              Confirmer le mot de passe*
            </label>
            <input
              id="reg-confirm"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
            />
          </div>
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
            Générales d&apos;Utilisation, pris connaissance de la politique de confidentialité
            et je certifie être âgé(e) d&apos;au moins 18 ans.
          </p>
          <button
            type="submit"
            className="w-full bg-veepee-pink py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Je m&apos;inscris
          </button>
        </form>
        <p className="mt-6 text-sm">
          Déjà membre ?{" "}
          <Link href="/gr/authentication" className="font-semibold text-veepee-pink">
            S&apos;identifier
          </Link>
        </p>
      </div>
      <AuthPromoPanel />
    </div>
  );
}
