import { SiteShell } from "@/components/layout/SiteShell";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountEmptyCard } from "@/components/account/AccountEmptyCard";

export default function ParrainagePage() {
  return (
    <SiteShell>
      <AccountShell title="Parrainage">
        <AccountEmptyCard
          seed="parrainage"
          title="Parrainez vos proches"
          description="Invitez vos amis sur Veepee et profitez d'avantages exclusifs lorsqu'ils passent leur première commande."
          ctaLabel="Inviter un ami"
        />
      </AccountShell>
    </SiteShell>
  );
}
