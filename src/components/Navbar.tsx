import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/UserMenu";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initials = user
    ? ((user.user_metadata?.full_name as string | undefined)
        ?.charAt(0)
        .toUpperCase() ??
      user.email?.charAt(0).toUpperCase() ??
      "?")
    : null;

  const { data: profile } = user
    ? await supabase
        .from("users")
        .select("avatar_url")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <nav className="nav-blur fixed left-0 right-0 top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-lg bg-transparent transition-shadow group-hover:shadow-[0_0_16px_var(--accent-glow-strong)]">
              <Image 
                src="/logo.svg" 
                alt="MCP Stacks Logo" 
                width={32} 
                height={32} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              MCP Stacks
            </span>
          </Link>
          <Link
            href="/explore"
            className="hidden text-sm font-semibold text-foreground-subtle transition-colors hover:text-accent min-[440px]:inline"
          >
            Browse
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {user ? (
            <UserMenu
              initials={initials!}
              avatarUrl={profile?.avatar_url ?? null}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-foreground-subtle transition-colors hover:text-accent min-[400px]:inline"
              >
                Sign in
              </Link>
              <Link
                href="/login?next=/stacks/new"
                className="btn-primary shrink-0 rounded-lg! px-3.5! py-2! text-sm font-semibold sm:px-5!"
              >
                <span className="sm:hidden">Share</span>
                <span className="hidden sm:inline">Share your stack</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
