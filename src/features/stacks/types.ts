export interface StackCardData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  user: { display_name: string | null; username: string | null };
  servers: { name: string; category: string | null }[];
  vote_count: number;
}

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

export type Tag = { name: string; slug: string };

export type SiteStats = {
  stacks: number;
  users: number;
};

export type EditorConfigs = {
  claude: string;
  cursor: string;
  windsurf: string;
  vscode: string;
};
