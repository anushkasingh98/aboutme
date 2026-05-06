/**
 * Content Loader
 * Loads blog/project manifests and renders content cards.
 * Each design provides its own templateFn to control card HTML.
 */
const ContentLoader = (() => {
  let _items = [];
  let _filteredItems = [];
  let _templateFn = null;
  let _container = null;

  /**
   * Initialize the content loader.
   * @param {Object} opts
   * @param {string} opts.manifestUrl - URL to the manifest JSON
   * @param {string} opts.containerSelector - CSS selector for the card container
   * @param {Function} opts.templateFn - (item) => HTML string for each card
   * @param {string} [opts.defaultTag] - Optional default tag filter
   */
  async function init(opts) {
    _templateFn = opts.templateFn;
    _container = document.querySelector(opts.containerSelector);

    if (!_container) {
      console.error('Content container not found:', opts.containerSelector);
      return;
    }

    try {
      const res = await fetch(opts.manifestUrl);
      _items = await res.json();
      // Sort by date descending
      _items.sort((a, b) => new Date(b.date) - new Date(a.date));
      _filteredItems = [..._items];

      if (opts.defaultTag) {
        filterByTag(opts.defaultTag);
      } else {
        renderItems();
      }

      // Initialize tag filter if TagFilter is available
      if (typeof TagFilter !== 'undefined') {
        const allTags = getAllTags();
        TagFilter.init({
          tags: allTags,
          onFilter: filterByTag,
          containerSelector: opts.tagContainerSelector || '.tag-filters'
        });
      }
    } catch (e) {
      console.error('Failed to load manifest:', e);
      _container.innerHTML = '<p>Failed to load content. Please try again later.</p>';
    }
  }

  function getAllTags() {
    const tagSet = new Set();
    _items.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }

  function filterByTag(tag) {
    if (!tag || tag === 'all') {
      _filteredItems = [..._items];
    } else {
      _filteredItems = _items.filter(item =>
        item.tags && item.tags.includes(tag)
      );
    }
    renderItems();
  }

  function renderItems() {
    if (!_container || !_templateFn) return;
    if (_filteredItems.length === 0) {
      _container.innerHTML = '<p class="no-results">No items found.</p>';
      return;
    }
    _container.innerHTML = _filteredItems.map(_templateFn).join('');
  }

  function getItems() {
    return _items;
  }

  function getFilteredItems() {
    return _filteredItems;
  }

  return { init, filterByTag, getAllTags, getItems, getFilteredItems };
})();
