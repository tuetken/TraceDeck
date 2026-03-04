# TraceDeck — Architecture Reference

TraceDeck is a lightweight API observability platform for solo developers and small teams. It
captures request metadata through passive middleware, processes logs asynchronously via a
Redis/BullMQ pipeline, and presents performance analytics through a developer-focused dashboard.

---

## Data Flow

```
Client Request
→ Developer's API (with TraceDeck Middleware)
→ POST /ingest to TraceDeck Backend
→ Redis Queue (BullMQ)
→ Background Worker
→ PostgreSQL (via Prisma)
→ Dashboard (React frontend)
```

---

## Data Model

```
User
└── Project
    └── Endpoint
        └── RequestLog
              ├── endpoint_id
              ├── method
              ├── status_code
              ├── response_time_ms
              ├── ip_address
              ├── user_agent
              └── created_at
```

---

## Component Responsibilities

**`/backend`** — Express.js REST API and BullMQ workers. Owns ingestion, authentication
middleware (Cognito JWT validation), and all database access through Prisma. Never trusts
client-supplied user IDs — identity is always extracted from the verified JWT.

**`/frontend`** — React 19 dashboard. Displays performance analytics (response times, status
code distributions, endpoint usage). All server state managed through TanStack Query. No
`useState` + `useEffect` data fetching.

**`/sdk`** — Lightweight `traceDeckLogger()` middleware package developers drop into their own
APIs. Must stay lean — minimal dependencies, Express-compatible, fires-and-forgets log payloads
to the TraceDeck ingestion endpoint without blocking the request lifecycle.

**`/sample-data`** — Standalone example service that integrates the SDK and generates realistic
traffic against a local TraceDeck setup. Used for development and demos.

---

## Tech Stack

| Layer            | Technology                                       |
|------------------|--------------------------------------------------|
| Backend runtime  | Node.js (ESM, JavaScript)                        |
| Backend framework| Express.js                                       |
| ORM              | Prisma 7                                         |
| Database         | PostgreSQL                                       |
| Queue            | BullMQ + Redis (ioredis)                         |
| Auth             | AWS Cognito (JWT)                                |
| Frontend         | React 19, Vite, TypeScript                       |
| Server state     | TanStack React Query                             |
| Routing          | React Router v7                                  |
| Styling          | Tailwind CSS                                     |
| HTTP client      | Axios                                            |

---

## Expected File/Folder Structure

### Backend

```
backend/
├── src/
│   ├── server.js             # Express app entry point, middleware registration
│   ├── routes/               # One file per resource (projectRoutes.js, etc.)
│   ├── services/             # Business logic delegated from route handlers
│   ├── workers/              # BullMQ job processors
│   ├── queues/               # Queue definitions and job producers
│   ├── middleware/           # Auth, error handler, async wrapper
│   └── prisma/
│       └── schema.prisma     # Database schema
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Router setup
│   ├── pages/                # Route-level components (Dashboard.tsx, etc.)
│   ├── components/           # Reusable UI components (PascalCase filenames)
│   ├── hooks/                # TanStack Query hooks (useProjects.ts, etc.)
│   └── lib/                  # Axios instance, shared utilities
├── index.html
├── vite.config.ts
└── package.json
```

---

## Key Design Decisions

**Passive monitoring over active polling.** TraceDeck observes real traffic through middleware
rather than sending synthetic test requests. This keeps the focus on backend observability
concepts: request lifecycle interception and asynchronous ingestion.

**Redis queue instead of direct DB writes.** Queuing log jobs through BullMQ prevents database
I/O from adding latency to the monitored API's response. Workers fail gracefully with retry
logic and dead-letter queue handling — silent failures are not acceptable.

**Relational data model.** PostgreSQL was chosen to model the User → Project → Endpoint →
RequestLog hierarchy explicitly. This structure reflects SaaS-style data ownership and supports
efficient analytics aggregation queries scoped per project or endpoint.

---

## AWS Infrastructure

- **EC2** — Docker-based deployment for the backend service
- **RDS** — Managed PostgreSQL database
- **Cognito** — User auth and JWT issuance; tokens validated on every protected route
- **Route53** — DNS routing to the deployed application
- **CI/CD** — Automated pipeline for build and deployment (details TBD)

