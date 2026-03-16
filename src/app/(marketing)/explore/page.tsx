import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StackCard, type StackCardData } from "@/components/stack-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Stacks",
  description: "Browse community-curated MCP server combinations filtered by role and category.",
};

async function getStacks(tag?: string): Promise<StackCardData[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("stacks")
      .select("id, title, slug, description, user_id, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    // If tag filter is specified, join through stack_tags
    if (tag) {
      const { data: tagRow } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", tag)
        .single();

      if (tagRow) {
        const { data: stackIds } = await supabase
          .from("stack_tags")
          .select("stack_id")
          .eq("tag_id", tagRow.id);

        if (stackIds && stackIds.length > 0) {
          query = query.in("id", stackIds.map((s) => s.stack_id));
        } else {
          return [];
        }
      }
    }

    const { data: stacks } = await query;
    if (!stacks || stacks.length === 0) return [];

    const results = await Promise.all(
      stacks.map(async (stack) => {
        const [{ data: user }, { data: stackServers }, { count: voteCount }] =
          await Promise.all([
            supabase
              .from("users")
              .select("display_name, username")
              .eq("id", stack.user_id)
              .single(),
            supabase
              .from("stack_servers")
              .select("server_id, servers(name, category)")
              .eq("stack_id", stack.id)
              .order("position"),
            supabase
              .from("votes")
              .select("*", { count: "exact", head: true })
              .eq("stack_id", stack.id),
          ]);

        return {
          id: stack.id,
          title: stack.title,
          slug: stack.slug,
          description: stack.description,
          user: user ?? { display_name: "Anonymous", username: null },
          servers: (stackServers ?? []).map((ss: Record<string, unknown>) => {
            const server = ss.servers as { name: string; category: string | null } | null;
            return {
              name: server?.name ?? "Unknown",
              category: server?.category ?? null,
            };
          }),
          vote_count: voteCount ?? 0,
        };
      })
    );

    return results;
  } catch {
    return [];
  }
}

async function getTags() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tags").select("name, slug").order("name");
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const [stacks, tags] = await Promise.all([
    getStacks(params.tag),
    getTags(),
  ]);

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Explore stacks
          </h1>
          <p className="text-[var(--foreground-muted)] max-w-lg">
            Browse community-curated MCP server combinations. Find the right
            setup for your role.
          </p>
        </div>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stacks.map((stack) => (
              <StackCard key={stack.id} stack={stack} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-subtle)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No stacks yet</h3>
            <p className="text-[14px] text-[var(--foreground-muted)] mb-6">
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
