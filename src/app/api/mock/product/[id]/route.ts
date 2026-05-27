import { NextResponse } from "next/server";
import { getApiProductsFromSnapshot } from "@/lib/api/loadSnapshot";
import { getProductById } from "@/lib/mock/products";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  const apiSource = getApiProductsFromSnapshot().find((item) => item.id === id);

  return NextResponse.json({
    product,
    apiSource: apiSource ? { fromSnapshot: true } : null,
  });
}
