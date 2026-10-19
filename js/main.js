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
  '.process-grid img',
  '.gallery-slider-shell',
  '.gallery-browse img',
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

const slider = document.querySelector('[data-gallery-slider]');
if (slider) {
  const track = slider.querySelector('.gallery-slider-track');
  const slides = [...slider.querySelectorAll('.gallery-slide')];
  const prev = slider.querySelector('.gallery-slider-btn.prev');
  const next = slider.querySelector('.gallery-slider-btn.next');
  const dotsWrap = slider.parentElement.querySelector('.gallery-slider-controls');
  let current = 0;
  let timer = null;
  let touchStartX = 0;
  let touchDeltaX = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `gallery-dot${index === 0 ? ' active' : ''}`;
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to gallery image ${index + 1}`);
    dot.addEventListener('click', () => {
      goTo(index);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.querySelectorAll('.gallery-dot')];

  const goTo = index => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
  };

  const stopAutoplay = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const startAutoplay = () => {
    if (prefersReducedMotion || slides.length < 2) return;
    stopAutoplay();
    timer = setInterval(() => goTo(current + 1), 5000);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  prev?.addEventListener('click', () => {
    goTo(current - 1);
    restartAutoplay();
  });

  next?.addEventListener('click', () => {
    goTo(current + 1);
    restartAutoplay();
  });

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  slider.addEventListener('touchstart', event => {
    touchStartX = event.touches[0].clientX;
    touchDeltaX = 0;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchmove', event => {
    touchDeltaX = event.touches[0].clientX - touchStartX;
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) > 50) goTo(current + (touchDeltaX < 0 ? 1 : -1));
    startAutoplay();
  });

  goTo(0);
  startAutoplay();
}

window.addEventListener('load', () => {
  document.body.classList.add('page-ready');
});
