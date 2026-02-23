# TraceDeck — CLAUDE.md

> This file covers **how to work** on TraceDeck: coding conventions, patterns, and workflows.
> For system design, data model, tech stack, and file structure, see @architecture.md.
> For project overview and goals, see @README.md.

---

## Coding Philosophy

**Readability first, conciseness by discipline.**

- Write code that reads clearly at a glance. Intent should be obvious without tracing through
  abstractions.
- Avoid premature optimization. Optimize only when there is a clear, measured need.
- Do not sacrifice clarity for brevity. Short code that requires mental translation is worse than
  slightly longer code that communicates intent.
- Avoid over-engineering. Simple, direct solutions are preferred over clever or highly abstracted
  ones.
- No unnecessary abstractions. If something is used only once, write it inline.
- Comments should explain _why_, not _what_. If you need a comment to explain what the code does,
  consider rewriting it to be self-evident.

---

## Naming Conventions

| Thing                   | Convention             | Example                     |
| ----------------------- | ---------------------- | --------------------------- |
| Variables and functions | `camelCase`            | `requestLog`, `getProject`  |
| Types and interfaces    | `PascalCase`           | `RequestLog`, `ProjectData` |
| React components        | `PascalCase`           | `EndpointTable`             |
| Component files         | `PascalCase`           | `EndpointTable.tsx`         |
| Non-component files     | `camelCase`            | `projectService.ts`         |
| Prisma models           | `PascalCase`           | `RequestLog`                |
| Database columns        | `snake_case`           | `response_time_ms`          |
| True constants          | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_ATTEMPTS`        |

---

## TypeScript Conventions

- Explicit types on function parameters and return values — never rely on inference at boundaries.
- Avoid `any`. Use `unknown` and narrow with type guards when the shape is uncertain.
- Use `type` for data shapes; use `interface` for extensible contracts (e.g., Express-augmented
  request types).
- Co-locate types with where they are used. Only move a type to a shared location if multiple
  modules genuinely need it.
- Prefer inference for local variables when the type is obvious from the right-hand side.

```typescript
// Good — explicit at the boundary, inferred locally
async function getProject(id: string): Promise<Project> {
  const row = await db.project.findUniqueOrThrow({ where: { id } });
  return row;
}

// Avoid — any erases type safety
function process(data: any) { ... }
```

---

## Error Handling

**Pattern: centralized Express middleware + explicit `try/catch` on critical async operations.**

- All Express routes bubble errors to a centralized error handler via `next(err)`.
- Async route handlers must be wrapped (or use an async wrapper utility) so uncaught promise
  rejections reach the error handler.
- Use explicit `try/catch` around critical async operations (queue jobs, external HTTP calls,
  DB writes) to add context before rethrowing.
- Log errors with enough context to debug: include the operation name and relevant IDs.
- Never swallow errors silently.

```typescript
// Route handler — bubble to centralized handler
router.get("/projects/:id", async (req, res, next) => {
  try {
    const project = await getProject(req.params.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// Critical async op — add context, rethrow
async function persistLog(logId: string, data: LogData): Promise<void> {
  try {
    await db.requestLog.create({ data });
  } catch (err) {
    throw new Error(`Failed to persist log ${logId}: ${(err as Error).message}`);
  }
}
```

---

## Adding Features

### New API Endpoint (Backend)

1. If the feature needs a schema change, update `schema.prisma` and run `prisma migrate dev`.
2. Add a route file under `backend/src/routes/`.
3. Write a thin handler — delegate business logic to a service function in `backend/src/services/`.
4. Register the route in the main Express app entry point.
5. Test with a REST client before wiring the frontend.

### New React Component (Frontend)

1. Create the component file under `frontend/src/components/` using a `PascalCase` filename.
2. Keep the component focused on rendering. Move data fetching into a TanStack Query hook in
   `frontend/src/hooks/`.
3. Style with Tailwind utility classes in JSX. Avoid inline `style` props.
4. Use React Router for navigation. Do not manipulate `window.location` directly.

### New Data Model

1. Add the model and its relations to `schema.prisma`.
2. Run `prisma migrate dev --name <descriptive-name>`.
3. Write service functions that interact with the new model.
4. If user-facing, expose it through a new or existing route.

---

## Debugging

### Backend

- `console.log` freely during development; remove before committing.
- If BullMQ jobs are not processing, verify Redis connectivity first.
- Use `npx prisma studio` to inspect database state without writing queries.
- For route issues, log at the top of the handler to confirm it is being reached before debugging
  deeper.

### Frontend

- React Query DevTools (available in dev mode) show query state and cache — use these before
  reaching for browser DevTools.
- For component rendering issues, check what props are being passed before assuming the component
  logic is wrong.
- Use the browser Network tab to confirm request and response shapes match what the frontend
  expects.

---

## Project-Specific Rules

- **SDK stays lean.** The `/sdk` package must have minimal dependencies — developers install it
  into their own APIs, so bloat is unacceptable.
- **BullMQ workers must be resilient.** Use retry logic and dead-letter queue handling for failed
  jobs. Silent job failures are not acceptable.
- **All database access goes through Prisma.** No raw SQL unless there is a documented, performance-
  justified reason.
- **Never trust client-supplied user IDs.** AWS Cognito tokens are validated on every protected
  route. Extract the user identity from the verified JWT, not from request params or body.
- **TanStack Query for all server state.** Do not use `useState` + `useEffect` to fetch and store
  server data in the frontend.
