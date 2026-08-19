# Resume Session Workflow

Triggered by: user typing `/resume-session [filename]` or `/resume-session` (lists available sessions).

## Purpose

Reload a saved session context and resume work precisely where it was left off, without requiring the user to re-explain the entire context.

## Steps

### Step 1: Identify the Session File

If a filename is provided:
```bash
# Load the specific session
.sessions/[provided-filename]
```

If no filename provided, list available sessions:
```bash
# List sessions, most recent first
Get-ChildItem .sessions -Filter "*.md" | Sort-Object LastWriteTime -Descending
```

Show the user the list and ask which to resume.

### Step 2: Read the Session File

Read the complete session file from `.sessions/`. Extract:
- **Goal** — What we're building
- **Current State** — Where code is right now
- **Next Steps** — What to do first
- **Critical Context** — Key facts that must be remembered
- **Modified Files** — What's already been done
- **Files Still Needing Changes** — The remaining work

### Step 3: Verify Current Codebase State

Before resuming, confirm the codebase matches the session:

```bash
# Check current branch matches session branch
git branch --show-current

# Check for any uncommitted changes
git status

# Check the files mentioned in the session exist
# (read each "Modified File" briefly to confirm state)
```

If branch doesn't match: ask user to confirm or switch.
If uncommitted changes exist: show them and ask how to proceed.

### Step 4: Restore Context

Output a context restoration summary:

```markdown
## Session Restored ✅

**Task:** [Goal from session file]
**Branch:** [branch name]
**Status:** [Current State from session file]

**What was done:**
- [Completed item 1]
- [Completed item 2]
- [Completed item 3]

**Key context:**
- [Critical context point 1]
- [Critical context point 2]
- [Critical context point 3]

**Resuming from:**
→ [Next Steps #1 from session file]
```

### Step 5: Resume Work

Immediately begin working on "Next Steps #1" from the session file. Do not ask the user to repeat the context — it's already loaded.

If the next step is code:
- Read only the specific file(s) needed for that step
- Do not re-read all modified files (context budget)
- Write the implementation
- Run the verification loop when done

## Special Cases

### Session File Not Found
```
Session file not found: [filename]

Available sessions:
1. 2026-07-14-18-30-auth-jwt-refresh.md — JWT refresh token implementation
2. 2026-07-13-15-20-dashboard-ui.md — Dashboard analytics UI

Which would you like to resume? (Enter number or filename)
```

### Multiple Sessions Available (No Filename Given)
Show sorted list and ask. Group by date if many sessions exist.

### Session is Stale (>7 days old)
Warn the user:
```
⚠️  This session is 14 days old. The codebase may have changed significantly.

Recommend: 
1. Read git log since [session date] to understand what changed
2. Re-verify the "Modified Files" are in the expected state
3. Check if "Next Steps" are still valid or superseded

Continue anyway? (y/n)
```

### Session State is "broken"
```
⚠️  Session was saved in BROKEN state.

The last action was: [last action from session]
The issue was: [inferred or stated]

Recommend starting with diagnosis before resuming normal work.
Activate @debugger agent? (y/n)
```

## Sessions Directory Management

### Creating the Directory (first time)
```bash
# Create .sessions directory if it doesn't exist
New-Item -ItemType Directory -Force -Path ".sessions"

# Add to .gitignore (sessions are personal, not shared)
Add-Content .gitignore "`n# AI session files`n.sessions/"
```

### Archiving Old Sessions
After a task is fully complete:
```bash
# Move to archive
New-Item -ItemType Directory -Force -Path ".sessions/archive"
Move-Item ".sessions/[completed-session].md" ".sessions/archive/"
```

### Listing All Sessions
```bash
# Recent sessions (last 10)
Get-ChildItem .sessions -Filter "*.md" -Exclude "archive" | 
  Sort-Object LastWriteTime -Descending | 
  Select-Object -First 10 |
  Format-Table Name, LastWriteTime, Length
```
