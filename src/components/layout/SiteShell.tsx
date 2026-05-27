import { SiteFooter } from "./SiteFooter";
import { BackToTop } from "./BackToTop";
import { StandardHeader } from "./StandardHeader";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StandardHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
