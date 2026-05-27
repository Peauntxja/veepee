import { SiteShell } from "@/components/layout/SiteShell";
import { PlpContent } from "@/components/catalog/CatalogContent";

type PlpPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function PlpPage({ params }: PlpPageProps) {
  const { category } = await params;

  return (
    <SiteShell>
      <PlpContent category={category} />
    </SiteShell>
  );
}
