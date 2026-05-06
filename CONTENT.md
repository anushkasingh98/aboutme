# Content Editing Guide

Everything you need to know to update this site without touching HTML or CSS. All page content lives in markdown files under `content/` — edit those, save, refresh. That's it.

> **Heads up:** because pages fetch markdown at runtime, you can't preview by double-clicking an HTML file. Run a local server first (see [Previewing locally](#previewing-locally) below).

## Table of contents

- [The big picture](#the-big-picture)
- [Blog posts](#blog-posts)
- [Projects](#projects)
- [Journey timeline](#journey-timeline)
- [Adding images](#adding-images)
- [Markdown cheat sheet](#markdown-cheat-sheet)
- [Previewing locally](#previewing-locally)
- [Common gotchas](#common-gotchas)

## The big picture

Three pages on this site are driven by markdown files:

| Page          | Source folder                | Manifest required?           | One file per entry?       |
| ------------- | ---------------------------- | ---------------------------- | ------------------------- |
| Blog          | `content/blog/`              | yes (auto-generated)         | yes                       |
| Projects      | `content/projects/`          | yes (auto-generated)         | yes                       |
| Journey       | `content/journey.md` (single) | no                          | no — all entries in one file |

Blog and projects use **front matter** (a YAML-ish header at the top of each file) plus a manifest file (`*-manifest.json`) that the listing pages read. The manifest is regenerated from a script — you never edit it by hand.

The journey page reads one markdown file directly, so there's no manifest step.

## Blog posts

### Add a new post

1. Create a new file in `content/blog/`. Name it after the slug, e.g. `content/blog/my-new-post.md`.
2. Add front matter and content:

   ```markdown
   ---
   title: What I Learned Debugging COBOL at 3am
   slug: cobol-at-3am
   date: 2026-04-12
   tags: [cobol, debugging, war-stories]
   excerpt: A short, plain-text summary that shows up on the blog index card.
   ---

   # What I Learned Debugging COBOL at 3am

   Your post body here. **Markdown** is fully supported.
   ```

3. Regenerate the manifest:

   ```bash
   ./generate-manifest.sh
   ```

4. The post is now live at `blog.html` (in the listing) and at `post.html?slug=cobol-at-3am` (the full post page).

### Edit an existing post

Just edit the file in `content/blog/`. If you change `title`, `date`, `tags`, or `excerpt`, run `./generate-manifest.sh` again so the listing card picks up the new metadata. If you only edited the body, no manifest rebuild is needed.

### Front matter fields

| Field     | Required | Format                         | Notes                                           |
| --------- | -------- | ------------------------------ | ----------------------------------------------- |
| `title`   | yes      | one line of text               | Shown on the card and at the top of the post.   |
| `slug`    | yes      | lowercase-with-dashes          | Becomes the URL: `post.html?slug=<slug>`. **Don't change this after publishing** — it breaks links. |
| `date`    | yes      | `YYYY-MM-DD`                   | Used for sorting (newest first) and display.    |
| `tags`    | recommended | `[tag1, tag2, tag3]`        | Powers the tag filter on `blog.html`.           |
| `excerpt` | recommended | one line of plain text      | Shown on the listing card. **No markdown — keep it plain.** |

## Projects

Same shape as blog posts, but in `content/projects/` with two extra optional fields.

### Add a new project

1. Create a new file in `content/projects/`, e.g. `content/projects/my-side-project.md`:

   ```markdown
   ---
   title: My Side Project
   slug: my-side-project
   date: 2026-03-01
   tags: [ai, side-project]
   excerpt: One-line description shown on the project card.
   url: https://my-side-project.example.com
   status: active
   ---

   # My Side Project

   The full writeup. **Markdown** rules apply.
   ```

2. Regenerate the manifest:

   ```bash
   ./generate-manifest.sh
   ```

3. It appears at `projects.html` and at `project.html?slug=my-side-project`.

### Project-only fields

| Field    | Required | Format        | Notes                                                                |
| -------- | -------- | ------------- | -------------------------------------------------------------------- |
| `url`    | optional | full URL      | External link to the live project / repo.                            |
| `status` | optional | text label    | E.g. `active`, `shipped`, `archived`, `simmering`. Shown as a pill on the card. |

All other fields (`title`, `slug`, `date`, `tags`, `excerpt`) work the same as blog posts.

## Journey timeline

The journey page (`journey.html`) reads from **one file**: `content/journey.md`. Add, edit, or delete entries there — no manifest, no script to run.

### File structure

```markdown
# The Journey

Optional intro paragraph. The first paragraph after the H1 becomes the
page tagline at the top.

---
date: 2026-05
tag: today-ish
title: Kathalyst hits its stride
---

The body of this entry. **Bold** and *italic* and [links](https://example.com)
all work. Multiple paragraphs are fine — just leave a blank line between them.

---
date: 2026-02
tag: hired
title: First full-time hire
---

The body of the next entry...
```

### Rules

- Each entry is a meta block (between two `---` lines) followed by the body.
- Entries are **sorted automatically** by `date`, newest first. You can paste a new entry anywhere in the file — order doesn't matter.
- The very oldest entry automatically gets the filled "origin story" marker styling.
- HTML comments (`<!-- ... -->`) are stripped before rendering, so feel free to leave editing notes in the file.

### Per-entry fields

| Field   | Required | Format                                | Notes                                              |
| ------- | -------- | ------------------------------------- | -------------------------------------------------- |
| `date`  | yes      | `YYYY-MM` or `YYYY-MM-DD` or `YYYY`   | Drives sorting and the year/month rendered on the left rail. |
| `title` | yes      | one line of text                      | Shown as the entry headline.                       |
| `tag`   | optional | short label (e.g. `shipped`, `quit`)  | Renders as a `// tag` pill above the title.        |

### Add a new entry

1. Open `content/journey.md`.
2. Paste a new block (anywhere — sort happens automatically):

   ```markdown
   ---
   date: 2026-08
   tag: launched
   title: Open-sourced the COBOL → docs pipeline
   ---

   Released the internal tool we'd been using on client engagements. **Two thousand stars in a week.**
   The inbound from this single tweet outran six months of sales calls.
   ```

3. Save. Refresh the page.

## Adding images

Images live in the existing `assets/` folder at the repo root. To keep things tidy, group them by content type:

```
assets/
├── blog/
│   └── cobol-at-3am-screenshot.png
├── projects/
│   └── my-side-project-hero.jpg
└── journey/
    └── 2025-launch-day.jpg
```

(The folder doesn't have to exist beforehand — just create it when you need it.)

### In a blog post or project

Use standard markdown image syntax. Paths are relative to the **site root**:

```markdown
![Alt text describing the image](assets/blog/cobol-at-3am-screenshot.png)
```

You can also use HTML if you need a caption or specific sizing:

```markdown
<figure>
  <img src="assets/blog/cobol-at-3am-screenshot.png" alt="Mainframe terminal showing 3am timestamp">
  <figcaption>3:14 am. The exact moment I gave up on understanding GOTO.</figcaption>
</figure>
```

Images are automatically responsive (capped at the post's max width and scaled proportionally) — that's a global rule in `css/style.css`.

### In a journey entry

Same syntax — markdown image tags work inside journey entry bodies:

```markdown
---
date: 2025-10
tag: shipped
title: First six-figure contract signed
---

![The signed SOW, redacted](assets/journey/2025-sow-signed.jpg)

A regional bank wanted their COBOL claims system mapped...
```

### File format tips

- **Photos:** JPEG (`.jpg`) — smaller files, fine for non-transparent images.
- **Screenshots / diagrams:** PNG (`.png`) — keeps text crisp.
- **Animations:** GIF or MP4 (`<video>` tag for MP4).
- **Compress before committing.** A 4 MB hero image will tank load times. Aim for under 300 KB for body images. Tools: [Squoosh](https://squoosh.app/), `pngquant`, `jpegoptim`.

### Filenames

- Lowercase, hyphens-not-spaces (`my-image.jpg`, not `My Image.JPG`).
- Spaces and special characters in filenames will break URLs in some browsers.

## Markdown cheat sheet

Everything below works in blog posts, projects, and journey entries (rendered by [marked.js](https://marked.js.org/)).

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text* and ***both***.

[Link text](https://example.com)
![Image alt](assets/path/to/image.png)

- Bullet list item
- Another item
  - Nested item

1. Numbered list
2. Second item

> Blockquote — for quotes or callouts.

`inline code` and code blocks:

​```python
def hello():
    print("hi")
​```

---

(A line of three dashes is a horizontal rule — but **don't** use them inside `journey.md`, since `---` is the entry separator there.)
```

## Previewing locally

Because the pages `fetch()` markdown and JSON files at runtime, opening an HTML file directly via `file://` will fail (browsers block it for security). Run a tiny local server from the repo root:

```bash
# Python (built in on macOS / Linux)
python3 -m http.server 8000

# Node (no install needed)
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000/` in your browser.

## Common gotchas

- **"My new post doesn't show up on the blog page."** Did you run `./generate-manifest.sh`? The script must be re-run any time you add, rename, or change front matter on a blog/project file. Journey doesn't need this.
- **"My image is broken."** Paths are relative to the site root, not the markdown file. Use `assets/blog/foo.png`, not `../assets/foo.png`.
- **"My slug stopped working."** Slugs become URLs. If you rename a file or change the `slug` field, any link to the old slug 404s. Pick a slug at publish time and don't change it.
- **"My excerpt has weird characters in the listing."** The excerpt is plain text — markdown formatting (`**bold**`, `[links]`, etc.) renders as literal characters. Keep it simple.
- **"My journey entry is in the wrong order."** Check the `date` field — entries sort by it, newest first. `2025-3` beats `2025-03` only by string comparison; pad single-digit months: write `2025-03`, not `2025-3`.
- **"I see `// loading journey from content/journey.md ...` and it never goes away."** You're previewing without a local server, or `journey.md` has a parse error. Open the browser console (F12) for the actual error.
- **"My code block isn't rendering."** You need a blank line before and after the triple-backtick fence, and the language tag goes right after the opening backticks (no space): ` ```python `, not ` ``` python `.

## When in doubt

Look at an existing file in `content/blog/` or `content/projects/` — copy it, change the fields, write your content. The patterns are short on purpose.
