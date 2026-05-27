"use client";

import { useState } from "react";

const STORAGE_KEY = "veepee-cookie-consent";

function readCookieConsentVisible(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return !localStorage.getItem(STORAGE_KEY);
}

export function CookieConsent() {
  const [visible, setVisible] = useState(readCookieConsentVisible);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-veepee-border bg-white p-4 shadow-lg md:p-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs leading-relaxed text-veepee-muted md:max-w-3xl">
          Veepee utilise des cookies pour améliorer votre expérience, mesurer
          l&apos;audience et personnaliser les contenus. En continuant, vous
          acceptez leur utilisation.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            className="border border-veepee-border px-4 py-2 text-xs font-medium hover:bg-gray-50"
          >
            Personnaliser
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="bg-veepee-pink px-5 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
