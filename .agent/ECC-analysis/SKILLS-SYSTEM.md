# ECC — Skills System Analysis
## Complete Documentation of the Skill Architecture

> Extracted from: `ECC/docs/SKILL-DEVELOPMENT-GUIDE.md`, `ECC/agent.yaml`, `ECC/skills/`  
> Source: https://github.com/affaan-m/ECC (v2.0.0)

---

## What Are Skills?

Skills are **passive knowledge modules** — domain expertise that is automatically loaded by context. Unlike agents (which execute tasks) or commands (which users invoke), skills provide background knowledge that gets activated when relevant.

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│    Skills    │   │    Agents    │   │   Commands   │   │    Hooks     │
│              │   │              │   │              │   │              │
│ Knowledge    │   │ Task         │   │ User Action  │   │ Automation   │
│ Repository   │   │ Executor     │   │ (/command)   │   │ (Event-based)│
│              │   │              │   │              │   │              │
│ Context-     │   │ Explicit     │   │ User-        │   │ Event-       │
│ automatic    │   │ delegation   │   │ invoked      │   │ triggered    │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

---

## Skill File Structure

```
skills/
└── your-skill-name/
    ├── SKILL.md           ← Required: Main skill definition
    ├── examples/          ← Optional: Code examples
    │   ├── basic.ts
    │   └── advanced.ts
    └── references/        ← Optional: External references
        └── links.md
```

### SKILL.md Required Format

```markdown
---
name: skill-name
description: Brief description shown in skill list (used for auto-activation)
origin: ECC
---

# Skill Title

Brief overview of what this skill covers.

## When to Activate

Describe scenarios where Claude should use this skill.

## Core Concepts

Main patterns and guidelines.

## Code Examples

```typescript
// Practical, tested examples
```

## Anti-Patterns

Show what NOT to do with concrete examples.

## Best Practices

- Actionable guidelines
- Do's and don'ts
```

---

## Skill Quality Standards

### Content Requirements
- **Source-backed** — Reference actual documentation, not general knowledge
- **No generic LLM rhetoric** — No canned CTAs or forced platform stereotypes
- **Actionable** — Step-by-step, concrete, testable guidance
- **Focused** — One domain per skill, no overlap
- **Anti-patterns included** — Always show what NOT to do

### Size Guidelines
- **Target:** 50-200 lines of meaningful content
- **Max:** 500 lines (use `references/` for overflow)
- **No duplication** — If similar guidance exists, point to it

### Activation Design
Skills activate when:
1. User's task matches the skill's domain (semantic matching)
2. Agent explicitly requests domain knowledge
3. Command references the skill
4. Context contains skill-relevant patterns

---

## Full Skills Inventory (261+ skills by category)

### Agentic & AI Engineering
| Skill | Purpose |
|-------|---------|
| `agent-architecture-audit` | Audit multi-agent system design |
| `agent-eval` | Evaluate agent performance |
| `agent-harness-construction` | Build custom agent harnesses |
| `agent-payment-x402` | x402 payment protocol for AI agents |
| `agentic-engineering` | Principles of agentic system design |
| `agentic-os` | Operating system patterns for agents |
| `ai-first-engineering` | AI-native software engineering |
| `ai-regression-testing` | Test AI model regressions |
| `autonomous-loops` | Safe autonomous execution loops |
| `continuous-agent-loop` | Continuous agent loop patterns |
| `continuous-learning` | Session knowledge extraction (v1) |
| `continuous-learning-v2` | Instinct-based learning system (v2) |
| `eval-harness` | Evaluation framework construction |
| `plan-orchestrate` | Multi-agent orchestration planning |
| `parallel-execution-optimizer` | Parallel agent execution strategies |
| `verification-loop` | Self-verification loop patterns |

### Frontend & UI
| Skill | Purpose |
|-------|---------|
| `frontend-patterns` | React/Vue/Angular patterns |
| `react-patterns` | React component architecture |
| `react-performance` | React performance optimization |
| `react-testing` | React testing strategies |
| `nextjs-turbopack` | Next.js + Turbopack patterns |
| `frontend-slides` | HTML presentation builder |
| `design-system` | Design system construction |
| `motion-ui` | Animation and motion design |
| `liquid-glass-design` | Modern glass morphism UI |
| `nuxt4-patterns` | Nuxt 4 patterns |

### Backend & API
| Skill | Purpose |
|-------|---------|
| `backend-patterns` | Server-side architecture patterns |
| `api-design` | REST/GraphQL API design |
| `django-patterns` | Django application patterns |
| `django-security` | Django security hardening |
| `django-tdd` | Test-driven Django development |
| `springboot-patterns` | Spring Boot patterns |
| `springboot-security` | Spring Boot security |
| `springboot-tdd` | Spring Boot TDD |
| `quarkus-patterns` | Quarkus patterns |
| `laravel-patterns` | Laravel patterns |
| `laravel-security` | Laravel security |
| `kotlin-patterns` | Kotlin server patterns |
| `kotlin-ktor-patterns` | Ktor framework patterns |
| `kotlin-coroutines-flows` | Kotlin async patterns |
| `kotlin-exposed-patterns` | Kotlin Exposed ORM |
| `golang-patterns` | Go server patterns |
| `golang-testing` | Go testing strategies |
| `rust-patterns` | Rust server patterns |
| `rust-testing` | Rust testing strategies |
| `python-patterns` | Python development patterns |
| `python-testing` | Python testing strategies |
| `pytorch-patterns` | PyTorch / deep learning |

### Database
| Skill | Purpose |
|-------|---------|
| `postgres-patterns` | PostgreSQL optimization |
| `database-migrations` | Safe migration strategies |
| `jpa-patterns` | JPA/Hibernate patterns |
| `clickhouse-io` | ClickHouse analytics patterns |

### Security
| Skill | Purpose |
|-------|---------|
| `security-review` | Comprehensive security review |
| `security-scan` | Automated security scanning |
| `safety-guard` | Safety boundary enforcement |
| `healthcare-phi-compliance` | HIPAA / PHI data protection |
| `defi-amm-security` | DeFi AMM security patterns |
| `evm-token-decimals` | EVM token decimal safety |
| `llm-trading-agent-security` | LLM trading security |
| `nodejs-keccak256` | Cryptographic hash patterns |
| `perl-security` | Perl security patterns |
| `laravel-security` | Laravel security |

### Testing
| Skill | Purpose |
|-------|---------|
| `tdd-workflow` | TDD Red-Green-Refactor cycle |
| `e2e-testing` | Playwright E2E testing |
| `browser-qa` | Browser QA automation |
| `ai-regression-testing` | AI model regression testing |
| `benchmark` | Performance benchmarking |
| `cpp-testing` | C++ testing patterns |
| `fsharp-testing` | F# testing patterns |
| `kotlin-testing` | Kotlin testing patterns |
| `python-testing` | Python testing patterns |
| `golang-testing` | Go testing patterns |
| `rust-testing` | Rust testing patterns |
| `perl-testing` | Perl testing patterns |

### DevOps & Infrastructure
| Skill | Purpose |
|-------|---------|
| `deployment-patterns` | Safe deployment strategies |
| `docker-patterns` | Docker/containerization |
| `git-workflow` | Git branching and PR workflow |
| `bun-runtime` | Bun JavaScript runtime |

### Architecture
| Skill | Purpose |
|-------|---------|
| `architecture-decision-records` | ADR documentation |
| `blueprint` | System blueprint creation |
| `coding-standards` | Universal coding standards |
| `cpp-coding-standards` | C++ specific standards |
| `java-coding-standards` | Java specific standards |
| `context-budget` | Context window management |
| `token-budget-advisor` | Token usage optimization |
| `error-handling` | Error handling patterns |

### Documentation & Content
| Skill | Purpose |
|-------|---------|
| `documentation-lookup` | API/docs research via Context7 |
| `article-writing` | Technical article writing |
| `content-engine` | Content production workflow |
| `market-research` | Market analysis |
| `investor-materials` | Investor deck creation |
| `investor-outreach` | Investor communication |
| `crosspost` | Cross-platform content publishing |

### Mobile
| Skill | Purpose |
|-------|---------|
| `android-clean-architecture` | Android clean arch patterns |
| `compose-multiplatform-patterns` | Kotlin Compose Multiplatform |
| `swiftui-patterns` | SwiftUI patterns |
| `swift-concurrency-6-2` | Swift 6.2 concurrency |
| `swift-actor-persistence` | Swift actor-based persistence |
| `swift-protocol-di-testing` | Swift protocol DI patterns |
| `foundation-models-on-device` | On-device ML models |
| `flutter-dart-code-review` | Flutter code review patterns |

### Media & Video
| Skill | Purpose |
|-------|---------|
| `manim-video` | Manim math animation |
| `remotion-video-creation` | React-based video creation |
| `video-editing` | Video editing automation |
| `videodb` | Video database patterns |
| `fal-ai-media` | fal.ai media generation |

### Search & External Services
| Skill | Purpose |
|-------|---------|
| `search-first` | Search-before-code methodology |
| `exa-search` | Exa search API patterns |
| `x-api` | Twitter/X API integration |
| `mcp-server-patterns` | MCP server construction |

### Business Operations
| Skill | Purpose |
|-------|---------|
| `enterprise-agent-ops` | Enterprise agent operations |
| `energy-procurement` | Energy procurement workflows |
| `inventory-demand-planning` | Inventory optimization |
| `logistics-exception-management` | Logistics exception handling |
| `production-scheduling` | Production scheduling |
| `quality-nonconformance` | Quality management |
| `returns-reverse-logistics` | Returns management |
| `customs-trade-compliance` | Trade compliance |
| `carrier-relationship-management` | Carrier management |

### Specialized ML/AI
| Skill | Purpose |
|-------|---------|
| `ito-market-intelligence` | Itô prediction market |
| `ito-basket-compare` | Market basket comparison |
| `ito-trade-planner` | Trade planning |
| `prediction-market-oracle-research` | Prediction market research |
| `prediction-market-risk-review` | Market risk analysis |

### System Meta-Skills
| Skill | Purpose |
|-------|---------|
| `configure-ecc` | ECC guided setup wizard |
| `skill-comply` | Skill compliance checking |
| `skill-stocktake` | Skill inventory audit |
| `rules-distill` | Distill rules from sessions |
| `codebase-onboarding` | New project onboarding |
| `repo-scan` | Repository structure scanning |
| `prompt-optimizer` | Prompt quality optimization |
| `santa-method` | Systematic task verification |
| `strategic-compact` | Strategic decision compression |
| `iterative-retrieval` | Progressive context retrieval |

---

## Skills vs. AgTechDesigne Comparison

### Already Covered
| ECC Skill | Our Equivalent |
|-----------|---------------|
| `frontend-patterns` | `frontend-design` |
| `react-patterns` | `nextjs-react-expert` |
| `backend-patterns` | `api-patterns` |
| `security-review` | `vulnerability-scanner` |
| `tdd-workflow` | `tdd-workflow` |
| `deployment-patterns` | `deployment-procedures` |
| `rust-patterns` | `rust-pro` |
| `python-patterns` | `python-patterns` |
| `coding-standards` | `clean-code` |
| `architecture-decision-records` | `architecture` |

### Missing — High Priority
| ECC Skill | Why We Need It |
|-----------|---------------|
| `continuous-learning-v2` | Session knowledge → instincts |
| `autonomous-loops` | Safe long-running agent tasks |
| `verification-loop` | Self-check before completion |
| `agent-architecture-audit` | Agent system quality |
| `context-budget` | Context window management |
| `token-budget-advisor` | Token cost optimization |
| `search-first` | Research methodology |
| `prompt-optimizer` | AI prompt quality |
| `codebase-onboarding` | New project initialization |

### Missing — Medium Priority
| ECC Skill | Why We Need It |
|-----------|---------------|
| `design-system` | Design token management |
| `motion-ui` | Animation patterns |
| `git-workflow` | Standardized git practices |
| `docker-patterns` | Containerization |
| `mcp-server-patterns` | MCP server building |
| `error-handling` | Error strategy patterns |

---

## Skill Creation Template for AgTechDesigne

```markdown
---
name: your-skill-name
description: One clear sentence describing what this skill provides and when it activates
---

# Skill Title

## When to Activate

List 3-5 specific scenarios where this skill should be used:
- Building X type of component
- Working with Y technology
- Solving Z class of problem

## Core Concepts

### Principle 1: [Name]
Explanation with concrete example.

### Principle 2: [Name]
Explanation with concrete example.

## Code Examples

\`\`\`typescript
// Example showing the RIGHT way
\`\`\`

## Anti-Patterns

\`\`\`typescript
// Example showing the WRONG way and why
\`\`\`

## Decision Checklist

Before finalizing, verify:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## References

- [Official Docs](https://...)
- [Related Skill](../related-skill/SKILL.md)
```

---

*Extracted from ECC v2.0.0 | 2026-07-14*
