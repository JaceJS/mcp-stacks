/**
 * Supabase Database Types for MCP Stacks.
 *
 * These types mirror your Supabase schema. To regenerate from the live
 * database, run: `bunx supabase gen types typescript --project-id <ref> > src/types/database.ts`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          github_url: string | null;
          twitter_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      servers: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          npm_package: string | null;
          github_url: string | null;
          icon_url: string | null;
          category: string | null;
          is_official: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          npm_package?: string | null;
          github_url?: string | null;
          icon_url?: string | null;
          category?: string | null;
          is_official?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          npm_package?: string | null;
          github_url?: string | null;
          icon_url?: string | null;
          category?: string | null;
          is_official?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      stacks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          description: string | null;
          config_json: Json | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          slug: string;
          description?: string | null;
          config_json?: Json | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          config_json?: Json | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stacks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      stack_servers: {
        Row: {
          id: string;
          stack_id: string;
          server_id: string;
          config_override: Json | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          stack_id: string;
          server_id: string;
          config_override?: Json | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          stack_id?: string;
          server_id?: string;
          config_override?: Json | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stack_servers_stack_id_fkey";
            columns: ["stack_id"];
            isOneToOne: false;
            referencedRelation: "stacks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stack_servers_server_id_fkey";
            columns: ["server_id"];
            isOneToOne: false;
            referencedRelation: "servers";
            referencedColumns: ["id"];
          }
        ];
      };

      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      stack_tags: {
        Row: {
          id: string;
          stack_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          stack_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          stack_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stack_tags_stack_id_fkey";
            columns: ["stack_id"];
            isOneToOne: false;
            referencedRelation: "stacks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stack_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };

      votes: {
        Row: {
          id: string;
          user_id: string;
          stack_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stack_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stack_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_stack_id_fkey";
            columns: ["stack_id"];
            isOneToOne: false;
            referencedRelation: "stacks";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ─── Convenience type aliases ──────────────────────────────────────────────

type Tables = Database["public"]["Tables"];

/** A full row from the `users` table. */
export type User = Tables["users"]["Row"];

/** A full row from the `servers` table. */
export type Server = Tables["servers"]["Row"];

/** A full row from the `stacks` table. */
export type Stack = Tables["stacks"]["Row"];

/** A full row from the `stack_servers` join table. */
export type StackServer = Tables["stack_servers"]["Row"];

/** A full row from the `tags` table. */
export type Tag = Tables["tags"]["Row"];

/** A full row from the `stack_tags` join table. */
export type StackTag = Tables["stack_tags"]["Row"];

/** A full row from the `votes` table. */
export type Vote = Tables["votes"]["Row"];
