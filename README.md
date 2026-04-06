# Green Coding Skills — Agent Skills + MCP Tools

[![Skill Version](https://img.shields.io/badge/skill-v3.0-blue)](skills/gc-setup/SKILL.md)
[![MCP Tools](https://img.shields.io/badge/MCP_tools-8-green)](mcp-plugin/)
[![CI](https://github.com/fullo/sustainable-code-skill-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/fullo/sustainable-code-skill-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/format-agentskills.io-purple)](https://agentskills.io/)

A collection of [Agent Skills](https://agentskills.io/) and MCP tools that audit software projects for environmental sustainability, accessibility, and quality, then implement measurable improvements.

## Commands

| Command | What it does |
|---------|-------------|
| `/gc-setup` | Full 9-phase sustainability audit (SCI, WSG, a11y, performance, testing, baselines) |
| `/gc-dev` | Daily development companion — green check before commit, feature planning, PR review |
| `/gc-measure-sci` | Measure SCI carbon intensity for a specific operation or endpoint |
| `/gc-check-sustainability` | Quick sustainability check (WSG, green hosting, code patterns) |
| `/gc-estimate-emissions` | Estimate CO2 emissions per page view or across a sitemap |
| `/gc-mobile-ios` | iOS green audit — energy profiling, Creedengo iOS rules, SCI measurement |
| `/gc-mobile-android` | Android green audit — battery optimization, Creedengo Android rules, SCI measurement |
| `/gc-verify` | Adversarial verification via [Chain-of-Verification (CoVe)](https://arxiv.org/abs/2309.11495) — runs automatically after each skill |

## What `/gc-setup` covers

When activated, the skill guides your AI agent through a 9-phase workflow:

1. **Explore** — understand the codebase, stack, and architecture
2. **Energy & Carbon (SCI)** — measure carbon intensity per operation using the [Green Software Foundation SCI formula](https://sci-guide.greensoftware.foundation/)
3. **WSG Compliance** — evaluate against all 80 [W3C Web Sustainability Guidelines 1.0](https://www.w3.org/TR/web-sustainability-guidelines/)
4. **Accessibility** — set up Lighthouse CI auditing with WCAG 2.1 AA thresholds
5. **Performance & Resource Efficiency** — bundle size, lazy loading, caching, fonts, images
6. **Testing & Quality** — test infrastructure, coverage, critical path tests
7. **Prioritize** — rank actions by impact x feasibility (P0-P3)
8. **Establish Baselines** — measurable targets for every dimension
9. **Sustainability-Aware CLAUDE.md** — encode sustainability into the development workflow

## Standards and tools

| Area | Standard / Tool |
|------|----------------|
| Carbon measurement | [SCI (Software Carbon Intensity)](https://sci-guide.greensoftware.foundation/) |
| SCI profiling (JS/TS) | [SCI Profiler](https://github.com/fullo/sci-profiler) — zero-dependency TypeScript library |
| SCI profiling (PHP) | [SCI Profiler PHP](https://github.com/fullo/sci-profiler-php) — zero-code-changes, framework-agnostic |
| Page emissions | [Sustainable Web Design (SWD) v4](https://sustainablewebdesign.org/estimating-digital-emissions/) model |
| Web sustainability | [W3C WSG 1.0](https://www.w3.org/TR/web-sustainability-guidelines/) (80 guidelines) |
| Accessibility | [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) via [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) |
| Performance | Lighthouse performance scores, bundle budgets |
| Green patterns | [Green Software Foundation](https://patterns.greensoftware.foundation/) patterns catalog |
| Static analysis | [Creedengo](https://github.com/green-code-initiative/creedengo-rules-specifications) green code rules |
| iOS energy rules | [Creedengo iOS](https://github.com/green-code-initiative/creedengo-ios) Swift energy patterns |
| Android energy | [Android Battery Optimization](https://developer.android.com/develop/background-work/background-tasks/optimize-battery) + [Android Vitals](https://developer.android.com/topic/performance/vitals) |
| iOS energy profiling | [Xcode Instruments Energy Log](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/EnergyGuide-iOS/) + [MetricKit](https://developer.apple.com/documentation/metrickit) |
| CI energy tracking | [eco-ci-energy-estimation](https://github.com/green-coding-solutions/eco-ci-energy-estimation) for pipeline measurement |
| Cloud carbon | [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/) |
| Report verification | [Chain-of-Verification (CoVe)](https://arxiv.org/abs/2309.11495) — Factored + Revise variant (Dhuliawala et al., 2023) |

## Installation

### Step 1 — Install the skills

Clone the repository and copy the skills into your project:

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git ~/.gc-tools
cp -r ~/.gc-tools/skills/* .claude/skills/
```

Or install globally (available across all projects):

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git ~/.gc-tools
cp -r ~/.gc-tools/skills/* ~/.claude/skills/
```

To update later:

```bash
cd ~/.gc-tools && git pull
cp -r skills/* ~/.claude/skills/        # or .claude/skills/ for project-local
```

Your `.claude/skills/` directory will contain:

```
.claude/skills/
  gc-setup/                             # Full 9-phase audit
    SKILL.md
    references/                         # 8 reference files loaded on-demand
  gc-measure-sci/                       # Quick SCI measurement
    SKILL.md
  gc-dev/                               # Daily dev companion
    SKILL.md
  gc-check-sustainability/              # Quick sustainability check
    SKILL.md
  gc-estimate-emissions/                # Page/sitemap emissions
    SKILL.md
  gc-mobile-ios/                        # iOS energy audit
    SKILL.md
  gc-mobile-android/                    # Android energy audit
    SKILL.md
  gc-verify/                            # Adversarial verification
    SKILL.md
```

### Step 2 (optional) — Enable MCP tools

The MCP plugin gives your agent access to 8 sustainability measurement tools. This enhances the skills with real-time calculations but is not required — all skills include manual fallback instructions.

If you already cloned in Step 1, just build the MCP plugin:

```bash
cd ~/.gc-tools/mcp-plugin
npm install && npm run build
```

Then add to your project's `.claude/settings.json` (replace `$HOME` with your actual home directory path):

```json
{
  "mcpServers": {
    "sustainable-code": {
      "command": "node",
      "args": ["/Users/yourname/.gc-tools/mcp-plugin/dist/index.js"]
    }
  }
}
```

> **Tip:** Run `echo $HOME` to get your home directory path. For example, on macOS it's typically `/Users/yourname`, on Linux `/home/yourname`.

Verify the tools are working by restarting Claude Code and asking:

> "Use the grid_carbon_intensity tool to check Italy's carbon intensity"

If the agent returns a gCO2eq/kWh value, the MCP server is working correctly.

## MCP tools

| Tool | Used by | Description |
|------|---------|-------------|
| `sci_calculate` | `/gc-setup`, `/gc-measure-sci`, `/gc-mobile-ios`, `/gc-mobile-android` | Compute SCI carbon intensity per functional unit |
| `swd_estimate` | `/gc-setup`, `/gc-estimate-emissions` | Estimate page-level CO2 via SWD v4 model |
| `swd_batch` | `/gc-setup`, `/gc-estimate-emissions` | Estimate emissions for multiple pages at once |
| `check_green_hosting` | `/gc-setup`, `/gc-check-sustainability` | Check if a domain uses green hosting |
| `grid_carbon_intensity` | `/gc-setup`, `/gc-measure-sci`, `/gc-mobile-ios`, `/gc-mobile-android` | Look up grid carbon intensity by country |
| `wsg_compliance_score` | `/gc-setup`, `/gc-check-sustainability` | Score a WSG compliance JSON file |
| `creedengo_check` | `/gc-setup`, `/gc-check-sustainability`, `/gc-mobile-ios`, `/gc-mobile-android` | Check source files against green code rules |
| `sci_compare` | `/gc-setup`, `/gc-measure-sci`, `/gc-mobile-ios`, `/gc-mobile-android` | Compare two SCI measurements |

## File structure

```
sustainable-code-skill-setup/
  .claude-plugin/
    plugin.json                           # Plugin manifest (agentskills.io format)
  README.md                               # This file
  CONTRIBUTING.md                         # How to contribute
  LICENSE                                 # MIT
  skills/                                 # Copy this into .claude/skills/
    gc-setup/                             # /gc-setup — full 9-phase audit
      SKILL.md
      evals/evals.json                    # Skill evaluation test cases
      references/                         # 8 reference files loaded on-demand
    gc-dev/                               # /gc-dev — daily dev companion
      SKILL.md
      evals/evals.json
    gc-measure-sci/                       # /gc-measure-sci — SCI measurement
      SKILL.md
      evals/evals.json
    gc-check-sustainability/              # /gc-check-sustainability — quick check
      SKILL.md
      evals/evals.json
    gc-estimate-emissions/                # /gc-estimate-emissions — page emissions
      SKILL.md
      evals/evals.json
    gc-mobile-ios/                        # /gc-mobile-ios — iOS energy audit
      SKILL.md
      evals/evals.json
    gc-mobile-android/                    # /gc-mobile-android — Android energy audit
      SKILL.md
      evals/evals.json
    gc-verify/                            # /gc-verify — adversarial verification
      SKILL.md
      evals/evals.json
  examples/                               # Walkthroughs and reference docs
    01-first-audit.md                     # Full /gc-setup example
    02-measure-sci.md                     # SCI measurement example
    03-page-emissions.md                  # Page emissions example
    04-daily-workflow.md                  # Daily dev workflow
    05-mcp-tools-reference.md             # Complete MCP tools reference
    sample-wsg-compliance.json            # Sample WSG compliance file
  mcp-plugin/                             # MCP server (optional, Step 2)
    src/tools/                            # 8 tool implementations
    src/tools/__tests__/                  # Test suite (72 tests)
    src/lib/                              # Shared constants and types
  scripts/                                # Validation and CI helpers
```

## Compatibility

This skill follows the [Agent Skills](https://agentskills.io/) open format and works with 30+ AI agents and tools, including:

- [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)
- [Cursor](https://www.cursor.com/)
- [Windsurf](https://windsurf.com/)
- [Cline](https://github.com/cline/cline)
- Any agent supporting the agentskills.io specification

## Examples

The [`examples/`](examples/) directory contains complete walkthroughs and reference documentation:

| Example | Description |
|---------|-------------|
| [First Audit](examples/01-first-audit.md) | Full `/gc-setup` walkthrough on a Next.js app |
| [Measure SCI](examples/02-measure-sci.md) | SCI measurement for an API endpoint (with and without MCP) |
| [Page Emissions](examples/03-page-emissions.md) | Single page and full sitemap emissions estimation |
| [Daily Workflow](examples/04-daily-workflow.md) | How `/gc-dev` integrates into your development cycle |
| [MCP Tools Reference](examples/05-mcp-tools-reference.md) | Complete reference for all 8 MCP tools with parameters and examples |

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute, commit conventions, and data update procedures.

## License

[MIT](LICENSE)
