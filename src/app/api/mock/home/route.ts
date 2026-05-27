import { NextResponse } from "next/server";
import { getHomePageMeta, getHomeSalesFromSnapshot } from "@/lib/api/loadSnapshot";

export async function GET() {
  const meta = getHomePageMeta();
  const operations = getHomeSalesFromSnapshot();

  return NextResponse.json({
    meta,
    operations,
  });
}
