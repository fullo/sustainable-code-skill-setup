---
name: gc-estimate-emissions
description: >-
  Estimate CO2 emissions for web pages using the Sustainable Web Design (SWD) v4
  model. Works on a single page or an entire sitemap. Use when the user asks about
  page weight, page emissions, CO2 per visit, or digital carbon footprint.
license: MIT
metadata:
  author: fullo
  version: "1.0"
---

# Estimate Emissions

Estimate CO2 emissions per page view using the [Sustainable Web Design Model v4](https://sustainablewebdesign.org/estimating-digital-emissions/) for $ARGUMENTS.

## Steps

### Single page

1. **Determine page weight** in bytes:
   - Use DevTools Network tab (disable cache, load page)
   - Or `curl -sL [url] | wc -c` for a rough estimate
   - Or use Lighthouse report transferred size

2. **Estimate emissions**:
   - Use the `swd_estimate` MCP tool with:
     - `pageWeightBytes` (required): total transfer size in bytes
     - `monthlyVisitors`: monthly unique visitors (enables monthly totals)
     - `newVisitorRatio`: fraction of new visitors, 0-1 (default: 0.75)
     - `returnCacheRatio`: cache hit ratio for returning visitors, 0-1 (default: 0.02)
     - `carbonIntensity`: grid intensity in gCO2eq/kWh (default: 494 global average)
   - To check green hosting: use `check_green_hosting` MCP tool with the domain
   - If MCP is not available, compute manually:
     - Energy per visit = bytes x 0.81 kWh/GB (adjusted for new/return visitor mix)
     - CO2 = energy x grid intensity (494 gCO2eq/kWh global average)
     - Green hosting reduces data center segment by ~81%

3. **Report**:

```
## Page Emissions: [url]

| Metric | Value |
|--------|-------|
| Page weight | ? KB |
| Green hosted | yes/no |
| CO2 per new visit | ? g |
| CO2 per return visit | ? g |
| CO2 per visit (blended) | ? g |
| Annual estimate (1000 visits/month) | ? kg CO2 |

### Breakdown by segment
| Segment | Share |
|---------|-------|
| Data centers | ?% |
| Networks | ?% |
| User devices | ?% |

### Methodology and sources
- Model: [Sustainable Web Design Model v4](https://sustainablewebdesign.org/estimating-digital-emissions/)
- Grid carbon intensity: [value] gCO2eq/kWh — [Ember Global Electricity Review](https://ember-energy.org/) [year], or tool default (494 global avg)
- New visitor ratio: [value] — [estimated / analytics data]
- Page weight source: [DevTools / curl / Lighthouse]
- Green hosting: [checked via Green Web Foundation API / not checked]
```

### Multiple pages (sitemap)

1. **Collect page weights** for the most important pages (home, top landing pages, key flows)

2. **Batch estimate**:
   - Use the `swd_batch` MCP tool with:
     - `pages` (required): array of `{ "url": "...", "weightBytes": 123456 }` objects
     - `monthlyVisitors`: monthly visitors for total calculation
     - `carbonIntensity`: grid intensity in gCO2eq/kWh (default: 494)
   - If MCP is not available: compute each page individually using the formula above

3. **Report**:

```
## Sitemap Emissions

| Page | Weight | CO2/visit | Annual (1k/mo) |
|------|--------|-----------|-----------------|
| / | ? KB | ? g | ? kg |
| /about | ? KB | ? g | ? kg |
| ... | ... | ... | ... |
| **Total** | **? KB** | **? g** | **? kg** |

### Heaviest pages
1. [url] — ? KB — [why it's heavy]
2. ...

### Recommendations
1. [action to reduce heaviest pages]
2. ...

### Methodology and sources
- Model: Sustainable Web Design Model v4 — sustainablewebdesign.org
- Grid carbon intensity: [value] gCO2eq/kWh — Ember [year]
- Page weights: [source]
```

## Gotchas

- **SWD model v4 estimates are order-of-magnitude**: The Sustainable Web Design model provides rough estimates (plus or minus 50%). Do not present results with false precision (e.g., "1.234g CO2" — say "~1.2g CO2" instead).
- **First visit vs return visit matters enormously**: Cached resources can reduce transfer by 80%+. Always specify whether the estimate is for a first or return visit.
- **Mobile vs desktop can differ by 2-3x**: Mobile devices use less energy per page load but may transfer more data due to responsive images. Specify the device context.

## Post-report verification

After presenting the emissions report, automatically run `/gc-verify` in quick mode. This triggers a Chain-of-Verification (CoVe) process: extract claims from the report, generate adversarial questions, answer each independently, and present findings under a `## Verification (CoVe)` heading.

## Context

- SWD estimates page-level emissions based on data transfer
- For operation-level carbon measurement (API calls, background jobs), use `/gc-measure-sci`
- For a full sustainability audit, use `/gc-setup`
- SWD and SCI are complementary: SWD measures the "weight" of what users see, SCI measures the "cost" of what the server does
