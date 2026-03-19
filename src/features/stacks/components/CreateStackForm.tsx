"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStack } from "@/features/stacks/actions";
import { getPillClass } from "@/features/stacks/utils";

interface Server {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  npm_package: string | null;
  description: string | null;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export function CreateStackForm({
  servers,
  tags,
}: {
  servers: Server[];
  tags: Tag[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedServers, setSelectedServers] = useState<Server[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [serverSearch, setServerSearch] = useState("");

  const filteredServers = servers.filter(
    (s) =>
      !selectedServers.find((ss) => ss.id === s.id) &&
      (s.name.toLowerCase().includes(serverSearch.toLowerCase()) ||
        (s.category ?? "").toLowerCase().includes(serverSearch.toLowerCase())),
  );

  function addServer(server: Server) {
    setSelectedServers((prev) => [...prev, server]);
    setServerSearch("");
  }

  function removeServer(serverId: string) {
    setSelectedServers((prev) => prev.filter((s) => s.id !== serverId));
  }

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  }

  const previewConfig: Record<string, unknown> = {};
  for (const server of selectedServers) {
    const key = server.slug || server.name.toLowerCase().replace(/\s+/g, "-");
    if (server.npm_package) {
      previewConfig[key] = { command: "npx", args: [server.npm_package] };
    } else {
      previewConfig[key] = { command: "npx", args: [`@${key}/mcp`] };
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (selectedServers.length === 0) {
      setError("Select at least one server");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("title", title);
        formData.set("description", description);
        formData.set("server_ids", JSON.stringify(selectedServers.map((s) => s.id)));
        formData.set("tag_ids", JSON.stringify(selectedTags));
        formData.set("config_json", JSON.stringify({ mcpServers: previewConfig }));

        const result = await createStack(formData);
        router.push(`/stacks/${result.slug}`);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Form */}
      <div className="lg:col-span-3 space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-[13px] font-medium mb-2"
          >
            Stack name
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Full-Stack AI Developer"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[14px] placeholder:text-subtle focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-[13px] font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this stack for? Who should use it?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[14px] placeholder:text-subtle focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {/* Server picker */}
        <div>
          <label className="block text-[13px] font-medium mb-2">
            MCP Servers
          </label>

          {/* Selected servers */}
          {selectedServers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedServers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => removeServer(server.id)}
                  className={`pill ${getPillClass(server.category)} cursor-pointer group`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {server.name}
                  <span className="text-current opacity-40 group-hover:opacity-100 ml-1">
                    &times;
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          {servers.length > 0 ? (
            <div className="relative">
              <input
                type="text"
                value={serverSearch}
                onChange={(e) => setServerSearch(e.target.value)}
                placeholder="Search servers..."
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[14px] placeholder:text-subtle focus:outline-none focus:border-accent transition-colors"
              />
              {serverSearch && filteredServers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-surface border border-border overflow-hidden z-10 max-h-60 overflow-y-auto">
                  {filteredServers.slice(0, 10).map((server) => (
                    <button
                      key={server.id}
                      onClick={() => addServer(server)}
                      className="w-full text-left px-4 py-3 hover:bg-surface-elevated transition-colors flex items-center justify-between cursor-pointer border-none bg-transparent text-foreground"
                    >
                      <div>
                        <div className="text-[14px] font-medium">
                          {server.name}
                        </div>
                        {server.description && (
                          <div className="text-[12px] text-muted mt-0.5">
                            {server.description}
                          </div>
                        )}
                      </div>
                      <span
                        className={`pill ${getPillClass(server.category)} text-[10px]`}
                      >
                        {server.category ?? "other"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-[13px] text-subtle py-3">
              No servers in the database yet. Add servers to the{" "}
              <code className="font-mono text-accent">
                servers
              </code>{" "}
              table in Supabase to enable selection.
            </p>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <label className="block text-[13px] font-medium mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`pill cursor-pointer ${
                    selectedTags.includes(tag.id) ? "pill-docs" : "pill-default"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-[13px] text-[var(--cat-monitoring)]">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`btn-primary w-full justify-center ${isPending ? "opacity-50" : ""}`}
        >
          {isPending ? "Publishing..." : "Publish stack"}
        </button>
      </div>

      {/* Preview */}
      <div className="lg:col-span-2">
        <div className="sticky top-24">
          <h3 className="text-[13px] font-medium text-muted mb-3 uppercase tracking-wider">
            Preview
          </h3>

          {/* Card preview */}
          <div className="glass-card rounded-2xl p-6 mb-4">
            <h4 className="font-semibold text-[16px] mb-2">
              {title || "Stack name"}
            </h4>
            <p className="text-[13px] text-muted mb-4">
              {description || "Your stack description will appear here..."}
            </p>
            {selectedServers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedServers.map((server) => (
                  <span
                    key={server.id}
                    className={`pill ${getPillClass(server.category)}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                    {server.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Config preview */}
          {selectedServers.length > 0 && (
            <div className="code-block">
              <div className="px-4 py-2 border-b border-border">
                <span className="font-mono text-[11px] text-subtle">
                  Generated config
                </span>
              </div>
              <pre
                className="font-mono overflow-auto"
                style={{ fontSize: 12, lineHeight: 1.6, padding: "16px" }}
              >
                <code className="text-muted">
                  {JSON.stringify({ mcpServers: previewConfig }, null, 2)}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
