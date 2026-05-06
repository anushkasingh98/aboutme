/**
 * Site Configuration
 * Loads site.json and provides access to site-wide data.
 */
const SiteConfig = (() => {
  let _data = null;
  const _contentBase = getContentBase();

  function getContentBase() {
    // Detect if we're in a design-N folder and resolve content path
    const path = window.location.pathname;
    const match = path.match(/design-\d+\//);
    if (match) {
      return '../content/';
    }
    return 'content/';
  }

  async function load() {
    if (_data) return _data;
    try {
      const res = await fetch(_contentBase + 'site.json');
      _data = await res.json();
      return _data;
    } catch (e) {
      console.error('Failed to load site.json:', e);
      return null;
    }
  }

  function get(key) {
    if (!_data) {
      console.warn('SiteConfig not loaded yet. Call SiteConfig.load() first.');
      return null;
    }
    return key ? _data[key] : _data;
  }

  function contentBase() {
    return _contentBase;
  }

  return { load, get, contentBase };
})();
