import { createClient } from "@/lib/supabase/server";
import { CreateStackForm } from "@/components/create-stack-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Your Stack",
};

async function getServers() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("servers")
      .select("id, name, slug, category, npm_package, description")
      .order("name");
    return data ?? [];
  } catch {
    return [];
  }
}

async function getTags() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("tags").select("id, name, slug").order("name");
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function NewStackPage() {
  const [servers, tags] = await Promise.all([getServers(), getTags()]);

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Share your stack
          </h1>
          <p className="text-[14px] text-[var(--foreground-muted)]">
            Combine your favorite MCP servers into a stack and share it with the
            community.
          </p>
        </div>
        <CreateStackForm servers={servers} tags={tags} />
      </div>
    </div>
  );
}
