/**
 * Markdown Engine
 * Parses front matter and renders markdown using marked.js (loaded via CDN).
 */
const MarkdownEngine = (() => {
  /**
   * Parse YAML-like front matter from markdown content.
   * Returns { meta: {}, content: 'markdown body' }
   */
  function parseFrontMatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, content: raw };

    const meta = {};
    const lines = match[1].split('\n');
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();

      // Parse arrays: [item1, item2]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      meta[key] = value;
    }

    return { meta, content: match[2] };
  }

  /**
   * Render markdown string to HTML using marked.js.
   * marked must be loaded via CDN before calling this.
   */
  function render(markdown) {
    if (typeof marked === 'undefined') {
      console.error('marked.js is not loaded. Include it via CDN.');
      return markdown;
    }
    return marked.parse(markdown);
  }

  /**
   * Fetch a markdown file, parse front matter, and render to HTML.
   */
  async function loadAndRender(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      const { meta, content } = parseFrontMatter(raw);
      const html = render(content);
      return { meta, html };
    } catch (e) {
      console.error('Failed to load markdown:', url, e);
      return null;
    }
  }

  return { parseFrontMatter, render, loadAndRender };
})();
