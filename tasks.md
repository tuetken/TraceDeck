# TraceDeck — Tasks & Build State

> This file tracks current build progress, active work, and the REST API implementation status.
> Update it whenever a meaningful change is made — scaffolding, new routes, schema migrations, etc.

---

## Build Status

| Package       | Status     | Notes                                                                             |
| ------------- | ---------- | --------------------------------------------------------------------------------- |
| `backend`     | Done       | Auth, Projects CRUD, Endpoints CRUD, Analytics routes, integration tests complete |
| `frontend`    | In Progress | Phase 3.3 projects complete; Sidebar, ProjectsPage, useProjects hooks, Modal, Breadcrumb, ProjectCard wired |
| `sdk`         | Done       | `traceDeckLogger()` middleware implemented; zero dependencies, uses native fetch  |
| `sample-data` | Done       | Example Express service with 3 routes + autonomous traffic generator              |

---

## REST API Status

| Route group    | Status | Notes                                                                                      |
| -------------- | ------ | ------------------------------------------------------------------------------------------ |
| `GET /health`  | Done   | Returns `{ status: 'ok' }`                                                                 |
| `POST /ingest` | Done   | Enqueues job to BullMQ; worker persists to DB                                              |
| Projects       | Done   | Full CRUD scoped to the authenticated user (`routes/projects.js`)                          |
| Endpoints      | Done   | Full CRUD nested under a project (`routes/endpoints.js`)                                   |
| Analytics      | Done   | Summary + per-endpoint breakdown (`routes/analytics.js`); optional `?from`/`?to` filtering |
| Auth           | Done   | `middleware/auth.js` — verifies Cognito ID token, upserts user, sets `req.user`            |

---

## Completed

- Monorepo scaffolded with npm workspaces (`backend`, `frontend`, `sdk`, `sample-data`)
- Dependencies installed for backend (Express, Prisma, BullMQ, ioredis, etc.) and frontend (React 19, Vite, TanStack Query, React Router)
- All packages switched from CommonJS to ESM (`"type": "module"`)
- `backend/src/server.js` — Express app with CORS, dotenv, `GET /health`, error handler, and `/ingest` route
- `backend/src/routes/ingest.js` — `POST /ingest` enqueues payload to BullMQ; responds 202
- `backend/src/queue.js` — BullMQ `ingestQueue` with ioredis connection
- `backend/src/worker.js` — BullMQ worker: upserts `Endpoint`, creates `RequestLog`, graceful shutdown on SIGTERM/SIGINT
- `backend/src/lib/db.js` — Prisma client initialized with `PrismaPg` adapter
- `backend/src/prisma/schema.prisma` — Full schema: `User`, `Project`, `Endpoint`, `RequestLog`
- 3 Prisma migrations run: initial schema, endpoint unique constraint, DB-level UUID defaults
- `backend/src/middleware/auth.js` — Cognito ID token verification via `aws-jwt-verify`; upserts user on first login; attaches DB user to `req.user`
- `backend/src/routes/projects.js` — Full CRUD for Projects (`GET/POST /projects`, `GET/PUT/DELETE /projects/:id`), scoped to authenticated user
- `backend/src/routes/endpoints.js` — Full CRUD for Endpoints (`GET/POST /projects/:projectId/endpoints`, `GET/PUT/DELETE /projects/:projectId/endpoints/:id`)
- `backend/src/routes/analytics.js` — Analytics routes: summary aggregates and per-endpoint breakdown (`GET /projects/:projectId/analytics/summary`, `GET /projects/:projectId/analytics/endpoints`); supports optional `?from`/`?to` time filtering
- `backend/src/app.js` — Express app factory (`createApp(authMiddleware)`); decouples app setup from server startup to enable testing with mock auth
- `backend/src/test/` — Vitest + Supertest integration test suite: 19 tests across health, projects, endpoints, and analytics routes; mock auth bypasses Cognito; real DB with per-file isolated test users cleaned up after each run
- `sdk/index.js` — `traceDeckLogger(config)` Express middleware; zero dependencies (native fetch); fire-and-forget POST to `/ingest`; uses `req.baseUrl + req.path` for correct path capture at any mount depth
- Phase 3.1 frontend scaffold — `index.html`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx` with `QueryClientProvider`, `src/index.css` with dark theme CSS custom properties
- Phase 3.2 frontend auth — Cognito sign-in via `amazon-cognito-identity-js`, Axios instance with token interceptor, `LoginPage`, `ProtectedRoute`, React Router v7 wired in `App.tsx`
- Phase 3.3 frontend projects — `useProjects`, `useCreateProject`, `useDeleteProject` TanStack Query hooks; `Sidebar`, `Breadcrumb`, `Modal`, `ProjectCard` components; `ProjectsPage` with grid layout and create modal; `AppShell` layout with sticky sidebar; routes updated in `App.tsx`
- `sample-data/index.js` — Standalone Express service with `GET /api/users`, `POST /api/orders`, `GET /api/products/:id` routes; realistic status code and delay variation; autonomous traffic generator fires random requests every 1.5–4s

---

## Up Next

### Phase 3 — Frontend

Design reference: Linear dashboard aesthetic — near-black background, card-based layout, data-dense tables, Recharts for charts.
New packages needed: `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/vite`, `recharts`, `amazon-cognito-identity-js`.

#### ~~3.1 — Scaffold~~ ✓ Done

- `index.html` — Vite HTML entry, mounts `#root`
- `vite.config.ts` — React plugin + Tailwind Vite plugin
- `tsconfig.json` — Strict TypeScript config targeting ESNext
- `src/main.tsx` — ReactDOM entry, `<App />` wrapped in `QueryClientProvider`
- `src/index.css` — Tailwind `@import` + CSS custom properties for dark theme tokens
- `src/App.tsx` — Minimal placeholder; will be replaced in Phase 3.2

#### ~~3.2 — Auth~~ ✓ Done

- `frontend/.env` — `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_REGION`, `VITE_API_URL`
- `src/lib/auth.ts` — `signIn`, `signOut`, `getIdToken`, `isAuthenticated` wrapping `amazon-cognito-identity-js`
- `src/lib/api.ts` — Axios instance; request interceptor attaches Cognito id token; 401 interceptor redirects to `/login`
- `src/pages/LoginPage.tsx` — Email/password form, dark theme, error display
- `src/components/ProtectedRoute.tsx` — Checks session; redirects unauthenticated users to `/login`
- `src/App.tsx` — React Router v7 with `/login`, `/` (protected placeholder), and wildcard catch-all

#### ~~3.3 — Projects~~ ✓ Done
- `src/hooks/useProjects.ts` — `useProjects`, `useCreateProject`, `useDeleteProject` TanStack Query hooks
- `src/components/Sidebar.tsx` — Left nav with TraceDeck logo and project links
- `src/components/Breadcrumb.tsx` — Linear-style `A › B › C` nav
- `src/components/Modal.tsx` — Overlay modal for create forms
- `src/components/ProjectCard.tsx` — Card: name, description, created date
- `src/pages/ProjectsPage.tsx` — Grid of `<ProjectCard>`, "New Project" button opens modal
- `src/App.tsx` — `AppShell` layout with sticky `Sidebar`; `/projects` route added; `/` redirects to `/projects`

#### 3.4 — Dashboard (stats + layout)
- `src/hooks/useAnalytics.ts` — `useAnalyticsSummary(projectId, range)` and `useAnalyticsEndpoints(projectId, range)`; `range: '24h' | '7d' | '30d' | 'all'` converted to `?from`/`?to` ISO params
- `src/components/StatCard.tsx` — Label + large value display
- `src/components/TimeRangeSelector.tsx` — Button group: 24h / 7d / 30d / All
- `src/pages/ProjectDashboardPage.tsx` — Breadcrumb, time selector, stat cards row; chart placeholders

#### 3.5 — Charts
- `src/components/ResponseTimeChart.tsx` — Recharts `BarChart`, avg response time per endpoint
- `src/components/StatusCodeChart.tsx` — Recharts `BarChart`, status code counts color-coded by class (2xx green, 4xx yellow, 5xx red)
- Wire charts into `ProjectDashboardPage`

#### 3.6 — Endpoints
- `src/hooks/useEndpoints.ts` — `useEndpoints`, `useCreateEndpoint` TanStack Query hooks
- `src/components/MethodBadge.tsx` — Colored pill for GET / POST / PUT / DELETE
- `src/components/EndpointUsageTable.tsx` — Table: method, path, request count, avg response time
- `src/pages/EndpointsPage.tsx` — Breadcrumb, endpoint table, "Add Endpoint" inline form row
