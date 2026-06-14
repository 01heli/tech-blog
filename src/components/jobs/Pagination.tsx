import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentParams: URLSearchParams;
}

export function Pagination({
  currentPage,
  totalPages,
  currentParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number): string => {
    const params = new URLSearchParams(currentParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return `/jobs${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10 pt-8 border-t border-border">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
        >
          ← 上一页
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`w-9 h-9 rounded-lg text-sm flex items-center justify-center transition-colors ${
            page === currentPage
              ? 'bg-foreground text-background font-medium'
              : 'border border-border hover:bg-secondary'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
        >
          下一页 →
        </Link>
      )}
    </div>
  );
}
