# Example: Daily Development Workflow

Use `/gc-dev` during your regular development process.

## Scenario

You are adding a product recommendation feature to an e-commerce app. Here is how green coding integrates into your workflow.

## 1. Planning the feature

```
/gc-dev feature product recommendations based on browsing history
```

The agent produces a sustainability-aware plan:

```
## Sustainability Plan: Product Recommendations

### Before coding
- [ ] Evaluate if real-time recommendations are necessary (could cached/pre-computed work?)
- [ ] Choose the lightest ML approach (rule-based > collaborative filtering > neural network)
- [ ] Plan caching strategy — recommendations change slowly, cache for 1 hour minimum

### During coding
- [ ] Fetch recommendations lazily — only when the user scrolls to the section
- [ ] Limit to 6 recommendations (not 20) — less data, fewer images, lower emissions
- [ ] Use responsive images with srcset — serve 200px thumbnails, not 800px originals
- [ ] Debounce scroll events that trigger recommendation loading
- [ ] Cache recommendations in sessionStorage to avoid re-fetching on navigation

### Before committing
- [ ] Run /gc-dev to check changed files
- [ ] No unused imports or dead code
- [ ] Images optimized (WebP, correct dimensions)

### Before PR
- [ ] Bundle size still within budget
- [ ] Run /gc-check-sustainability on the product page
- [ ] New API endpoint measured with /gc-measure-sci

### Methodology
- Green patterns: Green Software Foundation Patterns Catalog
- Caching strategy: GSF pattern "Cache static data"
- Image optimization: WSG guideline 3.11
```

## 2. During development — quick check

After writing the code, before committing:

```
/gc-dev
```

The agent scans your changed files:

```
## Green Check: feature/product-recommendations

### Code patterns
| File | Issues | Severity |
|------|--------|----------|
| src/components/Recommendations.tsx | 0 | - |
| src/api/recommendations.ts | 1 | medium |
| src/hooks/useRecommendations.ts | 0 | - |

Issue in src/api/recommendations.ts:
- Line 23: `fetch()` without caching headers — add `Cache-Control` to response

### Dependencies
- New deps: none
- Bundle impact: +2.1 KB (recommendation component)

### Assets
- New/changed assets: none (using existing product images)

### Verdict
[WARN] Minor issues found — consider fixing before commit

### Actions needed
1. Add Cache-Control header to /api/recommendations response (1h max-age)

### Methodology
- Code patterns: Creedengo green code rules
- Dependency check: bundle analysis via esbuild metafile
- Asset check: WSG 3.x guidelines
```

## 3. Before the PR — full review

```
/gc-dev review
```

The agent analyzes the full PR diff:

```
## Green PR Review: feature/product-recommendations

### Summary
Feature adds a lazy-loaded recommendation component with efficient caching.
Overall sustainability impact is positive — no significant new resource consumption.

### Findings
| Category | Status | Details |
|----------|--------|---------|
| Dependencies | ok | No new dependencies added |
| Bundle size | ok | +2.1 KB gzipped (within 200 KB budget) |
| Network efficiency | warn | API response not cached (fix: add Cache-Control) |
| Asset optimization | ok | Reuses existing product images with srcset |
| Code patterns | ok | No Creedengo issues after fix |
| Accessibility | ok | Recommendation cards have alt text and keyboard nav |

### Recommendations
1. Add `Cache-Control: public, max-age=3600` to recommendation API response
2. Consider preconnect hint for recommendation images if served from CDN

### Methodology and sources
- Code patterns: Creedengo green code rules
- Green patterns: GSF Patterns Catalog
- WSG reference: W3C Web Sustainability Guidelines 1.0
```

## 4. After merging — measure the impact

```
/gc-measure-sci GET /api/recommendations endpoint
```

```
## SCI Measurement: GET /api/recommendations

| Variable | Value | Source |
|----------|-------|--------|
| E (energy) | 0.0000025 kWh | wall-clock 90ms, server 65W |
| I (carbon intensity) | 436 gCO2eq/kWh | US grid, Ember 2022 |
| M (embodied) | 17.66 mgCO2eq/req | 1.2 tCO2eq / 26280h |
| R (functional unit) | 1 API request | GET /api/recommendations |
| **SCI** | **18.75 mgCO2eq/request** | |

### Methodology and sources
- Formula: SCI = ((E x I) + M) / R — GSF SCI Specification v1.0
- Grid carbon intensity: 436 gCO2eq/kWh — Ember 2022 (US)
- Device power: 65W — server TDP estimate
- Measurement tool: hyperfine (3 warmup runs, 10 measured)
```

## Summary: the green coding cycle

```
Plan feature ──> /gc-dev feature ...
     │
     v
Write code
     │
     v
Before commit ──> /gc-dev
     │
     v
Fix issues
     │
     v
Before PR ──────> /gc-dev review
     │
     v
Merge
     │
     v
Measure ────────> /gc-measure-sci
     │
     v
Track baseline ─> /gc-setup (quarterly)
```
