# ECC — Coding Standards & Quality Patterns
## Production Engineering Standards Extracted from ECC

> Source: `ECC/AGENTS.md`, `ECC/RULES.md`, `ECC/SOUL.md` (v2.0.0)

---

## Core Philosophy

ECC enforces five non-negotiable principles across all code:

1. **Agent-First** — Delegate to specialists. Don't do everything in one agent.
2. **Test-Driven** — Write tests before implementation. 80%+ coverage required. Always.
3. **Security-First** — No exceptions. Every input validated. No secrets in code.
4. **Immutability** — Create new objects. Never mutate existing state.
5. **Plan Before Execute** — Complex changes need a written plan first.

---

## Code Organization

### File Size Rules
| Size | Status | Action |
|------|--------|--------|
| < 200 lines | Ideal | Keep it |
| 200-400 lines | Normal | OK |
| 400-800 lines | Warning | Consider splitting |
| > 800 lines | VIOLATION | Must split |

### Organization Principles
- **Feature/domain over type** — `auth/` not `controllers/`
- **High cohesion** — Everything in a file should belong together
- **Low coupling** — Minimal dependencies between modules
- **Many small files** over few large files
- Functions: < 50 lines
- No deep nesting: max 4 levels

### Naming Standards
- **Self-documenting** — Names explain purpose without comments
- **Consistent** — Follow project conventions strictly
- **Descriptive** — No abbreviations (except industry-standard ones)
- Variables: camelCase (JS/TS), snake_case (Python), camelCase (Java/Kotlin)
- Files: kebab-case (web), PascalCase (components)

---

## Immutability (CRITICAL)

This is the most emphasized standard in ECC:

```typescript
// ❌ WRONG — Mutation
function addItem(cart: Cart, item: Item): void {
  cart.items.push(item);  // NEVER DO THIS
  cart.total += item.price;
}

// ✅ CORRECT — Immutable
function addItem(cart: Cart, item: Item): Cart {
  return {
    ...cart,
    items: [...cart.items, item],
    total: cart.total + item.price,
  };
}
```

**Immutability rules:**
- Always `return` a new object/array
- Use spread operators, `map`, `filter`, `reduce`
- Never use `push`, `pop`, `splice`, `sort` (mutating array methods)
- Never assign to object properties directly after creation
- In React: always use `setState` with new object, never mutate state

---

## Error Handling

```typescript
// ❌ WRONG — Swallowed error
try {
  const result = await fetchData();
} catch (e) {
  // nothing
}

// ❌ WRONG — Generic message
catch (e) {
  throw new Error("Something went wrong");
}

// ✅ CORRECT — Specific, contextual, logged
catch (error) {
  logger.error('Failed to fetch user data', {
    userId,
    endpoint: '/api/users',
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  
  // User-facing message is friendly
  throw new UserFacingError('Unable to load your profile. Please try again.');
}
```

**Error handling rules:**
1. Never silently swallow errors
2. Log detailed context server-side
3. Show friendly messages to users
4. Handle at every level (component, service, API)
5. Use typed errors when possible
6. Include context (what was being done, with what data)

---

## Input Validation

```typescript
// ❌ WRONG — Trusting user input
app.post('/users', async (req, res) => {
  const user = await db.create(req.body);  // DANGEROUS
  res.json(user);
});

// ✅ CORRECT — Schema validation at boundary
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
  age: z.number().int().min(0).max(150).optional(),
});

app.post('/users', async (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Invalid input',
      details: result.error.flatten()
    });
  }
  const user = await db.create(result.data);
  res.json(user);
});
```

**Validation rules:**
- Validate at ALL system boundaries (API routes, event handlers, CLI args)
- Use schema-based validation (Zod, Joi, Yup, Pydantic)
- Fail fast with clear messages
- Never trust external data (user input, third-party APIs, environment variables)
- Validate types AND business rules

---

## Security Requirements

### Pre-Commit Checklist (MANDATORY)

Before any commit, verify ALL of these:

```
Security Checklist:
[ ] No hardcoded secrets (API keys, passwords, tokens, connection strings)
[ ] All user inputs validated with schema
[ ] SQL queries use parameterized queries (no string concatenation)
[ ] HTML output sanitized (prevent XSS)
[ ] CSRF protection on all state-changing endpoints
[ ] Authentication checked on every protected route
[ ] Authorization verified (right user for right resource)
[ ] Rate limiting on all public endpoints
[ ] Error messages don't leak sensitive information
[ ] No sensitive data in logs (PII, passwords, tokens)
[ ] File uploads validated (type, size, content)
[ ] Redirects validated (no open redirect)
```

### Secret Management
```bash
# ❌ WRONG
API_KEY = "sk-1234567890abcdef"
DATABASE_URL = "postgres://user:pass@host/db"

# ✅ CORRECT
API_KEY = process.env.API_KEY
DATABASE_URL = process.env.DATABASE_URL

# Startup validation
if (!process.env.API_KEY) {
  throw new Error('API_KEY environment variable is required');
}
```

### OWASP Top 10 Quick Reference
1. **Injection** → Parameterized queries only
2. **Broken Auth** → bcrypt/argon2, JWT validation, secure sessions
3. **Sensitive Data** → HTTPS, env vars, PII encryption, log sanitization
4. **XXE** → Disable external entities in XML parsers
5. **Broken Access** → Auth on every route, proper CORS
6. **Misconfiguration** → Change defaults, disable debug in prod, set security headers
7. **XSS** → Escape output, set CSP headers, use framework auto-escaping
8. **Insecure Deserialization** → Validate deserialized data
9. **Known Vulnerabilities** → Keep deps updated, run `npm audit` / `pip audit`
10. **Insufficient Logging** → Log security events, set alerts

---

## Testing Standards

### Coverage Requirements
- **Minimum:** 80% coverage across all code
- **Target:** 90%+ for security-critical paths
- **Required types:** Unit + Integration + E2E

### TDD Workflow (Mandatory for new features)

```
1. RED   → Write failing test first
2. GREEN → Write minimal code to pass
3. REFACTOR → Clean up, verify 80%+ coverage
```

```typescript
// Step 1: RED — Write the test first
describe('calculateDiscount', () => {
  it('should apply 10% discount for premium users', () => {
    const result = calculateDiscount(100, 'premium');
    expect(result).toBe(90);  // Will FAIL — function doesn't exist yet
  });
  
  it('should not apply discount for standard users', () => {
    const result = calculateDiscount(100, 'standard');
    expect(result).toBe(100);
  });
});

// Step 2: GREEN — Minimal implementation
function calculateDiscount(price: number, tier: UserTier): number {
  if (tier === 'premium') return price * 0.9;
  return price;
}

// Step 3: REFACTOR — Clean up + edge cases
function calculateDiscount(price: number, tier: UserTier): number {
  if (price < 0) throw new Error('Price cannot be negative');
  const discountRates: Record<UserTier, number> = {
    premium: 0.1,
    standard: 0,
    trial: 0.05,
  };
  const rate = discountRates[tier] ?? 0;
  return price * (1 - rate);
}
```

### Test Structure (AAA Pattern)
```typescript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should [expected behavior] when [condition]', () => {
      // ARRANGE — Set up test data
      const input = { ... };
      
      // ACT — Execute the code
      const result = functionUnderTest(input);
      
      // ASSERT — Verify the result
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

---

## API Response Format

All API endpoints should use a consistent envelope:

```typescript
// Success response
{
  success: true,
  data: { ... },
  metadata: {
    page: 1,
    perPage: 20,
    total: 150,
    timestamp: "2026-07-14T16:00:00Z"
  }
}

// Error response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid email format",
    details: { field: "email", received: "not-an-email" }
  }
}

// Paginated list
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    perPage: 20,
    total: 150,
    hasNext: true,
    hasPrev: false
  }
}
```

---

## Repository Pattern

```typescript
// Interface — what business logic depends on
interface UserRepository {
  findAll(filters?: UserFilters): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

// Implementation — the actual storage mechanism
class PostgresUserRepository implements UserRepository {
  constructor(private db: Database) {}
  
  async findById(id: string): Promise<User | null> {
    const row = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return row ? mapRowToUser(row) : null;
  }
  // ...
}

// Business logic depends on interface, not implementation
class UserService {
  constructor(private users: UserRepository) {}  // Dependency injection
  
  async getUser(id: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return user;
  }
}
```

---

## Git Commit Standards

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
| Type | When to Use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructure (no behavior change) |
| `docs` | Documentation only |
| `test` | Tests only |
| `chore` | Build, config, CI |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |
| `style` | Formatting only |

### Examples
```bash
feat(auth): add JWT refresh token rotation
fix(cart): prevent negative quantity on item removal
refactor(users): extract UserRepository interface
docs(api): add OpenAPI schema for /payments endpoint
test(checkout): add E2E test for failed payment flow
perf(search): add index on products.category_id
```

---

## Performance Context Management

ECC's context window strategy:

| Context Utilization | Risk Level | Strategy |
|--------------------|-----------|---------|
| 0-60% | Low | Normal operation |
| 60-80% | Medium | Avoid large multi-file changes |
| 80-90% | High | Single-file edits only |
| > 90% (last 20%) | Critical | `/checkpoint`, summarize, start fresh |

**Context budget rules:**
- Large refactoring → start fresh session
- Multi-file features → use `/multi-plan` + `/multi-execute`
- Long debugging sessions → use `/save-session` at checkpoints
- When context > 80% → pause, `/checkpoint`, assess

---

*Extracted from ECC v2.0.0 AGENTS.md + RULES.md | 2026-07-14*
