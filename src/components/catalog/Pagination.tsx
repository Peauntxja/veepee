"use client";

type PaginationProps = {
  currentCount: number;
  totalCount: number;
  pageSize: number;
  hasMore: boolean;
  onLoadMore: () => void;
};

export function Pagination({
  currentCount,
  totalCount,
  pageSize,
  hasMore,
  onLoadMore,
}: PaginationProps) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 text-center">
      <p className="text-sm text-veepee-muted">
        {Math.min(currentCount, pageSize)} produits sur {totalCount.toLocaleString("fr-FR")}
      </p>
      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          className="border border-black px-8 py-3 text-sm font-semibold hover:bg-gray-50"
        >
          Voir les {pageSize} produits suivants
        </button>
      )}
    </div>
  );
}
