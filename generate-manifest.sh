#!/bin/bash
#
# generate-manifest.sh
# Rebuilds blog-manifest.json and projects-manifest.json from markdown files.
#
# Usage:
#   ./generate-manifest.sh
#
# Requirements:
#   - Markdown files must have YAML front matter with: title, slug, date, tags, excerpt
#   - Blog posts go in content/blog/
#   - Projects go in content/projects/
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTENT_DIR="$SCRIPT_DIR/content"

generate_manifest() {
  local dir="$1"
  local output="$2"
  local type="$3"

  echo "Generating $output from $dir..."

  local first=true
  echo "[" > "$output"

  for file in "$dir"/*.md; do
    [ -f "$file" ] || continue

    # Read front matter
    local in_front_matter=false
    local title="" slug="" date="" tags="" excerpt="" url="" status=""

    while IFS= read -r line; do
      if [ "$line" = "---" ]; then
        if [ "$in_front_matter" = true ]; then
          break
        else
          in_front_matter=true
          continue
        fi
      fi

      if [ "$in_front_matter" = true ]; then
        local key="${line%%:*}"
        local value="${line#*: }"

        case "$key" in
          title)  title="$value" ;;
          slug)   slug="$value" ;;
          date)   date="$value" ;;
          tags)   tags="$value" ;;
          excerpt) excerpt="$value" ;;
          url)    url="$value" ;;
          status) status="$value" ;;
        esac
      fi
    done < "$file"

    # Skip files without required fields
    if [ -z "$title" ] || [ -z "$slug" ] || [ -z "$date" ]; then
      echo "  Skipping $(basename "$file") — missing required fields"
      continue
    fi

    # Get relative file path
    local rel_path="${file#$CONTENT_DIR/}"

    # Add comma separator
    if [ "$first" = true ]; then
      first=false
    else
      echo "," >> "$output"
    fi

    # Write JSON entry
    printf '  {\n' >> "$output"
    printf '    "title": "%s",\n' "$title" >> "$output"
    printf '    "slug": "%s",\n' "$slug" >> "$output"
    printf '    "date": "%s",\n' "$date" >> "$output"
    # Convert tags [a, b, c] to ["a", "b", "c"]
    local json_tags
    json_tags=$(echo "$tags" | sed 's/\[//;s/\]//' | tr ',' '\n' | sed 's/^ *//;s/ *$//' | sed 's/.*/"&"/' | tr '\n' ',' | sed 's/,$//')
    printf '    "tags": [%s],\n' "$json_tags" >> "$output"
    printf '    "excerpt": "%s",\n' "$excerpt" >> "$output"

    if [ "$type" = "project" ]; then
      [ -n "$url" ] && printf '    "url": "%s",\n' "$url" >> "$output"
      [ -n "$status" ] && printf '    "status": "%s",\n' "$status" >> "$output"
    fi

    printf '    "file": "%s"\n' "$rel_path" >> "$output"
    printf '  }' >> "$output"

    echo "  Added: $title"
  done

  echo "" >> "$output"
  echo "]" >> "$output"

  echo "Done. Wrote $(grep -c '"slug"' "$output") entries to $output"
  echo ""
}

echo "================================="
echo "  Manifest Generator"
echo "================================="
echo ""

generate_manifest "$CONTENT_DIR/blog" "$CONTENT_DIR/blog-manifest.json" "blog"
generate_manifest "$CONTENT_DIR/projects" "$CONTENT_DIR/projects-manifest.json" "project"

echo "All manifests generated successfully."
