"use client";

import { useTransition } from "react";
import { toggleVote } from "@/features/votes/actions";

export function VoteButton({
  stackId,
  initialCount,
  hasVoted,
  isLoggedIn,
}: {
  stackId: string;
  initialCount: number;
  hasVoted: boolean;
  isLoggedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleVote() {
    if (!isLoggedIn) {
      window.location.href = `/login?next=/stacks/${stackId}`;
      return;
    }
    startTransition(() => {
      toggleVote(stackId);
    });
  }

  return (
    <button
      onClick={handleVote}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-[13px] font-medium transition-all duration-300 cursor-pointer ${
        hasVoted
          ? "border-accent bg-accent text-background shadow-[0_0_16px_var(--accent-glow-strong)]"
          : "border-accent/50 text-accent hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_16px_var(--accent-glow-strong)]"
      } ${isPending ? "opacity-50" : ""}`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill={hasVoted ? "currentColor" : "none"}>
        <path
          d="M8 3L9.8 6.6L14 7.2L11 10L11.7 14L8 12.1L4.3 14L5 10L2 7.2L6.2 6.6L8 3Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      {hasVoted ? "Upvoted" : "Upvote"} · {initialCount + (isPending ? (hasVoted ? -1 : 1) : 0)}
    </button>
  );
}
