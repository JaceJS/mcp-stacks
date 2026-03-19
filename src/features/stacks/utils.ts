import { slugify } from "@/lib/utils";
import type { EditorConfigs } from "./types";

const categoryClass: Record<string, string> = {
  docs: "pill-docs",
  documentation: "pill-docs",
  dev: "pill-dev",
  "dev-tools": "pill-dev",
  "dev tools": "pill-dev",
  development: "pill-dev",
  database: "pill-database",
  db: "pill-database",
  search: "pill-search",
  monitoring: "pill-monitoring",
  observability: "pill-monitoring",
  ai: "pill-ai",
  cloud: "pill-cloud",
  infrastructure: "pill-cloud",
};

export function getPillClass(category: string | null): string {
  if (!category) return "pill-default";
  return categoryClass[category.toLowerCase()] ?? "pill-default";
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
    mcpServers[key] = { command: "npx", args: [server.npm_package] };
  }

  return {
    claude: JSON.stringify({ mcpServers }, null, 2),
    cursor: JSON.stringify(
      {
        mcpServers: Object.fromEntries(
          Object.entries(mcpServers).map(([k, v]) => [k, { ...v, enabled: true }]),
        ),
      },
      null,
      2,
    ),
    windsurf: JSON.stringify(
      {
        mcpServers: Object.fromEntries(
          Object.entries(mcpServers).map(([k, v]) => {
            const args = (v.args as string[]) ?? [];
            return [k, { serverUrl: `npx ${args[0] ?? ""}`.trim() }];
          }),
        ),
      },
      null,
      2,
    ),
    vscode: JSON.stringify({ "mcp.servers": mcpServers }, null, 2),
  };
}
