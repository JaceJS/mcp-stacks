"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/features/auth/actions";

export function UserMenu({
  initials,
  avatarUrl,
}: {
  initials: string;
  avatarUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20
                   text-sm font-semibold text-accent hover:bg-accent/30 transition-colors overflow-hidden hover:cursor-pointer"
      >
        {avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={avatarUrl}
            alt={initials}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 min-w-[160px] rounded-xl border border-border
                     bg-surface-elevated p-1 shadow-lg"
        >
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-[13px] text-foreground-subtle hover:bg-accent/10
                       hover:text-accent transition-colors"
          >
            Dashboard
          </Link>
          <div className="my-1 border-t border-border" />
          <form>
            <button
              formAction={signOut}
              className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-red-400
                         hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer
                         bg-transparent border-none"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
