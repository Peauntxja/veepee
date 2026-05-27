import { SiteShell } from "@/components/layout/SiteShell";
import { HubContent } from "@/components/catalog/CatalogContent";

type HubPageProps = {
  params: Promise<{ category: string }>;
};

export default async function HubPage({ params }: HubPageProps) {
  const { category } = await params;

  return (
    <SiteShell>
      <HubContent category={category} />
    </SiteShell>
  );
}
