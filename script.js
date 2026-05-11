/* ================================================================
   ECHOES OF ISOLATION — MAIN JAVASCRIPT
   Horror Cinematic AAA Game Portfolio
================================================================ */

'use strict';

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let trailX = 0, trailY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
  curX = e.clientX;
  curY = e.clientY;
  cursor.style.left = curX + 'px';
  cursor.style.top = curY + 'px';
});

function animateTrail() {
  trailX += (curX - trailX) * 0.12;
  trailY += (curY - trailY) * 0.12;
  trail.style.left = trailX + 'px';
  trail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .feature-card, .enemy-card, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
  });
});

// ── NAVBAR SCROLL ──
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile nav
      const navCollapse = document.querySelector('.navbar-collapse');
      if (navCollapse.classList.contains('show')) {
        navCollapse.classList.remove('show');
      }
    }
  });
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('revealed');
      }, delay);
      revealObserver.unobserve(el);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-timeline').forEach(el => {
  revealObserver.observe(el);
});

// ── COUNTER ANIMATION ──
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const duration = 1800;
      const step = target / (duration / 16);

      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };

      setTimeout(() => requestAnimationFrame(update), 400);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ── TECH BAR ANIMATION ──
const techObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.tech-fill').forEach((bar, i) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, i * 100 + 200);
      });
      techObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const techSection = document.querySelector('.tech-section');
if (techSection) techObserver.observe(techSection);

// ── FOG / PARTICLE CANVAS ──
const canvas = document.getElementById('fogCanvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

class FogParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.radius = Math.random() * 120 + 40;
    this.opacity = Math.random() * 0.06 + 0.01;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 400 + 200;
    this.color = Math.random() > 0.7 ? '139, 0, 0' : '20, 20, 20';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;

    if (this.life > this.maxLife ||
        this.x < -this.radius || this.x > W + this.radius ||
        this.y < -this.radius || this.y > H + this.radius) {
      this.reset();
    }
  }

  draw() {
    const progress = this.life / this.maxLife;
    const fade = Math.sin(progress * Math.PI);
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity * fade})`);
    gradient.addColorStop(1, `rgba(${this.color}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Spark {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -Math.random() * 0.3 - 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife) this.reset();
  }

  draw() {
    const fade = 1 - this.life / this.maxLife;
    ctx.globalAlpha = this.opacity * fade;
    ctx.fillStyle = `rgb(255, ${Math.floor(Math.random() * 30)}, 30)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const fogParticles = Array.from({ length: 18 }, () => new FogParticle());
const sparks = Array.from({ length: 25 }, () => new Spark());

function animateFog() {
  ctx.clearRect(0, 0, W, H);

  fogParticles.forEach(p => { p.update(); p.draw(); });
  sparks.forEach(s => { s.update(); s.draw(); });

  requestAnimationFrame(animateFog);
}
animateFog();

// ── HERO TITLE GLITCH ──
const titleLines = document.querySelectorAll('.title-line');

function glitchEffect() {
  const line = titleLines[Math.floor(Math.random() * titleLines.length)];
  if (!line) return;

  const original = line.style.transform;
  const shift = (Math.random() - 0.5) * 6;
  line.style.transform = `translateX(${shift}px)`;
  line.style.textShadow = `${shift * 2}px 0 rgba(255,59,79,0.8), ${-shift}px 0 rgba(0,200,255,0.3)`;

  setTimeout(() => {
    line.style.transform = original || '';
    line.style.textShadow = '';
  }, 80 + Math.random() * 60);
}

function scheduleGlitch() {
  setTimeout(() => {
    glitchEffect();
    if (Math.random() > 0.4) {
      setTimeout(glitchEffect, 90);
    }
    scheduleGlitch();
  }, 3000 + Math.random() * 5000);
}

scheduleGlitch();

// ── ENEMY CARD AUDIO VISUALIZER ──
document.querySelectorAll('.enemy-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.setProperty('--flicker', '1');
  });
  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--flicker');
  });
});

// ── GALLERY ITEM PARALLAX ──
const galleryItems = document.querySelectorAll('.gallery-item');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  galleryItems.forEach((item, i) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const speed = 0.03 * (i % 3 === 0 ? 1 : -1);
      const offset = (rect.top - window.innerHeight / 2) * speed;
      item.querySelector('.gallery-img').style.transform = `scale(1) translateY(${offset}px)`;
    }
  });
});

// ── FEATURE CARD MOUSE TRACKING GLOW ──
document.querySelectorAll('.feature-card, .overview-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const glow = card.querySelector('.fc-glow');
    if (glow) {
      glow.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,59,79,0.12), transparent 60%)`;
    }
  });
});

// ── TIMELINE PROGRESS REVEAL ──
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.reveal-timeline');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('revealed'), i * 150);
      });
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const timelineEl = document.querySelector('.gameplay-timeline');
if (timelineEl) timelineObserver.observe(timelineEl);

// ── SOUND WAVE ANIMATION ON MIC ──
const micPulse = document.querySelector('.mic-pulse');
if (micPulse) {
  let intensity = 1;
  setInterval(() => {
    intensity = 0.8 + Math.random() * 0.4;
    micPulse.style.transform = `scale(${intensity})`;
    setTimeout(() => {
      micPulse.style.transform = 'scale(1)';
    }, 100);
  }, 600 + Math.random() * 400);
}

// ── COMING SOON MODAL ──
function showComingSoon() {
  const modal = document.getElementById('comingSoonModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideComingSoon() {
  const modal = document.getElementById('comingSoonModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

async function submitEmail() {
  const input = document.querySelector('.cs-input');
  const email = input ? input.value.trim() : '';

  if (!email || !email.includes('@')) {
    input.style.borderColor = 'rgba(255,59,79,0.8)';
    input.placeholder = 'Enter a valid email address';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'Enter your email address';
    }, 2000);
    return;
  }

  const btn = document.querySelector('.cs-input-group .btn-horror');
  const btnText = btn.querySelector('.btn-text');
  btnText.textContent = 'SENDING...';
  btn.disabled = true;

  try {
    await fetch('https://huzaifa2510.app.n8n.cloud/webhook/5e769a0b-8824-486a-896a-6e359f598afe', {
      method: 'POST',
      mode: 'no-cors',                          // 👈 KEY FIX
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        timestamp: new Date().toISOString(),
        source: 'Echoes of Isolation - Coming Soon Modal'
      }),
    });

    // no-cors won't throw on success, so we assume success here
    btnText.textContent = 'REGISTERED!';
    document.querySelector('.cs-bottom').textContent = '✓ Your soul is registered. We\'ll be in touch.';
    input.value = '';

    setTimeout(() => {
      hideComingSoon();
      btnText.textContent = 'NOTIFY ME';
      btn.disabled = false;
      document.querySelector('.cs-bottom').textContent = 'Your soul is registered. We\'ll be in touch.';
    }, 1800);

  } catch (err) {
    btnText.textContent = 'NOTIFY ME';
    btn.disabled = false;
    document.querySelector('.cs-bottom').textContent = 'Something went wrong. Try again.';
  }
}

// Close modal on overlay click
document.getElementById('comingSoonModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) hideComingSoon();
});

// ESC key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideComingSoon();
});

// ── STATIC NOISE FLICKER ──
const staticEl = document.querySelector('.static-noise');
if (staticEl) {
  function flickerNoise() {
    staticEl.style.opacity = 0.3 + Math.random() * 0.4;
    setTimeout(flickerNoise, 100 + Math.random() * 300);
  }
  flickerNoise();
}

// ── NAVBAR ACTIVE SECTION HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => sectionObserver.observe(section));

// ── PRICE CARD HOVER RIPPLE ──
document.querySelectorAll('.price-card button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: 10px; height: 10px;
      border-radius: 50%;
      background: rgba(255,59,79,0.3);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: ripple-out 0.6s ease-out forwards;
      pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe via style tag
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-out {
    to { transform: translate(-50%, -50%) scale(30); opacity: 0; }
  }
  .nav-link.active { color: var(--white) !important; }
  .nav-link.active::after { transform: scaleX(1); }
`;
document.head.appendChild(style);

// ── HERO PARALLAX ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');

  if (heroBg && scrolled < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.7);
  }
});

// ── MULTIPLAYER PLAYER ICONS PULSE ──
const mpPlayers = document.querySelectorAll('.mp-player-icon');
setInterval(() => {
  const randomIndex = Math.floor(Math.random() * mpPlayers.length);
  const el = mpPlayers[randomIndex];
  el.style.background = 'rgba(255,59,79,0.15)';
  el.style.borderColor = 'rgba(255,59,79,0.4)';
  setTimeout(() => {
    el.style.background = '';
    el.style.borderColor = '';
  }, 300);
}, 1200);

// ── INTRO FRAME SCAN LINE ──
const introFrame = document.querySelector('.intro-frame');
if (introFrame) {
  const scanLine = document.createElement('div');
  scanLine.style.cssText = `
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255,59,79,0.4), transparent);
    animation: scan-down 4s linear infinite;
    pointer-events: none;
    z-index: 3;
  `;
  introFrame.appendChild(scanLine);

  const scanStyle = document.createElement('style');
  scanStyle.textContent = `
    @keyframes scan-down {
      0% { top: 0; opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
  `;
  document.head.appendChild(scanStyle);
}

// ── INIT LOG ──
console.log(
  '%c ECHOES OF ISOLATION ',
  'background:#ff3b4f; color:#fff; font-family:monospace; font-size:14px; padding:8px 16px; letter-spacing:3px;'
);
console.log(
  '%c A Voice-Responsive Paranormal Horror Game\n%c Huzaifa Mumtaz & Abdullah Khalil\n%c COMSATS University Islamabad, Wah Campus',
  'color:#ff3b4f; font-family:monospace; font-size:11px;',
  'color:#aaa; font-family:monospace; font-size:11px;',
  'color:#555; font-family:monospace; font-size:10px;'
);