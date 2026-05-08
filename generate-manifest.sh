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
#   - Markdown bodies must NOT start with `# Heading` (the title is rendered
#     from front matter; a leading H1 would duplicate it on the page).
#   - Project front matter may include a `links` array of pipe-delimited
#     entries: links: [Live site|https://…|site, GitHub|https://…|github]
#     Each entry is `label|url[|type]`.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTENT_DIR="$SCRIPT_DIR/content"

# Tracks whether any file failed the leading-H1 guard.
HAS_LEADING_H1=false

# The post and project pages render the title from the manifest, so a
# leading `# Heading` in the body would render twice on the page.
# Reject any file whose first non-blank line after front matter is `# ...`.
check_no_leading_h1() {
  local file="$1"
  awk '
    BEGIN { in_fm = 0; seen_fm = 0 }
    /^---[[:space:]]*$/ {
      if (!seen_fm) { in_fm = 1; seen_fm = 1; next }
      else if (in_fm) { in_fm = 0; next }
    }
    !in_fm && seen_fm {
      if ($0 ~ /^[[:space:]]*$/) next
      if ($0 ~ /^#[[:space:]]+/) exit 1
      exit 0
    }
  ' "$file"
}

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
    local title="" slug="" date="" tags="" excerpt="" url="" status="" links=""

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
          links)  links="$value" ;;
        esac
      fi
    done < "$file"

    # Skip files without required fields
    if [ -z "$title" ] || [ -z "$slug" ] || [ -z "$date" ]; then
      echo "  Skipping $(basename "$file") — missing required fields"
      continue
    fi

    if ! check_no_leading_h1 "$file"; then
      echo "  ERROR: $(basename "$file") starts with a leading '# Heading'." >&2
      echo "         The page already renders the title from front matter; remove the H1." >&2
      HAS_LEADING_H1=true
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
      if [ -n "$links" ]; then
        local json_links
        json_links=$(printf '%s' "$links" | awk '
          {
            sub(/^[[:space:]]*\[/, "")
            sub(/\][[:space:]]*$/, "")
          }
          {
            n = split($0, entries, ",")
            out = ""
            for (i = 1; i <= n; i++) {
              entry = entries[i]
              sub(/^[[:space:]]+/, "", entry)
              sub(/[[:space:]]+$/, "", entry)
              if (entry == "") continue
              m = split(entry, parts, "|")
              label = parts[1]; sub(/^[[:space:]]+/, "", label); sub(/[[:space:]]+$/, "", label)
              link  = parts[2]; sub(/^[[:space:]]+/, "", link);  sub(/[[:space:]]+$/, "", link)
              type  = (m >= 3 ? parts[3] : "")
              sub(/^[[:space:]]+/, "", type); sub(/[[:space:]]+$/, "", type)
              if (out != "") out = out ", "
              out = out "{ \"label\": \"" label "\", \"url\": \"" link "\""
              if (type != "") out = out ", \"type\": \"" type "\""
              out = out " }"
            }
            print out
          }
        ')
        [ -n "$json_links" ] && printf '    "links": [%s],\n' "$json_links" >> "$output"
      fi
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

if [ "$HAS_LEADING_H1" = true ]; then
  echo "" >&2
  echo "One or more files have a leading H1 and were skipped. Fix and re-run." >&2
  exit 1
fi

echo "All manifests generated successfully."
