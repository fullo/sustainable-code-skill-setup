---
name: gc-check-sustainability
description: >-
  Quick sustainability check on a project or codebase. Evaluates WSG compliance,
  green hosting, and code-level green patterns. Use when the user asks for a fast
  sustainability review without a full audit.
license: MIT
metadata:
  author: fullo
  version: "1.0"
---

# Check Sustainability

Run a quick sustainability check on the current project. For a full 9-phase audit, use `/gc-setup`.

## Steps

### 1. WSG quick scan

Review the codebase against the most impactful [W3C Web Sustainability Guidelines](https://www.w3.org/TR/web-sustainability-guidelines/):

- **3.2** Minified and compressed assets?
- **3.3** Unused CSS/JS removed?
- **3.5** Lazy loading for non-critical resources?
- **3.7** Appropriate caching headers?
- **3.15** HTTP/2 or HTTP/3?
- **4.3** Green hosting provider?
- **4.5** CDN or edge caching?
- **2.7** Dark mode / `prefers-color-scheme` support?
- **2.15** System font stack or minimal web fonts?

If a `wsg-compliance.json` file exists, use the `wsg_compliance_score` MCP tool to score it. Otherwise, produce a quick manual assessment.

### 2. Green hosting check

- Use the `check_green_hosting` MCP tool with the project's domain
- If MCP is not available: check manually at [Green Web Foundation](https://www.thegreenwebfoundation.org/green-web-check/)
- Look for a [carbon.txt](https://carbontxt.org/) file at the domain root

### 3. Code-level green patterns

Pick 3-5 source files (busiest modules, largest files, entry points) and:

- Use the `creedengo_check` MCP tool to scan for energy-wasteful patterns
- If MCP is not available: manually check for:
  - Unnecessary DOM manipulation in loops
  - Missing pagination on large queries
  - Synchronous blocking operations
  - Oversized images or unoptimized media
  - Unused dependencies

### 4. Report

```
## Sustainability Quick Check

### WSG Compliance
| Guideline | Status | Notes |
|-----------|--------|-------|
| 3.2 Minification | pass/fail | ... |
| ... | ... | ... |

Score: ?/9 guidelines checked

### Green Hosting
- Domain: [domain]
- Green hosted: yes/no
- carbon.txt: found/not found
- Provider: [name]

### Code Patterns
| File | Issues found | Severity |
|------|-------------|----------|
| ... | ... | high/medium/low |

### Top 5 Recommendations
1. [highest impact action]
2. ...
```

## Notes

- This is a quick check, not a comprehensive audit
- For detailed WSG compliance (all 80 guidelines), use `/gc-setup`
- For carbon measurement, use `/gc-measure-sci`
- For page-level emissions, use `/gc-estimate-emissions`
