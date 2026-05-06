/**
 * Design 2: PostHog-Inspired Playful — Main JS
 * Doodles, personality, and shameless CTAs.
 */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCurrentNavLink();
  initScrollShadow();
});

/**
 * Mobile nav toggle with hamburger animation.
 */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a link
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Highlight current page in nav with pill-style active state.
 */
function initCurrentNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });
}

/**
 * Add shadow to nav on scroll.
 */
function initScrollShadow() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const observer = () => {
    if (window.scrollY > 10) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', observer, { passive: true });
  observer();
}

/**
 * Template function for blog cards (used by ContentLoader).
 * Design 2: Sketchy borders, doodle corners, playful personality.
 */
function blogCardTemplate(item) {
  const date = Router.formatDate(item.date);
  const tags = item.tags ? item.tags.map(t => `<span class="card__tag">${t}</span>`).join('') : '';
  return `
    <article class="card">
      <div class="card__image">// blog visual goes here</div>
      <div class="card__body">
        <time class="card__date" datetime="${item.date}">${date}</time>
        <h3 class="card__title"><a href="post.html?slug=${item.slug}">${item.title}</a></h3>
        <p class="card__excerpt">${item.excerpt}</p>
        <div class="card__tags">${tags}</div>
      </div>
    </article>
  `;
}

/**
 * Template function for project cards.
 * Design 2: Sketchy borders with status badges.
 */
function projectCardTemplate(item) {
  const date = Router.formatDate(item.date);
  const tags = item.tags ? item.tags.map(t => `<span class="card__tag">${t}</span>`).join('') : '';
  const status = item.status ? `<span class="card__status">${item.status}</span>` : '';
  return `
    <article class="card">
      <div class="card__image">// project visual goes here</div>
      <div class="card__body">
        <time class="card__date" datetime="${item.date}">${date}</time>
        <h3 class="card__title"><a href="project.html?slug=${item.slug}">${item.title}</a></h3>
        <p class="card__excerpt">${item.excerpt}</p>
        <div class="card__tags">${status}${tags}</div>
      </div>
    </article>
  `;
}
