# SCI Measurement Guide

Reference material for implementing Software Carbon Intensity measurement.

## SCI Formula

```
SCI = ((E x I) + M) / R
```

| Variable | Description | How to compute |
|----------|-------------|---------------|
| **E** | Energy per operation (kWh) | `DEVICE_POWER_W x wall_time_s / 3,600,000` |
| **I** | Carbon intensity (gCO2eq/kWh) | Grid carbon intensity for deployment region |
| **M** | Embodied emissions per operation (gCO2eq) | `(EMBODIED_G / LIFETIME_H) x (wall_time_s / 3600)` |
| **R** | Functional unit | 1 operation (define per project) |

## Default Constants

Use these defaults when project-specific data is unavailable. Replace with actual device/region data when possible.

| Constant | Default | Source | How to customize |
|----------|---------|--------|-----------------|
| `DEVICE_POWER_W` | 18 W | M1 Pro software-attributable power | Use manufacturer TDP or power profiling |
| `CARBON_INTENSITY` | 332 gCO2eq/kWh | GitHub Actions median | Use [Electricity Maps](https://app.electricitymaps.com/) for deployment region |
| `EMBODIED_TOTAL_G` | 211,000 g | Apple LCA (total - use phase) | Use manufacturer Product Environmental Report |
| `LIFETIME_HOURS` | 11,680 h | 4 years x 365 days x 8 h/day | Adjust for actual device lifecycle |

## Why Exclude Use-Phase from Embodied (M)

The SCI formula's `E x I` already captures operational energy carbon. Including the use-phase portion of an LCA in M would double-count. Therefore:

```
M_embodied = LCA_total - LCA_use_phase
```

Example: Apple MacBook Pro LCA = 271 kg total, 59.6 kg use-phase:
```
M_embodied = 271 - 59.6 = 211.4 kg = 211,000 g
```

## Implementation by Architecture

### Any JS/TS Environment (Browser, Node.js, Deno, Bun)

**Recommended**: use the [SCI Profiler](https://github.com/fullo/sci-profiler) — a zero-dependency, framework-agnostic TypeScript library that computes SCI per operation using `performance.now()`.

Features:
- `profileTool(name, operation, inputBytes?)` returning a full `ProfileResult`
- Configurable device parameters (power, carbon intensity, embodied carbon, lifetime)
- JSON and Markdown report export
- Dev-only integration (tree-shaken from production builds)

Integration:

```typescript
// 1. Add as git submodule or npm dependency
import { profileTool, configureSci } from 'sci-profiler';

// 2. (Optional) Configure for your device
configureSci({
    devicePowerW: 18,
    carbonIntensity: 332,
    embodiedTotalG: 211_000,
    lifetimeHours: 11_680,
});

// 3. Profile an operation
const result = await profileTool('process-file', async () => {
    return await processFile(input);
}, inputFile.size);

console.log(`SCI: ${result.sciMgCO2eq.toFixed(1)} mgCO2eq`);
```

If the SCI Profiler is not suitable, use raw `performance.now()`:

```typescript
const start = performance.now();
const result = await processFile(input);
const wallTimeMs = performance.now() - start;

const wallTimeS = wallTimeMs / 1000;
const energyKwh = DEVICE_POWER_W * wallTimeS / 3_600_000;
const carbonOp = energyKwh * CARBON_INTENSITY * 1000;  // mg
const carbonEmbodied = (EMBODIED_TOTAL_G / LIFETIME_HOURS) * (wallTimeS / 3600) * 1000;  // mg
const sci = carbonOp + carbonEmbodied;  // mgCO2eq per operation
```

### Server-Side

Track per-request CPU time:

```python
import time
import os

start_cpu = time.process_time()
start_wall = time.perf_counter()
result = process_request(data)
cpu_time = time.process_time() - start_cpu
wall_time = time.perf_counter() - start_wall
```

For cloud deployments, consider:
- [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/) for cloud provider integration
- [Carbon Aware SDK](https://github.com/Green-Software-Foundation/carbon-aware-sdk) for region-aware scheduling
- Cloud provider carbon APIs (AWS Customer Carbon Footprint Tool, Google Carbon Footprint, Azure Emissions Impact Dashboard)

### CLI Tools

Use `hyperfine` for reliable wall-clock benchmarks:

```bash
hyperfine --warmup 3 --runs 10 'my-tool process input.dat'
```

## Benchmark Design

Create a deterministic, representative benchmark input:

1. **Programmatic generation** — no static fixture files, generate in-memory
2. **Representative complexity** — exercise all major code paths
3. **Deterministic** — same input every run for comparable results
4. **Cached** — generate once, reuse across all benchmarks

## Tracking Over Time

Store SCI results per commit to detect regressions:

```json
{
  "commit": "abc1234",
  "date": "2026-03-10",
  "machine": "MacBook Pro M1 Pro, 16GB",
  "results": [
    { "tool": "process-file", "sciMgCO2eq": 45.2, "wallTimeMs": 120 },
    { "tool": "convert-format", "sciMgCO2eq": 12.8, "wallTimeMs": 34 }
  ]
}
```

## PHP Projects

**Recommended**: use [sci-profiler-php](https://github.com/fullo/sci-profiler-php) — a
zero-code-changes profiler that hooks into PHP via `auto_prepend_file`. Works
with Laravel, Symfony, WordPress, Drupal, and vanilla PHP.

Quick install:

```bash
git clone https://github.com/fullo/sci-profiler-php.git /opt/sci-profiler-php
```

Add to `php.ini`:

```ini
auto_prepend_file = /opt/sci-profiler-php/src/bootstrap.php
```

No application code changes needed. The profiler intercepts requests
automatically and measures SCI per request.

Reporters:
- **JSON Lines** — machine-readable, one JSON object per request
- **Log** — append to a log file for later analysis
- **HTML Dashboard** — visual summary of SCI per endpoint

## Advanced: GSF Impact Framework

For complex multi-component systems requiring standardized measurement across
heterogeneous stacks, use the [GSF Impact Framework (IF)](https://github.com/Green-Software-Foundation/if).

- Plugin-based pipeline configured via YAML manifests
- Supports custom plugins for any measurement source
- API server + Helm chart available for Kubernetes deployments
- Best suited for large organizations needing consistent SCI measurement
  across diverse services (different languages, runtimes, cloud providers)

Use IF when: the project spans multiple teams, languages, or infrastructure
providers and needs a unified measurement layer.

## Carbon-Aware Scheduling

The [Carbon Aware SDK](https://github.com/Green-Software-Foundation/carbon-aware-sdk)
enables running workloads when and where grid energy is greener.

- WebApi + CLI for querying carbon emissions data by region and time
- Supports WattTime and Electricity Maps as data sources
- Use cases: schedule batch jobs during low-carbon periods, route traffic
  to greener regions, defer non-urgent computation

Integration: call the SDK API before scheduling batch work or cron jobs to
pick the lowest-carbon time window within your SLO.

## Limitations

1. Wall time includes message passing and scheduling overhead
2. Device power is an average estimate (actual varies with workload)
3. Browser variability across engines
4. Single-run variance (average multiple runs for reliability)
5. `performance.memory` is Chrome-only

## References

- [Green Software Foundation SCI Specification](https://sci-guide.greensoftware.foundation/)
- [Green Software Patterns](https://patterns.greensoftware.foundation/)
- [SCI Profiler (TypeScript)](https://github.com/fullo/sci-profiler)
- [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/)
- [Electricity Maps](https://app.electricitymaps.com/)
- [SCI Profiler PHP](https://github.com/fullo/sci-profiler-php)
- [GSF Impact Framework](https://github.com/Green-Software-Foundation/if)
- [Carbon Aware SDK](https://github.com/Green-Software-Foundation/carbon-aware-sdk)
