# Contributing

Thank you for considering contributing to the Sustainable Code Skill Setup project.

## How to contribute

### Reporting issues

Open a GitHub issue describing the problem, the expected behavior, and steps to reproduce.

### Proposing changes

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes following the guidelines below
4. Run tests: `cd mcp-plugin && npm test`
5. Open a pull request with a clear description of the change

### What we welcome

- New reference files for emerging green software standards
- Improvements to existing reference material (corrections, updated data, new examples)
- New MCP tools that support sustainability measurement
- Bug fixes and test improvements
- Translations of reference material

## Project structure

```
SKILL.md                    # Main agent skill definition (v2.0)
references/                 # Reference material for each skill phase
mcp-plugin/                 # MCP server with sustainability tools
  src/tools/                # Tool implementations
  src/tools/__tests__/      # Test files (vitest)
  src/lib/                  # Shared constants and types
```

## Guidelines

### Skill and reference files

- Write in English
- Keep content actionable: agents need concrete steps, not essays
- SKILL.md uses progressive disclosure: keep it concise, link to references for detail
- Reference files should include a "References" section at the bottom with source links
- When adding data (carbon intensities, coefficients), always cite the source and year
- No emojis in files

### MCP plugin

- Use strict TypeScript (ES modules, Node16 resolution)
- Every tool must have a Zod schema for input validation
- Every tool must handle errors gracefully (try/catch, return isError)
- Every new tool or changed tool needs corresponding tests
- Use native APIs where possible (e.g., `fetch` instead of axios)
- Run `npm test` and `npm run build` before submitting

### Tests

- Tests use vitest and live in `src/tools/__tests__/`
- Name test files as `<tool-name>.test.ts`
- Cover: default parameters, custom overrides, edge cases, error conditions
- Network-dependent tests should handle offline gracefully (skip or mock)

### Commits

- Use concise commit messages that describe the "why"
- Prefix with area when useful: `skill:`, `mcp:`, `refs:`, `docs:`
- Examples:
  - `skill: add SWD model as alternative estimation method`
  - `mcp: fix SCI calculation for sub-millisecond operations`
  - `refs: update grid intensity data to Ember 2023`
  - `docs: add CONTRIBUTING.md`

## Updating data

Some reference files contain data that may become outdated:

| Data | File | Source | Update frequency |
|------|------|--------|-----------------|
| Grid carbon intensity | `mcp-plugin/src/tools/grid-intensity.ts`, `references/sci-guide.md` | [Ember Global Electricity Review](https://ember-energy.org/) | Annual |
| SWD coefficients | `mcp-plugin/src/lib/constants.ts`, `references/swd-model.md` | [sustainablewebdesign.org](https://sustainablewebdesign.org/estimating-digital-emissions/) | When model updates |
| WSG guidelines | `references/wsg-checklist.md` | [W3C WSG](https://www.w3.org/TR/web-sustainability-guidelines/) | When spec updates |
| Creedengo rules | `references/creedengo-rules.md` | [creedengo-rules-specifications](https://github.com/green-code-initiative/creedengo-rules-specifications) | Per release |

When updating data, update both the reference file and the corresponding MCP tool constants.

## Code of conduct

Be respectful, constructive, and inclusive. This project exists to make software more sustainable -- bring that same mindset to how you collaborate.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
