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
     - `bytes`: total transfer size
     - `greenHosting`: true/false (check with `check_green_hosting` if unsure)
     - `returnVisitorRatio`: estimated fraction of return visitors (default 0.25)
   - If MCP is not available, compute manually:
     - Energy per visit = bytes x 0.81 kWh/GB (adjusted for new/return visitor mix)
     - CO2 = energy x grid intensity (436 gCO2eq/kWh global average)
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
```

### Multiple pages (sitemap)

1. **Collect page weights** for the most important pages (home, top landing pages, key flows)

2. **Batch estimate**:
   - Use the `swd_batch` MCP tool with an array of `{ url, bytes }` entries
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
```

## Context

- SWD estimates page-level emissions based on data transfer
- For operation-level carbon measurement (API calls, background jobs), use `/gc-measure-sci`
- For a full sustainability audit, use `/gc-setup`
- SWD and SCI are complementary: SWD measures the "weight" of what users see, SCI measures the "cost" of what the server does
