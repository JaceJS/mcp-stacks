"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Sign in with email & password.
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) throw error;

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Sign up with email & password.
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) throw error;

  // Supabase sends a confirmation email by default.
  // Redirect to a "check your email" page.
  redirect("/auth/verify");
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Sign in with an OAuth provider (GitHub, Google, etc.).
 * Returns the OAuth URL for client-side redirect.
 */
export async function signInWithOAuth(provider: "github" | "google") {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : ""}/auth/callback`,
    },
  });

  if (error) throw error;
  if (data.url) redirect(data.url);
}
