# Creedengo Green Code Rules Reference

Creedengo (formerly ecoCode) provides 124 static analysis rules for SonarQube
that detect energy-wasteful code patterns. Rules are identified by the prefix
`GCI` followed by a number, and include severity and remediation cost.

## Supported Languages

Java, JavaScript, PHP, Python, C#, Android (Java/Kotlin), iOS (Swift/Objective-C)

## Key Rules by Language

### Java

| Rule | Description | Severity |
|------|-------------|----------|
| GCI2 | Avoid full SQL queries (`SELECT *`) when only specific columns are needed | Major |
| GCI4 | Avoid using regex for simple string operations (use `contains`, `startsWith`) | Minor |
| GCI26 | Avoid String concatenation in loops; use `StringBuilder` | Major |
| GCI32 | Avoid unnecessary object creation (reuse immutable objects) | Major |
| GCI69 | Do not call `BigDecimal.toString()` on computations; use `BigDecimal.toPlainString()` | Minor |
| GCI72 | Avoid `Arrays.copyOf` when original size is known | Minor |
| GCI74 | Avoid writing to file in a loop; buffer and write once | Major |

### JavaScript

| Rule | Description | Severity |
|------|-------------|----------|
| GCI5 | Avoid high-accuracy geolocation when approximate position suffices | Major |
| GCI7 | Avoid CSS animations for non-essential elements | Minor |
| GCI20 | Prefer server-side rendering for static or near-static content | Major |
| GCI22 | Avoid `setInterval`/`setTimeout` for polling; use event-driven approaches | Major |
| GCI30 | Provide explicit image sizes to avoid layout reflow | Minor |

### PHP

| Rule | Description | Severity |
|------|-------------|----------|
| GCI1 | Avoid double quotes when single quotes suffice (no interpolation) | Minor |
| GCI2 | Avoid `SELECT *` in SQL queries | Major |
| GCI3 | Avoid unnecessary object instantiation | Major |
| GCI8 | Use static methods when instance state is not needed | Minor |
| GCI70 | Avoid function calls in loop conditions (`count($arr)` in `for`) | Minor |

### Python

| Rule | Description | Severity |
|------|-------------|----------|
| GCI2 | Avoid `SELECT *` in SQL queries | Major |
| GCI10 | Avoid global variables modified in loops | Major |
| GCI25 | Avoid unnecessary list comprehension; use generators for iteration | Minor |
| GCI69 | Use generators (`yield`) instead of building full lists when possible | Minor |

## Integration

### SonarQube Plugin (recommended for CI)

Install the Creedengo plugin for your language from the SonarQube marketplace
or build from source. Rules appear in the SonarQube quality profile and can be
enforced as quality gates.

### Manual Code Review Checklist (for agents)

When reviewing code without SonarQube, check for these high-impact patterns:

1. SQL queries using `SELECT *` instead of specific columns
2. String concatenation in loops (use builders/buffers)
3. Unnecessary object creation in hot paths
4. Polling with timers instead of event-driven patterns
5. File I/O inside loops instead of batched operations
6. Regex for simple string matching (`contains`, `startsWith`, `endsWith`)
7. Full-precision APIs when approximate results suffice (geolocation, etc.)

## References

- [Creedengo Rules Specifications](https://github.com/green-code-initiative/creedengo-rules-specifications)
- [Creedengo Java Plugin](https://github.com/green-code-initiative/creedengo-java)
- [Creedengo JavaScript Plugin](https://github.com/green-code-initiative/creedengo-javascript)
- [Creedengo PHP Plugin](https://github.com/green-code-initiative/creedengo-php)
- [Creedengo Python Plugin](https://github.com/green-code-initiative/creedengo-python)
- [SonarQube](https://www.sonarqube.org/)
