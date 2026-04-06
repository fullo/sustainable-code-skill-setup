---
name: gc-verify
description: >-
  Adversarial verification of sustainability reports produced by gc-* skills.
  Challenges assumptions, checks for greenwashing, validates data sources, identifies
  blind spots, and stress-tests recommendations. Use after any gc-* skill report,
  or it runs automatically when triggered by other skills.
license: MIT
metadata:
  author: fullo
  version: "1.0"
---

# Green Coding — Verify

Adversarial review of a sustainability report. Acts as an independent critical reviewer to ensure accuracy, completeness, and intellectual honesty.

## When to use

- **Automatic**: triggered by other gc-* skills at the end of their report
- **Post-audit**: user runs `/gc-verify` after reviewing a report
- **Standalone**: user provides a sustainability report or claim to verify

## Mode: automatic

When triggered automatically by another skill, run only the **quick verification** (checks 1-4 below). Present findings inline, immediately after the original report, under a `## Verification` heading.

## Mode: post-audit

When invoked manually with `/gc-verify`, run the **full verification** (all 8 checks). Review the most recent gc-* report in the conversation.

## Mode: standalone

When invoked with `/gc-verify [claim or report]`, verify the specific claim or report provided.

## Verification checks

### 1. Source verification

For every data point cited in the report:

- Does it cite a source? Flag any unsourced numbers
- Is the source authoritative? (peer-reviewed, official standard, government data > blog post > opinion)
- Is the source current? Flag data older than 2 years without justification
- Is the source used correctly? (e.g., global average carbon intensity applied to a single-region deployment)

**Red flags**:
- Numbers without sources
- "Estimated" without explaining the estimation method
- Using global averages when regional data is available
- Citing a source but using a different number than what the source states

### 2. Assumption challenge

For every default value or assumption used:

| Common assumption | Challenge question |
|-------------------|-------------------|
| Device power (18W) | Is this appropriate for the target device? (3W phone vs 18W laptop vs 200W desktop) |
| Carbon intensity (494 gCO2eq/kWh) | Is the deployment region known? Use regional data instead of global average |
| Embodied carbon defaults | Does the project use dedicated or shared infrastructure? |
| Lifetime hours | Is the assumed device/server lifetime realistic for this use case? |
| New visitor ratio (0.75) | Does the project have analytics data? Use real data over defaults |
| SWD model accuracy (±50%) | Are results presented with appropriate uncertainty? |

**Red flags**:
- Using defaults without acknowledging them as assumptions
- Using laptop defaults for a mobile app (or vice versa)
- Using global carbon intensity for a project deployed in a specific region
- Assuming green hosting without verification

### 3. Precision audit

Check that results are reported with appropriate precision for the methodology:

| Model | Appropriate precision | Inappropriate |
|-------|----------------------|---------------|
| SWD v4 | "~1.2g CO2" or "1-2g CO2" | "1.2347g CO2" |
| SCI (estimated) | "~15 mgCO2eq" or "10-20 mgCO2eq" | "15.234 mgCO2eq" |
| SCI (measured with profiler) | "15.2 mgCO2eq" | Still not 6 significant figures |
| WSG compliance | "approximately 45/80" | "56.25% compliant" (implies false precision) |

**Red flags**:
- More than 2 significant figures on estimated values
- Percentage scores on self-assessed compliance
- Comparison of numbers with different uncertainty ranges ("reduced by 12%" when both measurements have ±50% error)

### 4. Coverage gap analysis

Identify what was NOT measured or assessed:

- **Scope gaps**: Was the full system boundary considered? (frontend only? backend only? third-party services? CDN? DNS? CI/CD pipeline?)
- **WSG gaps**: How many of the 80 guidelines were actually checked vs marked "na"?
- **SCI scope**: Was only one operation measured? Are the top energy consumers covered?
- **Mobile**: Were both foreground and background energy measured?
- **Third-party**: Were external scripts, analytics, ads, and CDN emissions counted?
- **Rebound effects**: Could the optimization increase usage enough to offset savings?

**Red flags**:
- Claiming "full sustainability audit" when only frontend was checked
- Marking guidelines as "na" without justification
- Ignoring third-party scripts that may dominate page weight
- Not mentioning what was excluded from scope

### 5. Methodology consistency

Check that the same methodology and parameters are used consistently across the report:

- Same carbon intensity value used across all calculations?
- Same functional unit definition used in all SCI measurements?
- Same device power assumption across comparable operations?
- WSG assessment criteria applied consistently across guidelines?
- Same data vintage (year) for all reference data?

**Red flags**:
- Different carbon intensity values in different sections without explanation
- Mixing SCI per-request and SCI per-session in the same comparison
- Inconsistent severity ratings for similar issues

### 6. Greenwashing detection

Look for claims that overstate environmental benefits:

- **Absolute claims**: "green", "sustainable", "carbon neutral", "eco-friendly" without quantification
- **Relative claims without baseline**: "50% reduction" — from what baseline? Measured how?
- **Selective reporting**: Showing only improving metrics, hiding worsening ones
- **Scope manipulation**: Reducing per-unit emissions while total emissions increase (more users)
- **Offset conflation**: Claiming green hosting offsets application-level emissions
- **Certification inflation**: Implying W3C WSG certification (doesn't exist) from self-assessment

**Red flags**:
- Any unqualified claim of "sustainability" or "green"
- Improvements reported without confidence intervals
- Missing total impact alongside per-unit metrics
- Using "compliant" when the standard has no formal compliance mechanism

### 7. Reproducibility check

Could another agent/team reproduce these results?

- Are all tools, versions, and configurations documented?
- Are measurement conditions specified? (device, network, time of day, load)
- Is the functional unit precisely defined?
- Are data collection methods reproducible?
- Is the WSG assessment criteria clear enough for independent evaluation?

**Red flags**:
- "Measured with Lighthouse" without specifying conditions (throttling, device, network)
- SCI measurements without specifying which operations were timed
- WSG assessments without explaining how each guideline was evaluated

### 8. Recommendation feasibility

For each recommendation in the report:

- Is the expected impact quantified (not just "high/medium/low")?
- Is the effort estimate realistic?
- Are there trade-offs not mentioned? (e.g., lazy loading improves LCP but may hurt interactivity)
- Are dependencies identified? (e.g., "switch to green hosting" requires infrastructure access)
- Is there a way to measure success?

**Red flags**:
- Recommendations without measurable outcomes
- "Quick win" labels on changes that require architectural refactoring
- Missing trade-offs (every optimization has one)
- No mention of how to verify the improvement was achieved

## Report format

### Quick verification (automatic mode)

```
## Verification

| Check | Status | Finding |
|-------|--------|---------|
| Sources | pass/warn/fail | [summary] |
| Assumptions | pass/warn/fail | [summary] |
| Precision | pass/warn/fail | [summary] |
| Coverage | pass/warn/fail | [summary] |

**Confidence level**: high / medium / low
[1-2 sentence overall assessment]
```

### Full verification (post-audit mode)

```
## Adversarial Verification

### Summary
- **Confidence level**: high / medium / low
- **Issues found**: ? critical, ? warnings, ? notes
- [1-2 sentence overall assessment]

### Findings

#### 1. Source verification
| Data point | Source cited | Status | Issue |
|------------|-------------|--------|-------|
| ... | ... | ok/warn/fail | ... |

#### 2. Assumption challenge
| Assumption | Value used | Appropriate? | Recommendation |
|------------|-----------|--------------|----------------|
| ... | ... | yes/no/maybe | ... |

#### 3. Precision audit
[Findings on false precision]

#### 4. Coverage gaps
- Assessed: [list what was covered]
- Not assessed: [list what was missing]
- Justification for exclusions: [present / absent]

#### 5. Methodology consistency
[Findings on inconsistencies]

#### 6. Greenwashing detection
[Any claims that overstate benefits]

#### 7. Reproducibility
[Can results be independently reproduced?]

#### 8. Recommendation feasibility
| Recommendation | Impact quantified? | Effort realistic? | Trade-offs noted? | Measurable? |
|----------------|-------------------|-------------------|-------------------|-------------|
| ... | yes/no | yes/no | yes/no | yes/no |

### Corrective actions
1. [most critical fix]
2. ...

### Methodology
- Verification framework: adversarial review against 8 quality dimensions
- Standard references: GSF SCI Spec, W3C WSG 1.0, SWD v4
- Verification does not constitute certification or endorsement
```

## Gotchas

- **Verification is not certification**: This skill checks internal consistency and methodology rigor. It does not certify compliance with any standard.
- **False negatives are possible**: The verification cannot catch errors in the underlying data sources themselves (e.g., if Ember's carbon intensity data is wrong).
- **Automatic mode is lightweight by design**: The quick verification (4 checks) catches the most common issues. For important reports (client-facing, published), always run the full verification.
- **Verifier bias**: The verification itself can have blind spots. For high-stakes reports, consider external review in addition to automated verification.

## Related commands

- `/gc-setup` — full 9-phase sustainability audit
- `/gc-dev` — daily development companion
- `/gc-measure-sci` — measure SCI for a specific operation
- `/gc-check-sustainability` — quick sustainability check
- `/gc-estimate-emissions` — estimate page/sitemap emissions
- `/gc-mobile-ios` — iOS energy audit
- `/gc-mobile-android` — Android energy audit
