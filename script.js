/* ===== SCROLL PROGRESS BAR ===== */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
});

/* ===== STICKY NAV ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== MOBILE HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: 0,
      maxOpacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '141,198,63' : '247,148,29',
      life: 0,
      maxLife: Math.random() * 200 + 150,
    };
  }

  for (let i = 0; i < 60; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height;
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.life++;
      p.y -= p.speedY;
      p.x += p.speedX;
      p.opacity = p.life < 30
        ? (p.life / 30) * p.maxOpacity
        : p.life > p.maxLife - 30
          ? ((p.maxLife - p.life) / 30) * p.maxOpacity
          : p.maxOpacity;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();

      if (p.life >= p.maxLife) particles[i] = createParticle();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ===== SCROLL-TRIGGERED FADE-UP ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

const animatables = [
  '.service-card', '.work-card', '.testi-card', '.process-step',
  '.about__stat-card', '.pillar', '.hero__badge', '.hero__headline',
  '.hero__sub', '.hero__actions', '.hero__stats', '.section-title',
  '.section-sub', '.section-label', '.partner-badge', '.feature-card',
  '.blog-card', '.job-card', '.contact__info-item'
];

document.querySelectorAll(animatables.join(',')).forEach((el, i) => {
  el.classList.add('fade-up');
  el.dataset.delay = (i % 6) * 80;
  observer.observe(el);
});

/* ===== ANIMATED NUMBER COUNTERS ===== */
function animateCount(el, target, suffix = '', prefix = '') {
  const duration = 2000;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  const frame = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const val = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target).toLocaleString();
    el.textContent = prefix + val + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCount(el, parseFloat(el.dataset.count), el.dataset.suffix || '', el.dataset.prefix || '');
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ===== HERO STAT COUNTERS ===== */
const heroStats = [
  { selector: '.hero__stats .stat__num:nth-child(1)', target: 2700, suffix: '+', label: 'Positive Reviews' },
];

/* Animate hero stats on load */
const heroStatNums = document.querySelectorAll('.hero__stat .stat__num');
heroStatNums.forEach(el => {
  const text = el.textContent;
  const num = parseFloat(text.replace(/[^0-9.]/g, ''));
  const suffix = text.replace(/[0-9.]/g, '');
  if (!isNaN(num) && num > 0) {
    setTimeout(() => animateCount(el, num, suffix), 800);
  }
});

/* ===== BUTTON RIPPLE EFFECT ===== */
document.querySelectorAll('.btn--primary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ===== 3D CARD TILT ===== */
document.querySelectorAll('.service-card, .work-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== TYPED TEXT EFFECT FOR HERO BADGE ===== */
const badge = document.querySelector('.hero__badge');
if (badge) {
  const text = badge.textContent.trim();
  badge.textContent = '';
  badge.innerHTML = '<span class="badge__dot"></span> ';
  let i = 0;
  const typeBadge = () => {
    if (i < text.length) {
      badge.innerHTML += text[i];
      i++;
      setTimeout(typeBadge, 40);
    }
  };
  setTimeout(typeBadge, 400);
}

/* ===== CONTACT FORM — FORMSPREE ===== */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
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
        const msg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong.';
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
}

/* ===== PARALLAX ORBS ON MOUSEMOVE ===== */
document.addEventListener('mousemove', e => {
  const orbs = document.querySelectorAll('.hero__orb');
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.4;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#fff' : '';
  });
});
