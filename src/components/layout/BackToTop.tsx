"use client";

export function BackToTop() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleScrollTop}
      className="fixed bottom-6 right-6 z-40 rounded-full border border-veepee-border bg-white px-4 py-2 text-sm font-medium shadow-md transition-colors hover:text-veepee-pink"
      aria-label="Retour en haut"
    >
      Retour en haut
    </button>
  );
}
