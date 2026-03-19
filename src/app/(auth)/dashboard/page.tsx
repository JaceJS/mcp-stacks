import Link from "next/link";
import { deleteStack } from "@/features/stacks/actions";
import { getUserStacks, PAGE_SIZE } from "@/features/stacks/queries";
import { Pagination } from "@/components/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim() || undefined;
  const { stacks, user, total } = await getUserStacks(page, q);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (p > 1) qs.set("page", String(p));
    const str = qs.toString();
    return `/dashboard${str ? `?${str}` : ""}`;
  }

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-[14px] text-muted">
            {user?.display_name ?? user?.email ?? "Your account"}
          </p>
        </div>

        {/* Search + New Stack */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <form method="GET" action="/dashboard" className="flex-1 max-w-md">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[--foreground-subtle] pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search your stacks…"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-[--border] bg-[--bg-secondary] text-[13px] text-[--foreground] placeholder:text-[--foreground-subtle] focus:outline-none focus:border-[--border-hover] transition-colors"
              />
            </div>
          </form>
          <Link href="/stacks/new" className="btn-primary shrink-0">
            New stack
          </Link>
        </div>

        {/* Stacks list */}
        {stacks.length > 0 ? (
          <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stacks.map((stack) => (
              <div
                key={stack.id}
                className="glass-card rounded-xl p-5 flex flex-col relative overflow-hidden"
              >
                {/* Left status accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl ${
                    stack.is_public ? "bg-[--accent]" : "bg-transparent"
                  }`}
                />

                {/* Title + Status badge */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <Link href={`/stacks/${stack.slug}`} className="group/title block">
                    <h3 className="font-semibold text-[15px] leading-snug group-hover/title:text-[--accent] transition-colors">
                      {stack.title}
                    </h3>
                  </Link>
                  <span className={`pill text-[10px] shrink-0 ${stack.is_public ? "pill-docs" : "pill-default"}`}>
                    {stack.is_public ? "Public" : "Draft"}
                  </span>
                </div>

                {/* Description */}
                {stack.description && (
                  <p className="text-[13px] text-muted line-clamp-2 flex-1 mb-4">
                    {stack.description}
                  </p>
                )}

                {/* Footer: metadata + actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono text-[11px] text-subtle">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 3L9.8 6.6L14 7.2L11 10L11.7 14L8 12.1L4.3 14L5 10L2 7.2L6.2 6.6L8 3Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {stack.vote_count}
                    </span>
                    <span className="font-mono text-[11px] text-subtle">
                      {new Date(stack.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/stacks/${stack.slug}`}
                      className="flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-lg border border-accent/25 text-accent/70 hover:border-accent hover:text-accent hover:bg-accent/8 transition-colors"
                    >
                      View
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      href={`/stacks/${stack.slug}/edit`}
                      className="flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-lg border border-yellow-500/30 text-yellow-400/60 hover:border-yellow-500/50 hover:text-yellow-400 hover:bg-yellow-500/8 transition-colors"
                    >
                      Edit
                    </Link>
                    <form>
                      <button
                        formAction={async () => {
                          "use server";
                          await deleteStack(stack.id);
                        }}
                        className="btn-delete text-[12px]"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} buildUrl={pageUrl} total={total} pageSize={PAGE_SIZE} />
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mx-auto mb-5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--foreground-subtle)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            {q ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No results for &ldquo;{q}&rdquo;</h3>
                <p className="text-[14px] text-muted mb-6">
                  Try a different keyword.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No stacks yet</h3>
                <p className="text-[14px] text-muted mb-6">
                  Create your first stack and share it with the community.
                </p>
                <Link href="/stacks/new" className="btn-primary">
                  Share your stack
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
