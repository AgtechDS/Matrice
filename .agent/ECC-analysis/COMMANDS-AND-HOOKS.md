# ECC — Commands & Hooks System
## Slash Commands + Hook Lifecycle Documentation

> Source: `ECC/commands/`, `ECC/AGENTS.md`, `ECC/README.md` (v2.0.0)

---

## Commands Architecture

### Commands as Legacy Surface

> **Important architectural note:** In ECC 2.0, `commands/` is considered a **legacy compatibility surface**. The long-term direction is **skills-first**:
>
> - New workflows → create as `skills/`
> - Existing commands → maintained only for backward compatibility
> - Cross-harness parity → only add commands when a shim is required

Commands are markdown files that define `/slash-command` behavior. Each command file is named `command-name.md` and contains:
- YAML frontmatter (optional)
- Prompt instructions for the slash command
- Workflow steps
- Output format

---

## Full Command Inventory (94 commands)

### Orchestration Family (`orch-*`)
| Command | Purpose |
|---------|---------|
| `/orch-add-feature` | Orchestrate adding a new feature |
| `/orch-build-mvp` | Build MVP orchestration |
| `/orch-change-feature` | Orchestrate feature modification |
| `/orch-fix-defect` | Orchestrate defect resolution |
| `/orch-refine-code` | Orchestrate code refinement |
| `/orch-review` | Orchestrate comprehensive review |

### Epic Management (`epic-*`)
| Command | Purpose |
|---------|---------|
| `/epic-claim` | Claim ownership of an epic |
| `/epic-decompose` | Break epic into tasks |
| `/epic-publish` | Publish epic to tracking |
| `/epic-review` | Review epic progress |
| `/epic-sync` | Sync epic state |
| `/epic-unblock` | Unblock stalled epic |
| `/epic-validate` | Validate epic completion |

### Multi-Agent Coordination (`multi-*`)
| Command | Purpose |
|---------|---------|
| `/multi-plan` | Plan multi-agent workflow |
| `/multi-execute` | Execute multi-agent plan |
| `/multi-backend` | Backend multi-agent workflow |
| `/multi-frontend` | Frontend multi-agent workflow |
| `/multi-workflow` | Custom multi-agent workflow |

### PR Process (`prp-*`)
| Command | Purpose |
|---------|---------|
| `/prp-plan` | Plan PR content |
| `/prp-prd` | Generate PR description |
| `/prp-implement` | Implement PR changes |
| `/prp-commit` | Commit with conventional format |
| `/prp-pr` | Create PR |

### Build Commands
| Command | Language/Stack |
|---------|---------------|
| `/react-build` | React/webpack/vite |
| `/rust-build` | Rust/cargo |
| `/go-build` | Go |
| `/kotlin-build` | Kotlin/Gradle |
| `/flutter-build` | Flutter/Dart |
| `/cpp-build` | C/C++ |
| `/gradle-build` | Gradle |
| `/gan-build` | GAN training build |

### Review Commands
| Command | Language/Stack |
|---------|---------------|
| `/code-review` | Universal code review |
| `/react-review` | React review |
| `/rust-review` | Rust review |
| `/go-review` | Go review |
| `/kotlin-review` | Kotlin review |
| `/flutter-review` | Flutter review |
| `/vue-review` | Vue.js review |
| `/python-review` | Python review |
| `/cpp-review` | C/C++ review |
| `/fastapi-review` | FastAPI review |
| `/review-pr` | PR review |

### Test Commands
| Command | Language/Stack |
|---------|---------------|
| `/react-test` | React testing |
| `/rust-test` | Rust testing |
| `/go-test` | Go testing |
| `/kotlin-test` | Kotlin testing |
| `/flutter-test` | Flutter testing |
| `/cpp-test` | C/C++ testing |
| `/test-coverage` | Coverage report |

### Session Management
| Command | Purpose |
|---------|---------|
| `/save-session` | Save current session state |
| `/resume-session` | Resume previous session |
| `/sessions` | List session history |
| `/checkpoint` | Create session checkpoint |

### Continuous Learning
| Command | Purpose |
|---------|---------|
| `/learn` | Extract learnings from session |
| `/learn-eval` | Evaluate extracted learnings |
| `/instinct-import` | Import instinct patterns |
| `/instinct-export` | Export instinct patterns |
| `/instinct-status` | Check instinct system state |
| `/evolve` | Evolve skill from session |

### Planning & PRD
| Command | Purpose |
|---------|---------|
| `/plan` | Create implementation plan |
| `/plan-canvas` | Visual plan canvas |
| `/plan-prd` | Generate PRD |
| `/project-init` | Initialize new project |
| `/feature-dev` | Feature development workflow |

### Security
| Command | Purpose |
|---------|---------|
| `/security-scan` | Run AgentShield security scan |

### Quality
| Command | Purpose |
|---------|---------|
| `/quality-gate` | Run quality gates |
| `/refactor-clean` | Clean and refactor code |
| `/build-fix` | Fix build errors |

### Skill Management
| Command | Purpose |
|---------|---------|
| `/skill-create` | Create new skill |
| `/skill-health` | Check skill health |
| `/ecc-guide` | ECC usage guide |
| `/hookify` | Manage hooks |
| `/hookify-configure` | Configure hooks |
| `/hookify-help` | Hook help |
| `/hookify-list` | List hooks |

### Content & Marketing
| Command | Purpose |
|---------|---------|
| `/marketing-campaign` | Create marketing campaign |
| `/gan-design` | GAN design workflow |

### Harness & Configuration
| Command | Purpose |
|---------|---------|
| `/harness-audit` | Audit harness configuration |
| `/loop-start` | Start autonomous loop |
| `/loop-status` | Check loop status |
| `/model-route` | Route to optimal model |
| `/harness-audit` | Harness performance audit |
| `/cost-report` | Token/cost usage report |

### Developer Tools
| Command | Purpose |
|---------|---------|
| `/aside` | Create development note |
| `/auto-update` | Auto-update skills |
| `/promote` | Promote to production |
| `/prune` | Prune stale resources |
| `/update-codemaps` | Update codebase maps |
| `/update-docs` | Update documentation |

### Project Management
| Command | Purpose |
|---------|---------|
| `/pm2` | PM2 process management |
| `/setup-pm` | Setup process manager |
| `/jira` | Jira integration |
| `/projects` | List projects |

### Loops
| Command | Purpose |
|---------|---------|
| `/santa-loop` | Santa verification loop |

---

## Hook System Architecture

### What Hooks Are
Hooks are **event-triggered automations** that fire at specific points in the agent harness lifecycle. They run scripts automatically without user intervention.

### Hook Events (Claude Code Native)
```
SessionStart   → Runs when new session begins
SessionStop    → Runs when session ends
PreToolUse     → Runs before any tool call
PostToolUse    → Runs after any tool call
Notification   → Runs on agent notifications
```

### Hook Runtime Controls

```bash
# Profile-based gating (no file edits required)
ECC_HOOK_PROFILE=minimal    # Minimal hooks only
ECC_HOOK_PROFILE=standard   # Standard hooks (default)
ECC_HOOK_PROFILE=strict     # All hooks + enforcement

# Disable specific hooks
ECC_DISABLED_HOOKS=hook1,hook2

# Example: run without session hooks
ECC_DISABLED_HOOKS=session-start,session-stop claude
```

### ECC Hook Behaviors

**SessionStart hooks:**
- Load context from previous session (if saved)
- Initialize memory systems
- Set project context from root detection
- Load active instincts

**SessionStop hooks:**
- Save session summary
- Extract learnings to instinct pool
- Update session log

**PreToolUse hooks:**
- Security validation
- Permission checking
- Rate limiting

**PostToolUse hooks:**
- Quality verification
- Output validation
- Memory updates

### Hook Best Practices (from ECC)

1. **Script-based, not inline** — Use `.sh`/`.js` files, not inline one-liners (brittle)
2. **Idempotent** — Hooks must be safe to run multiple times
3. **Fast** — Hooks should complete in < 2 seconds
4. **Guarded** — Check for re-entrancy (observer loop prevention)
5. **Environment-aware** — Check `ECC_HOOK_PROFILE` before running
6. **Windows-compatible** — Use Node.js for cross-platform scripts

### Observer Loop Prevention (5-Layer Guard)
1. Re-entrancy flag (`IN_HOOK=true` env var check)
2. File lock (`/tmp/ecc-hook.lock`)
3. PID comparison
4. Timestamp throttle (min 1s between runs)
5. Tail sampling (cap at N records per session)

---

## Instinct System (Continuous Learning v2)

### What Instincts Are
Instincts are **structured knowledge units** extracted from sessions. They represent patterns the agent has learned and should apply proactively.

### Instinct Structure
```yaml
---
type: instinct
name: pattern-name
confidence: 0.85      # 0.0 - 1.0
domain: frontend      # domain tag
version: 1
---

## Action
What the agent should do when this pattern matches.

## Evidence
What sessions/situations this was learned from.

## Examples
Concrete examples of the pattern in action.
```

### Instinct Commands
```bash
/instinct-status          # View active instincts
/instinct-export          # Export to .instincts/ folder
/instinct-import FILE     # Import from file
/learn                    # Extract learnings from this session
/learn-eval               # Evaluate learning quality
```

### Instinct Confidence Levels
- `0.0 - 0.4`: Draft (not applied automatically)
- `0.4 - 0.7`: Emerging (applied cautiously)
- `0.7 - 0.9`: Established (applied proactively)
- `0.9 - 1.0`: Core (always applied)

---

## Context Commands

ECC includes three context profiles (in `ECC/contexts/`):

| Context | When to Use |
|---------|------------|
| `dev.md` | Active development work |
| `research.md` | Research and exploration |
| `review.md` | Code review sessions |

These are injected via `/aside` or manual context loading to set the working mode.

---

## Recommended Commands for AgTechDesigne

### Immediately Useful
1. `/plan` — Before every complex feature
2. `/code-review` — After every code change
3. `/security-scan` — Before every commit
4. `/save-session` — At end of each working session
5. `/resume-session` — At start of each working session

### High Value Additions to Implement
1. `/learn` — After debugging sessions
2. `/quality-gate` — Before merging PRs
3. `/checkpoint` — During long implementations
4. `/harness-audit` — Monthly optimization

---

*Extracted from ECC v2.0.0 | 2026-07-14*
