"use client";

import { useState } from "react";
import { SiteFooter } from "./SiteFooter";
import { BackToTop } from "./BackToTop";
import { StandardHeader } from "./StandardHeader";
import { SideDrawer } from "./SideDrawer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <StandardHeader onMenuClick={() => setDrawerOpen(true)} />
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
