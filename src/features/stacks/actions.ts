"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { Json } from "@/types/database";

export async function createStack(formData: FormData): Promise<{ slug: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const serverIds: string[] = JSON.parse(
    (formData.get("server_ids") as string) || "[]",
  );
  const tagIds: string[] = JSON.parse(
    (formData.get("tag_ids") as string) || "[]",
  );
  const configJson: Json = JSON.parse(
    (formData.get("config_json") as string) || "null",
  );

  const slug = slugify(title);

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

  if (stackError) throw stackError;

  if (serverIds.length > 0) {
    const serverLinks = serverIds.map((serverId, i) => ({
      stack_id: stack.id,
      server_id: serverId,
      position: i,
    }));
    await supabase.from("stack_servers").insert(serverLinks);
  }

  if (tagIds.length > 0) {
    const tagLinks = tagIds.map((tagId) => ({
      stack_id: stack.id,
      tag_id: tagId,
    }));
    await supabase.from("stack_tags").insert(tagLinks);
  }

  revalidatePath("/explore");
  return { slug: stack.slug };
}

export async function updateStack(stackId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("stacks")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string | null,
      config_json: JSON.parse(
        (formData.get("config_json") as string) || "null",
      ) as Json,
    })
    .eq("id", stackId)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/explore");
  revalidatePath(`/stacks/${stackId}`);
}

export async function deleteStack(stackId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("stacks")
    .delete()
    .eq("id", stackId)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/explore");
  revalidatePath("/dashboard");
}
