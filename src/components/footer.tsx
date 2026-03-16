import Link from "next/link";
import { REPO_URL, AUTHOR } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-(--border)">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-(--accent) flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                className="text-(--bg-primary)"
              >
                <rect
                  x="1"
                  y="1"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  x="9"
                  y="1"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="currentColor"
                  opacity="0.6"
                />
                <rect
                  x="1"
                  y="9"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="currentColor"
                  opacity="0.6"
                />
                <rect
                  x="9"
                  y="9"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="currentColor"
                  opacity="0.3"
                />
              </svg>
            </div>
            <span className="text-[13px] text-(--foreground-muted)">
              MCP Stacks
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/explore"
              className="text-[13px] text-(--foreground-subtle) hover:text-(--foreground-muted) transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/stacks/new"
              className="text-[13px] text-(--foreground-subtle) hover:text-(--foreground-muted) transition-colors"
            >
              Share
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-(--foreground-subtle) hover:text-(--foreground-muted) transition-colors inline-flex items-center gap-1.5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-3">
            <p
              className="text-[11px] text-(--foreground-subtle)"
              style={{ fontFamily: "var(--font-code)" }}
            >
              Built by{" "}
              <a
                href={AUTHOR.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--foreground-muted) hover:text-(--accent) transition-colors"
              >
                {AUTHOR.name}
              </a>
            </p>
            <span className="text-(--foreground-subtle)">·</span>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-(--foreground-subtle) hover:text-(--accent) transition-colors"
              style={{ fontFamily: "var(--font-code)" }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
