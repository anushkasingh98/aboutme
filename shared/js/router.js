/**
 * Router
 * Simple query-param based routing for single-post/project pages.
 * Usage: post.html?slug=my-post loads content/blog/my-post.md
 */
const Router = (() => {
  /**
   * Get a query parameter value.
   */
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  /**
   * Load a single content item by slug from a manifest.
   * @param {Object} opts
   * @param {string} opts.manifestUrl - URL to the manifest JSON
   * @param {string} opts.slug - The slug to look up
   * @param {string} opts.contentBase - Base path for content files
   * @param {Function} opts.renderFn - (item, html) => void to render the content
   * @param {Function} [opts.notFoundFn] - Called if slug not found
   */
  async function loadBySlug(opts) {
    const slug = opts.slug || getParam('slug');
    if (!slug) {
      if (opts.notFoundFn) opts.notFoundFn();
      return;
    }

    try {
      const res = await fetch(opts.manifestUrl);
      const manifest = await res.json();
      const item = manifest.find(i => i.slug === slug);

      if (!item) {
        if (opts.notFoundFn) opts.notFoundFn();
        return;
      }

      const result = await MarkdownEngine.loadAndRender(opts.contentBase + item.file);
      if (result) {
        opts.renderFn(item, result.html);
      } else {
        if (opts.notFoundFn) opts.notFoundFn();
      }
    } catch (e) {
      console.error('Router: Failed to load content:', e);
      if (opts.notFoundFn) opts.notFoundFn();
    }
  }

  /**
   * Format a date string for display.
   */
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return { getParam, loadBySlug, formatDate };
})();
