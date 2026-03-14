# Example: Estimate Page Emissions

Estimate CO2 emissions for a website using the SWD v4 model.

## Scenario

You manage a marketing website with 5 pages and 10,000 monthly visitors. The site is hosted in Germany on a green hosting provider.

## Single page

```
/gc-estimate-emissions homepage at example.com
```

The agent measures the page weight and calls the MCP tools:

**Tool call 1: `check_green_hosting`**
```json
{ "domain": "example.com" }
```
Response: `{ "domain": "example.com", "green": true, "hostedBy": "Hetzner" }`

**Tool call 2: `grid_carbon_intensity`**
```json
{ "countryCode": "DE" }
```
Response: `{ "intensity": 385, "country": "Germany" }`

**Tool call 3: `swd_estimate`**
```json
{
  "pageWeightBytes": 620000,
  "monthlyVisitors": 10000,
  "carbonIntensity": 385,
  "newVisitorRatio": 0.6
}
```
Response:
```json
{
  "emissionsPerVisitG": 0.0713,
  "emissionsPerVisitMg": 71.3,
  "monthlyEmissionsKg": 0.713,
  "breakdown": {
    "dataCenters": 0.016,
    "networks": 0.0172,
    "userDevices": 0.0384
  }
}
```

### Agent report

```
## Page Emissions: example.com (homepage)

| Metric | Value |
|--------|-------|
| Page weight | 620 KB |
| Green hosted | yes (Hetzner) |
| CO2 per visit (blended) | 71.3 mg |
| Monthly emissions (10k visits) | 0.71 kg |
| Annual estimate | 8.56 kg CO2 |

### Breakdown by segment
| Segment | Share | gCO2/visit |
|---------|-------|------------|
| Data centers | 22.4% | 16.0 mg |
| Networks | 24.1% | 17.2 mg |
| User devices | 53.9% | 38.4 mg |

### Methodology and sources
- Model: Sustainable Web Design Model v4 — sustainablewebdesign.org
- Grid carbon intensity: 385 gCO2eq/kWh — Ember Global Electricity Review 2022 (Germany)
- New visitor ratio: 0.6 — estimated (no analytics data)
- Page weight source: DevTools Network tab (cache disabled)
- Green hosting: verified via Green Web Foundation API (Hetzner)
```

## Full sitemap

```
/gc-estimate-emissions all pages on example.com
```

**Tool call: `swd_batch`**
```json
{
  "pages": [
    { "url": "/", "weightBytes": 620000 },
    { "url": "/about", "weightBytes": 280000 },
    { "url": "/services", "weightBytes": 450000 },
    { "url": "/blog", "weightBytes": 890000 },
    { "url": "/contact", "weightBytes": 180000 }
  ],
  "monthlyVisitors": 10000,
  "carbonIntensity": 385
}
```

### Agent report

```
## Sitemap Emissions: example.com

| Page | Weight | CO2/visit | % of total |
|------|--------|-----------|------------|
| /blog | 890 KB | 102.3 mg | 36.8% |
| / | 620 KB | 71.3 mg | 25.6% |
| /services | 450 KB | 51.7 mg | 18.6% |
| /about | 280 KB | 32.2 mg | 11.6% |
| /contact | 180 KB | 20.7 mg | 7.4% |
| **Total** | **2.42 MB** | **278.2 mg** | **100%** |

Monthly total: 2.78 kg CO2 (10,000 visits)
Annual total: 33.4 kg CO2

### Heaviest pages
1. /blog — 890 KB — hero images not optimized, 3 third-party scripts (analytics, chat, social)
2. / — 620 KB — large hero video autoplay, custom web fonts (4 weights)

### Recommendations
1. Convert blog images to WebP/AVIF (est. -60% image weight)
2. Remove or defer third-party scripts on /blog (est. -200 KB)
3. Replace custom fonts with system font stack on all pages (est. -80 KB, 0 font requests)
4. Lazy load hero video on homepage (est. -300 KB initial load)
5. Enable Brotli compression server-side (est. -30% text assets)

### Methodology and sources
- Model: Sustainable Web Design Model v4 — sustainablewebdesign.org
- Grid carbon intensity: 385 gCO2eq/kWh — Ember 2022 (Germany)
- Page weights: DevTools Network tab (cache disabled, 3G throttle)
```

## Interpreting results

| Annual emissions | Rating | Context |
|-----------------|--------|---------|
| < 10 kg | Low | Comparable to charging a phone for a year |
| 10-100 kg | Medium | Comparable to a short domestic flight |
| 100-1000 kg | High | Comparable to a transatlantic flight |
| > 1000 kg | Very high | Consider this a sustainability priority |

Source: Web Almanac 2022, HTTP Archive median page weight analysis.
