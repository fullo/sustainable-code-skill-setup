# Sustainable Project Setup — Agent Skill

[![Skill Version](https://img.shields.io/badge/skill-v2.0-blue)](skills-agent/sustainable-project-setup/SKILL.md)
[![MCP Tools](https://img.shields.io/badge/MCP_tools-8-green)](mcp-plugin/)
[![CI](https://github.com/fullo/sustainable-code-skill-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/fullo/sustainable-code-skill-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/format-agentskills.io-purple)](https://agentskills.io/)

An [Agent Skill](https://agentskills.io/) that audits any software project for environmental sustainability, accessibility, and quality, then implements measurable improvements.

## What it does

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

## What it covers

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

### Step 1 — Install the skill

Copy the `skills-agent/` contents into your project's `.claude/skills/` directory:

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git /tmp/sustainable-skill
cp -r /tmp/sustainable-skill/skills-agent/* .claude/skills/
rm -rf /tmp/sustainable-skill
```

Or as a git submodule (mounts the full repo, but the agent only reads `skills-agent/`):

```bash
git submodule add https://github.com/fullo/sustainable-code-skill-setup.git .sustainable-skill
mkdir -p .claude/skills
cp -r .sustainable-skill/skills-agent/* .claude/skills/
```

For a global installation available across all projects:

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git /tmp/sustainable-skill
cp -r /tmp/sustainable-skill/skills-agent/* ~/.claude/skills/
rm -rf /tmp/sustainable-skill
```

Your `.claude/skills/` directory will contain:

```
.claude/skills/
  sustainable-project-setup/
    SKILL.md                            # Skill definition (9 phases)
    references/                         # 8 reference files loaded on-demand
```

### Step 2 (optional) — Enable MCP tools

The MCP plugin gives your agent access to 8 sustainability measurement tools. This enhances the skill with real-time calculations but is not required.

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

| Tool | Description |
|------|-------------|
| `sci_calculate` | Compute SCI carbon intensity per functional unit (operation, request, etc.) |
| `swd_estimate` | Estimate page-level CO2 emissions using the Sustainable Web Design v4 model |
| `check_green_hosting` | Check if a domain uses green hosting via The Green Web Foundation API |
| `grid_carbon_intensity` | Look up grid carbon intensity (gCO2eq/kWh) by country code |
| `wsg_compliance_score` | Score a WSG compliance JSON file and report gaps by category |
| `creedengo_check` | Check a source file against green code rules (JS, PHP, Python, Java) |
| `sci_compare` | Compare two SCI measurements and report delta/improvement |
| `swd_batch` | Estimate emissions for multiple pages at once (sitemap analysis) |

## File structure

```
sustainable-code-skill-setup/
  README.md                               # This file
  CONTRIBUTING.md                         # How to contribute
  LICENSE                                 # MIT
  skills-agent/
    sustainable-project-setup/
      SKILL.md                            # Main skill (v2.0, 9 phases)
      references/
        sci-guide.md                      # SCI formula, constants, JS/TS/PHP implementation
        wsg-checklist.md                  # Complete 80-guideline WSG 1.0 checklist + JSON template
        accessibility-setup.md            # Lighthouse CI configuration and manual checks
        green-patterns.md                 # Green Software Foundation patterns catalog
        creedengo-rules.md               # Creedengo static analysis rules for green code
        swd-model.md                      # Sustainable Web Design Model v4 for page emissions
        eco-ci-setup.md                   # CI pipeline energy measurement with eco-ci
        phase-output-examples.md          # Expected output format for each phase
  mcp-plugin/
    src/tools/                            # Eight MCP tool implementations
    src/tools/__tests__/                  # Test suite (72 tests)
    src/lib/                              # Shared constants and types
    vitest.config.ts                      # Test configuration
    package.json                          # Dependencies and scripts
  scripts/                                # Validation and CI helper scripts
```

The skill uses **progressive disclosure**: agents load `SKILL.md` first (~100 tokens for metadata), the full body on activation, and reference files only when needed during specific phases.

## Compatibility

This skill follows the [Agent Skills](https://agentskills.io/) open format and works with 30+ AI agents and tools, including:

- [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)
- [Cursor](https://www.cursor.com/)
- [Windsurf](https://windsurf.com/)
- [Cline](https://github.com/cline/cline)
- Any agent supporting the agentskills.io specification

## Triggers

The skill activates when a user mentions:

- Setting up or onboarding to a project
- Green code, carbon footprint, sustainability
- SCI, WSG, or accessibility auditing
- Eco-friendly development practices

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute, commit conventions, and data update procedures.

## License

[MIT](LICENSE)
