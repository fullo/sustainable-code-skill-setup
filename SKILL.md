---
name: sustainable-project-setup
description: >-
  Audits a software project for environmental sustainability, accessibility, and
  quality, then implements measurable improvements. Covers SCI carbon measurement,
  W3C Web Sustainability Guidelines (WSG 1.0) compliance, Lighthouse accessibility
  auditing, performance budgets, test infrastructure, and development workflow.
  Use when setting up a new project, onboarding to an existing codebase, or when
  the user asks about green code, sustainability, carbon footprint, SCI, WSG,
  accessibility, or eco-friendly development practices.
license: MIT
metadata:
  author: fullo
  version: "1.0"
---

# Sustainable Project Setup

Audit a codebase and establish a development workflow where environmental
sustainability, accessibility, and quality are first-class engineering concerns.

## When to use

- Setting up or onboarding to any software project
- User asks about green code, carbon footprint, sustainability, SCI, WSG, or accessibility
- Reviewing a project's environmental impact
- Establishing quality baselines for a codebase

## Workflow

Follow these phases in order. Complete each phase before moving to the next.

```
Sustainability Setup Progress:
- [ ] Phase 1: Explore codebase and understand architecture
- [ ] Phase 2: Audit — Energy & Carbon (SCI)
- [ ] Phase 3: Audit — Web Sustainability Guidelines (WSG 1.0)
- [ ] Phase 4: Audit — Accessibility
- [ ] Phase 5: Audit — Performance & Resource Efficiency
- [ ] Phase 6: Audit — Testing & Quality
- [ ] Phase 7: Prioritize actions (P0–P3)
- [ ] Phase 8: Establish baselines and targets
- [ ] Phase 9: Create sustainability-aware CLAUDE.md
```

## Phase 1 — Explore

Read the codebase thoroughly. Understand:

- Tech stack, language, framework
- Architecture (client-side, server-side, hybrid, CLI)
- Dependencies and their weight
- Build pipeline and output
- Hosting and deployment model
- Existing tests, CI, and quality tooling

## Phase 2 — Energy & Carbon (SCI)

Evaluate against the Green Software Foundation SCI formula:

```
SCI = ((E x I) + M) / R
```

| Variable | What to assess |
|----------|---------------|
| **E** (Energy) | CPU-intensive operations, hot loops, redundant computation, blocking I/O |
| **I** (Carbon Intensity) | Where does code run? Client device, cloud region, CDN, edge? |
| **M** (Embodied Carbon) | Dedicated servers/containers/VMs? Could it be serverless or client-side? |
| **R** (Functional Unit) | What is "one operation"? (API call, page load, file processed, session) |

Deliverables:

1. Identify the 5 most energy-intensive operations
2. Estimate relative energy cost (high/medium/low) per major feature
3. Recommend a measurement approach:
   - **Any JS/TS project** (browser, Node.js, Deno, Bun): integrate the [SCI Profiler](https://github.com/fullo/sci-profiler) — zero-dependency, framework-agnostic TypeScript library that uses `performance.now()` to compute SCI per operation. Recommended for all projects where `performance.now()` is available.
   - **Other server-side** (Python, Go, Java, etc.): per-request CPU time tracking or [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/)
   - **CLI tools**: wall-clock benchmarks with `hyperfine` or equivalent
4. If possible, create an initial SCI benchmark for the top 5 operations

See [references/sci-guide.md](references/sci-guide.md) for the full SCI methodology, constants, and implementation patterns.

## Phase 3 — WSG Compliance

Evaluate against the [W3C Web Sustainability Guidelines 1.0](https://www.w3.org/TR/web-sustainability-guidelines/) (80 guidelines, 4 categories):

- **User Experience Design** (2.1-2.21) — efficient, inclusive, minimal UX
- **Web Development** (3.1-3.20) — efficient, secure, standards-based code
- **Hosting & Infrastructure** (4.1-4.12) — sustainable hosting, caching, compression
- **Business Strategy** (5.1-5.27) — privacy, transparency, ethical practices

Deliverables:

1. For each guideline: mark as `full`, `partial`, `na` (not applicable), or `gap`
2. For each `gap`: propose a concrete action with effort estimate (trivial/small/medium/large)
3. Identify the 10 highest-impact improvements
4. Create `wsg-report/wsg-compliance.json` using the template structure

See [references/wsg-checklist.md](references/wsg-checklist.md) for the complete 80-guideline checklist and JSON template.

## Phase 4 — Accessibility

Assess the project's accessibility posture:

- Automated auditing (Lighthouse, axe-core, Pa11y)?
- WCAG 2.1 AA violations?
- Semantic HTML (headings, landmarks, ARIA)?
- Keyboard navigation across all interactive elements?
- Color contrast?
- Media alternatives (alt text, captions)?
- Respect for `prefers-reduced-motion` and `prefers-color-scheme`?

Deliverables:

1. Set up Lighthouse CI with thresholds: accessibility >= 90 (error), performance >= 80 (warn), best practices >= 90 (warn)
2. Create `lighthouserc.json` targeting 3-5 representative pages
3. Add `npm run audit:a11y` (or equivalent) script
4. List top 10 accessibility issues by severity

See [references/accessibility-setup.md](references/accessibility-setup.md) for Lighthouse CI configuration examples.

## Phase 5 — Performance & Resource Efficiency

Evaluate resource consumption:

| Area | What to check |
|------|--------------|
| Bundle size | Unnecessarily large dependencies? Lighter alternatives? |
| Network requests | How many per page load? Optimized? |
| Lazy loading | Non-critical resources deferred? Routes code-split? |
| Caching | Cache headers? Content-hashed filenames? |
| Web fonts | Can custom fonts be replaced with system font stack? |
| Images | Modern formats (WebP/AVIF)? Appropriately sized? SVG icons? |
| Third-party | Analytics, ads, widgets — cost vs value? |

Deliverables:

1. Define a performance budget (max bundle size, max requests, max LCP, max CLS)
2. Identify the 5 heaviest dependencies — propose lighter alternatives
3. Recommend tree-shaking, code splitting, and lazy loading improvements
4. If web fonts are used, evaluate switching to system font stack (zero network cost)

## Phase 6 — Testing & Quality

Evaluate test infrastructure:

- Automated test suite? Framework? Coverage?
- Critical paths untested?
- Tests deterministic and fast?
- CI pipeline?

Deliverables:

1. If no test suite: set up appropriate framework (Vitest, Jest, Pytest, Go test, etc.)
2. Create test helpers: fixture factories (programmatic, not static files), shared assertions
3. Write tests for the 5 most critical operations
4. Add `test`, `test:watch`, `test:coverage` scripts
5. Establish rule: every new feature gets a co-located test file

## Phase 7 — Prioritize

Produce an action plan ordered by **impact x feasibility**:

| Priority | Criteria | Examples |
|----------|---------|---------|
| **P0** | High impact, low effort | Enable tree-shaking, system font stack, cache headers, Lighthouse CI |
| **P1** | High impact, medium effort | Code splitting, SCI profiling, WSG compliance tracking |
| **P2** | Medium impact, higher effort | Full WSG audit, carbon budgets per feature, energy regression detection |
| **P3** | Lower impact or high effort | Real-time power measurement, carbon dashboards, sustainability CI gates |

Output as a table:

```
| # | Priority | Category | Action | Impact | Effort | Metric |
|---|----------|----------|--------|--------|--------|--------|
```

## Phase 8 — Establish Baselines

For every measurable dimension, establish a baseline and define a target:

```
| Dimension                  | Baseline | Target    | How to measure         |
|----------------------------|----------|-----------|------------------------|
| Lighthouse Accessibility   | ?        | >= 90     | npm run audit:a11y     |
| Lighthouse Performance     | ?        | >= 80     | npm run audit:a11y     |
| Bundle size (total JS)     | ? KB     | < ? KB    | npm run build          |
| Network requests (home)    | ?        | < ?       | DevTools Network       |
| Test count                 | ?        | full cov  | npm run test           |
| WSG compliance             | ?/80     | >= 50/80  | wsg-compliance.json    |
| SCI per operation          | ? mg     | tracked   | SCI profiler           |
```

## Phase 9 — Sustainability-Aware CLAUDE.md

Create or update `CLAUDE.md` encoding sustainability as a core practice:

1. **Build & test commands** including audit and benchmark commands
2. **Feature addition checklist** with mandatory sustainability steps:
   - Write the feature
   - Write tests
   - Run tests — all must pass
   - Check accessibility (Lighthouse audit)
   - Measure energy impact (SCI benchmark or equivalent)
   - Update WSG compliance if architecture changed
   - Verify performance budget
3. **Sustainability tracking files** — WSG JSON, SCI reports, Lighthouse config
4. **Performance budget** — concrete limits
5. **Architecture decisions** documenting WHY choices were made for sustainability
6. **Commit conventions** that track sustainability work

## Guiding Principles

Apply these throughout:

1. **Measure before optimizing** — establish baselines, don't guess
2. **Sustainability is not optional** — it's a quality dimension like security
3. **Client over server when possible** — user's device has near-zero marginal infrastructure carbon
4. **Less is more** — fewer dependencies, requests, bytes, servers
5. **Transparency** — publish sustainability data
6. **Accessibility is sustainability** — inclusive software serves more people without forcing device upgrades
7. **Automate the checks** — if it's not in CI, it will regress
8. **Track over time** — one measurement is a data point, a time series is a strategy
