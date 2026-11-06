/**
 * Google Analytics 4
 * Set GA_MEASUREMENT_ID to your property's Measurement ID (looks like G-XXXXXXXXXX).
 * Until then, this file does nothing.
 */
(function () {
  var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  if (!/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);
})();
