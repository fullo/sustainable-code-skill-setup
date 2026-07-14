# Website Specification — Sustainability-Adjacent Reference

Curated subset of [The Website Specification](https://specification.website/), a
platform-agnostic technical reference for well-built modern websites. The full
spec covers 13 areas. This file pulls two kinds of item:

1. **Environmental** (Performance, Resilience, Agent Readiness, Privacy) — items
   that meaningfully **reduce bytes transferred, CPU work, or energy**, so they
   reinforce the green-coding goal.
2. **Governance** (Security) — the "G" of ESG / sustainable governance. These do
   **not** reduce carbon and **do not affect the WSG, accessibility, or SCI
   scores**. They are tracked here as a governance dimension only, kept visibly
   separate so they never leak into an environmental verdict.

**Scope note — this is a complement, not an authority.** For sustainability
verdicts, the primary sources still win: [W3C WSG 1.0](https://www.w3.org/TR/web-sustainability-guidelines/)
([wsg-checklist.md](wsg-checklist.md)), [Green Software Patterns](https://patterns.greensoftware.foundation/)
([green-patterns.md](green-patterns.md)), and [Creedengo](creedengo-rules.md).
Use this file for the *agent-readiness* and *resilience* angles those sources
don't cover, and as a cross-check on performance/privacy. Do **not** cite
specification.website as the basis of a WSG or accessibility score — it is a
community guide, not a normative standard.

Spec is agent-friendly: each page has a `.md` endpoint, plus `/llms.txt`,
`/llms-full.txt`, and a remote MCP server at `https://mcp.specification.website/mcp`.

## Performance (cross-check against WSG 3.x and Web patterns)

Most items here overlap with WSG and the GSF Web patterns — when they conflict,
defer to those. Items unique to this spec are marked **(new angle)**.

| Practice | Sustainability rationale | Maps to |
|----------|--------------------------|---------|
| WebP/AVIF at correct viewport size, explicit dimensions | 25–50% fewer image bytes; avoids layout reflow CPU | WSG 3.x, `serve-images-in-modern-formats` |
| `loading="lazy"` for off-screen images/iframes (not LCP) | Skips network + decode for unseen assets | WSG 3.5, `defer-offscreen-images` |
| Brotli/gzip on all text responses | Fewer bytes over the wire | WSG 3.2, `enable-text-compression` |
| `Cache-Control: immutable, max-age=31536000` for fingerprinted assets | Eliminates repeat transfers | WSG 3.7, `cache-static-data` |
| Self-host subset WOFF2, `font-display: swap` | Removes third-party font requests; smaller payload | WSG 2.15 |
| `defer` app scripts / `async` independent third-party | Less main-thread blocking → less device CPU | `minimize-main-thread-work` |
| HTTP/2 / HTTP/3 (QUIC) | Multiplexing cuts connection overhead | WSG 3.15 |
| CSS containment (`contain`) | Isolates layout/paint to subtrees → less recompute | `minimize-main-thread-work` (new angle) |
| Scroll-driven animations (`scroll-timeline`) instead of JS listeners | Moves work off the main thread to the compositor | (new angle) |
| Speculation Rules prefetch/prerender | **Trade-off**: faster nav but speculative fetches can *waste* bytes — use sparingly, never blanket-prerender | (caution) |

> **Sustainability caveat on Speculation Rules / prefetch:** aggressive
> prefetch/prerender downloads pages the user may never visit, which *increases*
> total transfer and energy. This is the one place the spec's perf advice can
> conflict with green goals. Recommend only for high-probability next navigations.

## Resilience (new angle — not in WSG/GSF)

Graceful failure avoids wasted retries and re-renders, which is energy the user
would otherwise spend re-loading.

| Practice | Sustainability rationale |
|----------|--------------------------|
| Correct HTTP status on error pages (404/500) with clear guidance | Stops clients/crawlers retrying a 200-that-is-really-an-error |
| HTTP 503 + `Retry-After` during maintenance | Tells bots to back off instead of hammering the origin |
| Service-worker offline fallback | Serves cached shell instead of full re-fetch on flaky networks |
| External synthetic monitoring on a separate status host | Detects waste (error storms, runaway retries) early |

## Agent Readiness (new angle — efficient machine access)

Exposing machine-readable content lets agents and crawlers read a small Markdown
file instead of rendering full HTML+JS — directly fewer bytes and less CPU per
agent visit. This is the most sustainability-relevant *new* contribution of the spec.

| Practice | Sustainability rationale |
|----------|--------------------------|
| `/llms.txt` + `/llms-full.txt` | Agents read a curated index, not the whole rendered site |
| Markdown endpoints (`.md` suffix or content negotiation) | Raw Markdown is a fraction of the weight of rendered HTML+assets |
| `robots.txt` named user-agents + Content Signals | Lets you disallow training/ingest crawlers that add load with no user value |
| Stable URLs | Preserves agent/citation caches → avoids re-crawls |
| JSON-LD structured data (schema.org) | Typed facts without scraping the full DOM |
| MCP / tool discovery, A2A agent cards, Agent Skills well-known URI | Direct queryable access instead of brute-force crawling |

## Privacy (cross-check — overlaps WSG and data-minimization patterns)

| Practice | Sustainability rationale | Maps to |
|----------|--------------------------|---------|
| Data minimization (collect/retain only what's needed) | Less storage = less embodied + operational carbon (M, E) | `delete-unused-storage` |
| Third-party script audit | Each tracker is extra requests, bytes, and main-thread cost | `avoid-tracking-unnecessary-data` |
| Privacy-respecting, cookieless, aggregate analytics | Lighter than ad-tech tracking stacks | `avoid-tracking-unnecessary-data` |

## Security (governance dimension — NOT environmental)

> **Read this first.** Security is here because it sits in the *governance*
> pillar of sustainability (ESG-G), not because it cuts carbon. **Do not** roll
> these items into a WSG, accessibility, or SCI score, and **do not** present
> them as "green" wins. Report them under a separate *Governance* heading, or
> defer entirely to a dedicated security review (e.g. `/security-review`). The
> two genuine — but secondary — energy links are called out below; everything
> else is orthogonal to emissions.

| Practice | Header / location | Recommended value | Tier |
|----------|-------------------|-------------------|------|
| HTTPS + TLS 1.2/1.3, redirect HTTP→HTTPS, disable old SSL/TLS | — | — | Required |
| HSTS | `Strict-Transport-Security` | `max-age=…; includeSubDomains; preload` (irreversible once preloaded) | Required |
| MIME sniffing protection | `X-Content-Type-Options` | `nosniff` | Required |
| Clickjacking protection | CSP `frame-ancestors` (primary) / `X-Frame-Options` (fallback) | restrict who can iframe you | Required |
| Cookie hardening | cookie attributes | `Secure; HttpOnly; SameSite=…`, prefer `__Host-`/`__Secure-` prefixes | Required |
| Content Security Policy | `Content-Security-Policy` | allowlist script/style/img/frame sources | Recommended |
| Referrer leakage control | `Referrer-Policy` | `strict-origin-when-cross-origin` | Recommended |
| Feature lockdown | `Permissions-Policy` | disable unused camera/mic/geolocation/payment/USB | Recommended |
| Subresource Integrity (SRI) | `integrity` attr on external `<script>`/`<link>` | cryptographic hash | Recommended |
| Vulnerability reporting | `/.well-known/security.txt` | contact + disclosure policy | Recommended |
| Certificate issuance control | DNS CAA records | restrict allowed CAs | Recommended |
| DNS integrity | DNSSEC | sign DNS records (needs registrar/registry support) | Optional |

### The two real energy links (don't overstate them)

- **CSP + SRI block injected cryptominers.** The most concrete sustainability
  angle: a supply-chain or XSS injection that drops a JS cryptominer burns
  *visitors'* CPU/energy on every page load. CSP allowlists and SRI hashes stop
  tampered/foreign scripts from executing — preventing that wasted energy. This
  is real but defensive, not a measurable carbon reduction.
- **Fewer breaches → less remediation compute.** Incident response, forensics,
  full re-indexing, and credential-rotation storms consume real compute. Avoiding
  them avoids that energy. Secondary and unquantified — do not put a gCO2 number on it.

Everything else (HSTS, CAA, DNSSEC, Referrer-Policy, security.txt) is governance
hygiene with **no** material energy effect. Keep it labelled as such.

## How to use this in the skills

- **gc-setup Phase 5 (Performance):** use the Performance table as a secondary
  checklist after WSG 3.x and `green-patterns.md`. Flag the Speculation Rules
  caveat if the project blanket-prefetches.
- **gc-setup Phase 5 / new "Agent Readiness" angle:** if the project serves a
  public site, check for `/llms.txt` and Markdown endpoints — recommend them as
  a low-cost way to cut agent-traffic emissions.
- **gc-check-sustainability:** optional quick check — does the site expose
  `/llms.txt` and correct error status codes? Cheap wins, no measurement needed.
- **Security (governance):** if the project asks for a governance view, surface
  the Security table under its own *Governance* heading — never blended with the
  environmental score. For a real security audit, defer to `/security-review`
  rather than treating this checklist as sufficient.
- **Never** convert any of these into a WSG/a11y/SCI score; keep them as
  recommendations, and keep environmental and governance items visually separate.

## References

- [The Website Specification](https://specification.website/) — MIT, agent-friendly
- Remote MCP: `https://mcp.specification.website/mcp`
- Machine-readable: [/llms.txt](https://specification.website/llms.txt), [/llms-full.txt](https://specification.website/llms-full.txt)
- Primary green sources still take precedence: [WSG 1.0](https://www.w3.org/TR/web-sustainability-guidelines/), [GSF Patterns](https://patterns.greensoftware.foundation/)
