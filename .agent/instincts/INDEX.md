# Instinct System Index
## AgTechDesigne Continuous Learning — Active Instincts

> **System:** Antigravity / ECC-inspired Continuous Learning v1  
> **Updated:** 2026-07-14  

---

## What Are Instincts?

Instincts are **structured knowledge units** extracted from development sessions. They represent patterns, solutions, and anti-patterns that have been discovered through real work and should be applied proactively in future sessions.

Unlike general skills (which are domain knowledge), instincts are **specific to our codebase and team patterns**.

## Confidence Levels

| Level | Range | How Applied |
|-------|-------|------------|
| Draft | 0.0–0.4 | Not applied automatically — needs validation |
| Emerging | 0.4–0.7 | Applied cautiously — mentioned as suggestion |
| Established | 0.7–0.9 | Applied proactively — recommended strongly |
| Core | 0.9–1.0 | Always applied — core team pattern |

---

## Active Instincts

| File | Domain | Confidence | Status |
|------|--------|-----------|--------|
| *(none yet — instincts are added through `/learn` workflow)* | — | — | — |

---

## How to Add an Instinct

After a debugging session, refactoring, or discovering a pattern:

1. Run the `/learn` workflow
2. The system extracts the pattern into a new instinct file
3. Set confidence based on how well-established the pattern is
4. Add to the INDEX table above

## Instinct File Format

```markdown
---
type: instinct
name: [kebab-case-name]
domain: [frontend|backend|architecture|security|testing|devops|mobile|ai]
confidence: 0.75
extracted-from: [session date or context description]
created: YYYY-MM-DD
last-validated: YYYY-MM-DD
---

## Pattern
[One clear sentence: what pattern was learned]

## Context
[When does this apply? What situations trigger this?]

## Action
[What should the agent DO when this pattern matches?
Be specific — this is executed, not just read]

## Evidence
[What led to this pattern being discovered?
Be specific: "Found when debugging auth loop on 2026-07-10 — the problem was X"]

## Examples
[Concrete examples from our codebase — real file names if possible]

\`\`\`typescript
// Correct pattern
\`\`\`

## Anti-Pattern
[What NOT to do — the thing that led to the problem]

\`\`\`typescript
// Wrong — what we were doing before
\`\`\`

## References
- [Related skill or agent]
- [Related file in codebase if applicable]
```

---

## Instinct Lifecycle

```
Session Discovery
      ↓
/learn command (extract pattern)
      ↓
Draft instinct (confidence 0.3)
      ↓
Validate in next session (did it work?)
      ↓
Emerging (confidence 0.5–0.7)
      ↓
Confirmed in 3+ sessions
      ↓
Established (confidence 0.75–0.9)
      ↓
Standard team pattern
      ↓
Core (confidence 0.95+) → Promote to official skill
```

---

## Domain Categories

| Domain | Examples |
|--------|---------|
| `frontend` | React patterns, styling, component structure |
| `backend` | API patterns, Node.js, Python patterns |
| `architecture` | Module organization, dependency patterns |
| `security` | Auth patterns, validation, sanitization |
| `testing` | Test setup, mock patterns, test organization |
| `devops` | Build issues, deployment, CI/CD |
| `mobile` | React Native, Expo patterns |
| `ai` | LLM integration, prompt patterns, agent routing |
| `database` | Query patterns, migration patterns |
| `design` | UI patterns, color, layout, animation |
