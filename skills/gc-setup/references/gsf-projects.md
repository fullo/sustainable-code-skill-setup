# GSF Ecosystem & Standards (2026)

Reference map of the Green Software Foundation (GSF) standards and measurement
projects relevant to these skills, updated for the 2025–2026 releases. Use this
to pick the right standard and tool for a given workload.

## SCI is now an ISO standard

The core **Software Carbon Intensity (SCI)** specification was published as
**ISO/IEC 21031:2024**. The formula is unchanged:

```
SCI = ((E x I) + M) / R
```

Everything in [sci-guide.md](sci-guide.md) still applies. SCI for AI and SCI for
Web (below) are **domain-specific profiles** built on top of this parent standard.

## Standard / profile selector

| Workload | Use | Status (2026) |
|----------|-----|--------------|
| Generic software operation | **SCI** (ISO/IEC 21031:2024) | Ratified / ISO |
| AI training or inference | **SCI for AI** | Ratified (Dec 2025) |
| Web applications (browser-delivered) | **SCI for Web** | In development (Q1 2026) |

---

## SCI for AI

The [SCI for AI](https://greensoftware.foundation/standards/sci-ai/) specification
(ratified December 2025) extends SCI across the **entire AI lifecycle**, from data
preparation and training to deployment and inference. It is the first
consensus-based standard for making AI carbon footprint transparent and comparable.

### Core formula

```
SCI = C / R
```

- **C** — total operational + embodied carbon within the defined boundary (gCO2eq)
- **R** — functional unit (tokens, FLOPs, parameters, inferences, images, workflows…)

### Two scores

Report the boundary explicitly — the specification defines two personas:

| Score | Lifecycle stages | Covers |
|-------|-----------------|--------|
| **Provider SCI** | Inception, Design & Development, Deployment, Retirement | Data preprocessing, model training, evaluation, deployment infra |
| **Consumer SCI** | Operation & Monitoring | Inference servers, APIs, orchestration, scaling, observability, storage |

Most application developers report a **Consumer SCI** — they consume a hosted
model and optimize inference. Model builders report a **Provider SCI**.

### Functional units (pick by optimization focus)

- **Provider**: per FLOP (algorithmic efficiency), per training token (data
  quality), or per parameter (architecture).
- **Consumer**: per token (LLMs), per image (image generation), per inference
  (computer vision), per workflow execution (agentic AI), per second of audio
  (speech recognition).

### How to apply in an audit

When a project calls an LLM/AI API or self-hosts a model, add a **Consumer SCI**
line: estimate energy per inference (tokens x per-token energy, or measured
wall-time x device/GPU power), apply grid carbon intensity for the inference
region, divide by the functional unit. Report boundary + functional unit + data
sources alongside the number.

---

## SCI for Web

[SCI for Web](https://greensoftware.foundation/standards/sci-web/) is being
developed in **Q1 2026** in formal collaboration between GSF and the **W3C**
(brokered by the Green Web Foundation, which sits in both communities). It uses
the same core SCI formula but defines **web-appropriate boundaries**.

### Boundaries

Emissions are attributed across the full delivery chain:

- **Servers** — origin and application compute
- **Networks** — data transfer
- **Third parties** — analytics, advertising, CDNs, authentication (in scope,
  using supplier data or industry defaults)
- **End-user devices** — browser rendering and execution

### Key principles

- **Functional units** reflect *delivered web functionality* (not just total
  emissions) — this rewards efficiency.
- **Mandatory disclosure**: boundaries, assumptions, data sources and methods
  must be stated, preventing gaming through selective boundary choices.

### Relationship to existing tools

SCI for Web **complements** the [Sustainable Web Design (SWD) model](swd-model.md)
and [CO2.js](https://developers.thegreenwebfoundation.org/co2js/) rather than
replacing them, and shares foundational methodology with the
[W3C Web Sustainability Guidelines](wsg-checklist.md). Until it ratifies, keep
estimating page emissions with SWD v4, but structure results with explicit
boundaries and disclosure so they map cleanly onto SCI for Web later.

---

## Measurement engines for cloud & Kubernetes

For infrastructure-level and per-workload carbon measurement, two GSF/CNCF
projects matured significantly in 2026.

### Carmen — Carbon Measurement Engine

[Carmen](https://github.com/Green-Software-Foundation/if-carmen) (developed by
Amadeus, transferred to GSF on **31 January 2026**) measures carbon for cloud
infrastructure and Kubernetes workloads.

- Built on the **GSF Impact Framework**; integrates with **Kubernetes**,
  **Prometheus**, and **Kube State Metrics** — no new monitoring stack required.
- Two levels: **infrastructure** (VMs, storage, cloud services) and
  **application** (individual workloads / pods).
- Computes **operational + embodied** carbon out of the box, with transparent,
  auditable manifest files ("data consistency over absolute accuracy").
- Best for: team-level carbon visibility across many services at scale.

### Kepler — Kubernetes Efficient Power Level Exporter

[Kepler](https://sustainable-computing.io/) (CNCF **Sandbox**) exports per
container/pod/node **energy** metrics to Prometheus.

- **v0.10 (2026) was re-architected**: it **moved away from eBPF** and now reads
  from standard **`/proc` and `/sys`** for easier adoption and improved accuracy.
- Reads hardware power meters, attributes power to processes → pods.
- Measures **energy**; pair with grid **carbon intensity** (Electricity Maps /
  Carbon Aware SDK) to get emissions. Carmen, by contrast, produces carbon
  directly.

### Which to use

- Need **energy** telemetry inside a K8s cluster → **Kepler**.
- Need **carbon** (operational + embodied) at team/app granularity, with an
  auditable manifest → **Carmen**.
- Need a **unified measurement layer** across heterogeneous stacks → **Impact
  Framework** (both projects build on or alongside it).

---

## References

- [SCI — ISO/IEC 21031:2024](https://sci.greensoftware.foundation/)
- [SCI for AI](https://greensoftware.foundation/standards/sci-ai/) · [spec repo](https://github.com/Green-Software-Foundation/sci-ai)
- [SCI for Web](https://greensoftware.foundation/standards/sci-web/) · [design article](https://greensoftware.foundation/articles/designing-sci-web-what-we-agreed-and-what-comes-next/)
- [Carmen (GSF)](https://github.com/Green-Software-Foundation/if-carmen) · [announcement](https://greensoftware.foundation/articles/welcoming-carmen-carbon-measurement-engine-as-a-gsf-project/)
- [Kepler (CNCF)](https://sustainable-computing.io/) · [v0.10 re-architecture](https://www.cncf.io/blog/2026/06/30/kepler-re-architected-improved-power-accuracy-and-a-community-call-to-action/)
- [GSF Impact Framework](https://github.com/Green-Software-Foundation/if)
- [W3C Web Sustainability Guidelines](https://www.w3.org/TR/web-sustainability-guidelines/)
