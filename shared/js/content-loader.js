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
  let _activeTag = 'all';
  let _searchQuery = '';

  /**
   * Initialize the content loader.
   * @param {Object} opts
   * @param {string} opts.manifestUrl - URL to the manifest JSON
   * @param {string} opts.containerSelector - CSS selector for the card container
   * @param {Function} opts.templateFn - (item) => HTML string for each card
   * @param {string} [opts.defaultTag] - Optional default tag filter
   * @param {string} [opts.searchSelector] - CSS selector for a search input
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
        _activeTag = opts.defaultTag;
      }
      applyFilters();

      // Initialize tag filter if TagFilter is available
      if (typeof TagFilter !== 'undefined') {
        const allTags = getAllTags();
        TagFilter.init({
          tags: allTags,
          onFilter: filterByTag,
          containerSelector: opts.tagContainerSelector || '.tag-filters'
        });
      }

      // Wire up search input if one was provided
      if (opts.searchSelector) {
        const input = document.querySelector(opts.searchSelector);
        if (input) {
          input.addEventListener('input', (e) => setSearch(e.target.value));
        }
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
    _activeTag = tag || 'all';
    applyFilters();
  }

  function setSearch(query) {
    _searchQuery = (query || '').trim().toLowerCase();
    applyFilters();
  }

  function matchesSearch(item) {
    if (!_searchQuery) return true;
    const haystack = [
      item.title,
      item.excerpt,
      item.status,
      ...(item.tags || [])
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(_searchQuery);
  }

  function applyFilters() {
    _filteredItems = _items.filter(item => {
      const tagOk = !_activeTag || _activeTag === 'all'
        || (item.tags && item.tags.includes(_activeTag));
      return tagOk && matchesSearch(item);
    });
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

  return { init, filterByTag, setSearch, getAllTags, getItems, getFilteredItems };
})();
