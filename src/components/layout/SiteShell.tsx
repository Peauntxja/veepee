import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BackToTop } from "./BackToTop";
import { MobileCategoryMenu } from "./CategoryTabs";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <MobileCategoryMenu />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
