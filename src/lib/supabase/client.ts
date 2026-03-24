"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";

/**
 * Supabase client for browser / Client Components.
 *
 * Uses `document.cookie` automatically — no manual cookie config needed.
 * The client is cached as a singleton by `@supabase/ssr` by default.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
