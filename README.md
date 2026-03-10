# Sustainable Project Setup — Agent Skill

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
| Web sustainability | [W3C WSG 1.0](https://www.w3.org/TR/web-sustainability-guidelines/) (80 guidelines) |
| Accessibility | [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) via [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) |
| Performance | Lighthouse performance scores, bundle budgets |
| Cloud carbon | [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/) |

## Installation

### Option 1 — Git submodule (recommended)

```bash
git submodule add https://github.com/fullo/sustainable-code-skill-setup.git .claude/skills/sustainable-project-setup
```

### Option 2 — Copy

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git
cp -r sustainable-code-skill-setup/ .claude/skills/sustainable-project-setup/
```

### Option 3 — Global skill

Place the skill in your home directory to make it available across all projects:

```bash
git clone https://github.com/fullo/sustainable-code-skill-setup.git ~/.claude/skills/sustainable-project-setup
```

## File structure

```
sustainable-project-setup/
  SKILL.md                              # Main skill (224 lines)
  references/
    sci-guide.md                        # SCI formula, constants, implementation patterns
    wsg-checklist.md                    # Complete 80-guideline WSG 1.0 checklist + JSON template
    accessibility-setup.md              # Lighthouse CI configuration and manual checks
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

## License

[MIT](LICENSE)
