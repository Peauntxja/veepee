"use client";

import { useState } from "react";
import { HeroHeader } from "@/components/layout/HeroHeader";
import { SideDrawer } from "@/components/layout/SideDrawer";
import { HomeContent } from "./HomeContent";

export function HeroHomeClient() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <HeroHeader onMenuClick={() => setDrawerOpen(true)} />
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <HomeContent />
    </>
  );
}

