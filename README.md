# Green Coding Skills — Agent Skills + MCP Tools

[![Skill Version](https://img.shields.io/badge/skill-v3.0-blue)](skills-agent/gc-setup/SKILL.md)
[![MCP Tools](https://img.shields.io/badge/MCP_tools-8-green)](mcp-plugin/)
[![CI](https://github.com/fullo/sustainable-code-skill-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/fullo/sustainable-code-skill-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/format-agentskills.io-purple)](https://agentskills.io/)

A collection of [Agent Skills](https://agentskills.io/) and MCP tools that audit software projects for environmental sustainability, accessibility, and quality, then implement measurable improvements.

## Commands

| Command | What it does |
|---------|-------------|
| `/gc-setup` | Full 9-phase sustainability audit (SCI, WSG, a11y, performance, testing, baselines) |
| `/gc-measure-sci` | Measure SCI carbon intensity for a specific operation or endpoint |
| `/gc-check-sustainability` | Quick sustainability check (WSG, green hosting, code patterns) |
| `/gc-estimate-emissions` | Estimate CO2 emissions per page view or across a sitemap |

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
| CI energy tracking | [eco-ci-energy-estimation](https://github.com/green-coding-solutions/eco-ci-energy-estimation) for pipeline measurement |
| Cloud carbon | [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/) |

## Installation

### Step 1 — Install the skills

Copy the `skills-agent/` contents into your project's `.claude/skills/` directory:

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git /tmp/gc-skills
cp -r /tmp/gc-skills/skills-agent/* .claude/skills/
rm -rf /tmp/gc-skills
```

For a global installation available across all projects:

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git /tmp/gc-skills
cp -r /tmp/gc-skills/skills-agent/* ~/.claude/skills/
rm -rf /tmp/gc-skills
```

Your `.claude/skills/` directory will contain:

```
.claude/skills/
  gc-setup/                             # Full 9-phase audit
    SKILL.md
    references/                         # 8 reference files loaded on-demand
  gc-measure-sci/                       # Quick SCI measurement
    SKILL.md
  gc-check-sustainability/              # Quick sustainability check
    SKILL.md
  gc-estimate-emissions/                # Page/sitemap emissions
    SKILL.md
```

### Step 2 (optional) — Enable MCP tools

The MCP plugin gives your agent access to 8 sustainability measurement tools. This enhances the skills with real-time calculations but is not required — all skills include manual fallback instructions.

```bash
npm install -g sustainable-code-mcp
```

Then add to your `.claude/settings.json`:

```json
{
  "mcpServers": {
    "sustainable-code": {
      "command": "sustainable-code-mcp"
    }
  }
}
```

Or run from source:

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git
cd sustainable-code-skill-setup/mcp-plugin
npm install && npm run build
```

```json
{
  "mcpServers": {
    "sustainable-code": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-plugin/dist/index.js"]
    }
  }
}
```

## MCP tools

| Tool | Used by | Description |
|------|---------|-------------|
| `sci_calculate` | `/gc-setup`, `/gc-measure-sci` | Compute SCI carbon intensity per functional unit |
| `swd_estimate` | `/gc-setup`, `/gc-estimate-emissions` | Estimate page-level CO2 via SWD v4 model |
| `swd_batch` | `/gc-setup`, `/gc-estimate-emissions` | Estimate emissions for multiple pages at once |
| `check_green_hosting` | `/gc-setup`, `/gc-check-sustainability` | Check if a domain uses green hosting |
| `grid_carbon_intensity` | `/gc-setup`, `/gc-measure-sci` | Look up grid carbon intensity by country |
| `wsg_compliance_score` | `/gc-setup`, `/gc-check-sustainability` | Score a WSG compliance JSON file |
| `creedengo_check` | `/gc-setup`, `/gc-check-sustainability` | Check source files against green code rules |
| `sci_compare` | `/gc-setup`, `/gc-measure-sci` | Compare two SCI measurements |

## File structure

```
sustainable-code-skill-setup/
  README.md                               # This file
  CONTRIBUTING.md                         # How to contribute
  LICENSE                                 # MIT
  skills-agent/                           # Copy this into .claude/skills/
    gc-setup/                             # /gc-setup command
      SKILL.md                            # Full audit (v3.0, 9 phases)
      references/
        sci-guide.md                      # SCI formula, constants, JS/TS/PHP
        wsg-checklist.md                  # 80-guideline WSG 1.0 checklist
        accessibility-setup.md            # Lighthouse CI configuration
        green-patterns.md                 # GSF patterns catalog
        creedengo-rules.md                # Creedengo green code rules
        swd-model.md                      # SWD v4 page emissions model
        eco-ci-setup.md                   # CI energy measurement
        phase-output-examples.md          # Expected output formats
    gc-measure-sci/                       # /gc-measure-sci command
      SKILL.md
    gc-check-sustainability/              # /gc-check-sustainability command
      SKILL.md
    gc-estimate-emissions/                # /gc-estimate-emissions command
      SKILL.md
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

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute, commit conventions, and data update procedures.

## License

[MIT](LICENSE)
