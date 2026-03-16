import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="nav-blur fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center transition-shadow group-hover:shadow-[0_0_16px_var(--accent-glow-strong)]">
              <svg
                width="16"
                height="16"
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
            <span className="font-semibold text-[15px] tracking-tight">
              MCP Stacks
            </span>
          </Link>
          <Link
            href="/explore"
            className="text-[13px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Browse
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/stacks/new"
                className="btn-primary !py-2 !px-5 !text-[13px] !rounded-lg"
              >
                Share your stack
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[13px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/login?next=/stacks/new"
                className="btn-primary !py-2 !px-5 !text-[13px] !rounded-lg"
              >
                Share your stack
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
