import { SiteShell } from "@/components/layout/SiteShell";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountEmptyCard } from "@/components/account/AccountEmptyCard";

export default function MyAccountPage() {
  return (
    <SiteShell>
      <AccountShell title="Mon compte">
        <AccountEmptyCard
          seed="account"
          title="Votre espace membre"
          description="Consultez vos informations personnelles, adresses et moyens de paiement (données mockées en local)."
          ctaLabel="Modifier mes informations"
        />
      </AccountShell>
    </SiteShell>
  );
}
