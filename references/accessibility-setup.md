# Accessibility Audit Setup

How to set up automated accessibility auditing with Lighthouse CI.

## Lighthouse CI Configuration

Create `lighthouserc.json` at project root:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": [
        "http://localhost/",
        "http://localhost/main-feature",
        "http://localhost/about"
      ]
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": ".lighthouseci"
    }
  }
}
```

Adapt for your project:

- `staticDistDir`: your build output directory (`dist/`, `build/`, `docs/`, `public/`)
- `url`: 3-5 pages that represent different page types (home, feature, content, form)
- For SPA with hash routing: use `http://localhost/#/route`
- For server-rendered apps: point to the running server URL

## Using a Specific Browser

If the default Chrome is unavailable, specify a Chromium path:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "chromePath": "/usr/bin/chromium-browser",
      "url": ["http://localhost/"]
    }
  }
}
```

Common paths:
- macOS Chrome: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- macOS Edge: `/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge`
- Linux: `/usr/bin/chromium-browser` or `/usr/bin/google-chrome`

## Package Setup

Install:

```bash
npm install -D @lhci/cli
```

Add to `package.json`:

```json
{
  "scripts": {
    "audit:a11y": "lhci autorun"
  }
}
```

For non-Node projects, install globally:

```bash
npm install -g @lhci/cli
lhci autorun
```

## Running Against a Live Server

If the app requires a running server (not just static files):

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "Local:.*http",
      "url": [
        "http://localhost:4173/",
        "http://localhost:4173/dashboard"
      ]
    }
  }
}
```

## Thresholds

Recommended starting thresholds:

| Category | Threshold | Level | Rationale |
|----------|-----------|-------|-----------|
| Accessibility | >= 90 | Error (blocks) | Legal compliance, inclusive design |
| Performance | >= 80 | Warning | User experience, energy efficiency |
| Best Practices | >= 90 | Warning | Security, modern standards |

Raise thresholds over time as the project improves.

## CI Integration

### GitHub Actions

```yaml
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    npm run build
    lhci autorun
```

### GitLab CI

```yaml
lighthouse:
  script:
    - npm install -g @lhci/cli
    - npm run build
    - lhci autorun
  artifacts:
    paths:
      - .lighthouseci/
```

## Manual Accessibility Checks

Automated tools catch ~30-40% of accessibility issues. Also verify:

1. **Keyboard navigation** — Tab through all interactive elements
2. **Screen reader** — Test with VoiceOver (macOS), NVDA (Windows), or Orca (Linux)
3. **Zoom** — Content readable at 200% zoom
4. **Color contrast** — Use browser DevTools contrast checker
5. **Focus indicators** — Visible focus ring on all interactive elements
6. **Skip links** — "Skip to content" link for keyboard users
7. **Form labels** — Every input has an associated label
8. **Error messages** — Clear, specific, associated with the field

## References

- [WCAG 2.1 (W3C)](https://www.w3.org/TR/WCAG21/)
- [Lighthouse CI docs](https://github.com/GoogleChrome/lighthouse-ci)
- [axe-core (Deque)](https://github.com/dequelabs/axe-core)
- [Pa11y](https://pa11y.org/)
