/**
 * Site Links
 * Populates [data-social] elements (links to LinkedIn/GitHub/Twitter/email)
 * from content/site.json. Add data-social-text to also overwrite the visible
 * text with the value from site.json.
 */
(async () => {
  if (typeof SiteConfig === 'undefined') return;
  const data = await SiteConfig.load();
  if (!data) return;
  const socials = data.socials || {};
  const email = data.email;

  document.querySelectorAll('[data-social]').forEach((el) => {
    const key = el.dataset.social;
    const value = key === 'email' ? email : socials[key];
    if (!value) return;
    el.href = key === 'email' ? 'mailto:' + value : value;
    if (el.hasAttribute('data-social-text')) {
      el.textContent = value;
    }
  });
})();
