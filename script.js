/* ═══════════════════════════════════════════
   DEVCRAFT — SCRIPT.JS
   Navbar · Scroll Reveal · Hamburger · Smooth
═══════════════════════════════════════════ */

'use strict';

/* ── NAVBAR SCROLL ── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── HAMBURGER MENU ── */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── NAVBAR ACTIVE LINK highlight ── */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

/* ── TILT EFFECT on service / portfolio cards ── */
document.querySelectorAll('.service-card, .portfolio-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const xPct   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const yPct   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    const rotX   = (-yPct * 4).toFixed(2);
    const rotY   = ( xPct * 4).toFixed(2);
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── PRICING CARD special hover (no tilt, just glow) ── */
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

/* ── BUTTON RIPPLE ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple   = document.createElement('span');
    const rect     = this.getBoundingClientRect();
    const size     = Math.max(rect.width, rect.height);
    const x        = e.clientX - rect.left - size / 2;
    const y        = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      transform: scale(0);
      animation: ripple-anim 0.5s ease-out forwards;
      pointer-events: none;
    `;

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(2.5); opacity: 0; }
  }
  .nav-links a.active {
    color: var(--accent-blue) !important;
  }
`;
document.head.appendChild(rippleStyle);

/* ── TYPED EFFECT in hero (subtle) ── */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  heroTitle.style.opacity = '0';
  setTimeout(() => {
    heroTitle.style.transition = 'opacity 0.8s ease';
    heroTitle.style.opacity = '1';
  }, 100);
}

/* ── COUNTER ANIMATION for stats ── */
function animateCounter(el, target, duration = 1500) {
  const isText  = isNaN(parseInt(target));
  if (isText) return; // skip non-numeric

  const start     = 0;
  const startTime = performance.now();
  const suffix    = target.replace(/[0-9]/g, '');
  const numTarget = parseInt(target);

  const update = (currentTime) => {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(start + (numTarget - start) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        const text = num.textContent.trim();
        animateCounter(num, text);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ── PARALLAX on hero glows (subtle) ── */
window.addEventListener('mousemove', (e) => {
  const xPct = (e.clientX / window.innerWidth  - 0.5);
  const yPct = (e.clientY / window.innerHeight - 0.5);

  const g1 = document.querySelector('.glow-1');
  const g2 = document.querySelector('.glow-2');

  if (g1) g1.style.transform = `translate(${xPct * 20}px, ${yPct * 20}px)`;
  if (g2) g2.style.transform = `translate(${-xPct * 20}px, ${-yPct * 20}px)`;
});

console.log('%c⚡ DevCraft — Built with passion.', 
  'color: #6366f1; font-size: 14px; font-weight: bold; font-family: monospace;');
