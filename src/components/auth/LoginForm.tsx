"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { AuthPromoPanel } from "./AuthPromoPanel";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
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
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold">DÉJÀ MEMBRE VEEPEE ?</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email*
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
              placeholder="demo@veepee.fr"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Mot de passe*
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-veepee-border px-4 py-3 text-sm outline-none focus:border-veepee-pink"
              placeholder="demo123"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Rester connecté
            </label>
            <span className="text-veepee-pink">Mot de passe oublié ?</span>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-veepee-pink py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-8 border-t border-veepee-border pt-8">
          <h2 className="text-lg font-bold">Devenez membre de Veepee</h2>
          <Link
            href="/gr/registration"
            className="mt-4 inline-block border border-black px-8 py-3 text-sm font-semibold hover:bg-gray-50"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
      <AuthPromoPanel />
    </div>
  );
}
