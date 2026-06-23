# AGENTS.md — Meal Panner

## Project Overview

A single-user meal planning web application for managing family daily meals. Inspired by a Google Sheets-based system. Built to learn full-stack development, testing, CI/CD, and deployment with AI assistance.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NextJS (App Router) — frontend + backend API |
| Database | PostgreSQL (Neon DB — serverless) |
| ORM | Drizzle ORM + drizzle-kit |
| Testing | Vitest + React Testing Library |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend/backend) + Neon DB |
| Package Manager | pnpm |
| Auth | None (single user) |

## Source of Truth

Reference spreadsheet: `https://docs.google.com/spreadsheets/d/1XNrwu13UUqDjjcdVXrXhUzaxyVn9v2pRCqVUfa7MHf4/edit`

Contains daily meal plans from November 2024 through approximately June 2026.

## Data Model (from Spreadsheet)

The spreadsheet has one main sheet with these column groups:
- **Siang (Lunch)**: Day/Date, Menu + family assignments in parentheses, Notes
- **Malam (Dinner)**: Day/Date, Menu + family assignments, Notes
- **Anytime**: Additional flexible meal slots/notes

### Family Members

| Code | Role |
|------|------|
| AA | 1st Child |
| Wayah | GrandFather |
| Dika | 3rd Child |
| Cici | 2nd Child |
| Papa | Father |
| Mama | Mother |
| Semua | Everyone |

### Annotations
- `[[ ]]` — Family member activities/context (e.g., `[[ AA Kantor ]]`, `[[ Dika Les ]]`, `[[ Cici Kampus ]]`)
- Parentheses `(AA, Wayah)` — Who is eating a specific meal

### Leetspeak Clarification
The leetspeak numbers in the sheet (e.g., `53mv4`, `K4w4n`) are NOT encoding/decoding feature. They are the user's personal convention to mark whether a food has been "already eaten" or "not yet eaten". This is NOT a feature to build.

## Database Schema (Drizzle ORM)

### `family_members`
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | Full name |
| code | text | Short code (AA, Wayah, etc.), unique |
| emoji | text | Optional icon |
| is_active | boolean | Default true |
| created_at | timestamp | Default now |

### `meal_slots`
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | Siang, Malam, Anytime |
| icon | text | Optional icon |
| sort_order | integer | Display ordering |
| created_at | timestamp | Default now |

### `meals`
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| date | date | Meal date |
| meal_slot_id | integer | FK → meal_slots |
| menu_name | text | Food/restaurant name |
| restaurant_name | text | Nullable |
| assigned_members | jsonb | Array of member codes |
| activities | jsonb | Array of `[[ ]]` annotations |
| notes | text | Quality notes/reviews |
| rating | integer | Nullable, 1-5 |
| created_at | timestamp | Default now |
| updated_at | timestamp | Default now |

## Feature List

1. **Calendar Dashboard** — Weekly/daily view similar to spreadsheet layout
2. **Meal CRUD** — Create, read, update, delete meals per day per slot
3. **Family Member Picker** — Select who eats each meal with activity annotations
4. **Notes & Rating** — Free-text notes and 1-5 star rating per meal
5. **Meal History** — Browse/search past meals
6. **Statistics** — Most ordered restaurants, frequency analysis (future)
7. **Historical Data Import** — Script to parse exported CSV from Google Sheets and insert into DB

## Development Phases

### Phase 0 — Project Setup
- Init NextJS + TypeScript + pnpm
- Configure Drizzle + Neon PostgreSQL connection
- Setup ESLint + Prettier
- Init Git repo + GitHub remote
- Create GitHub Actions (basic lint workflow)

### Phase 1 — Database Schema & Migrations
- Define Drizzle schema for all tables
- Run migrations to Neon DB
- Seed data: family members (AA, Wayah, Dika, Cici, Papa, Mama), meal slots (Siang, Malam)

### Phase 2 — Core API Routes
- `GET /api/meals?startDate=&endDate=` — List meals by date range
- `POST /api/meals` — Create meal
- `PUT /api/meals/[id]` — Update meal
- `DELETE /api/meals/[id]` — Delete meal
- `GET /api/family-members` — List family members
- `GET /api/meal-slots` — List meal slots

### Phase 3 — UI Components
- Weekly calendar grid (Siang/Malam columns per day)
- Meal form (date picker, slot selector, menu input, family picker, notes, rating)
- Family member badges with emoji icons
- Editable inline notes

### Phase 4 — Historical Data Import
- Script to parse Google Sheets CSV export
- Map spreadsheet columns to DB schema
- Batch insert with date range validation

### Phase 5 — Testing
- Unit tests: utility functions, date formatting
- Integration tests: API routes (using test DB)
- Component tests: UI components (React Testing Library)

### Phase 6 — CI/CD Pipeline
- GitHub Actions workflow:
  - `pnpm install`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`

### Phase 7 — Deployment
- Connect GitHub repo to Vercel
- Set Neon DB connection string in Vercel environment variables
- Deploy production

## Project Location

`C:\Users\Made Indratama\Projects\test-new-meal-panner`

## Learning Goals

- Git & GitHub workflow
- CI/CD pipeline setup (GitHub Actions)
- Server deployment (Vercel + Neon)
- Testing methodology (unit, integration, component)
- AI-assisted development workflow

## Key Constraints

- Single user, no authentication
- PostgreSQL via Neon DB (serverless, free tier: 0.5GB)
- Historical data must be importable from Google Sheets CSV export
- Mobile-responsive UI (family accesses from phones)
