const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const header = document.querySelector('header');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('header-scrolled', window.scrollY > 8);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealTargets = [
  '.hero .eyebrow',
  '.hero h1',
  '.hero p',
  '.hero-actions',
  '.section-head',
  '.card',
  '.split > *',
  '.gallery-grid img',
  '.cta-band',
  '.check',
  '.pill',
  '.quote-form'
];

const elements = [...document.querySelectorAll(revealTargets.join(','))];

const grouped = new Map();
elements.forEach(el => {
  const parent = el.parentElement;
  const siblings = grouped.get(parent) || [];
  siblings.push(el);
  grouped.set(parent, siblings);
});

grouped.forEach(group => {
  group.forEach((el, index) => {
    el.classList.add('reveal');
    if (index > 0 && index < 5) el.classList.add(`reveal-delay-${index}`);
  });
});

document.querySelectorAll('.split').forEach(split => {
  const children = split.children;
  if (children[0]) children[0].classList.add('reveal-left');
  if (children[1]) children[1].classList.add('reveal-right');
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  elements.forEach(el => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -80px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

window.addEventListener('load', () => {
  document.body.classList.add('page-ready');
});
