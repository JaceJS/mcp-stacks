import Link from "next/link";

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

export interface StackCardData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  user: { display_name: string | null; username: string | null };
  servers: { name: string; category: string | null }[];
  vote_count: number;
}

export function StackCard({ stack }: { stack: StackCardData }) {
  return (
    <Link href={`/stacks/${stack.slug}`} className="block">
      <article className="glass-card flex h-full flex-col rounded-2xl p-6">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="pr-4 text-[16px] font-semibold leading-snug">
            {stack.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5 text-muted">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3L9.8 6.6L14 7.2L11 10L11.7 14L8 12.1L4.3 14L5 10L2 7.2L6.2 6.6L8 3Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-mono text-[12px]">{stack.vote_count}</span>
          </div>
        </div>

        <div className="mb-3 font-mono text-[12px] text-subtle">
          by {stack.user.display_name ?? stack.user.username ?? "anon"}
        </div>

        <p className="mb-5 flex-1 text-[13px] leading-relaxed text-muted">
          {stack.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {stack.servers.map((server) => (
            <span
              key={server.name}
              className={`pill ${getPillClass(server.category)}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              {server.name}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
