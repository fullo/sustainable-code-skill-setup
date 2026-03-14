#!/usr/bin/env bash
# Validate internal links between markdown files and reference files.
# Exits with code 1 if any broken links are found.

set -uo pipefail

ERRORS_FILE=$(mktemp)
trap 'rm -f "$ERRORS_FILE"' EXIT

echo "Validating internal links..."

# Check all markdown link references like [text](path) in .md files
find . -name '*.md' -not -path './mcp-plugin/node_modules/*' -not -path './.git/*' | sort | while IFS= read -r file; do
    # Extract relative .md links from markdown [text](link)
    links=$(grep -o ']([-a-zA-Z0-9_./ ]*\.md)' "$file" 2>/dev/null | sed 's/^]//' | sed 's/)$//' | sed 's/^(//' || true)
    if [ -z "$links" ]; then
        continue
    fi
    echo "$links" | while IFS= read -r link; do
        if [ -z "$link" ]; then
            continue
        fi
        dir=$(dirname "$file")
        target="$dir/$link"
        if [ ! -f "$target" ]; then
            echo "BROKEN: $file -> $link (resolved: $target)"
            echo "1" >> "$ERRORS_FILE"
        fi
    done
done

# Check that all reference files mentioned in gc-setup SKILL.md exist
SKILL_FILE="skills-agent/gc-setup/SKILL.md"
if [ -f "$SKILL_FILE" ]; then
    refs=$(grep -o 'references/[a-z-]*\.md' "$SKILL_FILE" | sort -u || true)
    if [ -n "$refs" ]; then
        echo "$refs" | while IFS= read -r ref; do
            target="skills-agent/gc-setup/$ref"
            if [ ! -f "$target" ]; then
                echo "BROKEN in SKILL.md: $ref does not exist (resolved: $target)"
                echo "1" >> "$ERRORS_FILE"
            fi
        done
    fi
fi

# Check that all skills have a SKILL.md
for skill_dir in skills-agent/*/; do
    if [ ! -f "${skill_dir}SKILL.md" ]; then
        echo "MISSING: ${skill_dir}SKILL.md"
        echo "1" >> "$ERRORS_FILE"
    fi
done

if [ -s "$ERRORS_FILE" ]; then
    count=$(wc -l < "$ERRORS_FILE" | tr -d ' ')
    echo "Found $count broken link(s)"
    exit 1
fi

echo "All internal links valid."
