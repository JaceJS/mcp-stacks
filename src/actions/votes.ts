"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggle vote on a stack.
 * If the user already voted, removes the vote. Otherwise, adds one.
 */
export async function toggleVote(stackId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Check if vote already exists
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", user.id)
    .eq("stack_id", stackId)
    .single();

  if (existingVote) {
    // Remove vote
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id);

    if (error) throw error;
  } else {
    // Add vote
    const { error } = await supabase.from("votes").insert({
      user_id: user.id,
      stack_id: stackId,
    });

    if (error) throw error;
  }

  revalidatePath("/explore");
}
