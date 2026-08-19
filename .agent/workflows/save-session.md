# Save Session Workflow

Triggered by: user typing `/save-session`, context budget hitting 80%+, or end of working session.

## Purpose

Persist the current session state so work can be resumed precisely in a future session without losing context, decisions, or progress.

## Steps

### Step 1: Collect Current State

Gather this information:
- What was the original goal/task?
- What was completed? (list specifically)
- What files were modified? (exact paths)
- What is the current code state? (working, broken, in-progress?)
- What decisions were made and why?
- What is the immediate next step?

### Step 2: Write Session File

Create the session file in `.sessions/` using this exact format:

```bash
# Filename format
.sessions/YYYY-MM-DD-HH-MM-[task-slug].md
# Example
.sessions/2026-07-14-18-30-auth-jwt-refresh.md
```

### Step 3: Session File Content

```markdown
# Session: [task-slug]
Date: YYYY-MM-DD HH:MM
Branch: [current git branch]
Duration: ~Xh Ym

## Goal
[The original task/feature being worked on — 1-2 sentences]

## Completed
- [Specific item 1 — e.g., "Created JWT refresh token service in src/auth/refresh.ts"]
- [Specific item 2]
- [Specific item 3]

## Modified Files
- `src/auth/refresh.ts` — Created. Handles token rotation logic.
- `src/auth/middleware.ts` — Updated. Added refresh token validation.
- `src/api/auth.routes.ts` — Updated. Added POST /auth/refresh endpoint.

## Current State
**Status:** [working / broken / in-progress — pick one]
**Last action:** [What was the last thing done?]
**Next immediate step:** [The very first thing to do when resuming]

## Key Decisions Made
- **Used rotating refresh tokens** (not static): Better security — old token invalidated on use
- **Stored refresh tokens in DB** (not cookie-only): Allows server-side revocation
- [Decision N]: [Rationale]

## Critical Context
- Refresh tokens expire in 30 days (configured in `.env`)
- Access tokens expire in 15 minutes
- Token rotation happens atomically — if DB write fails, old token stays valid
- `REFRESH_TOKEN_SECRET` env var must be different from `JWT_SECRET`
- Pattern uses repository pattern — `RefreshTokenRepository` in `src/auth/`

## Next Steps (Ordered)
1. Add tests for `RefreshTokenService` (zero tests currently)
2. Add E2E test for the full refresh flow
3. Add rate limiting on POST /auth/refresh (currently unprotected)
4. Update API documentation for the new endpoint
5. Update .env.example with new env vars

## Files Still Needing Changes
- `tests/auth/refresh.test.ts` — Needs to be created (step 1 above)
- `.env.example` — Needs `REFRESH_TOKEN_SECRET=` added
- `docs/api/auth.md` — Needs refresh endpoint documented
```

### Step 4: Verify the Save

After writing the file, confirm:
- `[ ]` Session file created in `.sessions/`
- `[ ]` All modified files listed with clear descriptions
- `[ ]` Next steps are specific and ordered
- `[ ]` Critical context would allow a cold-start resume
- `[ ]` Any uncommitted work is safe (committed, or clearly noted as not committed)

### Step 5: Optional — Git Commit

If work is in a stable state:
```bash
git add .
git commit -m "wip: [task-slug] — [brief state description]

Session saved. Resume from .sessions/YYYY-MM-DD-HH-MM-[task-slug].md"
```

## Output

Confirm to user:
```
Session saved to .sessions/[filename].md

Completed: [X items]
Next: [first next step]

Resume with: /resume-session [filename]
```
