import { NextResponse } from "next/server";
import {
  getApiProductsFromSnapshot,
  getCatalogTotalCount,
  getHubContent,
} from "@/lib/api/loadSnapshot";
import { getProductsByCategory } from "@/lib/mock/products";
import { getSalesByCategory } from "@/lib/mock/sales";

type RouteContext = {
  params: Promise<{ category: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { category } = await context.params;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "48");

  const hub = getHubContent(category);
  const sales = getSalesByCategory(category);
  const apiProducts = getApiProductsFromSnapshot().filter(
    (product) => product.categoryId === category,
  );
  const generatedProducts = getProductsByCategory(category);
  const products = [...apiProducts, ...generatedProducts].slice(0, page * pageSize);

  return NextResponse.json({
    meta: {
      category,
      hub,
      totalCount: getCatalogTotalCount(),
      page,
      pageSize,
    },
    sales,
    products,
  });
}
