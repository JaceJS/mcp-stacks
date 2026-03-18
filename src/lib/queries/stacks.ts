import { createClient } from "@/lib/supabase/server";
import type { StackCardData } from "@/components/StackCard";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type RawStack = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  user_id: string;
  created_at: string;
};

export type StackDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  config_json: unknown;
  user: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  servers: {
    name: string;
    slug: string;
    category: string | null;
    npm_package: string | null;
    description: string | null;
  }[];
  vote_count: number;
  has_voted: boolean;
  is_logged_in: boolean;
};

export type UserStack = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  vote_count: number;
};

export type UserProfile = {
  email: string | undefined;
  display_name: string | null | undefined;
  username: string | null | undefined;
  avatar_url: string | null | undefined;
};

async function enrichStackCard(
  supabase: SupabaseClient,
  stack: RawStack,
): Promise<StackCardData> {
  const [{ data: user }, { data: stackServers }, { count: voteCount }] =
    await Promise.all([
      supabase
        .from("users")
        .select("display_name, username")
        .eq("id", stack.user_id)
        .single(),
      supabase
        .from("stack_servers")
        .select("server_id, servers(name, category)")
        .eq("stack_id", stack.id)
        .order("position"),
      supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("stack_id", stack.id),
    ]);

  return {
    ...stack,
    user: user ?? { display_name: "Anonymous", username: null },
    servers: (stackServers ?? []).map((ss: Record<string, unknown>) => {
      const server = ss.servers as {
        name: string;
        category: string | null;
      } | null;
      return {
        name: server?.name ?? "Unknown",
        category: server?.category ?? null,
      };
    }),
    vote_count: voteCount ?? 0,
  };
}

export async function getFeaturedStacks(): Promise<StackCardData[]> {
  try {
    const supabase = await createClient();
    const { data: stacks } = await supabase
      .from("stacks")
      .select("id, title, slug, description, user_id, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (!stacks?.length) return [];

    return Promise.all(stacks.map((stack) => enrichStackCard(supabase, stack)));
  } catch {
    return [];
  }
}

export async function getStacks(tag?: string): Promise<StackCardData[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("stacks")
      .select("id, title, slug, description, user_id, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (tag) {
      const { data: tagRow } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", tag)
        .single();

      if (tagRow) {
        const { data: stackIds } = await supabase
          .from("stack_tags")
          .select("stack_id")
          .eq("tag_id", tagRow.id);

        if (stackIds?.length) {
          query = query.in(
            "id",
            stackIds.map((s) => s.stack_id),
          );
        } else {
          return [];
        }
      }
    }

    const { data: stacks } = await query;
    if (!stacks?.length) return [];

    return Promise.all(stacks.map((stack) => enrichStackCard(supabase, stack)));
  } catch {
    return [];
  }
}

export async function getStack(slug: string): Promise<StackDetail | null> {
  try {
    const supabase = await createClient();

    const { data: stack } = await supabase
      .from("stacks")
      .select("*")
      .eq("slug", slug)
      .eq("is_public", true)
      .single();

    if (!stack) return null;

    const [
      { data: user },
      { data: stackServers },
      { count: voteCount },
      { data: currentUser },
    ] = await Promise.all([
      supabase
        .from("users")
        .select("display_name, username, avatar_url")
        .eq("id", stack.user_id)
        .single(),
      supabase
        .from("stack_servers")
        .select("server_id, servers(name, slug, category, npm_package, description)")
        .eq("stack_id", stack.id)
        .order("position"),
      supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("stack_id", stack.id),
      supabase.auth.getUser().then(({ data }) => ({ data: data.user })),
    ]);

    let hasVoted = false;
    if (currentUser) {
      const { data: vote } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", currentUser.id)
        .eq("stack_id", stack.id)
        .single();
      hasVoted = !!vote;
    }

    return {
      ...stack,
      user: user ?? { display_name: "Anonymous", username: null, avatar_url: null },
      servers: (stackServers ?? []).map((ss: Record<string, unknown>) => {
        const server = ss.servers as {
          name: string;
          slug: string;
          category: string | null;
          npm_package: string | null;
          description: string | null;
        } | null;
        return {
          name: server?.name ?? "Unknown",
          slug: server?.slug ?? "",
          category: server?.category ?? null,
          npm_package: server?.npm_package ?? null,
          description: server?.description ?? null,
        };
      }),
      vote_count: voteCount ?? 0,
      has_voted: hasVoted,
      is_logged_in: !!currentUser,
    };
  } catch {
    return null;
  }
}

export async function getUserStacks(): Promise<{
  stacks: UserStack[];
  user: UserProfile | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { stacks: [], user: null };

  const { data: profile } = await supabase
    .from("users")
    .select("display_name, username, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: stacks } = await supabase
    .from("stacks")
    .select("id, title, slug, description, is_public, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const stacksWithVotes = await Promise.all(
    (stacks ?? []).map(async (stack) => {
      const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("stack_id", stack.id);
      return { ...stack, vote_count: count ?? 0 };
    }),
  );

  return {
    stacks: stacksWithVotes,
    user: {
      email: user.email,
      display_name: profile?.display_name,
      username: profile?.username,
      avatar_url: profile?.avatar_url,
    },
  };
}
