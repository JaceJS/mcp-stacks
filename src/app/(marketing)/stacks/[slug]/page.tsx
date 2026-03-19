import { notFound } from "next/navigation";
import { VoteButton } from "@/features/votes/components/VoteButton";
import { ShareButton } from "@/features/stacks/components/ShareButton";
import { StackDetailConfig } from "@/features/stacks/components/StackDetailConfig";
import { getStack } from "@/features/stacks/queries";
import { buildEditorConfigs, getPillClass } from "@/features/stacks/utils";
import { SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stack = await getStack(slug);
  if (!stack) return { title: "Stack Not Found" };

  const description =
    stack.description?.slice(0, 160) ??
    `A curated MCP server stack with ${stack.servers.length} servers.`;

  return {
    title: stack.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/stacks/${stack.slug}`,
    },
    openGraph: {
      title: stack.title,
      description,
      url: `${SITE_URL}/stacks/${stack.slug}`,
      // Next.js will automatically inject the dynamic opengraph-image.tsx here
    },
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

  const configs = buildEditorConfigs(stack.servers);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: stack.title,
    description: stack.description ?? `A curated MCP server stack with ${stack.servers.length} servers.`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    author: {
      "@type": "Person",
      name: stack.user.display_name ?? stack.user.username ?? "anon",
    },
    aggregateRating: stack.vote_count > 0 ? {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: stack.vote_count,
    } : undefined,
  };

  return (
    <div className="px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <a
          href="/explore"
          className="inline-flex items-center gap-1.5 text-[13px] text-[--foreground-subtle] hover:text-[--foreground-muted] transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
              className="text-[13px] text-[--foreground-subtle]"
              style={{ fontFamily: "var(--font-code)" }}
            >
              by {stack.user.display_name ?? stack.user.username ?? "anon"}
            </span>
          </div>
          {stack.description && (
            <p className="text-[--foreground-muted] leading-relaxed max-w-2xl">
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
                <span
                  className={`pill ${getPillClass(server.category)} mt-0.5`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {server.category ?? "other"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px]">{server.name}</div>
                  {server.description && (
                    <p className="text-[12px] text-[--foreground-muted] mt-1 leading-relaxed">
                      {server.description}
                    </p>
                  )}
                  {server.npm_package && (
                    <code
                      className="text-[11px] text-[--foreground-subtle] mt-1 block"
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
        {stack.servers.some((s) => s.npm_package) && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Copy config</h2>
            <StackDetailConfig configs={configs} />
          </div>
        )}
      </div>
    </div>
  );
}
