# Anushka Singh — Personal Website

Personal website for Anushka Singh — founder of Kathalyst, AI consultant, legacy modernization specialist, and Kathak dancer. Built with a PostHog-inspired playful design featuring monospace typography, witty microcopy, doodle borders, and warm personality.

## Quick Start

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd aboutme
   ```

2. **Serve locally** (needed for fetch requests to work)
   ```bash
   # Python
   python3 -m http.server 8000

   # Node
   npx serve .

   # PHP
   php -S localhost:8000
   ```

3. **Open the site** — navigate to `http://localhost:8000/`

## Project Structure

```
├── index.html                  # Home
├── services.html               # Services
├── projects.html               # Projects listing
├── project.html                # Single project page (query-param routed)
├── blog.html                   # Blog listing
├── post.html                   # Single blog post (query-param routed)
├── journey.html                # Journey timeline
├── dance.html                  # Kathak / dance
├── about.html                  # About
├── 404.html
├── css/
│   ├── variables.css           # Design tokens (colors, fonts, spacing)
│   ├── style.css               # Main styles
│   └── responsive.css          # Media queries
├── js/
│   └── main.js                 # Interactions + card templates
├── content/                    # Markdown-driven content
│   ├── site.json               # Site-wide info, services, social links
│   ├── blog-manifest.json      # Blog post index
│   ├── projects-manifest.json  # Project index
│   ├── blog/                   # Blog posts (markdown)
│   └── projects/               # Project writeups (markdown)
├── shared/js/                  # Shared JavaScript modules
│   ├── site-config.js          # Loads site.json
│   ├── markdown-engine.js      # Front matter parser + marked.js wrapper
│   ├── content-loader.js       # Loads manifest, renders cards with templateFn
│   ├── tag-filter.js           # Tag filtering UI
│   └── router.js               # Query-param routing for single pages
├── assets/                     # Images and static assets
├── generate-manifest.sh        # Rebuild manifests from .md files
├── CONTENT.md                  # Guide for editing site content
└── README.md
```

## How It Works

- **Markdown rendering** — uses [marked.js](https://marked.js.org/) via CDN, with a custom front-matter parser
- **Routing** — single post/project pages use query parameters (`post.html?slug=my-post`)
- **Tag filtering** — `ContentLoader` + `TagFilter` handle filtering; the design provides its own card template function
- **No build step** — pure HTML/CSS/JS, just serve and go

## Technologies

- HTML5 + CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (ES6+)
- [marked.js](https://marked.js.org/) for markdown rendering
- Google Fonts (Space Grotesk + Space Mono)
- No frameworks, no build tools, no dependencies to install

## License

Personal use. All content is specific to Anushka Singh.
