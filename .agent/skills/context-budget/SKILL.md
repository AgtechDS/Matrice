---
name: context-budget
description: Context window management and optimization. Tracks token utilization and provides strategies to avoid context overflow. Activate when sessions are long, when working on multi-file features, or when the AI signals context pressure.
---

# Context Budget Management

Managing the context window is critical for maintaining quality across long sessions. Context overflow leads to forgotten instructions, degraded reasoning, and missed requirements.

## When to Activate

- Session is running long (60+ minutes of continuous work)
- Working on multi-file features with many code reads
- The AI mentions it's approaching context limits
- Quality of responses starts degrading or previous instructions are forgotten
- Before starting a major refactoring task

## Context Risk Thresholds

| Utilization | Risk Level | Strategy |
|-------------|-----------|---------|
| 0–60% | 🟢 Low | Normal operation — full feature work |
| 60–80% | 🟡 Medium | Avoid large multi-file changes. Finish current sub-task before reading more files |
| 80–90% | 🔴 High | Single-file edits only. Create checkpoint before continuing |
| > 90% | 🚨 Critical | STOP current task. Checkpoint → summarize → start fresh session |

## Warning Signs of Context Pressure

- AI refers to "the code we looked at earlier" but makes mistakes about it
- Instructions from early in the session are no longer followed
- AI asks to re-read files already read in this session
- Responses become generic or repetitive
- AI contradicts decisions made earlier in the session

## Strategies by Utilization Level

### 60-80% — Medium Risk
1. **Finish the current sub-task** before starting anything new
2. **Avoid reading large files** — summarize instead of full reads
3. **Prioritize** — choose the most impactful remaining work
4. **Use targeted grep** instead of reading entire files
5. **Summarize completed work** in your next message

### 80-90% — High Risk
1. **Single file only** — one file per exchange
2. **No new feature exploration** — finish only what's in progress
3. **Create a checkpoint** (see format below)
4. **Write down** what decisions were made and why

### >90% — Critical
1. **STOP immediately**
2. **Write the checkpoint** (full format below)
3. **Commit current work** if it's in a good state
4. **Start a fresh session** with only the checkpoint as context

## Checkpoint Format

Create `.sessions/checkpoint-[date]-[task-slug].md`:

```markdown
# Session Checkpoint
Date: YYYY-MM-DD HH:MM
Task: [brief task description]
Branch: [git branch name]

## Completed in This Session
- [specific item 1 with file name if applicable]
- [specific item 2]
- [specific item 3]

## Current State
- Working on: [current task/file]
- Last file modified: [path/to/file.ts]
- Status: [what state the code is in — working, broken, in-progress]

## Key Decisions Made
- [Decision]: [Rationale — brief but complete]
- [Decision]: [Rationale]

## Next Steps (Ordered)
1. [First thing to do in next session]
2. [Second thing]
3. [Third thing]

## Critical Context for Next Session
- [Fact 1 that must not be forgotten]
- [Fact 2]
- [API or pattern being used]
- [Any gotcha discovered]

## Files That Were Changed
- `path/to/file1.ts` — [what changed]
- `path/to/file2.ts` — [what changed]

## Files That Need Changes (Not Done Yet)
- `path/to/file3.ts` — [what still needs to be done]
```

## Resuming from a Checkpoint

When starting a new session with a checkpoint:

```
"Resuming from checkpoint: [paste checkpoint content]
Pick up from: [Next Steps item 1]"
```

## Multi-File Feature Strategy

For features that touch many files, use this approach:

### Phase-Based Execution
1. **Plan phase** (one session): Design + write plan to a file, identify all files to touch
2. **Implementation phases** (multiple sessions): Implement one logical group at a time
3. **Review phase** (final session): Read plan + all changes, verify completeness

### Minimize Context Reads
- Use `grep` / `rg` instead of reading entire files
- Ask for specific line ranges instead of full files
- Work from the plan file, not from re-reading everything

## Token Optimization Tips

| Instead of... | Do this... |
|---------------|------------|
| Reading entire large file | Grep for the specific function |
| Re-explaining context | Reference the plan file |
| Asking AI to hold code in memory | Write code to files immediately |
| Long conversation threads | Save session + start fresh |
| Reading all related files | Read only the one being modified |

## Integration with Session Workflow

This skill integrates with:
- **`save-session` workflow** — Use when context hits 80%+
- **`verification-loop` skill** — Run before checkpointing
- **`plan-writing` skill** — Keep plan file short for easy re-loading
- **`brainstorming` skill** — Do exploration in a separate session before implementation
