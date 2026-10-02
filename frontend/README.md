# G Interior and Property Service Ltd — Real Estate Portal

> Vite + React 19 + TypeScript + Tailwind CSS v4 + Supabase. Full listings portal with admin panel.
> Brand: transparent orange primary (#EA5A00), blue `#1E7FCC` secondary.

## Quick Start

```bash
npm install
cp .env.example .env          # add Supabase URL + anon key (see Supabase Setup below)
npm run dev                    # http://localhost:5173
```

## Supabase Setup

The backend lives in `../supabase/` at the repo root:

| File | Purpose |
|------|---------|
| `supabase/migrations/20261001000000_init_schema.sql` | Full schema: 6 tables, CHECK constraints, indexes, `updated_at` triggers, `is_admin()` function, and Row-Level Security policies |
| `supabase/seed.sql` | Idempotent demo data: site settings, 3 agents, 8 Lagos properties, 4 testimonials, plus admin grant |

Steps:

1. **Create a project** at [supabase.com/dashboard](https://supabase.com/dashboard) (region: Frankfurt or Ireland for low latency to Nigeria). Save the DB password.
2. **Run the migration**: SQL Editor → paste `supabase/migrations/20261001000000_init_schema.sql` → **Run**. Expect "Success".
3. **Create the admin user**: Authentication → Users → **Add user** → email `admin@ginterior.ng`, a strong password, **Auto Confirm ON**.
4. **Disable public signups**: Authentication → Sign In / Providers → Email → toggle **Enable sign ups** OFF.
5. **Run the seed**: SQL Editor → paste `supabase/seed.sql` → **Run**. (Grants admin rights to the user from step 3 and inserts demo data. Safe to re-run.)
6. **Configure the frontend**: Project Settings → API → copy the **Project URL** and **anon public key** into `frontend/.env`:
   ```
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   ```

### RLS summary

| Table | Anonymous | Authenticated admin |
|-------|-----------|---------------------|
| `properties` | SELECT `status='available'` | full CRUD |
| `agents` | SELECT `active=true` | full CRUD |
| `testimonials` | SELECT `approved=true` | full CRUD |
| `leads` | INSERT only (`status='new'`) — no SELECT (PII) | SELECT/UPDATE/DELETE |
| `site_settings` | SELECT | INSERT/UPDATE/DELETE |
| `admins` | none | SELECT own row |

Admin writes are enforced by the `is_admin()` SECURITY DEFINER function (checks `public.admins`), used both in RLS policies and by the frontend (`ProtectedRoute` calls `supabase.rpc("is_admin")`). UI checks are defense in depth — RLS is the real gate.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vite 6 + React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix primitives) |
| Animations | Framer Motion |
| Maps | Leaflet / React-Leaflet |
| Icons | Lucide React |
| Backend | Supabase (auth, database, RLS) |
| Language | TypeScript |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve production build locally |

## Project Structure

```
frontend/
├── public/              # Static assets (logo, video, favicon)
├── src/
│   ├── components/
│   │   ├── forms/       # ContactForm, LeadForm, PropertyForm, AgentForm, TestimonialForm
│   │   ├── home/        # Hero, FeaturedGrid, Services, Stats, Testimonials, CTA, HomeAgents, HomeContact
│   │   ├── layout/      # Navbar, Footer, WhatsAppButton
│   │   ├── properties/  # PropertyCard, ImageGallery, FiltersBar, PropertyMap, SimilarProperties
│   │   ├── ui/          # shadcn/ui components (Button, Dialog, Badge, etc.)
│   │   └── admin/       # ProtectedRoute
│   ├── contexts/        # AuthContext (Supabase auth)
│   ├── lib/
│   │   ├── supabase/    # client, queries (CRUD), data (seed fallback), types, seed-data
│   │   └── utils/       # constants, currency formatter, slug helper
│   ├── pages/
│   │   ├── admin/       # Dashboard, Login, AdminProperties, AdminAgents, AdminLeads, AdminTestimonials
│   │   ├── Home, Properties, PropertyDetail, Agents, Contact, About, NotFound
│   │   └── ...
│   ├── App.tsx          # Router setup
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Pages

| Route | Description |
|-------|------------|
| `/` | Homepage — hero with video background, featured properties, agents, contact, services, stats, testimonials |
| `/properties` | All properties with filters (type, price, area) and pagination |
| `/properties/:slug` | Property detail with image gallery, map, agent info, similar properties |
| `/agents` | Agent directory |
| `/contact` | Contact form + info cards + map |
| `/about` | About page |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard |
| `/admin/properties` | Manage properties (CRUD, all statuses) |
| `/admin/agents` | Manage agents (CRUD) |
| `/admin/leads` | View and manage leads |
| `/admin/testimonials` | Manage testimonials (CRUD) |
| `/admin/settings` | Contact, social media, WhatsApp settings |

## Admin Panel

The admin panel includes full CRUD for:
- **Properties** — create, edit, delete, set featured, manage images, all statuses (available/sold/rented)
- **Agents** — create, edit, delete, manage contact info and photos
- **Testimonials** — create, edit, delete, approve/pending status
- **Leads** — view, filter, update status (new → contacted → closed)
- **Settings** (`/admin/settings`) — phone numbers (×2), WhatsApp, email, address, and social media URLs (Instagram, Facebook, X, LinkedIn, TikTok)

Protected by Supabase Auth **and** the `admins` table: `ProtectedRoute` requires both a session and `is_admin() = true`; RLS independently blocks non-admin writes at the database.

## Contact Placeholders

Contact details and social links are stored in the `site_settings` table (singleton row `id='main'`) and editable at `/admin/settings`. `src/lib/utils/constants.ts` holds fallback defaults used only when Supabase is unconfigured or a field is blank.

## Environment Variables

| Variable | Description |
|----------|------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

When Supabase is not configured, the app falls back to seed data (8 sample properties, 3 agents, 4 testimonials).

## Deployment

Build the project:

```bash
npm run build
```

The `dist/` folder can be deployed to any static host:
- **Vercel**: `npx vercel` or connect your GitHub repo
- **Netlify**: drag & drop `dist/` or connect repo
- **Cloudflare Pages**: connect repo, build command `npm run build`, output directory `dist`

For SPA routing, configure a catch-all rewrite to `index.html`:
- Vercel: add `"rewrites": [{"source": "/*", "destination": "/index.html"}]` to `vercel.json`
- Netlify: create `_redirects` with `/* /index.html 200`
