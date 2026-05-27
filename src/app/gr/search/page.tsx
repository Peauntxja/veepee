import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SearchContent } from "@/components/search/SearchContent";

export default function SearchPage() {
  return (
    <SiteShell>
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-veepee-muted">
            Chargement…
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </SiteShell>
  );
}
