import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * Uses the Next.js `cookies()` API (async in Next.js 15) for read-only
 * cookie access. Session refresh happens in the middleware, so this client
 * only needs `getAll`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` can fail when called from a Server Component.
            // This is safe to ignore if you have middleware refreshing
            // user sessions — which we do.
          }
        },
      },
    }
  );
}
