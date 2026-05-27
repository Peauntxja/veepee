"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { AuthPromoPanel } from "./AuthPromoPanel";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { usePrefillEmail } from "./usePrefillEmail";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const prefillEmail = usePrefillEmail();
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) {
      router.push("/gr/home");
      return;
    }
    setError("Email ou mot de passe incorrect. Essayez demo@veepee.fr / demo123");
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <section className="bg-white px-10 py-8 shadow-2xl">
        <h1 className="text-center text-xs font-bold uppercase tracking-widest text-veepee-muted">
          DÉJÀ MEMBRE VEEPEE ?
        </h1>

        <div className="mt-4">
          <SocialAuthButtons />
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs text-veepee-muted">
          <div className="h-px flex-1 bg-veepee-border" />
          OU
          <div className="h-px flex-1 bg-veepee-border" />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
            placeholder="Email*"
          />
          <div className="relative">
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
              placeholder="Mot de passe*"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-veepee-muted">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Rester connecté
            </label>
            <button type="button" className="hover:text-veepee-pink">
              Mot de passe oublié ?
            </button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-veepee-pink py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Se connecter
          </button>
        </form>
      </section>

      <section className="bg-white px-10 py-8 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold">Devenez membre de Veepee</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/gr/registration"
              className="border border-veepee-pink px-6 py-2 text-xs font-semibold text-veepee-pink hover:bg-pink-50"
            >
              S&apos;inscrire
            </Link>
            <button
              type="button"
              className="border border-veepee-border px-6 py-2 text-xs font-semibold text-veepee-muted hover:bg-gray-50"
            >
              Qui sommes nous ?
            </button>
          </div>
        </div>
        <div className="mt-6">
          <AuthPromoPanel />
        </div>
      </section>
    </div>
  );
}
