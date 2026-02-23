# TraceDeck — Tasks & Build State

> This file tracks current build progress, active work, and the REST API implementation status.
> Update it whenever a meaningful change is made — scaffolding, new routes, schema migrations, etc.

---

## Build Status

| Package       | Status     | Notes                                           |
|---------------|------------|-------------------------------------------------|
| `backend`     | Scaffolded | Dependencies installed, no source code yet      |
| `frontend`    | Scaffolded | Dependencies installed, no source code yet      |
| `sdk`         | Scaffolded | Package defined, no `traceDeckLogger()` yet     |
| `sample-data` | Scaffolded | Package defined, no example service yet         |

---

## REST API Status

| Route group   | Status  | Notes                                           |
|---------------|---------|-------------------------------------------------|
| `POST /ingest`| Planned | Receives log payloads from SDK middleware       |
| Projects      | Planned | CRUD endpoints scoped to the authenticated user |
| Endpoints     | Planned | CRUD endpoints nested under a project           |
| Analytics     | Planned | Response times, status codes, usage metrics     |
| Auth          | Planned | Cognito JWT validation; no custom auth routes   |

---

## Completed

- Monorepo scaffolded with npm workspaces (`backend`, `frontend`, `sdk`, `sample-data`)
- Dependencies installed for backend (Express, Prisma, BullMQ, ioredis, etc.) and frontend (React 19, Vite, TanStack Query, React Router)
- All packages switched from CommonJS to ESM (`"type": "module"`)

---

## Up Next

- Set up TypeScript in `backend` (`tsconfig.json`, install `typescript`, `tsx`, `@types/*`)
- Set up TypeScript in `sdk`
- Write `backend/src/index.ts` — Express app entry point with middleware registration
- Define Prisma schema (`User`, `Project`, `Endpoint`, `RequestLog`)
- Run initial Prisma migration
