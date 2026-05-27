"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { SafeImg } from "@/components/common/SafeImg";
import { searchCatalog } from "@/lib/mock/search";

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const results = useMemo(() => searchCatalog(query), [query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold">Recherche</h1>
      {query ? (
        <p className="mt-2 text-sm text-veepee-muted">
          Résultats pour « {query} » — {results.length} élément
          {results.length !== 1 ? "s" : ""}
        </p>
      ) : (
        <p className="mt-2 text-sm text-veepee-muted">
          Saisissez une marque ou un produit dans la barre de recherche.
        </p>
      )}

      {query && results.length === 0 && (
        <div className="mt-10 rounded border border-veepee-border bg-white p-10 text-center">
          <p className="text-sm text-veepee-muted">
            Aucun résultat trouvé. Essayez « GEOX », « NAZAR » ou « Dyson ».
          </p>
          <Link
            href="/gr/home"
            className="mt-6 inline-block bg-veepee-pink px-6 py-2 text-sm font-semibold text-white"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      )}

      <ul className="mt-8 divide-y divide-veepee-border rounded border border-veepee-border bg-white">
        {results.map((result) => (
          <li key={`${result.type}-${result.id}`}>
            <Link
              href={result.href}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50"
            >
              <SafeImg
                src={`/mock/image?seed=${encodeURIComponent(result.id)}&w=80&h=80&text=${encodeURIComponent(
                  result.subtitle.slice(0, 8),
                )}`}
                alt=""
                className="h-14 w-14 shrink-0 rounded object-cover"
              />
              <div>
                <p className="text-xs font-semibold uppercase text-veepee-pink">
                  {result.type === "sale" ? "Vente" : "Produit"}
                </p>
                <p className="font-semibold">{result.title}</p>
                <p className="text-sm text-veepee-muted">{result.subtitle}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
