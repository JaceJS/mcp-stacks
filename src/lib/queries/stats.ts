import { createClient } from "@/lib/supabase/server";

export type SiteStats = {
  stacks: number;
  users: number;
};

export async function getSiteStats(): Promise<SiteStats> {
  try {
    const supabase = await createClient();
    const [{ count: stackCount }, { count: userCount }] = await Promise.all([
      supabase
        .from("stacks")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);
    return { stacks: stackCount ?? 0, users: userCount ?? 0 };
  } catch {
    return { stacks: 0, users: 0 };
  }
}
