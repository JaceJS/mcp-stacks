import Link from "next/link";
import { StackCard } from "@/features/stacks/components/StackCard";
import { getStacks, getTags, PAGE_SIZE } from "@/features/stacks/queries";
import { Pagination } from "@/components/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Stacks",
  description:
    "Browse community-curated MCP server combinations filtered by role and category.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim() || undefined;

  const [{ stacks, total }, tags] = await Promise.all([
    getStacks(params.tag, page, q),
    getTags(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const qs = new URLSearchParams();
    if (params.tag) qs.set("tag", params.tag);
    if (q) qs.set("q", q);
    if (p > 1) qs.set("page", String(p));
    const str = qs.toString();
    return `/explore${str ? `?${str}` : ""}`;
  }

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Explore stacks
          </h1>
          <p className="text-[--foreground-muted] max-w-lg">
            Browse community-curated MCP server combinations. Find the right
            setup for your role.
          </p>
        </div>

        {/* Search */}
        <form method="GET" action="/explore" className="mb-6">
          {params.tag && (
            <input type="hidden" name="tag" value={params.tag} />
          )}
          <div className="relative max-w-md">
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
              placeholder="Search stacks…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[--border] bg-[--bg-secondary] text-[13px] text-[--foreground] placeholder:text-[--foreground-subtle] focus:outline-none focus:border-[--border-hover] transition-colors"
            />
          </div>
        </form>

        {/* Tag filters */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <a
              href="/explore"
              className={`pill ${!params.tag ? "pill-docs" : "pill-default"}`}
            >
              All
            </a>
            {tags.map((tag) => (
              <a
                key={tag.slug}
                href={`/explore?tag=${tag.slug}`}
                className={`pill ${params.tag === tag.slug ? "pill-docs" : "pill-default"}`}
              >
                {tag.name}
              </a>
            ))}
          </div>
        )}

        {/* Stack grid */}
        {stacks.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stacks.map((stack) => (
                <StackCard key={stack.id} stack={stack} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} buildUrl={pageUrl} total={total} pageSize={PAGE_SIZE} />
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[--bg-tertiary] border border-[--border] flex items-center justify-center mx-auto mb-5">
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
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No stacks yet</h3>
            <p className="text-[14px] text-[--foreground-muted] mb-6">
              Be the first to share your MCP server combination.
            </p>
            <Link href="/stacks/new" className="btn-primary">
              Share your stack
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
