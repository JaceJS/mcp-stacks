"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleVote(stackId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", user.id)
    .eq("stack_id", stackId)
    .single();

  if (existingVote) {
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("votes").insert({
      user_id: user.id,
      stack_id: stackId,
    });

    if (error) throw error;
  }

  revalidatePath("/explore");
}
