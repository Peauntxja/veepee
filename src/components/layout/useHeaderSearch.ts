"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function useHeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submitSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/gr/search?q=${encodeURIComponent(trimmed)}`);
  }, [query, router]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        submitSearch();
      }
    },
    [submitSearch],
  );

  return { query, setQuery, submitSearch, handleKeyDown };
}
