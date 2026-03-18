-- seed.sql — runs automatically on `supabase db reset`
-- Inline all seed data (supabase CLI executes this as plain SQL, not psql)

-- ── Servers ──────────────────────────────────────────────────────────────────

insert into public.servers (name, slug, description, npm_package, github_url, category, is_official) values
  (
    'Filesystem',
    'filesystem',
    'Read and write files on the local filesystem.',
    '@modelcontextprotocol/server-filesystem',
    'https://github.com/modelcontextprotocol/servers',
    'file-system',
    true
  ),
  (
    'GitHub',
    'github',
    'Interact with GitHub repositories, issues, and pull requests.',
    '@modelcontextprotocol/server-github',
    'https://github.com/modelcontextprotocol/servers',
    'developer-tools',
    true
  ),
  (
    'PostgreSQL',
    'postgresql',
    'Query and manage PostgreSQL databases.',
    '@modelcontextprotocol/server-postgres',
    'https://github.com/modelcontextprotocol/servers',
    'database',
    true
  ),
  (
    'Brave Search',
    'brave-search',
    'Web and local search using the Brave Search API.',
    '@modelcontextprotocol/server-brave-search',
    'https://github.com/modelcontextprotocol/servers',
    'search',
    true
  ),
  (
    'Puppeteer',
    'puppeteer',
    'Browser automation and web scraping with Puppeteer.',
    '@modelcontextprotocol/server-puppeteer',
    'https://github.com/modelcontextprotocol/servers',
    'browser',
    true
  ),
  (
    'Slack',
    'slack',
    'Send and read messages in Slack workspaces.',
    '@modelcontextprotocol/server-slack',
    'https://github.com/modelcontextprotocol/servers',
    'communication',
    true
  ),
  (
    'Google Maps',
    'google-maps',
    'Location data, directions, and place information via Google Maps.',
    '@modelcontextprotocol/server-google-maps',
    'https://github.com/modelcontextprotocol/servers',
    'location',
    true
  ),
  (
    'Memory',
    'memory',
    'Persistent key-value memory store for AI assistants.',
    '@modelcontextprotocol/server-memory',
    'https://github.com/modelcontextprotocol/servers',
    'productivity',
    true
  ),
  (
    'Fetch',
    'fetch',
    'HTTP fetch tool for reading web content and APIs.',
    '@modelcontextprotocol/server-fetch',
    'https://github.com/modelcontextprotocol/servers',
    'web',
    true
  ),
  (
    'Supabase',
    'supabase',
    'Interact with Supabase projects — database, auth, and storage.',
    '@supabase/mcp-server-supabase',
    'https://github.com/supabase-community/supabase-mcp',
    'database',
    false
  ),
  (
    'Linear',
    'linear',
    'Manage Linear issues, projects, and teams.',
    'mcp-linear',
    'https://github.com/jerhadf/linear-mcp-server',
    'project-management',
    false
  ),
  (
    'Notion',
    'notion',
    'Read and write Notion pages, databases, and blocks.',
    '@modelcontextprotocol/server-notion',
    'https://github.com/modelcontextprotocol/servers',
    'productivity',
    false
  )
on conflict (slug) do nothing;

-- ── Tags ─────────────────────────────────────────────────────────────────────

insert into public.tags (name, slug) values
  ('AI',              'ai'),
  ('Developer Tools', 'developer-tools'),
  ('Productivity',    'productivity'),
  ('Database',        'database'),
  ('Search',          'search'),
  ('Browser',         'browser'),
  ('File System',     'file-system'),
  ('Communication',   'communication'),
  ('Web Scraping',    'web-scraping'),
  ('Automation',      'automation'),
  ('Project Management', 'project-management'),
  ('Writing',         'writing'),
  ('Research',        'research'),
  ('Data Analysis',   'data-analysis'),
  ('Cloud',           'cloud')
on conflict (slug) do nothing;

-- ── Sample Stacks ─────────────────────────────────────────────────────────────

do $$
declare
  demo_user_id  uuid := '00000000-0000-0000-0000-000000000001';
  stack_dev_id  uuid;
  stack_res_id  uuid;
  stack_db_id   uuid;

  server_fs     uuid;
  server_gh     uuid;
  server_pg     uuid;
  server_brave  uuid;
  server_fetch  uuid;
  server_memory uuid;

  tag_ai        uuid;
  tag_dev       uuid;
  tag_db        uuid;
  tag_search    uuid;
  tag_research  uuid;
begin
  -- Insert demo user into auth.users first (trigger auto-creates public.users row)
  insert into auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    role,
    aud
  )
  values (
    demo_user_id,
    'demo@mcpstacks.dev',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "Demo User"}'::jsonb,
    'authenticated',
    'authenticated'
  )
  on conflict (id) do nothing;

  -- Backfill username since trigger doesn't set it
  update public.users set username = 'demo' where id = demo_user_id;

  -- Resolve server IDs
  select id into server_fs     from public.servers where slug = 'filesystem';
  select id into server_gh     from public.servers where slug = 'github';
  select id into server_pg     from public.servers where slug = 'postgresql';
  select id into server_brave  from public.servers where slug = 'brave-search';
  select id into server_fetch  from public.servers where slug = 'fetch';
  select id into server_memory from public.servers where slug = 'memory';

  -- Resolve tag IDs
  select id into tag_ai       from public.tags where slug = 'ai';
  select id into tag_dev      from public.tags where slug = 'developer-tools';
  select id into tag_db       from public.tags where slug = 'database';
  select id into tag_search   from public.tags where slug = 'search';
  select id into tag_research from public.tags where slug = 'research';

  -- ── Stack 1: Full Dev Setup ──────────────────────────────────────────────
  insert into public.stacks (user_id, title, slug, description, is_public, config_json)
  values (
    demo_user_id,
    'Full Dev Setup',
    'full-dev-setup',
    'A complete stack for software development: filesystem access, GitHub integration, and PostgreSQL.',
    true,
    '{"mcpServers": {"filesystem": {}, "github": {}, "postgresql": {}}}'::jsonb
  )
  returning id into stack_dev_id;

  insert into public.stack_servers (stack_id, server_id, position)
  values
    (stack_dev_id, server_fs, 0),
    (stack_dev_id, server_gh, 1),
    (stack_dev_id, server_pg, 2);

  insert into public.stack_tags (stack_id, tag_id)
  values
    (stack_dev_id, tag_dev),
    (stack_dev_id, tag_db);

  -- ── Stack 2: Research Assistant ──────────────────────────────────────────
  insert into public.stacks (user_id, title, slug, description, is_public, config_json)
  values (
    demo_user_id,
    'Research Assistant',
    'research-assistant',
    'Web research stack combining Brave Search, Fetch, and Memory for persistent context.',
    true,
    '{"mcpServers": {"brave-search": {}, "fetch": {}, "memory": {}}}'::jsonb
  )
  returning id into stack_res_id;

  insert into public.stack_servers (stack_id, server_id, position)
  values
    (stack_res_id, server_brave,  0),
    (stack_res_id, server_fetch,  1),
    (stack_res_id, server_memory, 2);

  insert into public.stack_tags (stack_id, tag_id)
  values
    (stack_res_id, tag_ai),
    (stack_res_id, tag_search),
    (stack_res_id, tag_research);

  -- ── Stack 3: Database Admin ───────────────────────────────────────────────
  insert into public.stacks (user_id, title, slug, description, is_public, config_json)
  values (
    demo_user_id,
    'Database Admin',
    'database-admin',
    'PostgreSQL-focused stack for database management and data analysis tasks.',
    true,
    '{"mcpServers": {"postgresql": {}, "filesystem": {}}}'::jsonb
  )
  returning id into stack_db_id;

  insert into public.stack_servers (stack_id, server_id, position)
  values
    (stack_db_id, server_pg, 0),
    (stack_db_id, server_fs, 1);

  insert into public.stack_tags (stack_id, tag_id)
  values
    (stack_db_id, tag_db);
end;
$$;
