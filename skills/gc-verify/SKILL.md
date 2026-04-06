---
name: gc-verify
description: >-
  Adversarial verification of sustainability reports using Chain-of-Verification
  (CoVe) methodology. Assumes errors exist, decomposes claims, generates adversarial
  questions, and performs independent investigations to find logic flaws, silent data
  corruption, and methodology weaknesses. Runs automatically after gc-* skills or
  manually for deep verification.
license: MIT
metadata:
  author: fullo
  version: "2.0"
---

# Green Coding — Adversarial Verification

Operates on a philosophy of **total skepticism**: assume errors exist and drill
down until you hit ground truth. Uses the Chain-of-Verification (CoVe)
methodology (Dhuliawala et al., 2023) to decompose claims, generate adversarial
questions, and perform independent investigation.

> **Reference**: "Chain-of-Verification Reduces Hallucination in Large Language
> Models" — Dhuliawala et al., 2023 (arXiv:2309.11495). The Factored + Revise
> variant is used: each verification question is answered independently to
> prevent bias propagation from the original report.

## When to use

- **Automatic**: triggered by other gc-* skills at the end of their report (quick mode)
- **Post-audit**: user runs `/gc-verify` for deep adversarial review (full mode)
- **Standalone**: user provides a claim, report, or assumption to verify

## Core principle: total skepticism

Do NOT assume the report is correct. Do NOT trust numbers because they look
precise. Do NOT accept methodology claims at face value. Every data point is
guilty until proven innocent.

The most dangerous errors are not obvious mistakes — they are plausible-looking
numbers with hidden flaws: wrong defaults applied silently, precision that
exceeds the model's capability, scope boundaries drawn to exclude inconvenient
truths, and recommendations that sound actionable but lack measurable outcomes.

## CoVe process — Factored + Revise

The verification follows 4 steps derived from the Chain-of-Verification
framework. The critical principle is **independent execution**: each
verification question must be answered in isolation, without access to the
original report's conclusions, to prevent reinforcing the original errors.

### Step 1 — Baseline claim extraction

Read the report under review and extract every verifiable claim as an
atomic assertion. A claim is any statement that can be independently
checked: a number, a source attribution, a comparison, a recommendation,
a scope statement, or an assumption.

For each claim, record:

```
| # | Claim | Type | Section |
|---|-------|------|---------|
| 1 | "SCI = 15.2 mgCO2eq per API call" | measurement | Phase 2 |
| 2 | "Carbon intensity: 330 gCO2eq/kWh (Italy, Ember 2023)" | data source | Phase 2 |
| 3 | "Device power: 18W (M1 Pro)" | assumption | Phase 2 |
| 4 | "WSG compliance: 52/80 guidelines met" | assessment | Phase 3 |
| 5 | "Switching to system fonts saves ~200KB" | recommendation | Phase 5 |
| ... | ... | ... | ... |
```

Claim types: `measurement`, `data source`, `assumption`, `assessment`,
`comparison`, `recommendation`, `scope`, `methodology`.

### Step 2 — Adversarial question generation

For each extracted claim, generate one or more adversarial verification
questions. These are NOT friendly confirmations — they are designed to
**find the failure mode** of each claim.

Question categories:

| Category | Purpose | Example questions |
|----------|---------|-------------------|
| **Source validity** | Is the cited source real, current, and used correctly? | "What does Ember 2023 actually report for Italy? Is it 330 or a different value?" |
| **Assumption appropriateness** | Is this default valid for this specific context? | "Is 18W appropriate here? What device actually runs this code?" |
| **Precision legitimacy** | Does the methodology support this level of precision? | "SWD v4 has ±50% error — why is this reported to 4 significant figures?" |
| **Scope completeness** | What was excluded and does that exclusion change the conclusion? | "Were third-party scripts included in page weight? They often dominate." |
| **Consistency** | Are the same parameters used throughout? | "Phase 2 uses 330 gCO2eq/kWh but Phase 8 baseline uses 494 — why?" |
| **Greenwashing** | Does the claim overstate the benefit? | "50% SCI reduction — but both measurements have ±50% error. Is this real?" |
| **Reproducibility** | Could someone else get the same result? | "What Lighthouse settings were used? Throttling? Device emulation?" |
| **Feasibility** | Is this recommendation actually achievable? | "'Quick win' to switch to system fonts — does the design system allow this?" |
| **Counterfactual** | What if the opposite were true? | "If the actual carbon intensity is 2x higher, does the conclusion change?" |
| **Silent corruption** | Is there a hidden error in the data pipeline? | "The SCI formula uses kWh but the input was in Wh — was the unit conversion done?" |

Generate at least one question per claim. For high-impact claims (SCI results,
WSG scores, key recommendations), generate 2-3 questions from different
categories.

### Step 3 — Independent execution (Factored)

**CRITICAL**: Answer each verification question independently. Do NOT look at
the original report's conclusions while answering. Do NOT let the answer to
one question influence another. Each question gets its own isolated
investigation.

For each question:

1. **Investigate independently**: look up the actual source data, re-derive
   the calculation, check the actual file/code, or verify the real-world
   constraint
2. **Reach a verdict**: `confirmed` (claim is correct), `refuted` (claim is
   wrong), `unverifiable` (cannot be independently checked), `imprecise`
   (directionally correct but precision overstated), `incomplete` (partially
   true but missing critical context)
3. **Document evidence**: what did you find that supports your verdict?

```
| # | Question | Verdict | Evidence |
|---|----------|---------|----------|
| 1a | What does Ember 2023 report for Italy? | confirmed | Ember 2023: Italy = 327 gCO2eq/kWh, report says 330 — close enough |
| 1b | Is 15.2 mgCO2eq precision justified? | imprecise | SCI was estimated, not measured with profiler — should be "~15 mgCO2eq" |
| 2a | Is 18W valid for this deployment? | refuted | Code runs on AWS Lambda (shared infra), not a dedicated M1 Pro laptop |
| ... | ... | ... | ... |
```

Verdicts that are NOT `confirmed` become findings in the final report.

### Step 4 — Revise and report (Factor + Revise)

Compare the original report against all verification verdicts. For each
non-confirmed finding:

1. **Classify severity**:
   - `critical` — changes the conclusion or a key number by >2x
   - `warning` — misleading but doesn't invalidate the conclusion
   - `note` — improvement to precision or completeness, minor impact

2. **Propose correction**: what should the report say instead?

3. **Assess overall confidence**: based on the ratio of confirmed vs
   non-confirmed claims and the severity distribution:
   - `high` — >80% confirmed, no critical findings
   - `medium` — >60% confirmed, or critical findings that don't invalidate the whole report
   - `low` — <60% confirmed, or multiple critical findings, or key conclusions rely on refuted claims

## Verification dimensions

The adversarial questions in Step 2 target these 8 dimensions. Use them as a
checklist to ensure full coverage:

### D1. Source verification

- Does every number cite a source?
- Is the source authoritative? (ISO standard > peer-reviewed > government data > blog > opinion)
- Is the source current? Flag data >2 years old without justification
- Is the source used correctly? (global average applied to a single-region deployment?)

### D2. Assumption challenge

| Common assumption | Challenge |
|-------------------|-----------|
| Device power (18W) | 3W phone vs 18W laptop vs 200W desktop — which is this? |
| Carbon intensity (494 gCO2eq/kWh) | Is deployment region known? Use regional data |
| Embodied carbon defaults | Dedicated or shared infrastructure? |
| Lifetime hours | Realistic for this use case? |
| New visitor ratio (0.75) | Real analytics data available? |
| SWD accuracy (±50%) | Results presented with uncertainty? |

### D3. Precision audit

| Model | Appropriate | Inappropriate |
|-------|------------|---------------|
| SWD v4 | "~1.2g CO2" | "1.2347g CO2" |
| SCI (estimated) | "~15 mgCO2eq" | "15.234 mgCO2eq" |
| SCI (profiler) | "15.2 mgCO2eq" | 6 significant figures |
| WSG compliance | "about 45/80" | "56.25% compliant" |

### D4. Coverage gaps

- Full system boundary? (frontend, backend, third-party, CDN, DNS, CI/CD)
- WSG: how many of 80 guidelines actually checked vs marked "na"?
- SCI: top energy consumers all covered?
- Mobile: foreground AND background?
- Rebound effects considered?

### D5. Methodology consistency

- Same carbon intensity across all calculations?
- Same functional unit in all SCI comparisons?
- Same device power for comparable operations?
- Same data vintage for reference data?
- Consistent severity criteria?

### D6. Greenwashing detection

- Unqualified absolute claims ("green", "sustainable", "carbon neutral")?
- Relative claims without baseline ("50% reduction" — from what?)?
- Selective reporting (only improving metrics)?
- Scope manipulation (lower per-unit but higher total)?
- Certification inflation (implying W3C WSG certification — doesn't exist)?

### D7. Reproducibility

- Tools, versions, configurations documented?
- Measurement conditions specified? (device, network, load, time)
- Functional unit precisely defined?
- WSG assessment criteria clear for independent evaluation?

### D8. Recommendation feasibility

- Impact quantified (not just "high/medium/low")?
- Effort estimate realistic?
- Trade-offs mentioned? (every optimization has one)
- Dependencies identified?
- Success measurable?

## Report format

### Quick verification (automatic mode — Steps 1-4 compressed)

In automatic mode, run the full CoVe process but compress the output. Extract
claims, generate questions, execute independently, then present only the
findings:

```
## Verification (CoVe)

**Process**: [N] claims extracted → [M] adversarial questions → [K] findings

| Dimension | Status | Finding |
|-----------|--------|---------|
| D1. Sources | pass/warn/fail | [summary] |
| D2. Assumptions | pass/warn/fail | [summary] |
| D3. Precision | pass/warn/fail | [summary] |
| D4. Coverage | pass/warn/fail | [summary] |

**Confidence**: high / medium / low — [1-2 sentence assessment]
**Critical issues**: [count] — [list if any]
```

### Full verification (post-audit and standalone mode)

```
## Adversarial Verification (CoVe — Factored + Revise)

### Process summary
- Claims extracted: [N]
- Adversarial questions generated: [M]
- Independently verified: [K]
- Findings: [X] critical, [Y] warnings, [Z] notes

### Confidence: high / medium / low
[1-2 sentence overall assessment]

### Step 1 — Extracted claims
| # | Claim | Type | Section |
|---|-------|------|---------|
| ... | ... | ... | ... |

### Step 2 — Adversarial questions
| # | Claim | Question | Category |
|---|-------|----------|----------|
| ... | ... | ... | ... |

### Step 3 — Independent verdicts
| # | Question | Verdict | Evidence |
|---|----------|---------|----------|
| ... | ... | confirmed/refuted/imprecise/incomplete/unverifiable | ... |

### Step 4 — Findings and corrections

#### Critical
| # | Original claim | Issue | Correction |
|---|----------------|-------|------------|
| ... | ... | ... | ... |

#### Warnings
| # | Original claim | Issue | Correction |
|---|----------------|-------|------------|
| ... | ... | ... | ... |

#### Notes
| # | Original claim | Issue | Correction |
|---|----------------|-------|------------|
| ... | ... | ... | ... |

### Corrective actions (priority order)
1. [most critical fix]
2. ...

### Methodology
- Framework: Chain-of-Verification, Factored + Revise variant
  (Dhuliawala et al., 2023 — arXiv:2309.11495)
- Execution: each verification question answered independently to prevent
  bias propagation from the original report
- Dimensions: 8 adversarial dimensions (sources, assumptions, precision,
  coverage, consistency, greenwashing, reproducibility, feasibility)
- Reference standards: GSF SCI Spec (ISO 21031:2024), W3C WSG 1.0, SWD v4
- This verification does not constitute certification or endorsement
```

## Gotchas

- **CoVe independent execution is the key**: If you find yourself confirming a claim by re-reading the original report, you are doing it wrong. Each verification question must be investigated from scratch, without access to the report's reasoning.
- **Verification is not certification**: This process checks internal consistency and methodology rigor. It does not certify compliance with any standard.
- **False negatives are possible**: CoVe cannot catch errors in the underlying data sources themselves (e.g., if Ember's carbon intensity data is wrong). It catches misuse of sources, not errors within sources.
- **Automatic mode compresses but does not skip steps**: The quick verification still runs all 4 CoVe steps — it just presents compressed output. The thinking process must be thorough even when the output is brief.
- **Verifier bias exists**: The verification itself can have blind spots. For high-stakes reports (client-facing, published, regulatory), complement CoVe with external human review.
- **Counterfactual questions are the most powerful**: "What if the opposite were true?" often reveals hidden dependencies and fragile assumptions that other question types miss.

## Related commands

- `/gc-setup` — full 9-phase sustainability audit
- `/gc-dev` — daily development companion
- `/gc-measure-sci` — measure SCI for a specific operation
- `/gc-check-sustainability` — quick sustainability check
- `/gc-estimate-emissions` — estimate page/sitemap emissions
- `/gc-mobile-ios` — iOS energy audit
- `/gc-mobile-android` — Android energy audit
