import Link from "next/link";
import { deleteStack } from "@/features/stacks/actions";
import type { UserStack } from "@/features/stacks/types";

export function DashboardStackCard({ stack }: { stack: UserStack }) {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col relative overflow-hidden bg-card transition-all duration-300 hover:bg-card-hover hover:scale-[1.02] group">
      {/* Left status accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl ${
          stack.is_public ? "bg-[--accent]" : "bg-transparent"
        }`}
      />

      {/* Title + Status badge */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <Link href={`/stacks/${stack.slug}`} className="group/title block">
          <h3 className="font-semibold text-[15px] leading-snug text-accent">
            {stack.title}
          </h3>
        </Link>
        <span
          className={`pill text-[10px] shrink-0 ${stack.is_public ? "pill-docs" : "pill-default"}`}
        >
          {stack.is_public ? "Public" : "Draft"}
        </span>
      </div>

      {/* Description */}
      {stack.description && (
        <p className="text-[13px] text-foreground line-clamp-2 flex-1 mb-4">
          {stack.description}
        </p>
      )}

      {/* Footer: metadata + actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-[11px] text-foreground">
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              className="text-amber-400"
            >
              <path
                d="M8 3L9.8 6.6L14 7.2L11 10L11.7 14L8 12.1L4.3 14L5 10L2 7.2L6.2 6.6L8 3Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            {stack.vote_count}
          </span>
          <span className="font-mono text-[11px] text-foreground">
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
            className="flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent hover:text-black transition-colors font-semibold"
          >
            View
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href={`/stacks/${stack.slug}/edit`}
            className="flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-lg border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors font-semibold"
          >
            Edit
          </Link>
          <form>
            <button
              formAction={async () => {
                "use server";
                await deleteStack(stack.id);
              }}
              className="flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:cursor-pointer transition-colors font-semibold"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
