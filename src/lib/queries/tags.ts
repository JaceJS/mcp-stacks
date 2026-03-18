import { createClient } from "@/lib/supabase/server";

export type Tag = { name: string; slug: string };

export async function getTags(): Promise<Tag[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tags")
      .select("name, slug")
      .order("name");
    return data ?? [];
  } catch {
    return [];
  }
}
