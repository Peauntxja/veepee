"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isDemoCredentials, isValidEmail } from "@/lib/mock/users";

type AuthState = {
  isAuthenticated: boolean;
  email: string | null;
  registeredEmails: string[];
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      email: null,
      registeredEmails: [],

      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (isDemoCredentials(normalizedEmail, password)) {
          set({ isAuthenticated: true, email: normalizedEmail });
          return true;
        }
        if (
          get().registeredEmails.includes(normalizedEmail) &&
          password.length >= 6
        ) {
          set({ isAuthenticated: true, email: normalizedEmail });
          return true;
        }
        return false;
      },

      register: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
          return { success: false, error: "Adresse e-mail invalide." };
        }
        if (password.length < 6) {
          return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
        }
        const registeredEmails = get().registeredEmails.includes(normalizedEmail)
          ? get().registeredEmails
          : [...get().registeredEmails, normalizedEmail];
        set({
          isAuthenticated: true,
          email: normalizedEmail,
          registeredEmails,
        });
        return { success: true };
      },

      logout: () => set({ isAuthenticated: false, email: null }),
    }),
    { name: "veepee-auth" },
  ),
);
