import Link from "next/link";
import { ConfigPreview } from "@/components/ConfigPreview";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { StackCard } from "@/components/StackCard";
import { REPO_URL } from "@/lib/constants";
import { getFeaturedStacks } from "@/lib/queries/stacks";
import { getSiteStats } from "@/lib/queries/stats";

const steps = [
  {
    step: "01",
    title: "Browse by role",
    description:
      "Find stacks curated for your workflow, whether you're a full-stack dev, data engineer, or open-source maintainer.",
    delayClass: "delay-200",
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
    delayClass: "delay-400",
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
      "Publish your own stack for the community and help others skip the trial and error you already went through.",
    delayClass: "delay-600",
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
];

export default async function Home() {
  const [featuredStacks, stats] = await Promise.all([
    getFeaturedStacks(),
    getSiteStats(),
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grain-overlay" />
      <Navbar />

      <section className="relative px-6 pb-24 pt-40">
        <div className="hero-glow" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-border-accent bg-accent-glow px-4 py-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#4bff8d] animate-[pulse-glow-green_2.2s_ease-in-out_infinite]" />
            <span className="font-mono text-[12px] tracking-wide text-accent">
              10,000+ MCP servers exist. Which ones go together?
            </span>
          </div>

          <h1 className="animate-fade-up delay-100 mb-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Stop guessing.
            <br />
            <span className="text-gradient">Share your stack.</span>
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Discover community-curated MCP server combinations. Copy a
            production-ready config in one click and start building faster.
          </p>

          <div className="animate-fade-up delay-300 flex flex-col justify-center gap-4 sm:flex-row">
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

          <div className="animate-fade-up delay-400 mt-6 flex justify-center">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="github-star-btn"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
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

      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="divider mb-12" />
          <div className="grid grid-cols-2 gap-8">
            <div className="animate-fade-up delay-100 text-center">
              <div className="mb-1 font-mono text-3xl font-bold text-accent sm:text-4xl">
                {stats.stacks}
              </div>
              <div className="text-[13px] uppercase tracking-wide text-muted">
                Stacks shared
              </div>
            </div>
            <div className="animate-fade-up delay-200 text-center">
              <div className="mb-1 font-mono text-3xl font-bold text-accent sm:text-4xl">
                {stats.users}
              </div>
              <div className="text-[13px] uppercase tracking-wide text-muted">
                Developers
              </div>
            </div>
          </div>
          <div className="divider mt-12" />
        </div>
      </section>

      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="animate-fade-up mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured stacks
            </h2>
            <p className="animate-fade-up delay-100 mx-auto max-w-lg text-muted">
              Community-tested combinations that developers actually use in
              production.
            </p>
          </div>

          {featuredStacks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {featuredStacks.map((stack) => (
                <div key={stack.id} className="animate-fade-up delay-200">
                  <StackCard stack={stack} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-10">
              No stacks yet.{" "}
              <Link href="/stacks/new" className="text-accent hover:underline">
                Be the first to share yours.
              </Link>
            </p>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
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

      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="animate-fade-up mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="animate-fade-up delay-100 text-muted">
              Three steps to a better MCP setup.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className={`animate-fade-up ${item.delayClass} glass-card rounded-2xl p-7`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-accent bg-accent-glow text-accent">
                    {item.icon}
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="animate-fade-up mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
                One config.
                <br />
                <span className="text-gradient">Every editor.</span>
              </h2>
              <p className="animate-fade-up delay-100 mb-6 leading-relaxed text-muted">
                Every stack generates a config tailored to your editor. Copy,
                paste, and start using your new MCP servers immediately with no
                manual setup required.
              </p>
              <div className="animate-fade-up delay-200 flex flex-wrap gap-3">
                {["Claude Desktop", "Cursor", "Windsurf", "VS Code"].map((editor) => (
                  <span key={editor} className="pill pill-default text-[12px]">
                    {editor}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-fade-up delay-300">
              <ConfigPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass-card relative overflow-hidden rounded-3xl p-12 sm:p-16">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-accent-glow to-transparent opacity-50" />

            <div className="relative z-10">
              <h2 className="animate-fade-up mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Your stack could help
                <br />
                <span className="text-gradient">thousands.</span>
              </h2>
              <p className="animate-fade-up delay-100 mx-auto mb-8 max-w-md leading-relaxed text-muted">
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

      <Footer />
    </div>
  );
}
