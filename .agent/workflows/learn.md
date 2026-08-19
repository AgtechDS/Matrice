# Learn Workflow
## Extract Session Learnings into Instincts

Triggered by: `/learn` at the end of a session, after debugging, or after solving a tricky problem.

## Purpose

Convert the implicit knowledge gained in this session into an explicit, reusable instinct. This is the mechanism for the system to improve over time.

## When to Use

- After solving a bug that required unexpected discovery
- After finding a better pattern than what we were using
- After debugging something that took longer than it should
- After discovering a project-specific convention
- After learning something about a library that isn't obvious from docs

## Process

### Step 1: Session Review

Reflect on what happened this session:
- What problems were encountered?
- What was tried that didn't work?
- What finally worked?
- What would you tell your past self at the start of this session?
- What would save time next time?

### Step 2: Pattern Extraction

From the session review, identify learnable patterns:

**Good pattern candidates:**
- A non-obvious solution that took research/trial-and-error to find
- A project-specific convention that isn't documented
- A library behavior that surprised you
- An anti-pattern that causes a class of bugs
- A testing strategy that worked well for this type of code

**Not good pattern candidates:**
- Something obvious that any developer would know
- A one-off hack that won't apply again
- A workaround for a bug that will be fixed
- Anything already covered in official docs and skills

### Step 3: Create the Instinct File

For each pattern identified, create a file in `.agent/instincts/[domain]/`:

```
.agent/instincts/
├── frontend/
│   └── react-hook-form-zod-resolver.md
├── backend/
│   └── prisma-transaction-rollback.md
├── architecture/
│   └── feature-barrel-exports.md
└── ...
```

**File naming:** `[specific-pattern-name].md` — be specific, not generic.

**File format:**
```markdown
---
type: instinct
name: [pattern name in words]
domain: [frontend|backend|architecture|security|testing|devops|mobile|ai|database|design]
confidence: 0.5
extracted-from: session [YYYY-MM-DD] — [brief context]
created: YYYY-MM-DD
last-validated: YYYY-MM-DD
---

## Pattern
[One sentence: what was learned]

## Context
[When does this apply? What are the triggers?]

## Action
[What to DO — specific, executable]

## Evidence
[What happened that led to this learning — the concrete story]

## Examples
[Real code if possible]

## Anti-Pattern
[What NOT to do]

## References
- [Related skill, agent, or file]
```

### Step 4: Update the Index

Add the new instinct to `.agent/instincts/INDEX.md`:

```markdown
| instincts/[domain]/[file].md | [domain] | 0.5 | Draft |
```

### Step 5: Validate

Ask yourself:
- Would another developer find this useful?
- Is the action specific enough to execute?
- Is the evidence real (not hypothetical)?
- Does it conflict with any existing instinct?

If yes to first 4 and no to conflict → instinct is valid.

## Output

After creating instinct(s):

```
Learning extracted ✅

Pattern: [pattern name]
Domain: [domain]
Confidence: 0.5 (Draft)
File: .agent/instincts/[domain]/[file].md

Action: This pattern will be suggested in future sessions when [trigger condition].

To increase confidence: validate this pattern in [N] more sessions,
then update confidence to 0.7+ in the instinct file.
```

## Examples of Good Instincts

### Good Example — Specific and Actionable
```markdown
---
name: zod-discriminated-union-for-api-responses
domain: backend
confidence: 0.75
---

## Pattern
Use Zod discriminated unions for API response types instead of optional fields.

## Action
When defining API response types, use `z.discriminatedUnion('success', [...])` 
instead of `{ success: boolean, data?: T, error?: string }`.

## Evidence
Session 2026-07-10: Spent 2 hours debugging type errors because optional fields
allowed invalid states (success=true with no data, success=false with data).
Discriminated union made invalid states unrepresentable.
```

### Bad Example — Too Generic
```markdown
---
name: use-typescript
domain: backend
confidence: 0.9
---

## Pattern
TypeScript is better than JavaScript.
```
*This is already known knowledge. Not a useful instinct.*

## Learn Workflow vs. Save Session

| Workflow | When | Purpose |
|----------|------|---------|
| `/learn` | During or after session | Extract reusable knowledge patterns |
| `/save-session` | When context is high or session ends | Save progress state for resuming |

These complement each other — use both at end of productive sessions.
