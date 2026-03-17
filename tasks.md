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
- **End-to-end validation** — Full pipeline confirmed working against a real Express app (Job Application Tracker). Installed `@tracedeck/sdk` via local path, added `traceDeckLogger` middleware; requests from JAT appeared in TraceDeck dashboard with correct endpoint, response time (165ms avg), and status code distribution (200/304). Auto-endpoint discovery (worker upsert) confirmed.

---

## Up Next

### SDK Integration UX

The `projectId` required by `@tracedeck/sdk` (and any custom adapter like the JAT test shim) is a UUID
that users must copy from their project and paste into their app's environment variables. Currently
there is no obvious place in the dashboard to find or copy it — users would have to dig it out of the
URL bar.

**Tasks:**

- [ ] **Display Project ID on the dashboard** — Show the UUID in the project header or settings area
  with a one-click copy button. Label it clearly as "Project ID" since that is the exact key users
  paste into their `.env` as `TRACEDECK_PROJECT_ID`.
- [ ] **Add SDK snippet to the dashboard** — Below the Project ID, show a ready-to-paste code block:
  ```js
  import { traceDeckLogger } from '@tracedeck/sdk';
  app.use(traceDeckLogger({
    ingestUrl: 'http://your-tracedeck-host/ingest',
    projectId: '<PROJECT_ID_PREFILLED_HERE>',
  }));
  ```
  Pre-fill the `projectId` value so users can copy the entire snippet without manually substituting anything.

**Why:** Without this, the integration workflow requires hunting for the UUID, which creates unnecessary
friction and increases the chance of misconfiguration. The Project ID is the single most critical piece
of information a user needs to connect their app to TraceDeck.
