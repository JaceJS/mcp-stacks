import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ConfigPreview } from "@/components/ConfigPreview";
import { Footer } from "@/components/Footer";
import { REPO_URL } from "@/lib/constants";

/* ─── Category → pill class mapping ─────────────────────────────────────── */

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

/* ─── Mock featured stacks (fallback) ───────────────────────────────────── */

const mockStacks = [
  {
    id: "1",
    title: "Full-Stack AI Developer",
    slug: "full-stack-ai-dev",
    description:
      "Everything you need for AI-powered development. From context-aware docs to database management and code search.",
    user: { display_name: "Sarah Chen", username: "sarachen" },
    servers: [
      { name: "Context7", category: "docs" },
      { name: "Supabase", category: "database" },
      { name: "Brave Search", category: "search" },
      { name: "GitHub", category: "dev-tools" },
      { name: "Sentry", category: "monitoring" },
    ],
    vote_count: 342,
  },
  {
    id: "2",
    title: "Data Engineering Pipeline",
    slug: "data-engineering-pipeline",
    description:
      "Optimized for building and monitoring data pipelines. Query databases, search logs, and track pipeline health.",
    user: { display_name: "Marcus Rivera", username: "mrivera" },
    servers: [
      { name: "PostgreSQL", category: "database" },
      { name: "Elasticsearch", category: "search" },
      { name: "Grafana", category: "monitoring" },
      { name: "AWS", category: "cloud" },
    ],
    vote_count: 218,
  },
  {
    id: "3",
    title: "Open Source Maintainer",
    slug: "open-source-maintainer",
    description:
      "Stay on top of issues, docs, and community. Built for maintainers who juggle multiple repos and need fast context.",
    user: { display_name: "Aiko Tanaka", username: "aikot" },
    servers: [
      { name: "GitHub", category: "dev-tools" },
      { name: "Linear", category: "dev-tools" },
      { name: "Notion", category: "docs" },
      { name: "Slack", category: "monitoring" },
      { name: "Context7", category: "docs" },
    ],
    vote_count: 189,
  },
];

/* ─── Data fetching ─────────────────────────────────────────────────────── */

async function getFeaturedStacks() {
  try {
    const supabase = await createClient();
    const { data: stacks } = await supabase
      .from("stacks")
      .select("id, title, slug, description, user_id, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (!stacks || stacks.length === 0) return null;

    const stacksWithDetails = await Promise.all(
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
          ...stack,
          user: user ?? { display_name: "Anonymous", username: null },
          servers: (stackServers ?? []).map((ss: Record<string, unknown>) => {
            const server = ss.servers as {
              name: string;
              category: string | null;
            } | null;
            return {
              name: server?.name ?? "Unknown",
              category: server?.category ?? null,
            };
          }),
          vote_count: voteCount ?? 0,
        };
      }),
    );

    return stacksWithDetails;
  } catch {
    return null;
  }
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default async function Home() {
  const dbStacks = await getFeaturedStacks();
  const featuredStacks = dbStacks ?? mockStacks;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* ─── Navbar ──────────────────────────────────────────────────── */}
      <nav className="nav-blur fixed top-0 left-0 right-0 z-50 border-b border-(--border)">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-(--accent) flex items-center justify-center transition-shadow group-hover:shadow-[0_0_16px_var(--accent-glow-strong)]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-(--bg-primary)"
                >
                  <rect
                    x="1"
                    y="1"
                    width="6"
                    height="6"
                    rx="1.5"
                    fill="currentColor"
                  />
                  <rect
                    x="9"
                    y="1"
                    width="6"
                    height="6"
                    rx="1.5"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <rect
                    x="1"
                    y="9"
                    width="6"
                    height="6"
                    rx="1.5"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <rect
                    x="9"
                    y="9"
                    width="6"
                    height="6"
                    rx="1.5"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </svg>
              </div>
              <span className="font-semibold text-[15px] tracking-tight">
                MCP Stacks
              </span>
            </Link>
            <Link
              href="/explore"
              className="text-[13px] text-[--foreground-muted] hover:text-[--foreground] transition-colors"
            >
              Browse
            </Link>
          </div>
          <Link
            href="/stacks/new"
            className="btn-primary py-2! px-5! text-[13px]! rounded-lg!"
          >
            Share your stack
          </Link>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="hero-glow" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[--border-accent] bg-[--accent-glow] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[--accent] animate-[pulse-glow_3s_ease-in-out_infinite]" />
            <span
              className="text-[12px] tracking-wide text-[--accent]"
              style={{ fontFamily: "var--(--font-code)" }}
            >
              10,000+ MCP servers exist. Which ones go together?
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Stop guessing.
            <br />
            <span className="text-gradient">Share your stack.</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 text-lg sm:text-xl text-[--foreground-muted] max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover community-curated MCP server combinations. Copy a
            production-ready config in one click and start building faster.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 2L6 14M10 2L10 14M2 6H14M2 10H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Browse stacks
            </Link>
            <Link href="/stacks/new" className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3V13M3 8H13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Share your stack
            </Link>
          </div>

          {/* GitHub star */}
          <div className="animate-fade-up delay-400 flex justify-center mt-6">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="github-star-btn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span className="github-star-divider" />
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="text-amber-300"
              >
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ─── Stats Row ───────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="divider mb-12" />
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "0", label: "Stacks shared" },
              { value: "0", label: "Configs copied" },
              { value: "0", label: "Developers" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-fade-up text-center delay-${(i + 1) * 100}`}
              >
                <div
                  className="text-3xl sm:text-4xl font-bold text-[--accent] mb-1"
                  style={{ fontFamily: "var(--font-code)" }}
                >
                  {stat.value}
                </div>
                <div className="text-[13px] text-[--foreground-muted] tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="divider mt-12" />
        </div>
      </section>

      {/* ─── Featured Stacks ─────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="animate-fade-up text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Featured stacks
            </h2>
            <p className="animate-fade-up delay-100 text-[--foreground-muted] max-w-lg mx-auto">
              Community-tested combinations that developers actually use in
              production.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredStacks.map((stack, i) => (
              <article
                key={stack.id}
                className={`animate-fade-up delay-${(i + 1) * 200} glass-card rounded-2xl p-6 flex flex-col`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-[16px] leading-snug pr-4">
                    {stack.title}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0 text-[--foreground-muted]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 3L9.8 6.6L14 7.2L11 10L11.7 14L8 12.1L4.3 14L5 10L2 7.2L6.2 6.6L8 3Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className="text-[12px]"
                      style={{ fontFamily: "var(--font-code)" }}
                    >
                      {stack.vote_count}
                    </span>
                  </div>
                </div>

                {/* Author */}
                <div
                  className="text-[12px] text-[--foreground-subtle] mb-3"
                  style={{ fontFamily: "var(--font-code)" }}
                >
                  by {stack.user.display_name ?? stack.user.username ?? "anon"}
                </div>

                {/* Description */}
                <p className="text-[13px] text-[--foreground-muted] leading-relaxed mb-5 flex-1">
                  {stack.description}
                </p>

                {/* Server pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {stack.servers.map((server) => (
                    <span
                      key={server.name}
                      className={`pill ${getPillClass(server.category)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                      {server.name}
                    </span>
                  ))}
                </div>

                {/* Copy config */}
                <button className="w-full py-2.5 rounded-lg border border-[--border] text-[13px] text-[--foreground-muted] hover:text-[--accent] hover:border-[--border-accent] hover:bg-[--accent-glow] transition-all cursor-pointer flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="5"
                      y="5"
                      width="9"
                      height="9"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M11 5V3.5C11 2.67 10.33 2 9.5 2H3.5C2.67 2 2 2.67 2 3.5V9.5C2 10.33 2.67 11 3.5 11H5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  Copy config
                </button>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-[14px] text-[--foreground-muted] hover:text-[--accent] transition-colors"
            >
              View all stacks
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="animate-fade-up text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How it works
            </h2>
            <p className="animate-fade-up delay-100 text-[--foreground-muted]">
              Three steps to a better MCP setup.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Browse by role",
                description:
                  "Find stacks curated for your workflow — whether you're a full-stack dev, data engineer, or open-source maintainer.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Copy the config",
                description:
                  "One click generates a ready-to-paste config for Claude Desktop, Cursor, Windsurf, or VS Code.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="8" y="8" width="12" height="12" rx="2" />
                    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Share yours",
                description:
                  "Publish your own stack for the community. Help others skip the trial and error you went through.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                ),
              },
            ].map((card, i) => (
              <div
                key={card.step}
                className={`animate-fade-up delay-${(i + 1) * 200} glass-card rounded-2xl p-7`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[--accent-glow] border border-[--border-accent] flex items-center justify-center text-[--accent]">
                    {card.icon}
                  </div>
                  <span
                    className="text-[11px] text-[--foreground-subtle] tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-code)" }}
                  >
                    Step {card.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-[14px] text-[--foreground-muted] leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Config Preview ──────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="animate-fade-up text-3xl sm:text-4xl font-bold tracking-tight mb-5">
                One config.
                <br />
                <span className="text-gradient">Every editor.</span>
              </h2>
              <p className="animate-fade-up delay-100 text-[--foreground-muted] leading-relaxed mb-6">
                Every stack generates a config tailored to your editor. Copy,
                paste, and start using your new MCP servers immediately — no
                manual setup required.
              </p>
              <div className="animate-fade-up delay-200 flex flex-wrap gap-3">
                {["Claude Desktop", "Cursor", "Windsurf", "VS Code"].map(
                  (editor) => (
                    <span
                      key={editor}
                      className="pill pill-default text-[12px]!"
                    >
                      {editor}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div className="animate-fade-up delay-300">
              <ConfigPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass-card rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-linear-to-br from-[--accent-glow] to-transparent opacity-50 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="animate-fade-up text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Your stack could help
                <br />
                <span className="text-gradient">thousands.</span>
              </h2>
              <p className="animate-fade-up delay-100 text-(--foreground-muted) max-w-md mx-auto mb-8 leading-relaxed">
                Share the MCP server combination that powers your workflow.
                Every stack published helps another developer skip the guessing
                game.
              </p>
              <div className="animate-fade-up delay-200">
                <Link href="/stacks/new" className="btn-primary">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 3V13M3 8H13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Share your stack
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
