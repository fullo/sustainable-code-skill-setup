# Sustainable Code Skill Setup

## Project structure

- `SKILL.md` -- Main agent skill definition (v2.0, 9 phases)
- `references/` -- Reference material loaded on-demand by agents
  - `sci-guide.md` -- SCI formula, constants, JS/TS/PHP implementation
  - `wsg-checklist.md` -- Complete 80-guideline WSG 1.0 checklist + JSON template
  - `accessibility-setup.md` -- Lighthouse CI configuration and manual checks
  - `green-patterns.md` -- Green Software Foundation patterns catalog
  - `creedengo-rules.md` -- Creedengo static analysis rules for green code
  - `swd-model.md` -- Sustainable Web Design Model v4 for page emissions
  - `eco-ci-setup.md` -- CI pipeline energy measurement with eco-ci
- `mcp-plugin/` -- MCP server providing 8 sustainability tools
- `scripts/` -- Validation and CI helper scripts
- `.github/workflows/ci.yml` -- GitHub Actions CI pipeline

## Build and test

```
cd mcp-plugin
npm install
npm run build     # TypeScript compilation
npm test          # Run vitest test suite
npm run dev       # Development mode with tsx
```

## MCP plugin tools

- `sci_calculate` -- SCI carbon intensity per operation
- `swd_estimate` -- Page-level emissions via SWD v4 model
- `check_green_hosting` -- Green Web Foundation hosting check
- `grid_carbon_intensity` -- Grid carbon intensity by country
- `wsg_compliance_score` -- WSG compliance JSON scorer
- `creedengo_check` -- Green code rule check on source files (JS, PHP, Python, Java)
- `sci_compare` -- Compare two SCI measurements (delta, improvement %)
- `swd_batch` -- Batch page emissions estimation (sitemap analysis)

## Editing guidelines

- SKILL.md uses progressive disclosure: keep it concise, link to references
- Reference files should be actionable: concrete steps, not essays
- MCP tools must have proper error handling and Zod schemas
- All tool changes need corresponding test updates
- Keep English in all files
- No emojis in files
- Run `npm test` in mcp-plugin/ before committing
