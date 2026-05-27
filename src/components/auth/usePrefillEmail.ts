"use client";

import { useSearchParams } from "next/navigation";

export function usePrefillEmail(): string {
  const searchParams = useSearchParams();
  return searchParams.get("email")?.trim() ?? "";
}
