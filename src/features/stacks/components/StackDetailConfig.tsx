"use client";

import { useState } from "react";

type EditorKey = "claude" | "cursor" | "vscode" | "antigravity";

const editors: { key: EditorKey; label: string }[] = [
  { key: "vscode", label: "VS Code" },
  { key: "cursor", label: "Cursor" },
  { key: "claude", label: "Claude Desktop" },
  { key: "antigravity", label: "Antigravity" },
];

export function StackDetailConfig({
  configs,
}: {
  configs: Record<EditorKey, string>;
}) {
  const [activeEditor, setActiveEditor] = useState<EditorKey>("vscode");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(configs[activeEditor]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="code-block">
      <div className="relative border-b border-border pl-2 pr-20">
        <div className="flex flex-wrap">
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
          className="absolute right-3 top-2 shrink-0 cursor-pointer rounded border border-border bg-transparent px-2.5 py-1 font-mono text-[11px] text-muted transition-all hover:border-accent hover:text-accent"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        className="font-mono overflow-x-hidden whitespace-pre-wrap break-all px-6 py-5"
        style={{ fontSize: 13, lineHeight: 1.7 }}
      >
        <code>
          {configs[activeEditor].split("\n").map((line, i) => {
            if (line.trim().startsWith("//")) {
              return (
                <div key={i} className="leading-7">
                  <span className="token-comment">{line}</span>
                </div>
              );
            }

            const html = line
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/("[^"]*")\s*:/g, '<span class="token-key">$1</span>:')
              .replace(/:\s*("[^"]*")/g, ': <span class="token-string">$1</span>')
              .replace(/:\s*(\b\d+\b)/g, ': <span class="token-number">$1</span>')
              .replace(/:\s*(\btrue\b|\bfalse\b|\bnull\b)/g, ': <span class="token-bool">$1</span>')
              .replace(/([\{\}\[\]])/g, '<span class="token-bracket">$1</span>');

            return (
              <div
                key={i}
                className="leading-7"
                dangerouslySetInnerHTML={{ __html: html || " " }}
              />
            );
          })}
        </code>
      </pre>
    </div>
  );
}
