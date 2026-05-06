/**
 * Tag Filter
 * Renders tag buttons and handles filter state.
 */
const TagFilter = (() => {
  let _activeTag = 'all';
  let _onFilter = null;
  let _container = null;

  /**
   * Initialize tag filter UI.
   * @param {Object} opts
   * @param {string[]} opts.tags - Array of tag strings
   * @param {Function} opts.onFilter - Callback when a tag is selected
   * @param {string} opts.containerSelector - CSS selector for the tag container
   */
  function init(opts) {
    _onFilter = opts.onFilter;
    _container = document.querySelector(opts.containerSelector);

    if (!_container) return;

    const tags = ['all', ...opts.tags];
    _container.innerHTML = tags.map(tag =>
      `<button class="tag-btn${tag === _activeTag ? ' active' : ''}" data-tag="${tag}">${tag}</button>`
    ).join('');

    _container.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-btn');
      if (!btn) return;

      const tag = btn.dataset.tag;
      setActive(tag);
    });
  }

  function setActive(tag) {
    _activeTag = tag;
    if (_container) {
      _container.querySelectorAll('.tag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === tag);
      });
    }
    if (_onFilter) _onFilter(tag);
  }

  function getActive() {
    return _activeTag;
  }

  return { init, setActive, getActive };
})();
