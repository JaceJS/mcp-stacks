import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="nav-blur fixed left-0 right-0 top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent transition-shadow group-hover:shadow-[0_0_16px_var(--accent-glow-strong)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-background"
              >
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.3" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              MCP Stacks
            </span>
          </Link>
          <Link
            href="/explore"
            className="text-[13px] text-muted transition-colors hover:text-foreground"
          >
            Browse
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] text-muted transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/stacks/new"
                className="btn-primary !rounded-lg !px-5 !py-2 !text-[13px]"
              >
                Share your stack
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[13px] text-muted transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/auth/login?next=/stacks/new"
                className="btn-primary !rounded-lg !px-5 !py-2 !text-[13px]"
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
