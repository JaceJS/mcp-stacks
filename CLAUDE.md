# CLAUDE.md — MCP Stacks

## Stack

Next.js 15.2.6 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase · bun

## Project Structure

```
src/
├── features/
│   ├── stacks/
│   │   ├── types.ts           # StackCardData, StackDetail, UserStack, dll
│   │   ├── queries.ts         # getFeaturedStacks, getStacks, getStack, getUserStacks, getTags, getSiteStats, getServersForPicker, getTagsForPicker
│   │   ├── actions.ts         # createStack, updateStack, deleteStack
│   │   ├── utils.ts           # getPillClass, buildEditorConfigs
│   │   └── components/
│   │       ├── StackCard.tsx
│   │       ├── CreateStackForm.tsx
│   │       ├── StackDetailConfig.tsx
│   │       └── ShareButton.tsx
│   ├── votes/
│   │   ├── actions.ts         # toggleVote
│   │   └── components/
│   │       └── VoteButton.tsx
│   └── auth/
│       └── actions.ts         # signIn, signUp, signOut, signInWithOAuth
├── app/                       # routing only — pages import dari features/
│   ├── (auth)/                # Protected routes — layout checks session
│   ├── (marketing)/           # Public routes — no auth
│   ├── auth/                  # OAuth callback, login
│   └── api/                   # Route Handlers — webhooks only
├── components/                # shared global UI
│   ├── ui/                    # shadcn/ui primitives
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ConfigPreview.tsx
├── lib/                       # shared infrastructure
│   ├── supabase/              # client.ts, server.ts, middleware.ts
│   ├── env.ts                 # semua env vars — JANGAN pakai process.env langsung
│   ├── constants.ts
│   └── utils.ts               # cn(), slugify(), formatDate()
└── types/
    └── database.ts            # Supabase DB types (Row, Insert, Update)
```

## Rules

### Tailwind CSS v4 — Color Token Usage

`globals.css` mendefinisikan warna di `@theme inline` sebagai `--color-*`, sehingga Tailwind v4 otomatis mengekspos token tersebut sebagai utility class.

**SELALU gunakan nama token langsung — JANGAN pakai `[--variable]` syntax untuk warna yang sudah terdaftar:**

```
✅  bg-accent          border-border         text-muted
✅  bg-accent/10       border-border-hover   text-subtle
✅  hover:bg-accent    hover:border-accent   hover:text-accent

❌  bg-[--accent]      border-[--border]     text-[--foreground-muted]
❌  bg-[--accent]/10   (opacity modifier tidak bekerja dengan sintaks ini)
```

Token yang tersedia (dari `@theme inline`):
- **bg / text / border**: `background`, `surface`, `surface-elevated`, `card`, `card-hover`
- **text**: `foreground`, `muted`, `subtle`, `accent`, `accent-dim`
- **border**: `border`, `border-hover`, `border-accent`
- **accent**: `accent`, `accent-dim`, `accent-glow`, `accent-glow-strong`

Untuk warna kategori (cat-docs, cat-dev, dll) yang **tidak** ada di `@theme`, gunakan CSS inline style atau class `.pill-*` yang sudah didefinisikan di `globals.css`.

---

### Code Quality

- Write clean, readable code. Prioritize clarity over cleverness
- DRY — extract shared logic into `lib/` or reusable components
- No overengineering — no unnecessary abstractions, wrappers, or layers
- Use `@/` path alias for all imports
- Component files: `kebab-case.tsx`. Types/utils: `camelCase.ts`
- Always run `bunx tsc --noEmit` after making changes to verify types

### Data Mutations

- Server Actions ada di `features/<nama-fitur>/actions.ts` — NOT API route handlers
- Every Server Action must verify auth: `const { data: { user } } = await supabase.auth.getUser()`
- Use `getUser()` (verified), never `getSession()` (unverified)

### Environment Variables

- Semua env vars diakses lewat `@/lib/env` — JANGAN gunakan `process.env` secara langsung di file manapun selain `src/lib/env.ts`

### Supabase Clients

- Client Components → `@/lib/supabase/client`
- Server Components / Actions → `@/lib/supabase/server`

### Git

- Respect `.gitignore` — never read & commit `.env`, `node_modules/`, `.next/`
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

Optional (has fallback to `localhost:3000`):

```
NEXT_PUBLIC_SITE_URL=
```
