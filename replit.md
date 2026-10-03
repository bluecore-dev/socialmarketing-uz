# Workspace — BlueCore SMM Agency (socialmarketing.uz)

## Project Goal
Full-stack SMM agency website: React+Vite frontend (3 languages: uz/ru/en), Express.js backend, PostgreSQL/Drizzle ORM, JWT auth with user cabinet, full admin CMS panel.

## Brand
- Primary: `#1A4F8A`, Secondary: `#0077CC`, Accent: `#00C4FF`
- Fonts: Cormorant Garamond (display/headings), DM Sans (body), JetBrains Mono (accents/labels)
- WhatsApp: wa.me/998911419988

## Premium Cinematic Design (Task 5)
- **Page Loader**: Logo reveal → fade out (sessionStorage once-per-session)
- **Scroll Progress Bar**: Gradient bar at top using Framer Motion `useScroll`
- **Custom Cursor**: Dot + ring, ring expands on hover — desktop only (pointer: fine)
- **Glass Morphism Header**: Blur intensifies on scroll, clip-path circle reveal mobile menu
- **Noise/Grain Texture**: CSS `body::before` with SVG noise, 3.5% opacity, fixed, animated
- **Hero**: Fullscreen video bg, cinematic overlay + vignette, blur→clear entrance animations
- **Smooth Scroll**: Lenis (`@studio-freight/lenis`) loaded lazily, respects `prefers-reduced-motion`
- **Scroll Animations**: `useScrollAnimation` hook with IntersectionObserver for fade+slide+blur
- **Counter Animations**: `useCounterAnimation` hook with requestAnimationFrame, scroll-triggered
- **Magnetic Hover**: `useMagneticHover` hook for CTA buttons — 15px radius, desktop only
- **Video Fallback**: `useVideoFallback` hook respects `navigator.connection` (slow → poster)
- **Parallax Sections**: `useScroll` + `useTransform` at 0.3-0.5x speed factor
- **Portfolio Grid**: Masonry layout with category filter + AnimatePresence transitions
- **Testimonials**: Swiper with FreeMode, grab cursor, autoplay, touch-friendly
- **Mobile CTA Bar**: Sticky bottom bar appears after scrolling 60% past hero
- **Fluid Typography**: CSS `clamp()` based fluid text classes (fluid-text-sm → fluid-text-hero)
- **Touch Targets**: 48×48px minimum on all mobile interactive elements
- **prefers-reduced-motion**: All animations and Lenis smooth scroll disabled/simplified

## Admin Access
- Admin account: created by the seed script; credentials are never stored in the repository.
- Admin panel: `/admin` (dark theme, requires admin or manager role)

## Auth Implementation
- POST /api/auth/login returns `{accessToken, user}` in response JSON
- Frontend stores `accessToken` in sessionStorage/localStorage (key: `bluecore_access_token`)
- `setAuthTokenGetter` in auth-context sets Bearer token for all API requests
- `/api/*` requests proxied by Vite from port 25703 → Express API on port 8080
- RefreshToken stored in httpOnly cookie (not used for initial auth check)

## Content Structure
- All DB content is JSONB `{uz: {...}, ru: {...}, en: {...}}` — use `getLocalizedContent()` helpers
- Blog API returns `{posts: [...], total, page, limit}` — use `blogQuery.data?.posts`
- Cases API returns array directly
- `useGetUsers` returns `{users: [...]}` — access as `data?.users`
- API params for pagination are strings: `page: "1"`, `limit: "20"` (not numbers)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
