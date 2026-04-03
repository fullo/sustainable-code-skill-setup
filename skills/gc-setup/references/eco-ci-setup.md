# Eco-CI Energy Estimation Setup

Measure the energy consumption of your CI pipelines using
[eco-ci-energy-estimation](https://github.com/green-coding-solutions/eco-ci-energy-estimation).

## What It Does

Estimates energy consumption (Wh) and carbon emissions (gCO2eq) of CI jobs by
combining CPU utilization data with cloud energy models. Supports GitHub Actions,
GitLab CI, and Jenkins.

## GitHub Actions Setup

Add to your workflow YAML:

```yaml
name: CI with Energy Tracking

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start Eco CI Energy Estimation
        uses: green-coding-solutions/eco-ci-energy-estimation@v4
        with:
          task: start-measurement
          branch: ${{ github.ref_name }}

      # ... your build and test steps ...

      - name: Stop Eco CI Measurement
        uses: green-coding-solutions/eco-ci-energy-estimation@v4
        with:
          task: get-measurement

      - name: Show Results
        uses: green-coding-solutions/eco-ci-energy-estimation@v4
        with:
          task: display-results
```

## GitLab CI Setup

Use the shell script integration:

```yaml
build:
  script:
    - curl -sL https://raw.githubusercontent.com/green-coding-solutions/eco-ci-energy-estimation/main/scripts/start.sh | bash
    - # ... your build and test steps ...
    - curl -sL https://raw.githubusercontent.com/green-coding-solutions/eco-ci-energy-estimation/main/scripts/stop.sh | bash
```

## Metrics Produced

| Metric | Unit | Description |
|--------|------|-------------|
| Energy | Wh | Total energy consumed during CI run |
| Carbon | gCO2eq | Estimated carbon emissions (energy x grid intensity) |
| CPU Utilization | % | Average CPU utilization during the job |
| Duration | s | Wall-clock time of the measured segment |

## Integration with the Sustainability Skill

Add to Phase 6 (Testing & Quality):

1. Add eco-ci to your CI workflow to measure pipeline energy per run
2. Add an `audit:ci-energy` script that reports the last CI run's energy data
3. Track energy per CI run over time to detect workflow efficiency regressions
4. Set a carbon budget for CI (e.g., < 5 gCO2eq per pipeline run)

## Related Tools

- **[Green Metrics Tool](https://github.com/green-coding-solutions/green-metrics-tool)** —
  full application energy measurement for development and staging environments
- **[Kepler](https://github.com/sustainable-computing-io/kepler)** —
  Kubernetes-based Efficient Power Level Exporter. Monitors energy at
  container, pod, and node level using eBPF and hardware counters.
  Useful for cloud/K8s deployments needing continuous energy observability.

## References

- [eco-ci-energy-estimation](https://github.com/green-coding-solutions/eco-ci-energy-estimation)
- [Green Metrics Tool](https://github.com/green-coding-solutions/green-metrics-tool)
- [Kepler](https://github.com/sustainable-computing-io/kepler)
- [Green Coding Solutions](https://www.green-coding.io/)
