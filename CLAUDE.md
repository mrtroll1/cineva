# Cineva

Prototype web client for Cineva — a matching platform for Cineville pass holders.

## Tech Stack

- React 19 + TypeScript, Vite
- Tailwind CSS + hand-rolled shadcn/ui components (`src/components/ui/`)
- Framer Motion for transitions
- Lucide React for icons

## Project Structure

- `src/data/mockData.json` — single source of truth for all UI data (user, stats, matches)
- `src/pages/` — Landing, Profile, Feed (the three app views)
- `src/components/` — shared components (MatchCard, StatBadge) + `ui/` primitives
- `src/lib/utils.ts` — `cn()` helper for Tailwind class merging

## Conventions

- Path alias: `@/` maps to `src/`
- Color palette: `cineva-*` (light blue) and `coral-*` (accent pink) defined in `tailwind.config.js`
- No backend, no DB — all data lives in `mockData.json`
- Mobile-first layout, max-width `max-w-lg` / `max-w-md`

## Running

```
npm install 
npm run dev
```
