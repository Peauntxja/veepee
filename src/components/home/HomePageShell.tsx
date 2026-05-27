"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { HeroHeader } from "@/components/layout/HeroHeader";
import { StandardHeader } from "@/components/layout/StandardHeader";
import { SideDrawer } from "@/components/layout/SideDrawer";
import { BackToTop } from "@/components/layout/BackToTop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useHomeHeaderScroll } from "@/components/layout/useHomeHeaderScroll";
import { getLocalImage } from "@/lib/assets/localImages";
import { HomeContent } from "./HomeContent";
import { HomeMemberContent } from "./HomeMemberContent";
import { HomeValueSections } from "./HomeValueSections";

export function HomePageShell() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrolled = useHomeHeaderScroll(72);

  const openDrawer = () => setDrawerOpen(true);

  return (
    <div className="min-h-screen bg-white">
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,opacity] duration-200 ${
          scrolled
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <StandardHeader onMenuClick={openDrawer} sticky={false} />
      </div>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <section className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(100vh,860px)]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${getLocalImage("home-jungle")})` }}
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-white via-white/85 to-transparent" />
        </div>

        <div className="relative">
          {!scrolled ? <HeroHeader onMenuClick={openDrawer} /> : null}
          {isAuthenticated ? <HomeMemberContent /> : <HomeContent />}
        </div>
      </section>

      {!isAuthenticated ? <HomeValueSections /> : null}
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
