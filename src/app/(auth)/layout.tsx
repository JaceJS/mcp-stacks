import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Layout for authenticated routes.
 * Checks auth state and redirects to login if not authenticated.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen">
      {/* TODO: Add dashboard sidebar/nav here */}
      <main>{children}</main>
    </div>
  );
}
