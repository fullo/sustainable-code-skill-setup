---
name: gc-measure-sci
description: >-
  Measure the SCI (Software Carbon Intensity) for a specific operation, endpoint,
  or feature. Use when the user asks to measure carbon, energy consumption, or SCI
  for their code. Requires the sustainable-code MCP server for calculations, or
  falls back to manual estimation.
license: MIT
metadata:
  author: fullo
  version: "1.0"
---

# Measure SCI

Compute the [Software Carbon Intensity](https://sci-guide.greensoftware.foundation/) for $ARGUMENTS.

## Steps

1. **Identify the functional unit R** — what counts as "one operation"? (API request, page load, file processed, user session, CI run, etc.)

2. **Measure energy E** (kWh per operation):
   - **JS/TS projects**: integrate [SCI Profiler](https://github.com/fullo/sci-profiler) — uses `performance.now()` to estimate energy per operation
   - **PHP projects**: integrate [sci-profiler-php](https://github.com/fullo/sci-profiler-php) — zero-code-changes via `auto_prepend_file`
   - **Other languages**: use wall-clock CPU time benchmarks (`hyperfine`, profiler output) and convert to energy using TDP-based estimation
   - **Cloud workloads**: use [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/) or provider billing data

3. **Determine carbon intensity I** (gCO2eq/kWh):
   - Use the `grid_carbon_intensity` MCP tool with the deployment region's country code
   - If MCP is not available: use 436 gCO2eq/kWh (2022 global average, Ember data)

4. **Estimate embodied carbon M** (gCO2eq per operation):
   - Shared infrastructure (serverless, CDN): M is near zero per operation
   - Dedicated server: amortize total embodied carbon over expected lifespan and operations
   - Default: use 0 if unknown, note as assumption

5. **Calculate SCI**:
   - Use the `sci_calculate` MCP tool with:
     - `wallTimeMs` (required): wall-clock execution time in milliseconds
     - `carbonIntensity`: grid intensity in gCO2eq/kWh (from step 3)
     - `devicePowerW`: device power in watts (default: 18W for M1 Pro)
     - `embodiedTotalG`: total embodied emissions in gCO2eq (default: 211000)
     - `lifetimeHours`: expected device lifetime in hours (default: 11680)
   - If MCP is not available: compute manually as `SCI = ((E x I) + M) / R`

6. **Report results**:

```
## SCI Measurement: [operation name]

| Variable | Value | Source |
|----------|-------|--------|
| E (energy) | ? kWh | [method used] |
| I (carbon intensity) | ? gCO2eq/kWh | [region/source] |
| M (embodied) | ? gCO2eq | [estimation method] |
| R (functional unit) | 1 [unit] | [definition] |
| **SCI** | **? gCO2eq/[unit]** | |

### Recommendations
- [concrete actions to reduce SCI]

### Methodology and sources
- Formula: SCI = ((E x I) + M) / R — [Green Software Foundation SCI Specification v1.0](https://sci-guide.greensoftware.foundation/)
- Grid carbon intensity: [value] gCO2eq/kWh — [Ember Global Electricity Review](https://ember-energy.org/) [year]
- Device power: [value] W — [source]
- Embodied carbon: [value] gCO2eq — [source]
- Measurement tool: [tool name and version]
```

7. **Compare with baseline** (if a previous measurement exists):
   - Use the `sci_compare` MCP tool with:
     - `baselineSciMg`: previous SCI value in mgCO2eq
     - `currentSciMg`: new SCI value in mgCO2eq
     - `baselineLabel`: description of baseline (e.g., "before optimization")
     - `currentLabel`: description of current (e.g., "after tree-shaking")
   - If no baseline: record this as the initial baseline

## Notes

- SCI is a rate, not a total — lower is better
- Always document assumptions and data sources
- For a full sustainability audit, use `/gc-setup` instead
