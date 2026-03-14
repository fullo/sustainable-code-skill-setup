# Example: First Sustainability Audit

Run a full 9-phase sustainability audit on an existing project.

## Scenario

You have a Next.js e-commerce application hosted on Vercel (US region). You want to understand its environmental impact and establish sustainability baselines.

## Step 1 — Start the audit

In Claude Code, type:

```
/gc-setup
```

The agent will begin Phase 1 (Explore) automatically, reading your codebase to understand the stack, dependencies, and architecture.

## Step 2 — Provide context when asked

The agent may ask questions like:

> "Where is this application deployed? What region?"

Answer with specifics:

> "Deployed on Vercel, US East (us-east-1). About 50,000 monthly page views. Average page weight is around 800KB."

## Step 3 — Review phase outputs

Each phase produces a structured report. For example, Phase 2 output:

```
## Phase 2: Energy & Carbon (SCI)

### Top 5 energy-intensive operations
| # | Operation | Est. wall time | Energy cost |
|---|-----------|----------------|-------------|
| 1 | Product search (Algolia query + render) | 320ms | high |
| 2 | Cart checkout (Stripe API + DB write) | 450ms | high |
| 3 | Image gallery render (12 images) | 200ms | medium |
| 4 | Homepage SSR | 150ms | medium |
| 5 | User auth (JWT verify) | 15ms | low |

### SCI measurements
| Operation | wallTimeMs | SCI (mgCO2eq) |
|-----------|-----------|---------------|
| Product search | 320 | 6.19 |
| Cart checkout | 450 | 8.70 |
| Homepage SSR | 150 | 2.90 |

### Page-level emissions (SWD v4)
| Page | Weight | CO2/visit | Monthly (50k visits) |
|------|--------|-----------|---------------------|
| Homepage | 800 KB | 72.3 mg | 3.62 kg |
| Product page | 1.2 MB | 108.5 mg | 5.42 kg |
| Cart | 400 KB | 36.2 mg | 1.81 kg |

### Methodology and sources
- Formula: SCI = ((E x I) + M) / R — Green Software Foundation SCI Specification v1.0
- Grid carbon intensity: 436 gCO2eq/kWh — Ember Global Electricity Review 2022 (US average)
- Device power: 18W — Apple M1 Pro TDP (development), 65W — CI server estimate
- SWD model: Sustainable Web Design Model v4 — sustainablewebdesign.org
- Measurement tool: wall-clock timing via performance.now()
```

## Step 4 — Act on priorities

After Phase 7 (Prioritize), you get an action plan:

```
| # | Priority | Category | Action | Impact | Effort | Metric |
|---|----------|----------|--------|--------|--------|--------|
| 1 | P0 | Performance | Enable Next.js image optimization | high | trivial | -400KB page weight |
| 2 | P0 | Performance | Add Cache-Control headers for static assets | high | trivial | -30% requests |
| 3 | P0 | Fonts | Switch to system font stack | medium | small | -120KB, 0 requests |
| 4 | P1 | Code | Lazy load product gallery below fold | high | medium | -200ms LCP |
| 5 | P1 | Carbon | Integrate SCI Profiler for top 5 operations | medium | medium | baseline tracking |
```

## Step 5 — Establish baselines (Phase 8)

```
| Dimension | Baseline | Target | How to measure |
|-----------|----------|--------|----------------|
| Lighthouse Accessibility | 82 | >= 90 | npm run audit:a11y |
| Lighthouse Performance | 64 | >= 80 | npm run audit:perf |
| Bundle size (total JS) | 340 KB | < 200 KB | npm run build |
| Homepage weight | 800 KB | < 400 KB | DevTools Network |
| WSG compliance | 34/80 | >= 50/80 | wsg-compliance.json |
| SCI per search | 6.19 mg | < 4 mg | SCI Profiler |
```

## What happens next

- Phase 9 creates a sustainability-aware `CLAUDE.md` for your project
- Use `/gc-dev` for daily development with green checks
- Use `/gc-measure-sci` to track SCI as you optimize
- Re-run `/gc-setup` quarterly to track progress
