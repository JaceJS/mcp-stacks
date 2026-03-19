interface PaginationProps {
  page: number;
  totalPages: number;
  buildUrl: (page: number) => string;
  total?: number;
  pageSize?: number;
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];

  const left = current - 1;
  const right = current + 1;

  // Gap between 1 and left neighbor
  if (left > 2) {
    pages.push("…");
  } else if (left === 2) {
    pages.push(2);
  }

  // Window around current
  if (left > 1) pages.push(left);
  if (current !== 1 && current !== total) pages.push(current);
  if (right < total) pages.push(right);

  // Gap between right neighbor and last
  if (right < total - 1) {
    pages.push("…");
  } else if (right === total - 1) {
    pages.push(total - 1);
  }

  pages.push(total);

  return pages;
}

export function Pagination({ page, totalPages, buildUrl, total, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  const navBase =
    "px-3 h-9 rounded-lg border border-[--border] text-[13px] text-[--foreground-muted] flex items-center gap-1.5 transition-colors";
  const navActive = `${navBase} hover:border-[--border-hover] hover:text-[--foreground]`;
  const navDisabled = `${navBase} opacity-30 pointer-events-none`;

  const from = total && pageSize ? (page - 1) * pageSize + 1 : null;
  const to = total && pageSize ? Math.min(page * pageSize, total) : null;

  return (
    <div className="flex flex-col items-center gap-3 mt-12">
      {total != null && pageSize != null && from != null && to != null && (
        <p className="font-mono text-[12px] text-subtle">
          Showing {from}–{to} of {total}
        </p>
      )}
      <div className="flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <a href={buildUrl(page - 1)} className={navActive}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </a>
      ) : (
        <span className={navDisabled}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </span>
      )}

      {pageNumbers.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-[--foreground-subtle] text-[13px]"
          >
            …
          </span>
        ) : p === page ? (
          <span key={p} className="pagination-active">
            {p}
          </span>
        ) : (
          <a
            key={p}
            href={buildUrl(p)}
            className="w-9 h-9 rounded-lg border border-[--border] font-mono text-[13px] text-[--foreground-muted] hover:border-[--border-hover] hover:text-[--foreground] transition-colors flex items-center justify-center"
          >
            {p}
          </a>
        )
      )}

      {page < totalPages ? (
        <a href={buildUrl(page + 1)} className={navActive}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>
      ) : (
        <span className={navDisabled}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
      </div>
    </div>
  );
}
