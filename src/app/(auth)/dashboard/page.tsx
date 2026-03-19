import Link from "next/link";
import { deleteStack } from "@/features/stacks/actions";
import { getUserStacks } from "@/features/stacks/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { stacks, user } = await getUserStacks();

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-[14px] text-muted">
            {user?.display_name ?? user?.email ?? "Your account"}
          </p>
        </div>

        {/* Stacks list */}
        {stacks.length > 0 ? (
          <div className="space-y-4">
            {stacks.map((stack) => (
              <div
                key={stack.id}
                className="glass-card rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <Link
                      href={`/stacks/${stack.slug}`}
                      className="font-semibold text-[15px] hover:text-accent transition-colors truncate"
                    >
                      {stack.title}
                    </Link>
                    <span
                      className={`pill text-[10px] ${stack.is_public ? "pill-docs" : "pill-default"}`}
                    >
                      {stack.is_public ? "Public" : "Draft"}
                    </span>
                  </div>
                  {stack.description && (
                    <p className="text-[13px] text-muted truncate">
                      {stack.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span
                      className="text-[11px] text-subtle"
                      style={{ fontFamily: "var(--font-code)" }}
                    >
                      {stack.vote_count} upvotes
                    </span>
                    <span
                      className="text-[11px] text-subtle"
                      style={{ fontFamily: "var(--font-code)" }}
                    >
                      {new Date(stack.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/stacks/${stack.slug}`}
                    className="text-[12px] px-3 py-1.5 rounded-lg border border-border text-muted hover:border-border-hover transition-colors"
                  >
                    View
                  </Link>
                  <form>
                    <button
                      formAction={async () => {
                        "use server";
                        await deleteStack(stack.id);
                      }}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mx-auto mb-5">
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
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No stacks yet</h3>
            <p className="text-[14px] text-muted mb-6">
              Create your first stack and share it with the community.
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
