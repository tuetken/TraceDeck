# TraceDeck — Developer-First API Monitoring Dashboard

TraceDeck is a lightweight API observability platform designed for solo developers and small teams who want clear insights into API performance without the overhead of enterprise monitoring tools.

TraceDeck captures request metadata through middleware, processes logs asynchronously using a Redis-backed queue, and presents performance analytics through a developer-focused dashboard. The goal is to provide meaningful analytics and system design transparency while maintaining a simple, practical developer experience.

---

## Overview

Modern monitoring platforms are powerful but often excessive for smaller projects. TraceDeck focuses on practical performance insights:

- Request performance metrics
- Endpoint usage analytics
- Multi-project organization
- Cloud-ready architecture

TraceDeck is built as both a usable monitoring tool and a backend engineering showcase, emphasizing middleware design, asynchronous ingestion, relational data modeling, and AWS deployment strategies.

---

## Core Concept

TraceDeck performs passive monitoring.

Instead of sending test requests to endpoints, TraceDeck observes real traffic flowing through an API via middleware. Request metadata is captured, queued asynchronously, and stored for analytics.

High-level flow:

Client Request  
→ API Service  
→ TraceDeck Middleware  
→ Redis Queue (BullMQ)  
→ Background Worker  
→ PostgreSQL  
→ Dashboard Analytics

---

## Key Features

### Passive API Monitoring

- Middleware captures request lifecycle data
- No modification to endpoint logic required

### Performance Analytics

- Response time tracking
- Status code distribution
- Endpoint usage metrics

### Multi-Project Workspaces

Inspired by developer tools like Postman:

User → Projects → Endpoints → Request Logs

Developers can organize multiple APIs and switch contexts quickly.

### Asynchronous Logging Pipeline

TraceDeck uses Redis and BullMQ to process logs in the background, preventing database writes from slowing down API responses.

### Developer-Focused Dashboard

- Table-based interface
- Dense request data
- Filtering and analytics views

---

## Architecture Overview

TraceDeck is composed of four primary components:

/frontend React frontend
/backend Express backend
/sdk TraceDeck logger package
/sample-data Sample API for generating traffic

### Data Flow

1. The example service or a developer’s API integrates the TraceDeck middleware.
2. Middleware captures request metadata.
3. Logs are sent to the TraceDeck backend.
4. BullMQ queues logging jobs in Redis.
5. Background workers write structured logs into PostgreSQL.
6. The dashboard queries aggregated analytics.

---

## Data Model (Simplified)

User
└── Project
└── Endpoint
└── RequestLog

### RequestLog fields

- endpoint_id
- method
- status_code
- response_time_ms
- ip_address
- user_agent
- created_at

Logs belong to endpoints, allowing analytics to be scoped per project.

---

## Tech Stack

### Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ

### Frontend

- React
- Developer-focused table UI

### Cloud / DevOps

- AWS EC2 (Docker deployment)
- AWS RDS (PostgreSQL)
- AWS Cognito (authentication)
- Route53 domain routing
- CI/CD pipeline

---

## Authentication

TraceDeck uses AWS Cognito for authentication and authorization.

- JWT-based sessions
- Project-scoped data access
- Cloud-native identity management

---

## Middleware SDK

TraceDeck includes a lightweight middleware package that developers install into their APIs:

```js
app.use(traceDeckLogger());

The middleware captures:
    •   HTTP method
    •   endpoint path
    •   response time
    •   IP address
    •   user agent
    •   status code

Logs are forwarded to the TraceDeck ingestion API.

---

Design Decisions

Passive Monitoring vs Active Polling:

TraceDeck focuses on passive monitoring through middleware instead of active endpoint polling. This emphasizes backend observability concepts such as request lifecycle interception and asynchronous ingestion rather than API testing workflows.

Redis Queue vs Direct Database Writes:

Logs are queued through Redis to prevent database operations from blocking request responses. This mirrors production logging pipelines while remaining lightweight enough for local development.

Relational Modeling:

A PostgreSQL schema was chosen to model user, project, endpoint, and log relationships explicitly. This structure aligns with SaaS-style data ownership and supports efficient aggregation queries.
```
