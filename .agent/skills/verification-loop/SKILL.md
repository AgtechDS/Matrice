---
name: verification-loop
description: Self-verification pattern before declaring any task complete. Systematically checks that implementation meets requirements, tests pass, security is sound, and documentation is updated. Activate before saying "done" or "complete" on any task.
---

# Verification Loop

> "Never declare a task complete without running the verification loop."

The verification loop is a systematic self-check that closes the quality gap between "code written" and "task actually done." It prevents the most common failure mode in AI-assisted development: shipping code that works in isolation but fails in context.

## When to Activate

- **Always** — before declaring any task complete
- Before creating a pull request
- Before committing a feature
- After fixing a bug (to verify fix didn't introduce regressions)
- After a refactoring (to verify behavior is preserved)

## The 6-Check Loop

Run all 6 checks in order. If any fails, fix and re-run that check before continuing.

---

### ✅ Check 1: Requirement Verification

**Question:** Does the implementation actually meet what was requested?

```
□ Re-read the original request/ticket
□ List each requirement explicitly
□ Verify each one is implemented (not just partially)
□ Check edge cases mentioned in the request
□ Verify the happy path works end-to-end
□ Verify common error cases are handled
```

**Red flags:**
- "I think this covers it" — verify explicitly
- Scope creep: implemented more than requested → confirm it's intentional
- Scope reduction: skipped something "for later" → confirm it's acceptable

---

### ✅ Check 2: Test Verification

**Question:** Are tests written, passing, and covering the new code?

```
□ Tests were written BEFORE implementation (TDD) or alongside it
□ All existing tests still pass (no regressions)
□ New code paths have corresponding test coverage
□ Edge cases are tested, not just the happy path
□ Test coverage ≥ 80% on new code
□ Integration tests written for API endpoints
□ E2E test written if this is a critical user flow
```

**Commands to verify:**
```bash
# Run full test suite
npm test

# Check coverage
npm run test:coverage

# Run only affected tests
npx jest --testPathPattern="feature-name"
```

**Red flags:**
- "The tests should pass" without running them
- New functions with zero test coverage
- Tests that only test the happy path

---

### ✅ Check 3: Security Verification

**Question:** Is this code secure and free of vulnerabilities?

```
□ No hardcoded secrets, API keys, or passwords
□ All user inputs validated at system boundary
□ SQL queries use parameterized parameters (no string concat)
□ HTML output sanitized (no XSS vectors)
□ Authentication checked on all protected routes
□ Authorization verified (right user for right resource)
□ Error messages don't expose internal details
□ No sensitive data logged (PII, tokens, passwords)
□ File uploads validated (if applicable)
□ Rate limiting in place on public endpoints (if applicable)
```

**Quick security check commands:**
```bash
# Check for hardcoded secrets
grep -r "api_key\|apikey\|password\|secret\|token" --include="*.ts" --include="*.js" src/

# Check for npm vulnerabilities  
npm audit --audit-level=high

# Check git doesn't contain secrets
git log --all --full-history -- "*.env"
```

---

### ✅ Check 4: Code Quality Verification

**Question:** Is the code clean, maintainable, and following project standards?

```
□ Functions are < 50 lines
□ Files are < 800 lines  
□ No deep nesting (> 4 levels)
□ Immutability: new objects returned, never mutated
□ Error handling at every level
□ No console.log() left in production code
□ No dead code or commented-out blocks
□ Self-documenting names (no x, tmp, data as variable names)
□ Linting passes with no errors
```

**Commands:**
```bash
# Lint check
npm run lint

# TypeScript type check
npx tsc --noEmit

# Format check
npm run format:check
```

---

### ✅ Check 5: Documentation Verification

**Question:** Is documentation updated to reflect the changes?

```
□ Function JSDoc updated if signature changed
□ README updated if user-facing feature was added
□ API documentation updated if endpoint changed
□ CODEBASE.md updated if architecture changed significantly
□ CHANGELOG.md entry added if this is a notable change
□ .env.example updated if new environment variables added
□ Migration guide written if this is a breaking change
```

**When to update each:**

| File | Update when... |
|------|---------------|
| JSDoc | Public function signature changes |
| README | New user-facing feature or setup step |
| CODEBASE.md | New module, new dependency, new pattern |
| CHANGELOG | Bug fix, new feature, breaking change |
| .env.example | New required or optional env var |

---

### ✅ Check 6: Integration Verification

**Question:** Does this work in context with the rest of the system?

```
□ Can be built without errors (npm run build / cargo build)
□ Dev server starts successfully
□ The actual user flow works end-to-end (manual test)
□ No breaking changes to interfaces consumed by other modules
□ Database migrations run without errors (if applicable)
□ Environment variables are all documented and set in .env.example
□ No circular dependencies introduced
```

**Manual verification checklist:**
1. Start the dev server
2. Navigate to the affected feature
3. Perform the action that was changed
4. Verify the expected result
5. Test the error case (e.g., invalid input)

---

## Verification Output

After completing all 6 checks, output a verification report:

```markdown
## Verification Report

**Task:** [what was implemented]
**Date:** YYYY-MM-DD

| Check | Status | Notes |
|-------|--------|-------|
| Requirements | ✅ PASS | All 3 requirements implemented |
| Tests | ✅ PASS | 12 tests, 94% coverage |
| Security | ✅ PASS | No issues found |
| Code Quality | ⚠️ WARN | One function at 45 lines (acceptable) |
| Documentation | ✅ PASS | JSDoc updated, README updated |
| Integration | ✅ PASS | Dev server tested, E2E manual pass |

**Verdict: READY TO COMMIT** ✅
```

Or if issues found:

```markdown
**Verdict: NOT READY — Issues to fix:**

1. [SECURITY] Missing input validation on POST /api/users
2. [TEST] No test for error case when email is duplicate
3. [DOCS] New env var `STRIPE_WEBHOOK_SECRET` not in .env.example
```

## Quick Verification (for small changes)

For minor fixes (single-line bug fixes, typos, config changes), use the abbreviated check:

```
□ Change does exactly what it should (no more, no less)
□ Existing tests still pass
□ No security implications
□ No documentation needed
→ READY
```

## When Verification Fails

If a check fails:
1. **Fix the issue** — don't skip or defer critical issues
2. **Re-run that specific check** — confirm the fix works
3. **Run all checks again from the start** — a fix can introduce new issues
4. **Only declare complete when all checks pass**

## Integration with Other Skills

- **`code-reviewer` agent** — Run before verification for external perspective
- **`context-budget` skill** — If context is high, checkpoint before running full verification
- **`tdd-workflow` skill** — Tests should already exist from TDD; Check 2 is then fast
- **`clean-code` skill** — Reference for Check 4 quality standards
