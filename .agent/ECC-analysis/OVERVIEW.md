# ECC — Everything Claude Code
## Repository Analysis & Knowledge Transfer Document

> **Source:** https://github.com/affaan-m/ECC  
> **Analyzed:** 2026-07-14  
> **Version:** 2.0.0 (GA released 2026-06-09)  
> **Analyst:** AgTechDesigne / Antigravity AI

---

## Executive Summary

ECC (*Everything Claude Code*) is a **production-grade, harness-native AI coding operating system** — not a simple prompt pack. Built from 10+ months of intensive daily use across real product teams, it is the most comprehensive open-source agent harness system available as of mid-2026.

**Key numbers (v2.0.0):**
| Metric | Count |
|--------|-------|
| Specialized Agents | 67 |
| Workflow Skills | 261+ |
| Slash Commands | 94 |
| Language Ecosystems | 12+ |
| Internal Tests | 997+ |
| Contributors | 230+ |
| Stars | 211.9K+ |
| Forks | 32.5K+ |

---

## What ECC Is (And Is Not)

### What It Is
- A **harness operating system** — session adapters, MCP inventory, worktree lifecycle, agent orchestration
- A **cross-harness portability layer** — same codebase works on Claude Code, Codex, Cursor, OpenCode, Gemini, Zed, GitHub Copilot
- A **continuous learning system** — instinct-based knowledge extraction, session persistence, self-improving skills
- A **security-enforcing framework** — AgentShield integration, OWASP checks, secret scanning, CVE detection
- A **real production tool** — evolved from building actual products, not academic examples

### What It Is Not
- Not just a config pack
- Not a collection of disconnected prompts
- Not limited to Claude Code (cross-harness by design)
- Not a toy project (997+ tests, 230+ contributors, enterprise tier)

---

## Core Architecture: 5 Layers

```
┌──────────────────────────────────────────────────────────────┐
│  Operator Surface                                            │
│  CLI, plugin, TUI, HUD/statusline, release gates, PR checks  │
├──────────────────────────────────────────────────────────────┤
│  Harness Adapter Layer                                       │
│  Claude Code, Codex, OpenCode, Cursor, Gemini, Zed, dmux     │
├──────────────────────────────────────────────────────────────┤
│  Worktree, Session & Queue Runtime                           │
│  worktrees, panes, sessions, todos, checks, merge queues     │
├──────────────────────────────────────────────────────────────┤
│  Observability & Evaluation Loop                             │
│  JSONL traces, status snapshots, risk ledger, harness audit  │
├──────────────────────────────────────────────────────────────┤
│  Security & Commercial Platform                              │
│  AgentShield, ECC Tools, billing, Linear/GitHub sync         │
└──────────────────────────────────────────────────────────────┘
```

---

## Repository Structure

```
ECC/
├── agents/           — 67 specialized subagents (.md files)
├── skills/           — 261+ workflow skills (knowledge modules)
├── commands/         — 94 slash commands (legacy compatibility shims)
├── hooks/            — Trigger-based automations
├── rules/            — Always-on guidelines (common + per-language)
├── scripts/          — Cross-platform Node.js utilities
├── mcp-configs/      — 14 MCP server configurations
├── tests/            — 997+ test suite
├── docs/             — Architecture, guides, security, releases
├── contexts/         — Context profiles (dev, research, review)
├── config/           — Project stack mappings, coordination configs
├── assets/           — Images, hero graphics
├── .agents/          — Antigravity IDE integration
├── .claude/          — Claude Code native hooks & config
├── .codex/           — Codex harness config
├── .cursor/          — Cursor IDE integration
├── .gemini/          — Gemini harness config
├── .opencode/        — OpenCode plugin surface
├── .agos_agent/          — AGOS_Agent operator config
├── .kiro/            — Kiro IDE config
├── .zed/             — Zed editor config
├── agent.yaml        — Canonical agent manifest (gitagent spec 0.1.0)
├── AGENTS.md         — Master agent instructions (all harnesses)
├── SOUL.md           — Core identity & philosophy
├── RULES.md          — Universal coding standards
├── WORKING-CONTEXT.md — Live sprint state & execution notes
├── CHANGELOG.md      — Full version history
├── SECURITY.md       — Security policy & vulnerability reporting
├── CONTRIBUTING.md   — Contribution guidelines
└── README.md         — 1,861-line comprehensive guide
```

---

## The Three Primary Components

### 1. Agents (67 specialists)
Agents are **task executors** — specialized subassistants invoked explicitly for domain work.

**Categories:**
- **Planning:** `planner`, `architect`, `code-architect`
- **Review:** `code-reviewer`, `security-reviewer`, `typescript-reviewer`, `react-reviewer`, `vue-reviewer`, `flutter-reviewer`, `java-reviewer`, `kotlin-reviewer`, `rust-reviewer`, `go-reviewer`, `python-reviewer`, `django-reviewer`, `cpp-reviewer`, `csharp-reviewer`, `fsharp-reviewer`, `php-reviewer`
- **Build Resolution:** `build-error-resolver`, `react-build-resolver`, `java-build-resolver`, `kotlin-build-resolver`, `rust-build-resolver`, `go-build-resolver`, `dart-build-resolver`, `cpp-build-resolver`, `django-build-resolver`, `pytorch-build-resolver`, `swift-build-resolver`, `harmonyos-app-resolver`
- **Orchestration:** `chief-of-staff`, `loop-operator`, `harness-optimizer`, `planner`
- **Quality:** `tdd-guide`, `e2e-runner`, `performance-optimizer`, `refactor-cleaner`
- **Domain:** `database-reviewer`, `mle-reviewer`, `healthcare-reviewer`, `network-architect`, `network-troubleshooter`, `homelab-architect`
- **ML/AI:** `gan-evaluator`, `gan-generator`, `gan-planner`
- **Content:** `marketing-agent`, `seo-specialist`
- **Tools:** `doc-updater`, `docs-lookup`, `spec-miner`, `comment-analyzer`

### 2. Skills (261+ modules)
Skills are **passive knowledge modules** — domain expertise loaded automatically by context.

**Key skill domains:**
- Frontend: `react-patterns`, `react-testing`, `react-performance`, `frontend-patterns`, `nextjs-turbopack`, `frontend-slides`
- Backend: `backend-patterns`, `api-design`, `django-patterns`, `springboot-patterns`, `kotlin-patterns`, `golang-patterns`, `rust-patterns`
- Architecture: `architecture-decision-records`, `blueprint`, `agentic-os`, `agent-architecture-audit`
- Testing: `tdd-workflow`, `e2e-testing`, `python-testing`, `kotlin-testing`, `rust-testing`, `cpp-testing`, `fsharp-testing`
- Security: `security-review`, `security-scan`, `healthcare-phi-compliance`, `defi-amm-security`, `evm-token-decimals`
- AI/ML: `pytorch-patterns`, `eval-harness`, `ai-regression-testing`, `continuous-learning`, `continuous-learning-v2`
- DevOps: `deployment-patterns`, `docker-patterns`, `git-workflow`, `database-migrations`
- Agentic: `autonomous-loops`, `continuous-agent-loop`, `plan-orchestrate`, `parallel-execution-optimizer`, `verification-loop`
- Content: `article-writing`, `content-engine`, `market-research`, `investor-materials`, `manim-video`

### 3. Commands (94 slash entries)
Commands are **user-triggered actions** — slash-command entry points, now a **legacy compatibility surface**. Skills-first is the long-term direction.

**Command families:**
- `orch-*`: Orchestration (add-feature, build-mvp, fix-defect, refine-code, review)
- `epic-*`: Epic management (claim, decompose, publish, review, sync, unblock, validate)
- `multi-*`: Multi-agent coordination (plan, execute, backend, frontend, workflow)
- `prp-*`: PR process (plan, implement, commit, pr, prd)
- Build commands: `react-build`, `rust-build`, `go-build`, `kotlin-build`, `flutter-build`, `cpp-build`
- Review commands: `code-review`, `react-review`, `rust-review`, `vue-review`, `python-review`
- Session commands: `save-session`, `resume-session`, `sessions`, `checkpoint`
- Learning: `learn`, `learn-eval`, `instinct-import`, `instinct-export`, `instinct-status`

---

## Core Principles (SOUL.md + AGENTS.md)

1. **Agent-First** — Delegate to specialized agents for domain tasks
2. **Test-Driven** — Write tests before implementation, 80%+ coverage required
3. **Security-First** — Never compromise on security; validate all inputs
4. **Immutability** — Always create new objects, never mutate existing ones
5. **Plan Before Execute** — Plan complex features before writing code

---

## Agent Orchestration Matrix

| Trigger | Agent to Activate |
|---------|------------------|
| Complex feature request | `planner` |
| Code just written/modified | `code-reviewer` |
| Bug fix or new feature | `tdd-guide` |
| Architectural decision | `architect` |
| Security-sensitive code | `security-reviewer` |
| Brownfield project onboarding | `spec-miner` |
| Autonomous loops / monitoring | `loop-operator` |
| Harness config reliability | `harness-optimizer` |

**Parallel execution:** Launch multiple independent agents simultaneously for maximum throughput.

---

## Key Technical Patterns

### Instinct System (Continuous Learning v2)
- Auto-extracts reusable patterns from sessions into **instincts** (structured knowledge units)
- Each instinct has: action, evidence, examples, confidence score
- Commands: `/instinct-import`, `/instinct-export`, `/instinct-status`

### Session Persistence
- Hook-based session start/stop lifecycle
- SQLite state store for query CLI
- JSONL trace records for replay and evaluation
- `/save-session` and `/resume-session` for cross-session context

### Memory Optimization
- Context budget advisor (`token-budget-advisor` skill)
- Tail sampling to prevent memory explosion
- Observer re-entrancy guard
- Last 20% context window strategy for large refactors

### Hook System
- `ECC_HOOK_PROFILE=minimal|standard|strict` for runtime gating
- `ECC_DISABLED_HOOKS=...` to disable without editing files
- Script-based hooks replacing fragile inline one-liners
- SessionStart root fallback, Stop-phase session summaries

### AgentShield Security
- 102 security rules, 1282 tests
- `/security-scan` skill runs AgentShield directly
- OWASP Top 10 check workflow
- Secret detection, SSRF, injection pattern flagging

---

## Coding Standards (from AGENTS.md)

### Immutability (CRITICAL)
- Always create new objects, never mutate
- Return new copies with changes applied

### File Organization
- Many small files over few large ones
- 200-400 lines typical, **800 max hard limit**
- Organize by feature/domain, not by type
- High cohesion, low coupling

### Error Handling
- Handle errors at every level
- User-friendly messages in UI code
- Detailed context logged server-side
- Never silently swallow errors

### Security Requirements (before ANY commit)
- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized HTML)
- CSRF protection enabled
- Authentication/authorization verified
- Rate limiting on all endpoints
- Error messages don't leak sensitive data

### Git Commit Format
```
<type>: <description>
```
Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

---

## Harness Compatibility Matrix

| Harness | Config File | Support Level |
|---------|------------|---------------|
| Claude Code | `.claude/` | Full (native) |
| Codex | `.codex/` | Full |
| OpenCode | `.opencode/` | Full (plugin) |
| Cursor | `.cursor/` | Full |
| Gemini (Antigravity) | `.gemini/`, `.agents/` | Full |
| Zed | `.zed/` | Full |
| AGOS_Agent | `.agos_agent/` | Full (operator) |
| Kiro | `.kiro/` | Full |
| GitHub Copilot | Via AGENTS.md | Partial |
| Qwen | `.qwen/` | Partial |
| CodeBuddy | `.codebuddy/` | Partial |
| Trae | `.trae/` | Partial |

---

## Install Architecture

### Install Profiles
- `minimal`: Rules, agents, commands, core skills — NO hooks
- `core`: Standard profile
- `full`: Everything including hooks-runtime

### Selective Install
- Manifest-driven: `install-plan.js` + `install-apply.js`
- State store tracks what's installed
- Incremental updates without full reinstall
- Module-level targeting: `--with capability:machine-learning`

### npm Packages
- `ecc-universal`: Full installer
- `ecc-agentshield`: Security scanner package
- Plugin slug: `ecc@ecc`

---

## ECC 2.0 Control Plane (Alpha)

The `ecc2/` Rust binary exposes:
- `dashboard` — TUI status overview
- `start` / `stop` / `resume` — Session lifecycle
- `sessions` / `status` — State inspection
- `daemon` — Background process management

Status: Alpha (builds locally, not yet GA for general release).

---

## Lessons & Patterns for AgTechDesigne

### Adoption Priority (High → Low)
1. **Agent specialization structure** — Model our own agents on ECC's domain-expert pattern
2. **Skill-as-knowledge-module** — Keep skills as passive context, agents as active executors
3. **Prompt Defense Baseline** — Apply the 6-point security preamble to all our agents
4. **Instinct/continuous-learning** — Extract session patterns into reusable instincts
5. **Hook lifecycle** — SessionStart/Stop hooks for context persistence
6. **Parallel agent execution** — Launch independent specialists simultaneously

### Key Differences vs. Our Current Setup
| ECC Pattern | Our Current Status | Action Needed |
|-------------|-------------------|---------------|
| 67 specialized agents | 20 agents | Add domain-specific agents |
| Skills-first (commands as shims) | Commands-centric | Migrate to skills-first |
| Prompt Defense Baseline in every agent | Partial | Add security preamble |
| Agent orchestration matrix | Manual | Create auto-routing rules |
| Session persistence hooks | Not implemented | Add hook lifecycle |
| Continuous learning (instincts) | Not implemented | Add instinct system |
| Harness compliance matrix | Single harness | Already multi-harness |

---

## References

- **Repository:** https://github.com/affaan-m/ECC
- **Website:** https://ecc.tools
- **Discord:** https://discord.gg/36yGMHGFbR
- **GitHub App:** https://github.com/apps/ecc-tools
- **npm:** https://www.npmjs.com/package/ecc-universal
- **License:** MIT

---

*Last analyzed: 2026-07-14 | AgTechDesigne / Antigravity AI*
