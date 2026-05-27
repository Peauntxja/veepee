import { SiteShell } from "@/components/layout/SiteShell";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountEmptyCard } from "@/components/account/AccountEmptyCard";

export default function MyOrdersPage() {
  return (
    <SiteShell>
      <AccountShell title="Mes commandes">
        <AccountEmptyCard
          seed="orders"
          title="Profitez de nombreux bons plans !"
          description="Les meilleures marques à tout petits prix ! Dès votre commande passée, elle apparaîtra sur cette page."
          ctaLabel={"Trouver l'inspiration"}
        />
      </AccountShell>
    </SiteShell>
  );
}
