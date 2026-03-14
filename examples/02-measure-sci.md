# Example: Measure SCI for a Node.js API

Measure the Software Carbon Intensity for a specific API endpoint.

## Scenario

You have a REST API endpoint `POST /api/orders` that processes e-commerce orders. You want to measure its carbon intensity per request.

## Step 1 — Invoke the skill

```
/gc-measure-sci POST /api/orders endpoint
```

## Step 2 — The agent measures wall-clock time

The agent benchmarks the endpoint:

```bash
# The agent runs something like:
hyperfine --warmup 3 'curl -s -X POST http://localhost:3000/api/orders -d @test-order.json'
```

Result: **average 280ms per request**

## Step 3 — The agent uses MCP tools

If MCP tools are configured, the agent calls them automatically:

**Tool call 1: `grid_carbon_intensity`**
```json
{ "countryCode": "US" }
```
Response: `{ "intensity": 436, "source": "Ember Global Electricity Review", "year": 2022 }`

**Tool call 2: `sci_calculate`**
```json
{
  "wallTimeMs": 280,
  "carbonIntensity": 436,
  "devicePowerW": 65,
  "embodiedTotalG": 1200000,
  "lifetimeHours": 26280
}
```
Response:
```json
{
  "sciMgCO2eq": 55.02,
  "energyKwh": 0.00000506,
  "carbonOperationalMg": 2.21,
  "carbonEmbodiedMg": 52.81
}
```

## Step 4 — The agent produces the report

```
## SCI Measurement: POST /api/orders

| Variable | Value | Source |
|----------|-------|--------|
| E (energy) | 0.00000506 kWh | wall-clock 280ms, server 65W TDP |
| I (carbon intensity) | 436 gCO2eq/kWh | US grid, Ember 2022 |
| M (embodied) | 52.81 mgCO2eq/req | 1.2 tCO2eq server / 26280h lifetime |
| R (functional unit) | 1 API request | POST /api/orders |
| **SCI** | **55.02 mgCO2eq/request** | |

### Recommendations
- 96% of SCI is embodied carbon — consider serverless to amortize across more users
- DB query takes 180ms of the 280ms — add query caching for repeat orders
- Response payload is 12KB — compress with gzip (est. 3KB)

### Methodology and sources
- Formula: SCI = ((E x I) + M) / R — Green Software Foundation SCI Specification v1.0
- Grid carbon intensity: 436 gCO2eq/kWh — Ember Global Electricity Review 2022 (US)
- Device power: 65W — server TDP estimate
- Embodied carbon: 1,200,000 gCO2eq — estimated for dedicated cloud instance (3-year amortization)
- Measurement tool: hyperfine wall-clock benchmarks
```

## Step 5 — Compare after optimization

After adding query caching (280ms -> 95ms):

```
/gc-measure-sci POST /api/orders after caching optimization
```

The agent calls `sci_compare`:
```json
{
  "baselineSciMg": 55.02,
  "currentSciMg": 18.67,
  "baselineLabel": "before query caching",
  "currentLabel": "after query caching"
}
```

Result:
```
SCI improved by 66.07% (from 55.02 to 18.67 mgCO2eq)
```

## Without MCP tools

If MCP tools are not installed, the agent computes manually:

```
E = 280ms / 1000 / 3600 * 65W = 0.00000506 kWh
Operational = 0.00000506 * 436 * 1000 = 2.21 mg
Embodied = (1200000 / 26280) * (280/3600000) = 3.55 mg (simplified)
SCI = 2.21 + 3.55 = 5.76 mgCO2eq/request
```

Note: manual calculation may differ slightly from the MCP tool due to different embodied carbon amortization approaches. The MCP tool uses per-millisecond amortization for precision.
