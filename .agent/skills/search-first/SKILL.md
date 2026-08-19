---
name: search-first
description: Research-before-code methodology. Enforces searching for existing solutions, patterns, and documentation BEFORE writing any implementation. Prevents reinventing the wheel, using outdated patterns, or missing ecosystem-native solutions. Activate at the start of any new feature or unfamiliar domain.
---

# Search First

> "Before writing code, ask: does this already exist?"

The search-first principle prevents the most common waste in development: implementing something that already exists in the framework, library, or codebase — or implementing it poorly because you skipped reading the documentation first.

## When to Activate

- Starting any new feature in an unfamiliar library/framework
- Implementing something that sounds like a common problem (auth, caching, file upload, pagination, etc.)
- Choosing between two approaches you're not certain about
- Before adding a new dependency
- When debugging an error you haven't seen before

## The Search-First Protocol

### Step 1: Search Before Writing

Before writing a single line of implementation code:

```
1. Does this exist natively in the framework?
   → Read the framework docs first

2. Does this exist in the existing codebase?
   → Search the codebase for similar patterns

3. Is there a battle-tested library for this?
   → Check npm/PyPI/crates.io for established solutions

4. What is the current community best practice?
   → Check official docs, not tutorials from 2020
```

### Step 2: Framework/Library Native Solutions

Always check if the framework already handles it:

| Problem | Where to Check |
|---------|---------------|
| Authentication | Next.js Auth.js / NextAuth, Passport.js, Supabase Auth |
| Form validation | React Hook Form + Zod, Formik |
| Data fetching | TanStack Query (react-query), SWR, Next.js fetch |
| State management | Zustand, Context API, Redux Toolkit |
| Database ORM | Prisma, Drizzle, TypeORM |
| Testing | Vitest, Jest, Playwright |
| Caching | Redis, Upstash, Vercel KV |
| File uploads | UploadThing, Cloudinary, AWS S3 SDK |
| Emails | Resend, Nodemailer, SendGrid |
| Payments | Stripe SDK |
| Search | Algolia, Typesense, Postgres full-text |

### Step 3: Search the Existing Codebase

Before implementing a pattern, search if it already exists:

```bash
# Search for similar functions
grep -r "createUser\|registerUser\|addUser" --include="*.ts" src/

# Search for similar patterns
grep -r "try.*catch\|error.*handling" --include="*.ts" src/auth/ | head -20

# Find how authentication is done elsewhere
grep -r "authenticate\|verifyToken\|session" --include="*.ts" src/ | head -30

# Find existing test patterns for similar features
find src/ -name "*.test.ts" | head -10 | xargs grep -l "describe"
```

### Step 4: Evaluate Options

When multiple approaches exist, evaluate:

```
| Criteria          | Option A | Option B |
|-------------------|---------|---------|
| Framework native? | Yes/No  | Yes/No  |
| Actively maintained? | Yes/No | Yes/No |
| Team already knows it? | Yes/No | Yes/No |
| Adds new dependency? | Yes/No | Yes/No |
| Fits existing patterns? | Yes/No | Yes/No |
```

**Prefer:**
1. Framework-native solution
2. Already-used library (don't add a 4th way to do the same thing)
3. Established library with known tradeoffs
4. Custom implementation only as last resort

### Step 5: Document Your Choice

Before implementing, write a one-liner:

```
// Using Zod for validation (already used in auth module, consistent with project)
// Alternative considered: Joi — rejected because Zod has better TypeScript integration
```

---

## Domain-Specific Search Guides

### Next.js / React
```bash
# Check Next.js version for available features
cat package.json | grep next

# Common patterns to search first:
# - Server Actions (Next.js 14+)
# - Route Handlers vs API Routes
# - Server Components vs Client Components
# - Metadata API
# - Image optimization (next/image)
# - Font optimization (next/font)
```

### Node.js / Backend
```bash
# Before writing middleware, check existing ones
ls src/middleware/

# Before new DB query pattern
grep -r "db\." --include="*.ts" src/ | head -20

# Before new error class
grep -r "extends Error\|class.*Error" --include="*.ts" src/
```

### Python
```bash
# Check existing utility functions
grep -r "def " --include="*.py" utils/ | head -20

# Check existing patterns
grep -r "class.*View\|@router" --include="*.py" src/
```

### Rust
```bash
# Check existing trait implementations
grep -r "impl " --include="*.rs" src/ | head -20

# Check error types
grep -r "enum.*Error\|thiserror" --include="*.rs" src/
```

---

## Anti-Patterns to Avoid

```
❌ "I'll implement my own auth because I know how JWT works"
   → Auth is solved. Use Auth.js, Supabase Auth, or Clerk.

❌ "I'll write a custom fetch wrapper"
   → TanStack Query or SWR already do this plus caching, retries, and loading state.

❌ "I'll add lodash for this one function"
   → Check if it's 1-2 lines of modern JS first. Often it is.

❌ "I'll copy-paste from Stack Overflow 2018"
   → Check the official docs for the current API.

❌ "I found a great library that does exactly this"
   → Check: last commit date, download count, issues, alternatives.
   → A library with 3 stars and no commits in 2 years is a liability.
```

---

## Documentation Sources (Bookmark These)

| Technology | Official Docs |
|------------|--------------|
| Next.js | https://nextjs.org/docs |
| React | https://react.dev |
| TypeScript | https://www.typescriptlang.org/docs |
| Node.js | https://nodejs.org/docs |
| Prisma | https://www.prisma.io/docs |
| Supabase | https://supabase.com/docs |
| TanStack Query | https://tanstack.com/query/latest |
| Zod | https://zod.dev |
| Stripe | https://stripe.com/docs |
| Rust | https://doc.rust-lang.org/book |
| Python | https://docs.python.org/3 |

---

## Decision Tree

```
New feature/implementation needed?
│
├── Is it auth-related?
│   └── Use existing auth solution (Auth.js, Supabase, Clerk)
│
├── Is it form/validation?
│   └── Use React Hook Form + Zod
│
├── Is it data fetching?
│   └── Use TanStack Query or Next.js fetch (if Server Component)
│
├── Does it already exist in our codebase?
│   └── Extend/reuse that
│
├── Is there a framework-native API?
│   └── Use that
│
├── Is there an established, maintained library?
│   └── Evaluate carefully (bundle size, maintenance, team knowledge)
│
└── None of the above?
    └── Now you may implement custom — but document why
```
