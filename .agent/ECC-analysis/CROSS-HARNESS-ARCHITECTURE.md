# ECC — Cross-Harness Architecture
## Multi-AI-IDE Compatibility & Integration Patterns

> Source: `ECC/docs/ECC-2.0-REFERENCE-ARCHITECTURE.md`, `ECC/docs/architecture/`, `ECC/AGENTS.md` (v2.0.0)

---

## What "Cross-Harness" Means

ECC uses the term **"harness"** to describe any AI coding environment (IDE, CLI, editor). A **cross-harness** system works across all of them without requiring different workflows.

The core principle: **the skill/agent/command surface is identical regardless of which harness the developer uses**.

---

## Supported Harnesses (2026)

| Harness | Type | Config Path | Integration Level |
|---------|------|------------|------------------|
| Claude Code | Native CLI | `.claude/` | Full (reference implementation) |
| Codex (OpenAI) | CLI + App | `.codex/`, `AGENTS.md` | Full |
| OpenCode | Plugin | `.opencode/` | Full (plugin system) |
| Cursor | IDE | `.cursor/` | Full |
| Antigravity (Gemini) | IDE | `.gemini/`, `.agents/` | Full |
| Zed | Editor | `.zed/` | Full |
| AGOS_Agent | Operator shell | `.agos_agent/` | Full (operator pattern) |
| Kiro | IDE | `.kiro/` | Full |
| GitHub Copilot | Editor ext | Via AGENTS.md | Partial |
| Qwen | CLI | `.qwen/` | Partial |
| CodeBuddy | IDE | `.codebuddy/` | Partial |
| Trae | Agent | `.trae/` | Partial |
| OpenClaw | Agent | `.openclaw/` | Partial |
| JoyCode | Agent | Via AGENTS.md | Partial |

---

## Harness Adapter Pattern

Each harness has a different API for:
- Loading agent instructions
- Reading skills/knowledge
- Processing commands/slash actions
- Running hooks/automations
- Managing sessions

ECC solves this through **adapter files** in each harness's config directory:

```
AGENTS.md          → Universal (Codex, OpenCode, GitHub Copilot)
.claude/           → Claude Code
.codex/            → Codex CLI
.cursor/           → Cursor IDE
.gemini/           → Gemini (Antigravity)
.opencode/         → OpenCode plugin
.agos_agent/           → AGOS_Agent operator
.kiro/             → Kiro IDE
.zed/              → Zed editor
```

The **canonical truth** is always in `agents/`, `skills/`, and `commands/`. Harness-specific files just reference or adapt that content.

---

## ECC 2.0 Architecture: 5 Layers

```
┌──────────────────────────────────────────────────────────────┐
│  LAYER 5: Operator Surface                                   │
│  What developers interact with:                              │
│  • CLI commands (ecc status, ecc sessions, ecc dashboard)    │
│  • Plugin interfaces                                         │
│  • TUI / HUD / statusline                                    │
│  • Release gates, PR quality checks                         │
├──────────────────────────────────────────────────────────────┤
│  LAYER 4: Harness Adapter Layer                              │
│  How ECC speaks to each harness:                             │
│  • Claude Code adapter (native hooks)                        │
│  • Codex adapter (AGENTS.md + .codex/)                       │
│  • OpenCode adapter (plugin events)                          │
│  • Cursor adapter (.cursor/rules)                            │
│  • Gemini adapter (.gemini/ + .agents/)                      │
│  • Zed adapter (.zed/settings)                               │
│  • dmux / Orca / Superset adapters                          │
├──────────────────────────────────────────────────────────────┤
│  LAYER 3: Worktree, Session & Queue Runtime                  │
│  State management:                                           │
│  • Worktree lifecycle (create, resume, pause, close)         │
│  • Session persistence (SQLite state store)                  │
│  • Task queue and todo management                            │
│  • Conflict queue and merge readiness                        │
│  • Notification state                                        │
├──────────────────────────────────────────────────────────────┤
│  LAYER 2: Observability & Evaluation Loop                    │
│  Self-improvement and monitoring:                            │
│  • JSONL trace records (replay, evaluation)                  │
│  • Status snapshots (ecc status --markdown)                  │
│  • Risk ledger tracking                                      │
│  • Harness audit scoring                                     │
│  • Scenario specs, verifiers, promoted playbooks             │
│  • RAG sets for retrieval-augmented generation               │
├──────────────────────────────────────────────────────────────┤
│  LAYER 1: Security & Commercial Platform                     │
│  Enterprise and security foundation:                         │
│  • AgentShield policies (102 rules, SARIF output)            │
│  • ECC Tools billing and access control                      │
│  • Linear/GitHub issue and PR sync                           │
│  • Enterprise audit reports                                  │
│  • CVE detection and secret scanning                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Worktree Lifecycle Events

ECC 2.0 treats worktrees as first-class citizens:

```
Worktree States:
create → active → pause → resume → diff → review → PR → merge-ready → close
                                                            ↓
                                                      conflict → resolve
                                                            ↓
                                                       stale → salvage
```

**Key events:**
- `create`: New worktree created for a task
- `active`: Development in progress
- `pause`: Worktree saved and suspended
- `resume`: Reactivated from saved state
- `diff`: Changes reviewed before PR
- `review`: PR review in progress
- `PR`: PR submitted
- `merge-ready`: CI green, reviewer approved
- `conflict`: Merge conflict detected
- `stale`: No activity for X days
- `close`: Worktree completed and cleaned up

---

## Session State Architecture

### SQLite State Store
```sql
-- Session record
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  harness TEXT NOT NULL,         -- claude|codex|cursor|gemini|...
  project_path TEXT NOT NULL,
  branch TEXT,
  started_at DATETIME,
  ended_at DATETIME,
  summary TEXT,
  token_count INTEGER,
  cost_usd REAL
);

-- Instinct (learned pattern)
CREATE TABLE instincts (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id),
  domain TEXT,
  pattern TEXT,
  confidence REAL,
  evidence TEXT,
  created_at DATETIME
);
```

### JSONL Trace Format
```json
{"timestamp":"2026-07-14T16:00:00Z","type":"tool_call","tool":"Write","path":"src/auth.ts","tokens":150}
{"timestamp":"2026-07-14T16:00:01Z","type":"agent_invoked","agent":"security-reviewer","trigger":"auth_code"}
{"timestamp":"2026-07-14T16:00:02Z","type":"finding","severity":"HIGH","message":"JWT not validated"}
```

---

## MCP (Model Context Protocol) Configuration

ECC ships 14 MCP server configurations:

### Default MCP (v2.0.0 — minimal policy)
Only `chrome-devtools` is in the default set.

### Optional MCP Servers
| Server | Purpose | Use When |
|--------|---------|---------|
| `github` | GitHub API access | PR management |
| `context7` | Library documentation | `docs-lookup` agent |
| `exa` | Web search | `exa-search` skill |
| `memory` | Persistent memory | Session continuity |
| `playwright` | Browser automation | E2E testing |
| `sequential-thinking` | Extended reasoning | Complex planning |
| `chrome-devtools` | Browser debugging | Frontend debugging |
| `postgres` | Database access | DB queries |
| `filesystem` | File system access | Codebase analysis |
| `slack` | Slack notifications | Team communication |
| `linear` | Linear issue tracking | Sprint management |

### MCP Connector Policy (2026 update)
The June 2026 audit retired 6 default MCPs because:
- Their jobs are covered by skills wrapping CLIs/REST APIs
- Harness-native features (memory, web search) now handle many use cases
- Reducing default MCPs reduces attack surface and complexity

---

## AgentShield Integration

AgentShield is ECC's security enforcement layer:

```bash
# Run AgentShield scan
/security-scan

# Or directly
npx ecc-agentshield scan --dir ./src
```

**AgentShield capabilities:**
- 102 security rules
- 1282 internal tests
- SARIF output format (CI/CD compatible)
- Secret detection (30+ secret patterns)
- OWASP Top 10 checks
- Supply chain security analysis
- LLM-specific attack detection (prompt injection, etc.)

---

## Harness Adapter Compliance Matrix

ECC maintains a public compliance matrix tracking which features work in which harness:

| Feature | Claude Code | Codex | OpenCode | Cursor | Gemini | Zed |
|---------|------------|-------|---------|--------|--------|-----|
| Agents | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Skills | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Commands | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hooks | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ❌ |
| Session persistence | ✅ | ⚠️ | ✅ | ❌ | ⚠️ | ❌ |
| MCP servers | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Instincts | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ |
| AgentShield | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |

*✅ Full | ⚠️ Partial | ❌ Not supported*

---

## ECC 2.0 Control Plane (Rust Binary)

The `ecc2/` binary is an alpha Rust control plane:

```bash
# Status overview
ecc status
ecc status --markdown --write status.md

# Session management
ecc start                    # Start new session
ecc stop                     # End current session
ecc resume [session-id]      # Resume previous session
ecc sessions                 # List sessions

# Work item management
ecc work-items upsert "PR #123: Fix auth bug" --status in-progress
ecc work-items sync-github --repo owner/repo

# Readiness gate (fails CI if not ready)
ecc status --exit-code

# TUI dashboard
ecc dashboard
```

### Status Output Format
```markdown
# ECC Status — 2026-07-14T16:00:00Z

## Readiness: READY

## Active Sessions
- auth-refactor (claude, branch: feat/jwt-refresh, 2h active)

## Skill Run Health
- security-review: ✅ last run 10m ago
- tdd-guide: ✅ last run 30m ago

## Install Health
- ecc-universal: ✅ v2.0.0
- agents: 67/67
- skills: 261/261

## Pending Work Items
- #1234: Add refresh token rotation [in-progress]
- #1235: Fix CORS configuration [blocked]

## Risk
- No critical issues
```

---

## AgTechDesigne Harness Strategy

### Current State
AgTechDesigne already uses Antigravity (Gemini) as primary harness. The `.agent/` and `.agents/` directories serve this.

### Recommended Multi-Harness Plan
Based on ECC analysis:

1. **Keep Gemini/Antigravity as primary** — Already fully set up
2. **Add Claude Code compatibility** — Create `.claude/` with hooks
3. **Add Codex compatibility** — AGENTS.md already serves this
4. **Keep `agents/` as canonical** — Don't duplicate into harness configs

### File to Create for Multi-Harness
```
.claude/
  settings.json     ← Claude Code hook configuration
  CLAUDE.md         ← Claude Code specific instructions
  hooks/
    session-start.sh
    session-stop.sh
.codex/
  AGENTS.md symlink or copy
  settings.json
```

---

*Extracted from ECC v2.0.0 architecture docs | 2026-07-14*
