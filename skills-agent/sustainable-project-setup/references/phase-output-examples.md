# Phase Output Examples

Expected deliverables for each phase of the Sustainable Project Setup skill.
Agents should produce output in these formats to ensure consistency.

## Phase 1 -- Explore

```
## Project Overview

- **Stack**: React 18 + TypeScript, Vite, Tailwind CSS
- **Architecture**: Single-page application (client-side rendering)
- **Dependencies**: 47 packages (12 direct, 35 transitive)
- **Build output**: dist/ (1.2 MB uncompressed, 380 KB gzipped)
- **Hosting**: Vercel (edge network, serverless functions)
- **Tests**: None
- **CI**: GitHub Actions (build only, no quality gates)
```

## Phase 2 -- Energy and Carbon (SCI)

```
## SCI Assessment

### Top 5 Energy-Intensive Operations

| # | Operation | Relative Cost | Wall Time | Notes |
|---|-----------|---------------|-----------|-------|
| 1 | Dashboard data fetch + render | High | ~1200ms | 3 API calls, heavy DOM |
| 2 | PDF report generation | High | ~800ms | Client-side, blocks main thread |
| 3 | Image gallery lazy load | Medium | ~400ms | 12 images per page |
| 4 | Search with autocomplete | Medium | ~200ms | Debounced, but no caching |
| 5 | Auth token refresh | Low | ~50ms | Every 15 minutes |

### Measurement Approach

Recommended: SCI Profiler (TypeScript) for operation-level measurement.
SWD Model v4 for page-level estimation.

### SWD Page-Level Estimate

| Page | Weight | Emissions/visit | Monthly (10k visitors) |
|------|--------|-----------------|----------------------|
| Home | 1.8 MB | 0.13 gCO2eq | 1.3 kgCO2eq |
| Dashboard | 3.2 MB | 0.23 gCO2eq | 2.3 kgCO2eq |
| About | 0.4 MB | 0.03 gCO2eq | 0.3 kgCO2eq |
```

## Phase 3 -- WSG Compliance

```
## WSG 1.0 Compliance Summary

| Category | Full | Partial | Gap | N/A | Score |
|----------|------|---------|-----|-----|-------|
| UX Design (2.1-2.21) | 8 | 5 | 6 | 2 | 55% |
| Web Development (3.1-3.20) | 10 | 4 | 4 | 2 | 67% |
| Hosting & Infrastructure (4.1-4.12) | 5 | 3 | 2 | 2 | 65% |
| Business Strategy (5.1-5.27) | 3 | 2 | 5 | 17 | 40% |
| **Total** | **26** | **14** | **17** | **23** | **58%** |

### Top 10 Improvements

| # | Guideline | Gap | Action | Effort |
|---|-----------|-----|--------|--------|
| 1 | 2.11 Optimize media | gap | Convert images to WebP, add srcset | small |
| 2 | 2.13 Web typography | gap | Switch to system font stack | trivial |
| 3 | 3.4 Remove unnecessary code | gap | Tree-shake unused exports | small |
| 4 | 3.8 Defer non-critical resources | gap | Lazy load below-fold components | small |
| 5 | 4.2 Optimize caching | gap | Add Cache-Control headers, service worker | medium |
| ... | | | | |

File created: wsg-report/wsg-compliance.json
```

## Phase 4 -- Accessibility

```
## Accessibility Assessment

### Lighthouse CI Results

| Page | Accessibility | Performance | Best Practices |
|------|--------------|-------------|----------------|
| Home | 78 | 65 | 85 |
| Dashboard | 72 | 58 | 82 |
| About | 91 | 88 | 95 |

### Top 10 Issues

| # | Severity | Issue | Count | Fix |
|---|----------|-------|-------|-----|
| 1 | Critical | Missing alt text on images | 14 | Add descriptive alt attributes |
| 2 | Critical | Insufficient color contrast | 8 | Adjust text/background colors |
| 3 | Serious | Missing form labels | 5 | Associate labels with inputs |
| 4 | Serious | No skip-to-content link | 1 | Add skip link in header |
| ... | | | | |

### Hosting Sustainability

- carbon.txt: Not found
- Green Web Foundation: Vercel -- listed as green hosting provider
```

## Phase 5 -- Performance and Resource Efficiency

```
## Performance Budget

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Total JS (gzipped) | 380 KB | < 200 KB | Over budget |
| Total CSS (gzipped) | 45 KB | < 50 KB | OK |
| Requests (home) | 28 | < 15 | Over budget |
| LCP | 3.2s | < 2.5s | Over budget |
| CLS | 0.05 | < 0.1 | OK |

### 5 Heaviest Dependencies

| Package | Size | Alternative | Savings |
|---------|------|-------------|---------|
| moment | 72 KB | dayjs (2 KB) | 70 KB |
| lodash | 68 KB | lodash-es (tree-shake) | ~55 KB |
| chart.js | 54 KB | uPlot (12 KB) | 42 KB |
| animate.css | 18 KB | CSS @keyframes | 18 KB |
| font-awesome | 45 KB | Inline SVG icons | 45 KB |
```

## Phase 6 -- Testing and Quality

```
## Test Infrastructure

- Framework: Vitest (installed)
- Tests: 0 existing -> 23 created
- Coverage: 0% -> 45% (critical paths)
- CI: GitHub Actions updated with test + audit steps

### Tests Created

| File | Tests | Coverage |
|------|-------|----------|
| src/api/__tests__/dashboard.test.ts | 6 | API data fetching, error handling |
| src/components/__tests__/Search.test.ts | 5 | Autocomplete, debounce, empty state |
| src/utils/__tests__/pdf.test.ts | 4 | Report generation, formatting |
| src/auth/__tests__/token.test.ts | 4 | Refresh flow, expiry, retry |
| e2e/navigation.test.ts | 4 | Critical user journeys |

### CI Energy

- eco-ci: Configured for GitHub Actions
- Baseline CI run: ~0.8 Wh per pipeline execution
```

## Phase 7 -- Prioritize

```
## Action Plan

| # | Priority | Category | Action | Impact | Effort | Metric |
|---|----------|----------|--------|--------|--------|--------|
| 1 | P0 | Performance | Replace moment with dayjs | High | Trivial | -70 KB bundle |
| 2 | P0 | Performance | System font stack | High | Trivial | -45 KB, -2 requests |
| 3 | P0 | Infra | Add Cache-Control headers | High | Trivial | -60% repeat requests |
| 4 | P0 | Quality | Lighthouse CI in pipeline | High | Small | Automated auditing |
| 5 | P1 | Performance | Code splitting per route | High | Medium | -40% initial JS |
| 6 | P1 | Carbon | Integrate SCI Profiler | High | Medium | Per-operation tracking |
| 7 | P1 | WSG | WSG compliance tracking | Medium | Medium | JSON report in CI |
| 8 | P2 | Carbon | SWD page weight budgets | Medium | Medium | Per-page CO2 targets |
| 9 | P2 | Accessibility | Full WCAG 2.1 AA remediation | High | Large | Score >= 90 |
| 10 | P3 | Carbon | Carbon budget CI gate | Medium | Large | Block deploys over budget |
```

## Phase 8 -- Establish Baselines

```
## Baselines and Targets

| Dimension | Baseline | Target | How to measure |
|-----------|----------|--------|----------------|
| Lighthouse Accessibility | 78 | >= 90 | npm run audit:a11y |
| Lighthouse Performance | 65 | >= 80 | npm run audit:a11y |
| Bundle size (total JS) | 380 KB | < 200 KB | npm run build |
| Network requests (home) | 28 | < 15 | DevTools Network |
| Test count | 23 | full cov | npm run test |
| WSG compliance | 40/80 | >= 50/80 | wsg-compliance.json |
| SCI per dashboard load | TBD | tracked | SCI Profiler |
| SWD home page | 0.13 g | < 0.10 g | swd_estimate tool |
| CI energy per run | 0.8 Wh | tracked | eco-ci |
```

## Phase 9 -- Sustainability-Aware CLAUDE.md

```markdown
# Project Name

## Build and test

npm run build        # Production build
npm run test         # Run test suite
npm run test:watch   # Watch mode
npm run audit:a11y   # Lighthouse accessibility audit
npm run audit:ci-energy  # CI energy report

## Feature addition checklist

1. Write the feature
2. Write co-located tests
3. Run tests -- all must pass
4. Run Lighthouse audit -- accessibility >= 90
5. Measure energy impact (SCI benchmark)
6. Check bundle size stays within budget (< 200 KB JS)
7. Update WSG compliance if architecture changed

## Performance budget

- Total JS (gzipped): < 200 KB
- Requests per page: < 15
- LCP: < 2.5s
- CLS: < 0.1
- Lighthouse Accessibility: >= 90
- Lighthouse Performance: >= 80

## Sustainability tracking

- wsg-report/wsg-compliance.json -- WSG compliance status
- lighthouserc.json -- Lighthouse CI thresholds
- .github/workflows/ci.yml -- includes eco-ci energy tracking
```

## References

- [Green Software Foundation SCI Specification](https://sci-guide.greensoftware.foundation/)
- [W3C Web Sustainability Guidelines 1.0](https://www.w3.org/TR/web-sustainability-guidelines/)
- [Sustainable Web Design Model](https://sustainablewebdesign.org/estimating-digital-emissions/)
