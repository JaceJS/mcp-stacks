"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/constants";

export function ShareButton({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/stacks/${slug}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/50 text-[13px] text-foreground hover:border-white hover:text-foreground transition-all cursor-pointer bg-transparent">
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M6.5 9.5L9.5 6.5" strokeLinecap="round" />
          <path d="M9 10l1.5 1.5a2.12 2.12 0 003 0l0 0a2.12 2.12 0 000-3L12 7" />
          <path d="M7 6L5.5 4.5a2.12 2.12 0 00-3 0l0 0a2.12 2.12 0 000 3L4 9" />
        </svg>
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/50 text-[13px] text-foreground hover:border-white hover:text-foreground transition-all cursor-pointer bg-transparent">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9.294 6.928L14.357 1h-1.2L8.762 6.147 5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.75 15h4.05L9.294 6.928zM7.593 8.93l-.538-.776L2.864 1.91h1.843l3.455 4.977.538.776 4.493 6.475h-1.843L7.593 8.93z" />
        </svg>
      </button>
    </div>
  );
}
