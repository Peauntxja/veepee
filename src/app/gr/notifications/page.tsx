import { SiteShell } from "@/components/layout/SiteShell";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountEmptyCard } from "@/components/account/AccountEmptyCard";

export default function NotificationsPage() {
  return (
    <SiteShell>
      <AccountShell title="Notifications">
        <AccountEmptyCard
          seed="notifications"
          title="Aucune notification pour le moment"
          description="Vous serez informé ici des nouvelles ventes, offres exclusives et mises à jour de commande."
          ctaLabel="Découvrir les ventes"
        />
      </AccountShell>
    </SiteShell>
  );
}
