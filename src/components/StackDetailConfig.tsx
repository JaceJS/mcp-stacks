"use client";

import { useState } from "react";

type EditorKey = "claude" | "cursor" | "windsurf" | "vscode";

const editors: { key: EditorKey; label: string }[] = [
  { key: "claude", label: "Claude Desktop" },
  { key: "cursor", label: "Cursor" },
  { key: "windsurf", label: "Windsurf" },
  { key: "vscode", label: "VS Code" },
];

export function StackDetailConfig({
  configs,
}: {
  configs: Record<EditorKey, string>;
}) {
  const [activeEditor, setActiveEditor] = useState<EditorKey>("claude");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(configs[activeEditor]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="code-block">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-2">
        <div className="flex overflow-x-auto">
          {editors.map((editor) => (
            <button
              key={editor.key}
              onClick={() => setActiveEditor(editor.key)}
              className={`config-tab ${activeEditor === editor.key ? "active" : ""}`}
            >
              {editor.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="text-[12px] px-3 py-1.5 rounded-md text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all cursor-pointer border-none bg-transparent mr-2"
          style={{ fontFamily: "var(--font-code)" }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre style={{ fontFamily: "var(--font-code)", fontSize: 13, lineHeight: 1.7, padding: "20px 24px", overflow: "auto" }}>
        <code className="text-[var(--foreground-muted)]">
          {configs[activeEditor]}
        </code>
      </pre>
    </div>
  );
}
