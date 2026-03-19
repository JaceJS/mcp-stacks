import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type {
  StackCardData,
  StackDetail,
  UserStack,
  UserProfile,
  Tag,
  SiteStats,
} from "./types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type RawStack = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  user_id: string;
  created_at: string;
};

export const PAGE_SIZE = 12;

async function enrichStackCards(
  supabase: SupabaseClient,
  stacks: RawStack[],
): Promise<StackCardData[]> {
  if (!stacks.length) return [];

  const stackIds = stacks.map((s) => s.id);
  const userIds = [...new Set(stacks.map((s) => s.user_id))];

  const [{ data: users }, { data: allStackServers }, { data: votes }] =
    await Promise.all([
      supabase
        .from("users")
        .select("id, display_name, username")
        .in("id", userIds),
      supabase
        .from("stack_servers")
        .select("stack_id, servers(name, category)")
        .in("stack_id", stackIds)
        .order("position"),
      supabase.from("votes").select("stack_id").in("stack_id", stackIds),
    ]);

  const userMap = new Map((users ?? []).map((u) => [u.id, u]));

  const serversByStack = new Map<
    string,
    Array<{ name: string; category: string | null }>
  >();
  for (const ss of allStackServers ?? []) {
    const server = (ss as Record<string, unknown>).servers as {
      name: string;
      category: string | null;
    } | null;
    const stackId = (ss as Record<string, unknown>).stack_id as string;
    if (!serversByStack.has(stackId)) serversByStack.set(stackId, []);
    serversByStack.get(stackId)!.push({
      name: server?.name ?? "Unknown",
      category: server?.category ?? null,
    });
  }

  const votesByStack = new Map<string, number>();
  for (const v of votes ?? []) {
    const stackId = (v as Record<string, unknown>).stack_id as string;
    votesByStack.set(stackId, (votesByStack.get(stackId) ?? 0) + 1);
  }

  return stacks.map((stack) => ({
    ...stack,
    user: userMap.get(stack.user_id) ?? {
      display_name: "Anonymous",
      username: null,
    },
    servers: serversByStack.get(stack.id) ?? [],
    vote_count: votesByStack.get(stack.id) ?? 0,
  }));
}

export async function getFeaturedStacks(): Promise<StackCardData[]> {
  try {
    const supabase = await createClient();
    const { data: stacks, error } = await supabase
      .from("stacks")
      .select("id, title, slug, description, user_id, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      logger.error("getFeaturedStacks failed", { error });
      return [];
    }

    if (!stacks?.length) return [];

    return enrichStackCards(supabase, stacks);
  } catch (e) {
    logger.error("getFeaturedStacks unexpected error", { error: e });
    return [];
  }
}

export async function getStacks(
  tag?: string,
  page = 1,
  q?: string,
): Promise<{ stacks: StackCardData[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // Resolve tag filter to stack IDs up front
    let filteredStackIds: string[] | null = null;
    if (tag) {
      const { data: tagRow } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", tag)
        .single();

      if (!tagRow) return { stacks: [], total: 0 };

      const { data: taggedStacks } = await supabase
        .from("stack_tags")
        .select("stack_id")
        .eq("tag_id", tagRow.id);

      if (!taggedStacks?.length) return { stacks: [], total: 0 };
      filteredStackIds = taggedStacks.map((s) => s.stack_id);
    }

    let query = supabase
      .from("stacks")
      .select("id, title, slug, description, user_id, created_at", {
        count: "exact",
      })
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filteredStackIds) {
      query = query.in("id", filteredStackIds);
    }

    if (q) {
      query = query.or(
        `title.ilike.%${q}%,description.ilike.%${q}%`,
      );
    }

    const { data: stacks, count, error } = await query;

    if (error) {
      logger.error("getStacks failed", { error });
      return { stacks: [], total: 0 };
    }

    if (!stacks?.length) return { stacks: [], total: 0 };

    return {
      stacks: await enrichStackCards(supabase, stacks),
      total: count ?? 0,
    };
  } catch (e) {
    logger.error("getStacks unexpected error", { error: e });
    return { stacks: [], total: 0 };
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
        .select(
          "server_id, servers(name, slug, category, npm_package, description)",
        )
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
      user: user ?? {
        display_name: "Anonymous",
        username: null,
        avatar_url: null,
      },
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

export async function getUserStacks(page = 1, q?: string): Promise<{
  stacks: UserStack[];
  user: UserProfile | null;
  total: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { stacks: [], user: null, total: 0 };

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let stacksQuery = supabase
    .from("stacks")
    .select("id, title, slug, description, is_public, created_at", {
      count: "exact",
    })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) {
    stacksQuery = stacksQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const [{ data: profile }, { data: stacks, count }] = await Promise.all([
    supabase
      .from("users")
      .select("display_name, username, avatar_url")
      .eq("id", user.id)
      .single(),
    stacksQuery,
  ]);

  const stackIds = (stacks ?? []).map((s) => s.id);
  const { data: votes } = await supabase
    .from("votes")
    .select("stack_id")
    .in("stack_id", stackIds);

  const votesByStack = new Map<string, number>();
  for (const v of votes ?? []) {
    const stackId = (v as Record<string, unknown>).stack_id as string;
    votesByStack.set(stackId, (votesByStack.get(stackId) ?? 0) + 1);
  }

  const stacksWithVotes = (stacks ?? []).map((stack) => ({
    ...stack,
    vote_count: votesByStack.get(stack.id) ?? 0,
  }));

  return {
    stacks: stacksWithVotes,
    total: count ?? 0,
    user: {
      email: user.email,
      display_name: profile?.display_name,
      username: profile?.username,
      avatar_url: profile?.avatar_url,
    },
  };
}

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

export async function getSiteStats(): Promise<SiteStats> {
  try {
    const supabase = await createClient();
    const [
      { count: stackCount, error: stackError },
      { count: userCount, error: userError },
    ] = await Promise.all([
      supabase
        .from("stacks")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);

    if (stackError)
      logger.error("getSiteStats stacks query failed", { error: stackError });
    if (userError)
      logger.error("getSiteStats users query failed", { error: userError });

    return { stacks: stackCount ?? 0, users: userCount ?? 0 };
  } catch (e) {
    logger.error("getSiteStats unexpected error", { error: e });
    return { stacks: 0, users: 0 };
  }
}

export async function getServersForPicker() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("servers")
      .select("id, name, slug, category, npm_package, description")
      .order("name");

    if (error) logger.error("getServersForPicker failed", { error });

    return data ?? [];
  } catch (e) {
    logger.error("getServersForPicker unexpected error", { error: e });
    return [];
  }
}

export async function getTagsForPicker(): Promise<
  { id: string; name: string; slug: string }[]
> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tags")
      .select("id, name, slug")
      .order("name");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getStackForEdit(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: stack } = await supabase
    .from("stacks")
    .select("id, title, slug, description, config_json, user_id")
    .eq("slug", slug)
    .single();

  if (!stack || stack.user_id !== user.id) return null;

  const [{ data: stackServers }, { data: stackTags }] = await Promise.all([
    supabase
      .from("stack_servers")
      .select("server_id")
      .eq("stack_id", stack.id)
      .order("position"),
    supabase.from("stack_tags").select("tag_id").eq("stack_id", stack.id),
  ]);

  return {
    ...stack,
    serverIds: (stackServers ?? []).map((r) => r.server_id),
    tagIds: (stackTags ?? []).map((r) => r.tag_id),
  };
}
