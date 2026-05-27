import { SiteShell } from "@/components/layout/SiteShell";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountEmptyCard } from "@/components/account/AccountEmptyCard";

export default function PreferencesPage() {
  return (
    <SiteShell>
      <AccountShell title="Préférences de communication">
        <AccountEmptyCard
          seed="preferences"
          title="Gérez vos préférences"
          description="Choisissez les e-mails et notifications que vous souhaitez recevoir de Veepee."
          ctaLabel="Enregistrer mes préférences"
        />
      </AccountShell>
    </SiteShell>
  );
}
