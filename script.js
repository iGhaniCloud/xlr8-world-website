// Sticky nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// Scroll-triggered fade-up animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

const animatables = [
  '.service-card', '.work-card', '.testi-card',
  '.process-step', '.about__stat-card', '.pillar',
  '.hero__badge', '.hero__headline', '.hero__sub',
  '.hero__actions', '.hero__stats', '.section-title',
  '.section-sub', '.section-label'
];

document.querySelectorAll(animatables.join(',')).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Contact form — Formspree
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type=submit]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/xwvyrvpa', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });

    if (res.ok) {
      form.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
      btn.style.display = 'none';
      formSuccess.style.display = 'flex';
    } else {
      const data = await res.json();
      const msg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong. Please try again.';
      alert(msg);
      btn.textContent = 'Send My Free Audit Request';
      btn.disabled = false;
    }
  } catch {
    alert('Network error — please check your connection and try again.');
    btn.textContent = 'Send My Free Audit Request';
    btn.disabled = false;
  }
});

// Animated count-up for stat numbers
function animateCount(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  const frame = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = isFloat ? (eased * target).toFixed(1) : Math.floor(eased * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.dataset.count;
      const suffix = el.dataset.suffix || '';
      animateCount(el, parseFloat(raw), suffix);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));
