# Antigravity Kit Architecture

> Comprehensive AI Agent Capability Expansion Toolkit

---

## 📋 Overview

Antigravity Kit is a modular system consisting of:

- **22 Specialist Agents** — Role-based AI personas (+ `code-reviewer`, `spec-miner` from ECC analysis)
- **42 Skills** — Domain-specific knowledge modules (+ `context-budget`, `verification-loop`, `search-first` from ECC)
- **14 Workflows** — Slash command procedures (+ `save-session`, `resume-session`, `learn` from ECC)
- **Instincts System** — Continuous learning knowledge units (`.agent/instincts/`)
- **Sessions System** — Cross-session state persistence (`.sessions/`)

---

## 🏗️ Directory Structure

```plaintext
.agent/
├── ARCHITECTURE.md          # This file
├── agents/                  # 22 Specialist Agents
├── skills/                  # 42 Skills
├── workflows/               # 14 Slash Commands
├── rules/                   # Global Rules
├── scripts/                 # Master Validation Scripts
├── instincts/               # Continuous Learning (ECC-inspired)
│   ├── INDEX.md             # Active instincts index
│   ├── frontend/            # Frontend patterns
│   ├── backend/             # Backend patterns
│   ├── architecture/        # Architecture patterns
│   └── [domain]/            # Additional domains
└── ECC-analysis/            # ECC Repository Analysis Docs
    ├── INDEX.md
    ├── OVERVIEW.md
    ├── AGENTS-CATALOG.md
    ├── SKILLS-SYSTEM.md
    ├── COMMANDS-AND-HOOKS.md
    ├── CODING-STANDARDS.md
    ├── CROSS-HARNESS-ARCHITECTURE.md
    └── ADAPTATION-GUIDE.md
```

**Session files (project-level, not in .agent/):**
```plaintext
[project-root]/
└── .sessions/               # Session persistence files
    ├── YYYY-MM-DD-HH-MM-[task].md
    └── archive/             # Completed session archives
```

---

## 🤖 Agents (22)

Specialist AI personas for different domains. All agents include ECC **Prompt Defense Baseline**.

| Agent                    | Focus                      | Skills Used                                              |
| ------------------------ | -------------------------- | -------------------------------------------------------- |
| `orchestrator`           | Multi-agent coordination   | parallel-agents, behavioral-modes                        |
| `project-planner`        | Discovery, task planning   | brainstorming, plan-writing, architecture                |
| `frontend-specialist`    | Web UI/UX                  | frontend-design, react-best-practices, tailwind-patterns |
| `backend-specialist`     | API, business logic        | api-patterns, nodejs-best-practices, database-design     |
| `database-architect`     | Schema, SQL                | database-design, prisma-expert                           |
| `mobile-developer`       | iOS, Android, RN           | mobile-design                                            |
| `game-developer`         | Game logic, mechanics      | game-development                                         |
| `devops-engineer`        | CI/CD, Docker              | deployment-procedures, docker-expert                     |
| `security-auditor`       | Security compliance        | vulnerability-scanner, red-team-tactics                  |
| `penetration-tester`     | Offensive security         | red-team-tactics                                         |
| `test-engineer`          | Testing strategies         | testing-patterns, tdd-workflow, webapp-testing           |
| `debugger`               | Root cause analysis        | systematic-debugging                                     |
| `performance-optimizer`  | Speed, Web Vitals          | performance-profiling                                    |
| `seo-specialist`         | Ranking, visibility        | seo-fundamentals, geo-fundamentals                       |
| `documentation-writer`   | Manuals, docs              | documentation-templates                                  |
| `product-manager`        | Requirements, user stories | plan-writing, brainstorming                              |
| `product-owner`          | Strategy, backlog, MVP     | plan-writing, brainstorming                              |
| `qa-automation-engineer` | E2E testing, CI pipelines  | webapp-testing, testing-patterns                         |
| `code-archaeologist`     | Legacy code, refactoring   | clean-code, code-review-checklist                        |
| `explorer-agent`         | Codebase analysis          | -                                                        |
| `code-reviewer` ⭐NEW      | Code quality gate (auto)   | clean-code, code-review-checklist, vulnerability-scanner |
| `spec-miner` ⭐NEW         | Brownfield spec extraction | architecture, documentation-templates                    |

---

## 🧩 Skills (42)

Modular knowledge domains that agents can load on-demand. based on task context.

### Frontend & UI

| Skill                   | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `react-best-practices`  | React & Next.js performance optimization (Vercel - 57 rules)          |
| `web-design-guidelines` | Web UI audit - 100+ rules for accessibility, UX, performance (Vercel) |
| `tailwind-patterns`     | Tailwind CSS v4 utilities                                             |
| `frontend-design`       | UI/UX patterns, design systems                                        |
| `ui-ux-pro-max`         | 50 styles, 21 palettes, 50 fonts                                      |

### Backend & API

| Skill                   | Description                    |
| ----------------------- | ------------------------------ |
| `api-patterns`          | REST, GraphQL, tRPC            |
| `nestjs-expert`         | NestJS modules, DI, decorators |
| `nodejs-best-practices` | Node.js async, modules         |
| `python-patterns`       | Python standards, FastAPI      |

### Database

| Skill             | Description                 |
| ----------------- | --------------------------- |
| `database-design` | Schema design, optimization |
| `prisma-expert`   | Prisma ORM, migrations      |

### TypeScript/JavaScript

| Skill               | Description                         |
| ------------------- | ----------------------------------- |
| `typescript-expert` | Type-level programming, performance |

### Cloud & Infrastructure

| Skill                   | Description               |
| ----------------------- | ------------------------- |
| `docker-expert`         | Containerization, Compose |
| `deployment-procedures` | CI/CD, deploy workflows   |
| `server-management`     | Infrastructure management |

### Testing & Quality

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `testing-patterns`      | Jest, Vitest, strategies |
| `webapp-testing`        | E2E, Playwright          |
| `tdd-workflow`          | Test-driven development  |
| `code-review-checklist` | Code review standards    |
| `lint-and-validate`     | Linting, validation      |

### Security

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `vulnerability-scanner` | Security auditing, OWASP |
| `red-team-tactics`      | Offensive security       |

### Architecture & Planning

| Skill           | Description                |
| --------------- | -------------------------- |
| `app-builder`   | Full-stack app scaffolding |
| `architecture`  | System design patterns     |
| `plan-writing`  | Task planning, breakdown   |
| `brainstorming` | Socratic questioning       |

### Mobile

| Skill           | Description           |
| --------------- | --------------------- |
| `mobile-design` | Mobile UI/UX patterns |

### Game Development

| Skill              | Description           |
| ------------------ | --------------------- |
| `game-development` | Game logic, mechanics |

### SEO & Growth

| Skill              | Description                   |
| ------------------ | ----------------------------- |
| `seo-fundamentals` | SEO, E-E-A-T, Core Web Vitals |
| `geo-fundamentals` | GenAI optimization            |

### Shell/CLI

| Skill                | Description               |
| -------------------- | ------------------------- |
| `bash-linux`         | Linux commands, scripting |
| `powershell-windows` | Windows PowerShell        |

### Other

| Skill                     | Description               |
| ------------------------- | ------------------------- |
| `clean-code`              | Coding standards (Global) |
| `behavioral-modes`        | Agent personas            |
| `parallel-agents`         | Multi-agent patterns      |
| `mcp-builder`             | Model Context Protocol    |
| `documentation-templates` | Doc formats               |
| `i18n-localization`       | Internationalization      |
| `performance-profiling`   | Web Vitals, optimization  |
| `systematic-debugging`    | Troubleshooting           |

---

### ECC-Inspired (NEW ⭐)

| Skill | Description |
| ----- | ----------- |
| `context-budget` | Context window management — prevents context overflow |
| `verification-loop` | 6-check self-verification before declaring task done |
| `search-first` | Research-before-code methodology |

---

## 🔄 Workflows (14)

Slash command procedures. Invoke with `/command`.

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `/brainstorm`     | Socratic discovery               |
| `/create`         | Create new features              |
| `/debug`          | Debug issues                     |
| `/deploy`         | Deploy application               |
| `/enhance`        | Improve existing code            |
| `/orchestrate`    | Multi-agent coordination         |
| `/plan`           | Task breakdown                   |
| `/preview`        | Preview changes                  |
| `/status`         | Check project status             |
| `/test`           | Run tests                        |
| `/ui-ux-pro-max`  | Design with 50 styles            |
| `/save-session`   | ⭐ Save session state to file     |
| `/resume-session` | ⭐ Resume from saved session      |
| `/learn`          | ⭐ Extract learnings → instincts  |

---

## 🎯 Skill Loading Protocol

```plaintext
User Request → Skill Description Match → Load SKILL.md
                                            ↓
                                    Read references/
                                            ↓
                                    Read scripts/
```

### Skill Structure

```plaintext
skill-name/
├── SKILL.md           # (Required) Metadata & instructions
├── scripts/           # (Optional) Python/Bash scripts
├── references/        # (Optional) Templates, docs
└── assets/            # (Optional) Images, logos
```

### Enhanced Skills (with scripts/references)

| Skill               | Files | Coverage                            |
| ------------------- | ----- | ----------------------------------- |
| `ui-ux-pro-max`     | 27    | 50 styles, 21 palettes, 50 fonts    |
| `app-builder`       | 20    | Full-stack scaffolding              |

---

## � Scripts (2)

Master validation scripts that orchestrate skill-level scripts.

### Master Scripts

| Script          | Purpose                                 | When to Use              |
| --------------- | --------------------------------------- | ------------------------ |
| `checklist.py`  | Priority-based validation (Core checks) | Development, pre-commit  |
| `verify_all.py` | Comprehensive verification (All checks) | Pre-deployment, releases |

### Usage

```bash
# Quick validation during development
python .agent/scripts/checklist.py .

# Full verification before deployment
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

### What They Check

**checklist.py** (Core checks):

- Security (vulnerabilities, secrets)
- Code Quality (lint, types)
- Schema Validation
- Test Suite
- UX Audit
- SEO Check

**verify_all.py** (Full suite):

- Everything in checklist.py PLUS:
- Lighthouse (Core Web Vitals)
- Playwright E2E
- Bundle Analysis
- Mobile Audit
- i18n Check

For details, see [scripts/README.md](scripts/README.md)

---

## 📊 Statistics

| Metric              | Value                         |
| ------------------- | ----------------------------- |
| **Total Agents**    | 20                            |
| **Total Skills**    | 36                            |
| **Total Workflows** | 11                            |
| **Total Scripts**   | 2 (master) + 18 (skill-level) |
| **Coverage**        | ~90% web/mobile development   |

---

## 🔗 Quick Reference

| Need     | Agent                 | Skills                                |
| -------- | --------------------- | ------------------------------------- |
| Web App  | `frontend-specialist` | react-best-practices, frontend-design |
| API      | `backend-specialist`  | api-patterns, nodejs-best-practices   |
| Mobile   | `mobile-developer`    | mobile-design                         |
| Database | `database-architect`  | database-design, prisma-expert        |
| Security | `security-auditor`    | vulnerability-scanner                 |
| Testing  | `test-engineer`       | testing-patterns, webapp-testing      |
| Debug    | `debugger`            | systematic-debugging                  |
| Plan     | `project-planner`     | brainstorming, plan-writing           |
