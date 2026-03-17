import Link from "next/link";
import { signInWithOAuth } from "@/actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/dashboard";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <div className="grain-overlay" />
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[var(--bg-primary)]"
            >
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Welcome to MCP Stacks
            </h1>
            <p className="text-[14px] text-[var(--foreground-muted)]">
              Sign in with GitHub or Google to share and upvote stacks.
            </p>
          </div>

          <form className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <button
              formAction={async () => {
                "use server";
                await signInWithOAuth("github", next);
              }}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white text-[#0a0a0c] font-medium text-[14px] hover:bg-gray-100 transition-colors cursor-pointer border-none"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Continue with GitHub
            </button>

            <button
              formAction={async () => {
                "use server";
                await signInWithOAuth("google", next);
              }}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-[var(--border)] bg-transparent text-[var(--foreground)] font-medium text-[14px] hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M21.805 12.041c0-.818-.067-1.414-.211-2.033H12.2v3.71h5.514c-.111.922-.71 2.31-2.043 3.243l-.019.124 3.026 2.298.21.02c1.932-1.74 3.047-4.306 3.047-7.362"
                />
                <path
                  fill="#34A853"
                  d="M12.2 21.75c2.7 0 4.965-.87 6.62-2.348l-3.153-2.442c-.844.578-1.976.981-3.467.981-2.644 0-4.887-1.74-5.687-4.149l-.12.01-3.146 2.387-.041.113c1.643 3.176 5.01 5.448 8.994 5.448"
                />
                <path
                  fill="#FBBC05"
                  d="M6.513 13.792A5.74 5.74 0 016.18 12c0-.622.112-1.226.322-1.792l-.006-.12-3.185-2.425-.104.048A9.614 9.614 0 002.1 12c0 1.548.377 3.01 1.107 4.289z"
                />
                <path
                  fill="#EB4335"
                  d="M12.2 6.059c1.88 0 3.146.792 3.868 1.455l2.821-2.696C17.154 3.27 14.9 2.25 12.2 2.25c-3.984 0-7.351 2.272-8.994 5.448l3.295 2.497c.81-2.41 3.053-4.136 5.699-4.136"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-[12px] text-[var(--foreground-subtle)] mt-6">
            We only request your public profile. No spam, ever.
          </p>
        </div>

        <p className="text-center text-[12px] text-[var(--foreground-subtle)] mt-6">
          <Link href="/" className="hover:text-[var(--foreground-muted)] transition-colors">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
