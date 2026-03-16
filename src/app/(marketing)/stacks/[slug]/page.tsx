import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VoteButton } from "@/components/vote-button";
import { ShareButton } from "@/components/share-button";
import { StackDetailConfig } from "@/components/stack-detail-config";
import type { Metadata } from "next";

const categoryClass: Record<string, string> = {
  docs: "pill-docs",
  documentation: "pill-docs",
  dev: "pill-dev",
  "dev-tools": "pill-dev",
  "dev tools": "pill-dev",
  development: "pill-dev",
  database: "pill-database",
  db: "pill-database",
  search: "pill-search",
  monitoring: "pill-monitoring",
  observability: "pill-monitoring",
  ai: "pill-ai",
  cloud: "pill-cloud",
  infrastructure: "pill-cloud",
};

function getPillClass(category: string | null) {
  if (!category) return "pill-default";
  return categoryClass[category.toLowerCase()] ?? "pill-default";
}

interface Server {
  name: string;
  slug: string;
  category: string | null;
  npm_package: string | null;
  description: string | null;
}

async function getStack(slug: string) {
  try {
    const supabase = await createClient();

    const { data: stack } = await supabase
      .from("stacks")
      .select("*")
      .eq("slug", slug)
      .eq("is_public", true)
      .single();

    if (!stack) return null;

    const [{ data: user }, { data: stackServers }, { count: voteCount }, { data: currentUser }] =
      await Promise.all([
        supabase
          .from("users")
          .select("display_name, username, avatar_url")
          .eq("id", stack.user_id)
          .single(),
        supabase
          .from("stack_servers")
          .select("server_id, servers(name, slug, category, npm_package, description)")
          .eq("stack_id", stack.id)
          .order("position"),
        supabase
          .from("votes")
          .select("*", { count: "exact", head: true })
          .eq("stack_id", stack.id),
        supabase.auth.getUser().then(({ data }) => ({ data: data.user })),
      ]);

    let hasVoted = false;
    if (currentUser) {
      const { data: vote } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", currentUser.id)
        .eq("stack_id", stack.id)
        .single();
      hasVoted = !!vote;
    }

    const servers: Server[] = (stackServers ?? []).map((ss: Record<string, unknown>) => {
      const server = ss.servers as {
        name: string;
        slug: string;
        category: string | null;
        npm_package: string | null;
        description: string | null;
      } | null;
      return {
        name: server?.name ?? "Unknown",
        slug: server?.slug ?? "",
        category: server?.category ?? null,
        npm_package: server?.npm_package ?? null,
        description: server?.description ?? null,
      };
    });

    return {
      ...stack,
      user: user ?? { display_name: "Anonymous", username: null, avatar_url: null },
      servers,
      vote_count: voteCount ?? 0,
      has_voted: hasVoted,
      is_logged_in: !!currentUser,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stack = await getStack(slug);
  if (!stack) return { title: "Stack Not Found" };

  return {
    title: stack.title,
    description: stack.description ?? `A curated MCP server stack with ${stack.servers.length} servers.`,
  };
}

export default async function StackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stack = await getStack(slug);
  if (!stack) notFound();

  // Build config JSON for each editor
  const serverConfigs: Record<string, Record<string, unknown>> = {};
  for (const server of stack.servers) {
    if (server.npm_package) {
      serverConfigs[server.slug || server.name.toLowerCase().replace(/\s+/g, "-")] = {
        command: "npx",
        args: [server.npm_package],
      };
    }
  }

  const configs = {
    claude: JSON.stringify({ mcpServers: serverConfigs }, null, 2),
    cursor: JSON.stringify(
      {
        mcpServers: Object.fromEntries(
          Object.entries(serverConfigs).map(([k, v]) => [k, { ...v, enabled: true }])
        ),
      },
      null,
      2
    ),
    windsurf: JSON.stringify(
      {
        mcpServers: Object.fromEntries(
          Object.entries(serverConfigs).map(([k, v]) => {
            const args = (v.args as string[]) ?? [];
            return [k, { serverUrl: `npx ${args[0] ?? ""}`.trim() }];
          })
        ),
      },
      null,
      2
    ),
    vscode: JSON.stringify(
      {
        "mcp.servers": serverConfigs,
      },
      null,
      2
    ),
  };

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <a
          href="/explore"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to stacks
        </a>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {stack.title}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-[13px] text-[var(--foreground-subtle)]"
              style={{ fontFamily: "var(--font-code)" }}
            >
              by {stack.user.display_name ?? stack.user.username ?? "anon"}
            </span>
          </div>
          {stack.description && (
            <p className="text-[var(--foreground-muted)] leading-relaxed max-w-2xl">
              {stack.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <VoteButton
            stackId={stack.id}
            initialCount={stack.vote_count}
            hasVoted={stack.has_voted}
            isLoggedIn={stack.is_logged_in}
          />
          <ShareButton slug={stack.slug} title={stack.title} />
        </div>

        {/* Servers */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Servers in this stack</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {stack.servers.map((server) => (
              <div
                key={server.name}
                className="glass-card rounded-xl p-4 flex items-start gap-3"
              >
                <span className={`pill ${getPillClass(server.category)} mt-0.5`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {server.category ?? "other"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px]">{server.name}</div>
                  {server.description && (
                    <p className="text-[12px] text-[var(--foreground-muted)] mt-1 leading-relaxed">
                      {server.description}
                    </p>
                  )}
                  {server.npm_package && (
                    <code
                      className="text-[11px] text-[var(--foreground-subtle)] mt-1 block"
                      style={{ fontFamily: "var(--font-code)" }}
                    >
                      {server.npm_package}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Config preview */}
        {Object.keys(serverConfigs).length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Copy config</h2>
            <StackDetailConfig configs={configs} />
          </div>
        )}
      </div>
    </div>
  );
}
