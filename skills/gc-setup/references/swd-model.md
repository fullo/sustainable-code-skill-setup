# Sustainable Web Design Model v4

The SWD model provides a top-down method for estimating the carbon emissions of
a web page view based on data transfer. It complements the bottom-up SCI
approach by offering quick estimation without per-operation profiling.

## Core Formula

```
emissions = (segment_emissions x new_visitor_ratio)
          + (segment_emissions x return_visitor_ratio x (1 - cache_ratio))
```

Where `segment_emissions` is the sum of operational and embodied emissions across
three infrastructure segments.

## Three Segments and Energy Distribution

| Segment | Energy Share | Operational % | Embodied % |
|---------|-------------|---------------|------------|
| Data Centers | 22% | 82% | 18% |
| Networks | 24% | 82% | 18% |
| User Devices | 54% | 49% | 51% |

## Energy Intensity

### Operational (kWh per GB transferred)

| Segment | Intensity |
|---------|-----------|
| Data Centers | 0.055 kWh/GB |
| Networks | 0.059 kWh/GB |
| User Devices | 0.080 kWh/GB |

### Embodied (kWh per GB transferred)

| Segment | Intensity |
|---------|-----------|
| Data Centers | 0.012 kWh/GB |
| Networks | 0.013 kWh/GB |
| User Devices | 0.081 kWh/GB |

## Default Carbon Intensity

**494 gCO2e/kWh** — global average grid carbon intensity (Ember 2022 data).

Override with region-specific data from [Electricity Maps](https://app.electricitymaps.com/)
when deployment location is known.

## Calculation Example

For a 2 MB page, 75% new visitors, 2% cache ratio:

```
data_gb = 2 / 1024 = 0.00195 GB

Operational energy:
  DC:  0.00195 x 0.055 = 0.000107 kWh
  Net: 0.00195 x 0.059 = 0.000115 kWh
  Dev: 0.00195 x 0.080 = 0.000156 kWh

Embodied energy:
  DC:  0.00195 x 0.012 = 0.0000234 kWh
  Net: 0.00195 x 0.013 = 0.0000254 kWh
  Dev: 0.00195 x 0.081 = 0.000158 kWh

Total energy = 0.000585 kWh
Emissions = 0.000585 x 494 = 0.289 gCO2e per new visit
Return visit = 0.289 x (1 - 0.02) = 0.283 gCO2e
Blended = (0.289 x 0.75) + (0.283 x 0.25) = 0.288 gCO2e per page view
```

## SCI vs SWD: When to Use Which

| Aspect | SCI | SWD |
|--------|-----|-----|
| Approach | Bottom-up (per operation) | Top-down (per page view) |
| Input needed | CPU time, device power | Page weight in bytes |
| Best for | Any software, precise measurement | Web projects, quick estimation |
| Requires profiling | Yes | No |
| Granularity | Per-function/operation | Per-page/session |

**They complement each other.** Use SWD for a quick project-level estimate
early in the audit, then SCI for granular per-operation measurement of hot paths.

## When to Use SWD

- Quick estimation without profiling setup
- Web projects where page weight is the primary lever
- Content sites, marketing pages, documentation
- Comparing versions or competitors by page weight
- Setting carbon budgets per page

## When to Use SCI

- Precise per-operation measurement
- Any software type (CLI, API, desktop, mobile)
- Identifying specific energy-intensive code paths
- Tracking regressions per commit

## References

- [Sustainable Web Design Model v4](https://sustainablewebdesign.org/estimating-digital-emissions/)
- [SWD Methodology (detailed)](https://sustainablewebdesign.org/calculating-digital-emissions/)
- [Ember Global Electricity Review](https://ember-climate.org/data/)
- [Green Software Foundation SCI Specification](https://sci-guide.greensoftware.foundation/)
