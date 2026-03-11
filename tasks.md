# TraceDeck — Tasks & Build State

> This file tracks current build progress, active work, and the REST API implementation status.
> Update it whenever a meaningful change is made — scaffolding, new routes, schema migrations, etc.

---

## Build Status

| Package       | Status | Notes                                                                             |
| ------------- | ------ | --------------------------------------------------------------------------------- |
| `backend`     | Done   | Auth, Projects CRUD, Endpoints CRUD, Analytics routes, integration tests complete |
| `frontend`    | Done   | Phase 3 complete — auth, projects, dashboard, charts, and endpoints pages shipped |
| `sdk`         | Done   | `traceDeckLogger()` middleware implemented; zero dependencies, uses native fetch  |
| `sample-data` | Done   | Example Express service with 3 routes + autonomous traffic generator              |

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

- **Monorepo** — npm workspaces (`backend`, `frontend`, `sdk`, `sample-data`); all packages on ESM
- **Backend** — Express + Prisma + BullMQ stack; full schema (`User`, `Project`, `Endpoint`, `RequestLog`); 3 migrations; ingest queue + worker; Cognito auth middleware; Projects, Endpoints, and Analytics CRUD routes; `createApp` factory for testability; 19 Vitest + Supertest integration tests
- **SDK** — `traceDeckLogger()` Express middleware; zero dependencies; fire-and-forget ingest via native fetch
- **Sample data** — Express service with 3 routes and autonomous traffic generator (random requests every 1.5–4s)
- **Frontend** — React 19 + TypeScript + Vite + Tailwind, Linear-inspired dark theme. Cognito auth with sign-up and email verification; `AppShell` with sidebar and breadcrumb nav; `ProjectsPage`; `ProjectDashboardPage` with stat cards, time range selector, response time and status code charts (Recharts); `EndpointsPage` with usage table and add-endpoint form; TanStack Query hooks throughout

---

## Up Next
