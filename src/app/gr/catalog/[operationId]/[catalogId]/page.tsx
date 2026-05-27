import { SiteShell } from "@/components/layout/SiteShell";
import { SaleRoomContent } from "@/components/catalog/SaleRoomContent";

type SaleRoomPageProps = {
  params: Promise<{ operationId: string; catalogId: string }>;
};

export default async function SaleRoomPage({ params }: SaleRoomPageProps) {
  const { operationId, catalogId } = await params;

  return (
    <SiteShell>
      <SaleRoomContent operationId={operationId} catalogId={catalogId} />
    </SiteShell>
  );
}
