import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request.
 *
 * This is called from the root Next.js middleware. It creates a server client
 * with full read/write cookie access so it can update the session tokens
 * (access_token + refresh_token) transparently.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT use `getSession()` here.
  // `getUser()` sends a request to the Supabase Auth server to revalidate
  // the token, while `getSession()` only reads unverified data from cookies.
  // See: https://supabase.com/docs/guides/auth/server-side/nextjs
  // Revalidate the auth token server-side (not just reading cookies).
  // See: https://supabase.com/docs/guides/auth/server-side/nextjs
  await supabase.auth.getUser();

  // Optional: redirect unauthenticated users away from protected routes.
  // Uncomment and adjust the path check when you add protected pages.
  //
  // if (
  //   !user &&
  //   !request.nextUrl.pathname.startsWith("/login") &&
  //   !request.nextUrl.pathname.startsWith("/auth")
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  return supabaseResponse;
}
