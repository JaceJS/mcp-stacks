"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Json } from "@/types/database";

/**
 * Create a new stack.
 */
export async function createStack(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { data, error } = await supabase
    .from("stacks")
    .insert({
      user_id: user.id,
      title,
      slug,
      description,
      is_public: true,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/explore");
  return data;
}

/**
 * Update an existing stack.
 */
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
        (formData.get("config_json") as string) || "null"
      ) as Json,
    })
    .eq("id", stackId)
    .eq("user_id", user.id); // RLS safety net

  if (error) throw error;

  revalidatePath("/explore");
  revalidatePath(`/stacks/${stackId}`);
}

/**
 * Delete a stack.
 */
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
