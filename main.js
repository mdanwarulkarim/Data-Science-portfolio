/* ═══════════════════════════════════════════════
   MAIN.JS — Portfolio Interactive Logic
═══════════════════════════════════════════════ */

// ── Custom Cursor ──────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, .skill-category').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '18px'; cursor.style.height = '18px';
    follower.style.width = '48px'; follower.style.height = '48px';
    follower.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px'; cursor.style.height = '10px';
    follower.style.width = '32px'; follower.style.height = '32px';
    follower.style.opacity = '0.6';
  });
});

// ── Navbar scroll effect ───────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Hamburger menu ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Typing animation ───────────────────────────
const roles = [
  'Data Scientist',
  'Business Intelligence Analyst',
  'ML Engineer',
  'SQL Developer',
  'Power BI Developer',
  'Data Analyst',
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const roleEl = document.getElementById('roleText');

function typeRole() {
  const current = roles[roleIndex];
  if (isDeleting) {
    roleEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(typeRole, 400); return; }
    setTimeout(typeRole, 50);
  } else {
    roleEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) { isDeleting = true; setTimeout(typeRole, 1800); return; }
    setTimeout(typeRole, 80);
  }
}
setTimeout(typeRole, 800);

// ── Particle Canvas ────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [], animId;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,195,255,${this.a})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  particles = Array.from({ length: Math.min(count, 100) }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,195,255,${0.12 * (1 - dist/130)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ── Skill bar animation (IntersectionObserver) ─
const skillsSection = document.getElementById('skills');
const skillFills    = document.querySelectorAll('.skill-fill');
let skillsAnimated  = false;

const skillObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !skillsAnimated) {
    skillsAnimated = true;
    skillFills.forEach(fill => {
      const w = fill.getAttribute('data-w');
      setTimeout(() => { fill.style.width = w + '%'; }, 200);
    });
  }
}, { threshold: 0.3 });
skillObserver.observe(skillsSection);

// ── Reveal on scroll ───────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ── Project card expand/collapse ───────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const isExpanded = card.classList.contains('expanded');
    document.querySelectorAll('.project-card.expanded').forEach(c => c.classList.remove('expanded'));
    if (!isExpanded) card.classList.add('expanded');
  });
});

// ── Contact form → mailto ──────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('fname').value;
  const email   = document.getElementById('femail').value;
  const subject = document.getElementById('fsubject').value || 'Portfolio Inquiry';
  const message = document.getElementById('fmessage').value;
  const mailto  = `mailto:karim247live@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Karim,\n\n${message}\n\nBest regards,\n${name}\n${email}`)}`;
  window.location.href = mailto;
});

// ── Active nav link on scroll ──────────────────
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
  });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
  });
});

// ── Back to top visibility ─────────────────────
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.style.opacity = window.scrollY > 500 ? '1' : '0';
});
