---
name: gc-dev
description: >-
  Sustainability-aware development companion. Use during daily coding to check
  that new features, changes, and commits follow green coding practices.
  Activates when the user mentions green review, sustainability check before
  commit, eco-friendly code review, or green coding during development.
license: MIT
metadata:
  author: fullo
  version: "1.0"
---

# Green Coding Dev Companion

Sustainability checklist for your daily development workflow. Use this during feature development, before commits, and during code reviews.

## When to use

- Writing a new feature or making significant changes
- Before committing or opening a pull request
- Reviewing someone else's code
- Checking if recent changes affect sustainability metrics

## Quick check (default)

When invoked without arguments, run the quick check on recently changed files.

### 1. Identify changed files

```bash
git diff --name-only HEAD~1   # or git diff --staged --name-only
```

### 2. Code-level green check

For each changed source file (JS, TS, PHP, Python, Java):

- Use the `creedengo_check` MCP tool to scan for energy-wasteful patterns
- If MCP is not available, manually check for:
  - Unnecessary loops or DOM manipulation
  - Missing pagination on data queries
  - Synchronous blocking calls that could be async
  - Oversized imports (full library instead of specific modules)
  - Console.log or debug statements left in production code

### 3. Dependency check

If `package.json`, `composer.json`, `requirements.txt`, or similar changed:

- Check for new dependencies — are they necessary?
- Check bundle size impact — is there a lighter alternative?
- Check if tree-shaking is supported

### 4. Asset check

If images, fonts, or media files changed:

- Images: WebP/AVIF format? Appropriately sized? Lazy loaded?
- Fonts: system font stack preferred over custom web fonts
- SVG: optimized with svgo or equivalent?

### 5. Report

```
## Green Check: [branch/commit]

### Code patterns
| File | Issues | Severity |
|------|--------|----------|
| ... | ... | ... |

### Dependencies
- New deps: [list or "none"]
- Bundle impact: [estimated]

### Assets
- New/changed assets: [list or "none"]
- Optimization: [status]

### Verdict
[PASS] Ready to commit — no sustainability concerns
[WARN] Minor issues found — consider fixing before commit
[FAIL] Significant issues — fix before committing

### Actions needed
1. ...

### Methodology
- Code patterns: Creedengo green code rules (green-code-initiative/creedengo-rules-specifications)
- Dependency check: bundle size analysis via [tool]
- Asset check: format and compression best practices per WSG 3.x guidelines
```

## Feature mode

When invoked with `/gc-dev feature [description]`, provide a sustainability-aware development plan:

### 1. Plan the feature with sustainability in mind

- What data does this feature need? Can it be lazy-loaded?
- What computations are required? Can they be cached or memoized?
- Does it add new dependencies? Are they necessary?
- Does it add new network requests? Can they be batched or deferred?
- Does it affect the critical rendering path?

### 2. Suggest green implementation patterns

Based on the feature description, recommend specific patterns from the [Green Software Foundation catalog](https://patterns.greensoftware.foundation/):

- **Cache static data** — avoid redundant computation or fetches
- **Minimize DOM changes** — batch updates, use virtual scrolling for long lists
- **Lazy load below-the-fold** — defer non-critical resources
- **Use efficient data formats** — prefer JSON over XML, binary over text where appropriate
- **Debounce/throttle user inputs** — reduce processing frequency
- **Prefer CSS over JS** — animations, transitions, layout via CSS use less energy

### 3. Output a checklist

```
## Sustainability Plan: [feature]

### Before coding
- [ ] Evaluate if the feature is necessary (less code = less carbon)
- [ ] Choose the lightest dependencies possible
- [ ] Plan caching strategy for data fetches

### During coding
- [ ] Use lazy loading for non-critical resources
- [ ] Minimize network requests (batch, cache, deduplicate)
- [ ] Avoid blocking the main thread
- [ ] Use efficient data structures and algorithms
- [ ] Add appropriate cache headers

### Before committing
- [ ] Run /gc-dev to check changed files
- [ ] No unused imports or dead code
- [ ] Images optimized (WebP/AVIF, correct dimensions)
- [ ] No console.log in production code

### Before PR
- [ ] Bundle size within budget
- [ ] Run /gc-check-sustainability on affected pages
- [ ] Update wsg-compliance.json if architecture changed
```

## PR review mode

When invoked with `/gc-dev review`, analyze the current PR diff for sustainability:

### 1. Analyze the diff

```bash
git diff main...HEAD
```

### 2. Check each change against green criteria

- New dependencies added? Justified?
- Bundle size impact?
- New network requests or API calls?
- Efficient data fetching? (pagination, filtering on server)
- Proper caching?
- Images and assets optimized?
- Accessibility maintained?
- Code patterns clean? (creedengo check)

### 3. Report

```
## Green PR Review

### Summary
[1-2 sentence sustainability assessment]

### Findings
| Category | Status | Details |
|----------|--------|---------|
| Dependencies | ok/warn/fail | ... |
| Bundle size | ok/warn/fail | ... |
| Network efficiency | ok/warn/fail | ... |
| Asset optimization | ok/warn/fail | ... |
| Code patterns | ok/warn/fail | ... |
| Accessibility | ok/warn/fail | ... |

### Recommendations
1. ...

### Methodology and sources
- Code patterns: Creedengo green code rules
- Green patterns: Green Software Foundation Patterns Catalog (patterns.greensoftware.foundation)
- WSG reference: W3C Web Sustainability Guidelines 1.0
```

## Gotchas

- **Green hosting check requires DNS resolution**: The Green Web Foundation API checks the domain's IP against its database. If the domain isn't publicly resolvable (localhost, internal), the check will fail — this is expected, not an error.
- **Creedengo rules are language-specific**: Not all green code rules apply to all languages. Check which rules exist for the project's stack before reporting missing compliance.
- **SCI improvements below measurement noise are meaningless**: If SCI measurement variance is ±15%, a reported 5% improvement is within noise. Only report improvements that exceed measurement uncertainty.

## Post-report verification

After presenting the report (quick check, feature plan, or PR review), automatically run `/gc-verify` in quick mode (checks 1-4) to validate sources, assumptions, precision, and coverage. Present the verification results immediately after the report under a `## Verification` heading.

## Related commands

- `/gc-setup` — full 9-phase sustainability audit (run once at project start)
- `/gc-measure-sci` — measure carbon intensity for a specific operation
- `/gc-check-sustainability` — quick WSG + hosting + code patterns check
- `/gc-estimate-emissions` — estimate page or sitemap CO2 emissions
