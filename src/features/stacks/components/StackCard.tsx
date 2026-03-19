import Link from "next/link";
import { getPillClass } from "@/features/stacks/utils";
import type { StackCardData } from "@/features/stacks/types";

export function StackCard({ stack }: { stack: StackCardData }) {
  return (
    <Link href={`/stacks/${stack.slug}`} className="block group">
      <article className="glass-card flex h-full flex-col rounded-2xl p-6 bg-card transition-all duration-300 hover:bg-card-hover hover:scale-[1.02]">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="pr-4 text-[16px] font-semibold leading-snug text-accent">
            {stack.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5 text-foreground">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-amber-400">
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

        <div className="mb-3 font-mono text-[12px] text-foreground">
          by <span className="font-semibold text-white">{stack.user.display_name ?? stack.user.username ?? "anon"}</span>
        </div>

        <p className="mb-5 flex-1 text-[13px] leading-relaxed text-foreground">
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
