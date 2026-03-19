"use client";

import { useState } from "react";

type EditorKey = "claude" | "cursor" | "vscode" | "antigravity";

const editors: { key: EditorKey; label: string }[] = [
  { key: "vscode", label: "VS Code" },
  { key: "cursor", label: "Cursor" },
  { key: "claude", label: "Claude Desktop" },
  { key: "antigravity", label: "Antigravity" },
];

const configs: Record<EditorKey, { lines: TokenLine[] }> = {
  claude: {
    lines: [
      { tokens: [{ type: "comment", value: "// ~/Library/Application Support/Claude/claude_desktop_config.json" }] },
      { tokens: [{ type: "bracket", value: "{" }] },
      {
        tokens: [
          { type: "indent", value: "  " },
          { type: "key", value: '"mcpServers"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"context7"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@context7/mcp"' },
          { type: "plain", value: "]" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"supabase"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@supabase/mcp"' },
          { type: "plain", value: "]" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"brave-search"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@brave/mcp-search"' },
          { type: "plain", value: "]" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "  " },
          { type: "plain", value: "}" },
        ],
      },
      { tokens: [{ type: "bracket", value: "}" }] },
    ],
  },
  cursor: {
    lines: [
      { tokens: [{ type: "comment", value: "// ~/.cursor/mcp.json" }] },
      { tokens: [{ type: "bracket", value: "{" }] },
      {
        tokens: [
          { type: "indent", value: "  " },
          { type: "key", value: '"mcpServers"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"context7"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@context7/mcp"' },
          { type: "plain", value: "]" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"supabase"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@supabase/mcp"' },
          { type: "plain", value: "]" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "  " },
          { type: "plain", value: "}" },
        ],
      },
      { tokens: [{ type: "bracket", value: "}" }] },
    ],
  },
  vscode: {
    lines: [
      {
        tokens: [
          { type: "comment", value: "// .vscode/mcp.json" },
        ],
      },
      { tokens: [{ type: "bracket", value: "{" }] },
      {
        tokens: [
          { type: "indent", value: "  " },
          { type: "key", value: '"servers"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"context7"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@context7/mcp"' },
          { type: "plain", value: "]," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"type"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"stdio"' },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"supabase"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@supabase/mcp"' },
          { type: "plain", value: "]," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"type"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"stdio"' },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "  " },
          { type: "plain", value: "}" },
        ],
      },
      { tokens: [{ type: "bracket", value: "}" }] },
    ],
  },
  antigravity: {
    lines: [
      { tokens: [{ type: "comment", value: "// ~/.gemini/antigravity/mcp_config.json" }] },
      { tokens: [{ type: "bracket", value: "{" }] },
      {
        tokens: [
          { type: "indent", value: "  " },
          { type: "key", value: '"mcpServers"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"context7"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@context7/mcp"' },
          { type: "plain", value: "]" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "key", value: '"supabase"' },
          { type: "plain", value: ": {" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"command"' },
          { type: "plain", value: ": " },
          { type: "string", value: '"npx"' },
          { type: "plain", value: "," },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "      " },
          { type: "key", value: '"args"' },
          { type: "plain", value: ": [" },
          { type: "string", value: '"-y"' },
          { type: "plain", value: ", " },
          { type: "string", value: '"@supabase/mcp"' },
          { type: "plain", value: "]" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "    " },
          { type: "plain", value: "}" },
        ],
      },
      {
        tokens: [
          { type: "indent", value: "  " },
          { type: "plain", value: "}" },
        ],
      },
      { tokens: [{ type: "bracket", value: "}" }] },
    ],
  },
};

type TokenType =
  | "key"
  | "string"
  | "bracket"
  | "plain"
  | "indent"
  | "comment"
  | "number"
  | "bool";

interface Token {
  type: TokenType;
  value: string;
}

interface TokenLine {
  tokens: Token[];
}

const tokenClassMap: Record<TokenType, string> = {
  key: "token-key",
  string: "token-string",
  bracket: "token-bracket",
  plain: "",
  indent: "",
  comment: "token-comment",
  number: "token-number",
  bool: "token-bool",
};

export function ConfigPreview() {
  const [activeEditor, setActiveEditor] = useState<EditorKey>("vscode");
  const [copied, setCopied] = useState(false);

  const config = configs[activeEditor];

  function handleCopy() {
    const text = config.lines
      .map((line) => line.tokens.map((t) => t.value).join(""))
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="code-block animate-float">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border pl-2 pr-3">
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
          className="ml-2 shrink-0 cursor-pointer rounded border border-border bg-transparent px-2.5 py-1 font-mono text-[11px] text-muted transition-all hover:border-accent hover:text-accent"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <pre>
        <code>
          {config.lines.map((line, lineIdx) => (
            <div key={lineIdx} className="leading-7">
              {line.tokens.map((token, tokenIdx) => (
                <span key={tokenIdx} className={tokenClassMap[token.type]}>
                  {token.value}
                </span>
              ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
