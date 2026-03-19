import { slugify } from "@/lib/utils";
import type { EditorConfigs } from "./types";

export function getPillClass(category: string | null): string {
  if (!category) return "pill-default";
  const cat = category.toLowerCase();

  if (cat.includes("doc") || cat.includes("wiki")) return "pill-docs";
  if (cat.includes("data") || cat.includes("db") || cat.includes("sql")) return "pill-database";
  if (cat.includes("search")) return "pill-search";
  if (cat.includes("monitor") || cat.includes("observ") || cat.includes("log") || cat.includes("error")) return "pill-monitoring";
  if (cat.includes("ai") || cat.includes("llm") || cat.includes("model") || cat.includes("machine learning")) return "pill-ai";
  if (cat.includes("cloud") || cat.includes("infra") || cat.includes("deploy") || cat.includes("host")) return "pill-cloud";
  if (cat.includes("dev") || cat.includes("tool") || cat.includes("code") || cat.includes("test")) return "pill-dev";

  return "pill-default";
}

type ServerForConfig = {
  slug: string;
  name: string;
  npm_package: string | null;
};

export function buildEditorConfigs(servers: ServerForConfig[]): EditorConfigs {
  const mcpServers: Record<string, Record<string, unknown>> = {};

  for (const server of servers) {
    if (!server.npm_package) continue;
    const key = server.slug || slugify(server.name);
    mcpServers[key] = { command: "npx", args: ["-y", server.npm_package] };
  }

  const mcpServersWithType = Object.fromEntries(
    Object.entries(mcpServers).map(([k, v]) => [k, { ...v, type: "stdio" }]),
  );

  return {
    claude: `// ~/Library/Application Support/Claude/claude_desktop_config.json\n${JSON.stringify({ mcpServers }, null, 2)}`,
    cursor: `// ~/.cursor/mcp.json\n${JSON.stringify({ mcpServers }, null, 2)}`,
    vscode: `// .vscode/mcp.json\n${JSON.stringify({ servers: mcpServersWithType }, null, 2)}`,
    antigravity: `// ~/.gemini/antigravity/mcp_config.json\n${JSON.stringify({ mcpServers }, null, 2)}`,
  };
}
