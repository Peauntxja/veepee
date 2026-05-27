import { SiteShell } from "@/components/layout/SiteShell";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountEmptyCard } from "@/components/account/AccountEmptyCard";

export default function LeClubPage() {
  return (
    <SiteShell>
      <AccountShell title="Le Club">
        <AccountEmptyCard
          seed="le-club"
          title="Bienvenue au Club Veepee"
          description="Accédez à des ventes réservées aux membres les plus fidèles et cumulez des avantages."
          ctaLabel="Découvrir Le Club"
        />
      </AccountShell>
    </SiteShell>
  );
}
