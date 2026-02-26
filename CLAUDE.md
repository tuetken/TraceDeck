# TraceDeck — CLAUDE.md

> This file covers **how to work** on TraceDeck: coding conventions, patterns, and workflows.
> For system design, data model, tech stack, and file structure, see @architecture.md.
> For current build state, task tracking, and REST API progress, see @tasks.md.
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

