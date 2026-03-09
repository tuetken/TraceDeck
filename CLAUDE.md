# TraceDeck — CLAUDE.md

> This file covers **how to work** on TraceDeck: coding conventions, patterns, and workflows.
> For system design, data model, tech stack, and file structure, see @architecture.md.
> For current build state, task tracking, and REST API progress, see @tasks.md.
> For project overview and goals, see @README.md.

---

## Task Tracking

After every meaningful change — new route, schema migration, scaffolding, config update — review
[tasks.md](tasks.md) and update it to reflect the current state. This keeps the build log accurate
and "Up Next" actionable at all times.

- Move completed items from "Up Next" into the "Completed" section.
- Update the **Build Status** and **REST API Status** tables if the change affects them.
- Add newly discovered work to "Up Next" if it surfaces during implementation.

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

