import Link from "next/link";
import { getUserStacks, PAGE_SIZE } from "@/features/stacks/queries";
import { DashboardStackCard } from "@/features/stacks/components/DashboardStackCard";
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
            Dashboard -{" "}
            <span className="text-accent">
              {user?.display_name ?? user?.email ?? "Your account"}
            </span>
          </h1>
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
                <DashboardStackCard key={stack.id} stack={stack} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              buildUrl={pageUrl}
              total={total}
              pageSize={PAGE_SIZE}
            />
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
                <h3 className="text-lg font-semibold mb-2">
                  No results for &ldquo;{q}&rdquo;
                </h3>
                <p className="text-[14px] text-foreground mb-6">
                  Try a different keyword.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No stacks yet</h3>
                <p className="text-[14px] text-foreground mb-6">
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
