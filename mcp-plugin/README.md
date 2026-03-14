# Sustainable Code MCP Server

An MCP (Model Context Protocol) server that provides tools for measuring and estimating the carbon footprint of software. It implements five sustainability-focused tools based on industry-standard methodologies.

## Tools

### sci_calculate

Calculate the Software Carbon Intensity (SCI) score for a unit of work using the Green Software Foundation SCI specification.

**Inputs:**
- `wallTimeMs` (required) -- Wall-clock execution time in milliseconds.
- `devicePowerW` -- Device power in watts. Default: 18 (M1 Pro).
- `carbonIntensity` -- Grid intensity in gCO2eq/kWh. Default: 332.
- `embodiedTotalG` -- Embodied emissions in gCO2eq. Default: 211000.
- `lifetimeHours` -- Device lifetime in hours. Default: 11680.

**Example output:**
```json
{
  "sciMgCO2eq": 1.6607,
  "energyKwh": 0.00000333,
  "carbonOperationalMg": 1.1067,
  "carbonEmbodiedMg": 0.554,
  "wallTimeMs": 667
}
```

### swd_estimate

Estimate per-page carbon emissions using the Sustainable Web Design (SWD) v4 model.

**Inputs:**
- `pageWeightBytes` (required) -- Page transfer size in bytes.
- `monthlyVisitors` -- Monthly unique visitors (enables monthly total).
- `newVisitorRatio` -- Ratio of new visitors (0-1). Default: 0.75.
- `returnCacheRatio` -- Cache ratio for returning visitors (0-1). Default: 0.02.
- `carbonIntensity` -- Grid intensity in gCO2eq/kWh. Default: 494.

**Example output:**
```json
{
  "emissionsPerVisitG": 0.143256,
  "emissionsPerVisitMg": 143.256,
  "monthlyEmissionsKg": 1.4326,
  "breakdown": {
    "dataCenters": 0.032868,
    "networks": 0.035532,
    "userDevices": 0.079356
  }
}
```

### check_green_hosting

Check whether a domain is hosted on green (renewable energy) infrastructure via The Green Web Foundation API.

**Inputs:**
- `domain` (required) -- Domain name (e.g., "example.com").

**Example output:**
```json
{
  "domain": "www.thegreenwebfoundation.org",
  "green": true,
  "hostedBy": "Google Cloud",
  "hostedByWebsite": "https://cloud.google.com"
}
```

### grid_carbon_intensity

Look up the grid carbon intensity for a country using Ember 2022 data.

**Inputs:**
- `countryCode` (required) -- ISO 3166-1 alpha-2 code (e.g., "US", "DE") or "GLOBAL".

**Example output:**
```json
{
  "country": "France",
  "countryCode": "FR",
  "intensity": 56,
  "source": "Ember Global Electricity Review",
  "year": 2022
}
```

### wsg_compliance_score

Parse a WSG compliance JSON file and calculate a compliance score with gap analysis.

**Inputs:**
- `filePath` (required) -- Absolute path to a JSON file containing an array of guideline objects with `id`, `title`, `status` ("full"|"partial"|"gap"|"na"), and optional `category`.

**Example output:**
```json
{
  "totalGuidelines": 93,
  "full": 42,
  "partial": 28,
  "gap": 18,
  "na": 5,
  "scorePercent": 63.64,
  "gapsByCategory": {
    "UX Design": [
      { "id": "3.1", "title": "Use system fonts where possible", "status": "gap" }
    ]
  }
}
```

## Installation

### From npm

```bash
npm install -g sustainable-code-mcp
```

### From source

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git
cd sustainable-code-skill-setup/mcp-plugin
npm install
npm run build
```

## Configuration

Add the server to your Claude Code MCP settings. In `.claude/settings.json` or `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sustainable-code": {
      "command": "npx",
      "args": ["-y", "sustainable-code-mcp"]
    }
  }
}
```

For development, you can use tsx instead:

```json
{
  "mcpServers": {
    "sustainable-code": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/mcp-plugin/src/index.ts"]
    }
  }
}
```

## Development

```bash
# Run in development mode (with tsx)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test
```

## Related

This MCP server is part of the [sustainable-code-skill-setup](../) project, which provides a Claude Code skill for sustainable software development practices.

## License

MIT
