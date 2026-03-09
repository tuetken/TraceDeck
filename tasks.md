# TraceDeck — Tasks & Build State

> This file tracks current build progress, active work, and the REST API implementation status.
> Update it whenever a meaningful change is made — scaffolding, new routes, schema migrations, etc.

---

## Build Status

| Package       | Status      | Notes                                                                          |
|---------------|-------------|--------------------------------------------------------------------------------|
| `backend`     | Done        | Auth, Projects CRUD, Endpoints CRUD, Analytics routes, integration tests complete |
| `frontend`    | Scaffolded  | Dependencies installed, TypeScript not configured, no source code yet           |
| `sdk`         | Scaffolded  | Package defined, no `traceDeckLogger()` yet                                    |
| `sample-data` | Scaffolded  | Package defined, no example service yet                                        |

---

## REST API Status

| Route group    | Status      | Notes                                                       |
|----------------|-------------|-------------------------------------------------------------|
| `GET /health`  | Done        | Returns `{ status: 'ok' }`                                 |
| `POST /ingest` | Done        | Enqueues job to BullMQ; worker persists to DB               |
| Projects       | Done        | Full CRUD scoped to the authenticated user (`routes/projects.js`) |
| Endpoints      | Done        | Full CRUD nested under a project (`routes/endpoints.js`)    |
| Analytics      | Done        | Summary + per-endpoint breakdown (`routes/analytics.js`); optional `?from`/`?to` filtering |
| Auth           | Done        | `middleware/auth.js` — verifies Cognito ID token, upserts user, sets `req.user` |

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

---

## Up Next

### Phase 2 — SDK + traffic generation
- Implement SDK `traceDeckLogger()` middleware
- Build out `sample-data` example service (integrates SDK, generates realistic traffic)

### Phase 3 — Frontend (complete API and real data exist before any UI is written)
- Set up frontend: TypeScript, `@vitejs/plugin-react`, Tailwind, `vite.config.ts`, React entry point
- Frontend pages and components: Dashboard, Projects view, Analytics view
