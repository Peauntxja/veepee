"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { HeroHeader } from "@/components/layout/HeroHeader";
import { SideDrawer } from "@/components/layout/SideDrawer";
import { BackToTop } from "@/components/layout/BackToTop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getLocalImage } from "@/lib/assets/localImages";
import { HomeContent } from "./HomeContent";
import { HomeMemberContent } from "./HomeMemberContent";
import { HomeValueSections } from "./HomeValueSections";

export function HomePageShell() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#2a4a2a]">
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${getLocalImage("home-jungle")})` }}
      />
      <div className="pointer-events-none fixed inset-0 bg-black/10" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-white via-white/85 to-transparent" />
      <div className="relative min-h-screen">
        <HeroHeader onMenuClick={() => setDrawerOpen(true)} />
        <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        {isAuthenticated ? <HomeMemberContent /> : <HomeContent />}
        {!isAuthenticated ? <HomeValueSections /> : null}
        <SiteFooter />
        <BackToTop />
      </div>
    </div>
  );
}
