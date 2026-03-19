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
  ),
  -- Official servers
  (
    'Git',
    'git',
    'Read and manipulate Git repositories — log, diff, blame, and more.',
    '@modelcontextprotocol/server-git',
    'https://github.com/modelcontextprotocol/servers',
    'developer-tools',
    true
  ),
  (
    'GitLab',
    'gitlab',
    'Interact with GitLab repositories, merge requests, and issues.',
    '@modelcontextprotocol/server-gitlab',
    'https://github.com/modelcontextprotocol/servers',
    'developer-tools',
    true
  ),
  (
    'SQLite',
    'sqlite',
    'Create, query, and manage SQLite databases.',
    '@modelcontextprotocol/server-sqlite',
    'https://github.com/modelcontextprotocol/servers',
    'database',
    true
  ),
  (
    'Sequential Thinking',
    'sequential-thinking',
    'Dynamic and reflective problem-solving through sequential thought chains.',
    '@modelcontextprotocol/server-sequential-thinking',
    'https://github.com/modelcontextprotocol/servers',
    'ai',
    true
  ),
  (
    'Google Drive',
    'google-drive',
    'Search, read, and manage files in Google Drive.',
    '@modelcontextprotocol/server-gdrive',
    'https://github.com/modelcontextprotocol/servers',
    'productivity',
    true
  ),
  (
    'Sentry',
    'sentry',
    'Retrieve and analyze error reports from Sentry.',
    '@modelcontextprotocol/server-sentry',
    'https://github.com/modelcontextprotocol/servers',
    'developer-tools',
    true
  ),
  (
    'Time',
    'time',
    'Get current time and perform timezone conversions.',
    '@modelcontextprotocol/server-time',
    'https://github.com/modelcontextprotocol/servers',
    'productivity',
    true
  ),
  (
    'EverArt',
    'everart',
    'Generate images using EverArt AI models.',
    '@modelcontextprotocol/server-everart',
    'https://github.com/modelcontextprotocol/servers',
    'ai',
    true
  ),
  (
    'AWS KB Retrieval',
    'aws-kb-retrieval',
    'Retrieve information from AWS Knowledge Base using Bedrock Agent Runtime.',
    '@modelcontextprotocol/server-aws-kb-retrieval',
    'https://github.com/modelcontextprotocol/servers',
    'cloud',
    true
  ),
  -- Community servers
  (
    'Cloudflare',
    'cloudflare',
    'Deploy and manage Cloudflare Workers, KV, R2, and D1.',
    '@cloudflare/mcp-server-cloudflare',
    'https://github.com/cloudflare/mcp-server-cloudflare',
    'cloud',
    false
  ),
  (
    'MongoDB',
    'mongodb',
    'Query and manage MongoDB databases and collections.',
    '@mongodb-js/mongodb-mcp-server',
    'https://github.com/mongodb-js/mongodb-mcp-server',
    'database',
    false
  ),
  (
    'Playwright',
    'playwright',
    'Browser automation and end-to-end testing with Playwright.',
    '@playwright/mcp',
    'https://github.com/microsoft/playwright-mcp',
    'browser',
    false
  ),
  (
    'Stripe',
    'stripe',
    'Manage Stripe payments, customers, and subscriptions.',
    NULL,
    'https://github.com/stripe/agent-toolkit',
    'developer-tools',
    false
  ),
  (
    'Figma',
    'figma',
    'Read Figma files and access design context for development.',
    'figma-developer-mcp',
    'https://github.com/GLips/Figma-Context-MCP',
    'developer-tools',
    false
  ),
  (
    'Exa Search',
    'exa',
    'AI-powered web search and content retrieval via Exa.',
    'exa-mcp-server',
    'https://github.com/exa-labs/exa-mcp-server',
    'search',
    false
  ),
  (
    'Tavily',
    'tavily',
    'Real-time web search optimized for AI agents via Tavily.',
    'tavily-mcp',
    'https://github.com/tavily-ai/tavily-mcp',
    'search',
    false
  ),
  (
    'E2B Code Sandbox',
    'e2b',
    'Execute code securely in isolated cloud sandboxes with E2B.',
    '@e2b/mcp-server',
    'https://github.com/e2b-dev/mcp-server',
    'developer-tools',
    false
  ),
  (
    'Browserbase',
    'browserbase',
    'Automate browsers in the cloud with Browserbase.',
    '@browserbasehq/mcp-server-browserbase',
    'https://github.com/browserbase/mcp-server-browserbase',
    'browser',
    false
  ),
  (
    'Docker',
    'docker',
    'Manage Docker containers, images, and volumes.',
    NULL,
    'https://github.com/ckreiling/mcp-server-docker',
    'developer-tools',
    false
  ),
  (
    'Atlassian',
    'atlassian',
    'Manage Jira issues and Confluence pages.',
    'mcp-atlassian',
    'https://github.com/sooperset/mcp-atlassian',
    'project-management',
    false
  ),
  (
    'Obsidian',
    'obsidian',
    'Read and write notes in your Obsidian vault.',
    'mcp-obsidian',
    'https://github.com/MarkusPfundstein/mcp-obsidian',
    'productivity',
    false
  ),
  (
    'Vercel',
    'vercel',
    'Deploy and manage Vercel projects and deployments.',
    NULL,
    'https://github.com/vercel/mcp-adapter',
    'developer-tools',
    false
  ),
  (
    'Perplexity',
    'perplexity',
    'AI-powered search and answers via Perplexity.',
    NULL,
    'https://github.com/ppl-ai/modelcontextprotocol',
    'search',
    false
  ),
  (
    'HuggingFace',
    'huggingface',
    'Access HuggingFace models, datasets, and the Hub.',
    '@huggingface/mcp-client',
    'https://github.com/huggingface/huggingface-mcp-server',
    'ai',
    false
  ),
  (
    'Airtable',
    'airtable',
    'Read and write Airtable bases, tables, and records.',
    NULL,
    'https://github.com/domdomegg/airtable-mcp-server',
    'database',
    false
  ),
  (
    'Gmail',
    'gmail',
    'Read, send, and manage Gmail messages and threads.',
    NULL,
    'https://github.com/GongRzhe/Gmail-MCP-Server',
    'communication',
    false
  ),
  (
    'Google Calendar',
    'google-calendar',
    'Read and manage Google Calendar events and schedules.',
    NULL,
    'https://github.com/v-3/google-calendar-mcp',
    'productivity',
    false
  ),
  (
    'MySQL',
    'mysql',
    'Query and manage MySQL databases.',
    'mcp-server-mysql',
    'https://github.com/benborla29/mcp-server-mysql',
    'database',
    false
  ),
  (
    'Redis',
    'redis',
    'Interact with Redis key-value stores and data structures.',
    NULL,
    'https://github.com/modelcontextprotocol/servers',
    'database',
    false
  ),
  (
    'Spotify',
    'spotify',
    'Control Spotify playback and browse music.',
    NULL,
    'https://github.com/varunneal/spotify-mcp',
    'productivity',
    false
  ),
  (
    'Discord',
    'discord',
    'Read and send messages in Discord servers and channels.',
    NULL,
    'https://github.com/v-3/discordmcp',
    'communication',
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
