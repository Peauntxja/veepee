import { SiteShell } from "@/components/layout/SiteShell";
import { ProductDetail } from "@/components/catalog/ProductDetail";

type PdpPageProps = {
  params: Promise<{ category: string; slug: string; id: string }>;
};

export default async function PdpPage({ params }: PdpPageProps) {
  const { category, id } = await params;

  return (
    <SiteShell>
      <ProductDetail productId={id} category={category} />
    </SiteShell>
  );
}
