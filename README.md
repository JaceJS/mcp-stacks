# MCP Stacks

> Discover and share curated MCP server stacks

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)
![bun](https://img.shields.io/badge/bun-1-fbf0df?logo=bun)
![MIT License](https://img.shields.io/badge/license-MIT-green)

---

## About

MCP Stacks is a community platform for discovering and sharing curated collections of [MCP (Model Context Protocol)](https://modelcontextprotocol.io) servers. Instead of hunting through repositories to find the right tools, you can browse stacks built by other developers and copy a ready-to-use config directly into your editor.

Live site: **[mcpstacks.dev](https://mcpstacks.dev)**

---

## Features

- **Browse & filter** community stacks by role, tag, and use case
- **One-click copy** editor config for Claude Desktop, Cursor, VS Code, and Windsurf
- **Publish your own stack** with a curated list of MCP servers
- **Voting system** to surface the best stacks
- **Personal dashboard** to manage your published stacks

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev) + [shadcn/ui](https://ui.shadcn.com) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | [Supabase](https://supabase.com) (Postgres) |
| Runtime | [bun](https://bun.sh) |

---

## Getting Started

### Prerequisites

- [bun](https://bun.sh) >= 1.0
- A [Supabase](https://supabase.com) account (or Docker for local setup)

### Installation

```bash
git clone https://github.com/JaceJS/mcp-stacks
cd mcp-stacks
bun install
cp .env.example .env
# Fill in .env — see Environment Variables below
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | No | Public URL of your site (defaults to `http://localhost:3000`) |

To get your Supabase credentials: go to your project dashboard → **Settings → API**.

---

## Database Setup

### Option A — Supabase Cloud

```bash
bun run db:push    # push migrations to your cloud project
bun run db:reset   # run migrations + seed (30+ MCP servers)
```

### Option B — Local (Docker required)

```bash
bun run db:start      # start local Supabase stack
bun run db:reset      # run migrations + seed data
bunx supabase status  # get local credentials to put in .env
```

---

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start dev server with Turbopack |
| `bun run lint` | Run ESLint |
| `bunx tsc --noEmit` | Type-check the project |
| `bun run db:start` | Start local Supabase (Docker) |
| `bun run db:stop` | Stop local Supabase |
| `bun run db:push` | Push migrations to Supabase |
| `bun run db:reset` | Reset DB and run seed data |

---

## Project Structure

```
src/
├── features/          # Feature modules (stacks, votes, auth)
│   ├── stacks/        # Types, queries, actions, components
│   ├── votes/         # Vote actions + VoteButton component
│   └── auth/          # Auth actions (sign in/up/out, OAuth)
├── app/               # Next.js routes — pages import from features/
│   ├── (auth)/        # Protected routes
│   ├── (marketing)/   # Public routes
│   └── api/           # Route handlers (webhooks only)
├── components/        # Shared UI (Navbar, Footer, shadcn primitives)
├── lib/               # Shared infrastructure (Supabase clients, env, utils)
└── types/             # Supabase DB types
```

---

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Open a pull request

Please follow the conventions documented in [`CLAUDE.md`](./CLAUDE.md).

---

## License

MIT — see [LICENSE](./LICENSE)
