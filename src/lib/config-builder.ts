import { slugify } from "@/lib/utils";

type ServerForConfig = {
  slug: string;
  name: string;
  npm_package: string | null;
};

export type EditorConfigs = {
  claude: string;
  cursor: string;
  windsurf: string;
  vscode: string;
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
