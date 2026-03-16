# CLAUDE.md — MCP Stacks

## Stack

Next.js 15.2.6 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase · bun

## Project Structure

```
src/
├── actions/              # Server Actions ("use server") — all data mutations
├── app/
│   ├── (auth)/           # Protected routes — layout checks session
│   ├── (marketing)/      # Public routes — no auth
│   ├── auth/             # Login, signup, OAuth callback
│   └── api/              # Route Handlers — webhooks only
├── components/
│   ├── ui/               # shadcn/ui primitives
│   └── [feature]/        # Feature-specific components
├── lib/
│   ├── supabase/         # Client utilities (client.ts, server.ts, middleware.ts)
│   └── utils.ts          # cn(), formatDate(), slugify()
└── types/
    └── database.ts       # Supabase DB types (Row, Insert, Update)
```

## Rules

### Code Quality

- Write clean, readable code. Prioritize clarity over cleverness
- DRY — extract shared logic into `lib/` or reusable components
- No overengineering — no unnecessary abstractions, wrappers, or layers
- Use `@/` path alias for all imports
- Component files: `kebab-case.tsx`. Types/utils: `camelCase.ts`
- Always run `bunx tsc --noEmit` after making changes to verify types

### Data Mutations

- Use Server Actions in `src/actions/` — NOT API route handlers
- Every Server Action must verify auth: `const { data: { user } } = await supabase.auth.getUser()`
- Use `getUser()` (verified), never `getSession()` (unverified)

### Supabase Clients

- Client Components → `@/lib/supabase/client`
- Server Components / Actions → `@/lib/supabase/server`

### Git

- Respect `.gitignore` — never commit `.env`, `node_modules/`, `.next/`
- `.env.example` is tracked and documents required variables

## Commands

```bash
bun run dev            # Dev server (Turbopack)
bun run lint           # ESLint
bunx tsc --noEmit      # Type check — run after every change
```

## Environment

Required in `.env` (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
