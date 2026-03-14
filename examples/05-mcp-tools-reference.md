# MCP Tools Reference

Complete reference for all 8 MCP tools with parameters, defaults, and example outputs.

## Setup

```json
{
  "mcpServers": {
    "sustainable-code": {
      "command": "node",
      "args": ["~/.gc-tools/mcp-plugin/dist/index.js"]
    }
  }
}
```

Verify: ask Claude "Use the grid_carbon_intensity tool to check Italy's carbon intensity"

---

## 1. grid_carbon_intensity

Look up grid carbon intensity for a country.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `countryCode` | string | yes | ISO 3166-1 alpha-2 code (e.g., "US", "DE") or "GLOBAL" |

**Supported countries:** US, CN, IN, DE, GB, FR, JP, AU, BR, CA, IT, ES, SE, NO, IS, GLOBAL

**Example:**
```json
{ "countryCode": "DE" }
```

**Response:**
```json
{
  "country": "Germany",
  "countryCode": "DE",
  "intensity": 385,
  "source": "Ember Global Electricity Review",
  "year": 2022
}
```

---

## 2. sci_calculate

Compute SCI (Software Carbon Intensity) for a unit of work.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `wallTimeMs` | number | yes | - | Wall-clock execution time in milliseconds |
| `devicePowerW` | number | no | 18 | Device power draw in watts |
| `carbonIntensity` | number | no | 332 | Grid carbon intensity in gCO2eq/kWh |
| `embodiedTotalG` | number | no | 211000 | Total embodied emissions in gCO2eq |
| `lifetimeHours` | number | no | 11680 | Expected device lifetime in hours |

**Defaults represent:** Apple M1 Pro laptop, GitHub Actions CI grid intensity, 4-year device lifetime (8h/day).

**Example — API endpoint on CI server:**
```json
{
  "wallTimeMs": 280,
  "carbonIntensity": 436,
  "devicePowerW": 65,
  "embodiedTotalG": 1200000,
  "lifetimeHours": 26280
}
```

**Response:**
```json
{
  "sciMgCO2eq": 55.02,
  "energyKwh": 0.00000506,
  "carbonOperationalMg": 2.21,
  "carbonEmbodiedMg": 52.81,
  "wallTimeMs": 280
}
```

---

## 3. swd_estimate

Estimate per-page carbon emissions using the SWD v4 model.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageWeightBytes` | number | yes | - | Page weight (transfer size) in bytes |
| `monthlyVisitors` | number | no | - | Monthly unique visitors (enables monthly totals) |
| `newVisitorRatio` | number | no | 0.75 | Fraction of new visitors (0-1) |
| `returnCacheRatio` | number | no | 0.02 | Cache hit ratio for returning visitors (0-1) |
| `carbonIntensity` | number | no | 494 | Grid carbon intensity in gCO2eq/kWh |

**Example:**
```json
{
  "pageWeightBytes": 512000,
  "monthlyVisitors": 10000,
  "carbonIntensity": 385
}
```

**Response:**
```json
{
  "emissionsPerVisitG": 0.0589,
  "emissionsPerVisitMg": 58.9,
  "monthlyEmissionsKg": 0.589,
  "breakdown": {
    "dataCenters": 0.01322,
    "networks": 0.01421,
    "userDevices": 0.03179
  }
}
```

---

## 4. swd_batch

Estimate emissions for multiple pages at once.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pages` | array | yes | - | Array of `{ "url": string, "weightBytes": number }` |
| `monthlyVisitors` | number | no | - | Monthly visitors for total calculation |
| `carbonIntensity` | number | no | 494 | Grid carbon intensity |

**Example:**
```json
{
  "pages": [
    { "url": "/", "weightBytes": 620000 },
    { "url": "/blog", "weightBytes": 890000 },
    { "url": "/contact", "weightBytes": 180000 }
  ],
  "monthlyVisitors": 5000,
  "carbonIntensity": 385
}
```

**Response:**
```json
{
  "totalEmissionsPerVisitMg": 194.3,
  "totalMonthlyEmissionsKg": 0.972,
  "pages": [
    { "url": "/blog", "weightBytes": 890000, "emissionsPerVisitMg": 102.3, "percentage": 52.65 },
    { "url": "/", "weightBytes": 620000, "emissionsPerVisitMg": 71.3, "percentage": 36.70 },
    { "url": "/contact", "weightBytes": 180000, "emissionsPerVisitMg": 20.7, "percentage": 10.65 }
  ],
  "heaviestPage": "/blog",
  "lightestPage": "/contact"
}
```

---

## 5. check_green_hosting

Check if a domain uses green hosting.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain` | string | yes | Domain name (e.g., "example.com"). Protocols and paths are stripped. |

**Example:**
```json
{ "domain": "https://www.thegreenwebfoundation.org" }
```

**Response (green):**
```json
{
  "domain": "thegreenwebfoundation.org",
  "green": true,
  "hostedBy": "Hetzner Online GmbH"
}
```

**Response (not green):**
```json
{
  "domain": "github.com",
  "green": false
}
```

Note: requires internet access. The tool calls the Green Web Foundation API.

---

## 6. wsg_compliance_score

Score a WSG compliance JSON file.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filePath` | string | yes | Absolute path to the JSON file |

**Expected JSON format:** array of objects with `id`, `status`, and `category`:
```json
[
  { "id": "2.1", "status": "full", "category": "ux", "title": "Optional title" },
  { "id": "3.2", "status": "gap", "category": "dev" }
]
```

Valid `status` values: `full`, `partial`, `gap`, `na`
Valid `category` values: `ux`, `dev`, `hosting`, `business`

**Response:**
```json
{
  "totalGuidelines": 16,
  "full": 10,
  "partial": 2,
  "gap": 3,
  "na": 1,
  "scorePercent": 73.3,
  "gapsByCategory": {
    "dev": [{ "id": "3.7", "title": "Caching headers", "status": "gap" }],
    "hosting": [{ "id": "4.3", "title": "Green hosting", "status": "gap" }]
  }
}
```

See [sample-wsg-compliance.json](sample-wsg-compliance.json) for a complete example file.

---

## 7. creedengo_check

Check a source file against green coding rules.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filePath` | string | yes | Absolute path to a source file |
| `language` | string | no | Override: `javascript`, `php`, `python`, `java`. Auto-detected from extension. |

**Supported extensions:** `.js`, `.ts`, `.jsx`, `.tsx`, `.mjs` (JavaScript), `.php` (PHP), `.py` (Python), `.java` (Java)

**Example:**
```json
{ "filePath": "/absolute/path/to/src/app.ts" }
```

**Response (clean):**
```json
{
  "filePath": "/path/to/src/app.ts",
  "language": "javascript",
  "issuesFound": 0,
  "issues": []
}
```

**Response (issues found):**
```json
{
  "filePath": "/path/to/src/dashboard.ts",
  "language": "javascript",
  "issuesFound": 2,
  "issues": [
    {
      "rule": "avoid-setinterval",
      "line": 45,
      "message": "setInterval detected — prefer requestAnimationFrame or event-driven updates",
      "severity": "medium"
    },
    {
      "rule": "avoid-wildcard-import",
      "line": 3,
      "message": "Wildcard import detected — import only what you need for tree-shaking",
      "severity": "low"
    }
  ]
}
```

---

## 8. sci_compare

Compare two SCI measurements.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `baselineSciMg` | number | yes | - | Baseline SCI in mgCO2eq |
| `currentSciMg` | number | yes | - | Current SCI in mgCO2eq |
| `baselineLabel` | string | no | "baseline" | Label for baseline |
| `currentLabel` | string | no | "current" | Label for current |

**Example:**
```json
{
  "baselineSciMg": 55.02,
  "currentSciMg": 18.67,
  "baselineLabel": "before query caching",
  "currentLabel": "after query caching"
}
```

**Response:**
```json
{
  "baselineLabel": "before query caching",
  "baselineSciMg": 55.02,
  "currentLabel": "after query caching",
  "currentSciMg": 18.67,
  "deltaMg": -36.35,
  "deltaPercent": -66.07,
  "improved": true,
  "summary": "SCI improved by 66.07% (from 55.02 to 18.67 mgCO2eq)"
}
```
