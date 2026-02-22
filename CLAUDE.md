# Cineva

Matching platform for Cineville pass holders (and other cultural subscription providers).

## Tech Stack

**Client** (`client/web/`): React 19 + TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React
**API** (`api/`): Fastify 5, Drizzle ORM, PostgreSQL 17, TypeScript
**Infra**: Docker Compose (dev + prod), Nginx, GitLab CI/CD → Hetzner

## Project Structure

```
client/web/         — React SPA (Vite)
  src/pages/        — Landing, Profile, Feed
  src/components/   — MatchCard, StatBadge, ui/ primitives
  src/hooks/        — useProfile, useMatches (API data fetching)
  src/lib/api.ts    — typed fetch wrappers for /api/*
  src/lib/constants.ts — temporary CURRENT_USER_ID (until auth)

api/                — Fastify backend
  src/routes/       — thin HTTP handlers (health, profile, matches, ingest)
  src/use-cases/    — business logic (getProfile, getMatches, ingestVisits)
  src/repositories/ — pure data access (Drizzle queries)
  src/providers/    — external service adapters (cineville mock)
  src/db/schema/    — Drizzle table definitions
  src/db/migrations/— generated SQL migrations (committed)
  src/db/seeds/     — re-runnable seed scripts (tsx)

nginx/              — dev + prod nginx configs, prod Dockerfile
```

## Architecture

- **Routes → Use-cases → Repositories** — routes are thin, use-cases contain business logic, repositories are pure data access
- All DB tables: UUID PKs, created_at, updated_at, deleted_at (soft-delete)
- Client fetches from `/api/*` — nginx proxies to Fastify
- Matches are randomized (no algorithm yet, no persistence)

## Conventions

- Client path alias: `@/` maps to `client/web/src/`
- Color palette: `cineva-*` (light blue) and `coral-*` (accent pink) in `tailwind.config.js`
- Mobile-first layout, max-width `max-w-lg` / `max-w-md`
- API uses `.js` extensions in imports (NodeNext module resolution)

## Linting

Always run lints after completing a task:

```bash
cd api && npx tsc --noEmit
cd client/web && npx tsc --noEmit
```

