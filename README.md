# Health-y

A modern, privacy-first medication adherence and health informatics platform that helps patients track prescriptions, log doses, and access verified health information. See `healthyplan.md` for the broader product vision.

<!-- Badges: CI / build / tests — replace with actual badges after first CI run -->

## Table of Contents
- Quick Start
- Scripts & Commands
- Architecture Overview
- Folder Structure
- Environment Variables
- Database & Migrations
- Styling & Conventions
- Testing
- Troubleshooting & FAQ
- Roadmap

## Quick Start (developer)

Windows (PowerShell):

```powershell
git clone <repo-url>
cd health-y/client
cp .env.example .env.local
npm ci
npm run dev
```

Unix / macOS:

```bash
git clone <repo-url>
cd health-y/client
cp .env.example .env.local
npm ci
npm run dev
```

Open http://localhost:5173 (Vite default) after the client starts.

## Scripts & Commands

Run in `client/`:

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run test` — unit tests
- `npm run type-check` — TypeScript checks
- `npm run smoke:supabase` — read-only supabase smoke test
- `npm run smoke:supabase:full` — end-to-end smoke (local credentials required)

## Architecture Overview

- Frontend: React + Vite + TypeScript, Tailwind CSS for utilities
- Backend: Supabase (Postgres) with Auth and RLS policies
- Edge Functions: Supabase Edge Functions for secure server-side logic
- Future: pgvector for semantic matching and AI-driven features

See `healthyplan.md` for the full product and architecture roadmap.

## Folder Structure

- `client/` — React application
- `server/` — Supabase migrations, Edge Functions, seeds
- `client/scripts/` — helper scripts (smoke checks, CI helpers)

## Environment Variables

Do NOT commit secrets. Common env vars used locally:

- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anon/public key
- `SMOKE_EMAIL` / `SMOKE_PASSWORD` — local creds for smoke tests (keep private)

## Database & Migrations

Migrations and seeds are stored under `server/supabase/migrations` and `server/supabase/seeds`.

Current schema highlights:

- `profiles` — one row per authenticated user, synced from `auth.users`
- `medications` — public reference data used by the medication picker
- `prescriptions` — user-specific medication schedules
- `dose_logs` — adherence records for taken / missed / skipped doses

The initial schema also enables RLS on every table and creates an idempotent trigger that inserts or updates a `profiles` row when a user signs up.

Typical local workflow:

```bash
supabase start
supabase db reset
supabase db push
```

If you are using direct SQL instead of the Supabase CLI, apply `server/supabase/migrations/001_initial_schema.sql` first, then seed data from `server/supabase/seeds/seed.sql`.

Recommended checks when changing schema:

- Keep migrations idempotent where possible (`create table if not exists`, `create or replace function`, `drop trigger if exists`).
- Re-run the smoke tests after any schema or policy change.
- Verify RLS policies still allow the expected authenticated user flows.

## Styling & Conventions

- Tailwind is used for utility classes; CSS Modules are used for component-scoped styles.
- `client/src/styles/globals.css` must only contain `:root` tokens and Tailwind directives. CI enforces this rule.
- Shared primitives live under `client/src/components/primitives/`.

## Testing

- Unit tests: `npm run test`
- CI: `npm run test -- --ci` is run by the GitHub Actions workflow

## Troubleshooting & FAQ

**My dropdown options are blank or hard to read.**

- Confirm `client/src/styles/globals.css` only contains tokens and Tailwind directives.
- Check that the component styles are coming from CSS Modules or Tailwind classes, not old global selectors.

**`globals.css` keeps growing.**

- Move feature-specific styling into `*.module.css` files or `client/src/components/primitives/`.
- The CI globals check will fail if non-token content is added back.

**Smoke tests fail with auth or profile errors.**

- Re-check Supabase credentials and confirm the profile trigger exists in `server/supabase/migrations/001_initial_schema.sql`.
- Make sure the schema has been reset or pushed after migration changes.

**`npm run test -- --ci` does not work locally.**

- This repository uses Vitest; run `npm run test` for local checks.
- CI uses the same test command through the workflow.

## Roadmap

This project follows the phases described in `healthyplan.md`:

1. Day 0 foundation
- React + Vite app setup
- Supabase auth, schema, and RLS
- CI checks and smoke tests

2. Prescription tracking MVP
- Auth flows
- Add/edit prescriptions
- Log doses and review adherence

3. Notifications and automations
- Scheduled checks for missed doses
- Edge Function / notification integration

4. Health informatics and AI support
- Curated medication and health info hub
- Symptom-routing assistant
- Semantic resource matching with pgvector

Update this section as milestones change. Keep the detailed long-form plan in `healthyplan.md`.

---

This README is a living document — update sections as the project evolves. See `/docs` for longer guides (recommended once README grows).
