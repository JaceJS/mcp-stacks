import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const serverIds: string[] = JSON.parse(
    (formData.get("server_ids") as string) || "[]"
  );
  const tagIds: string[] = JSON.parse(
    (formData.get("tag_ids") as string) || "[]"
  );
  const configJson: Json = JSON.parse(
    (formData.get("config_json") as string) || "null"
  );

  if (!title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Create stack
  const { data: stack, error: stackError } = await supabase
    .from("stacks")
    .insert({
      user_id: user.id,
      title,
      slug,
      description,
      config_json: configJson,
      is_public: true,
    })
    .select("id, slug")
    .single();

  if (stackError) {
    return NextResponse.json(
      { error: stackError.message },
      { status: 500 }
    );
  }

  // Link servers
  if (serverIds.length > 0) {
    const serverLinks = serverIds.map((serverId, i) => ({
      stack_id: stack.id,
      server_id: serverId,
      position: i,
    }));

    await supabase.from("stack_servers").insert(serverLinks);
  }

  // Link tags
  if (tagIds.length > 0) {
    const tagLinks = tagIds.map((tagId) => ({
      stack_id: stack.id,
      tag_id: tagId,
    }));

    await supabase.from("stack_tags").insert(tagLinks);
  }

  return NextResponse.json({ slug: stack.slug });
}
