# G Interior and Property Service Ltd — Real Estate Portal

> Next.js (App Router, TypeScript) + Tailwind CSS + Supabase. Full listings portal with admin.
> Brand: transparent orange primary, blue `#1E7FCC` secondary. Logo: `logo.jpeg` (cleaned to `public/brand/`).

## Quick start

```bash
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev                  # http://localhost:3000
```

Requires a Supabase project (see `docs/database.md`). Create one admin user in Supabase Auth (email/password, no public signup).

## Docs

- `docs/architecture.md` — system overview, project structure, key decisions
- `docs/frontend.md` — pages, components, styling, SEO
- `docs/backend.md` — Server Actions, auth, middleware, storage
- `docs/api.md` — Server Action + query reference (no REST routes in v1)
- `docs/database.md` — schema, RLS, buckets, seed data
- `docs/userflow.md` — visitor, inquiry, and admin flows

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |

## Contact placeholders

Phone/WhatsApp, email, address, socials live in `lib/utils/constants.ts` (and env). Swap placeholders when the owner supplies real details — no other file changes needed.

## Status

Greenfield — scaffold + Supabase setup is step 1 (see `docs/architecture.md` build order).
