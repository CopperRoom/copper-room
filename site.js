// Copper Room — shared behaviour for every page.
// Each part checks that its element exists, so pages only get what they use.

// ---------- Top bar: glass once you scroll, and the colours of the section underneath ----------
const topbar = document.getElementById('topbar');
const bands = [...document.querySelectorAll('main > section, footer')];
const themes = ['t-light', 't-copper', 't-ember'];
const onScroll = () => {
  topbar.classList.toggle('scrolled', window.scrollY > 20);
  let under = bands[0];
  for (const b of bands) if (b.getBoundingClientRect().top <= 32) under = b;
  if (under) themes.forEach(t => topbar.classList.toggle(t, under.classList.contains(t)));
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// ---------- Rise-in animation: whole blocks, with grid items staggered one after another ----------
document.documentElement.classList.add('js');
const revealEls = [];
document.querySelectorAll('main > section:not(.hero), footer').forEach(sec => {
  [...sec.children].forEach(el => { el.classList.add('reveal'); revealEls.push(el); });
});
document.querySelectorAll('.eps, .packs-grid, .studio-photos, .photo-grid, .rows, .facts').forEach(group => {
  [...group.children].forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', Math.min(i * 0.08, 0.6) + 's'); revealEls.push(el); });
});
const revealer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
}), { rootMargin: '0px 0px -8% 0px' });
revealEls.forEach(el => revealer.observe(el));

// ---------- Phone menu ----------
const toggle = document.getElementById('menuToggle');
const setMenu = open => {
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// ---------- Homepage: highlight the menu item for the section on screen ----------
// (Sub-pages mark their own menu item with class="active" in the HTML.)
const navLinks = [...document.querySelectorAll('#menu a[href^="#"]')];
if (navLinks.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section').forEach(s => io.observe(s));
}

// ---------- Homepage: service rows pre-fill the contact form ----------
document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => {
  const select = document.getElementById('service');
  if (select) select.value = a.dataset.service;
}));

// ---------- Newsletter (footer): Brevo handles it in a hidden iframe; swap the form for a note ----------
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', () => {
    setTimeout(() => {
      newsletterForm.style.display = 'none';
      document.getElementById('newsletter-success').style.display = 'block';
    }, 500);
  });
}

// ---------- Contact form: send to Formspree without leaving the page ----------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const contactError = document.getElementById('contact-error');
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    contactError.style.display = 'none';
    try {
      const res = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Formspree returned ' + res.status);
      contactForm.style.display = 'none';
      document.getElementById('contact-success').style.display = 'block';
    } catch (err) {
      console.error(err);
      contactError.style.display = 'block';
    }
  });
}

// ---------- Hero line drawing, only drawn while the hero is on screen ----------
const canvas = document.getElementById('c');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let elapsed = 0, last = null, running = false, raf = 0;
  const figure = (W, H, d, color) => {
    const cx = W * 0.5, cy = H * 0.5, R = Math.min(W, H) * 0.40, steps = 600;
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * Math.PI * 2;
      const x = cx + R * Math.sin(3 * t + d), y = cy + R * Math.sin(2 * t);
      s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath(); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke();
  };
  const draw = (ts, once) => {
    if (last === null) last = ts;
    elapsed += ts - last; last = ts;
    const W = hero.clientWidth, H = hero.clientHeight;
    const d = Math.sin(elapsed * 0.00016) * Math.PI;
    ctx.clearRect(0, 0, W, H);
    figure(W, H, d + 0.3, 'rgba(232,228,220,0.05)');
    ctx.globalAlpha = 0.45;
    figure(W, H, d, getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim());
    ctx.globalAlpha = 1;
    if (!once && running) raf = requestAnimationFrame(draw);
  };
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = hero.clientWidth * dpr; canvas.height = hero.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!running) draw(performance.now(), true);
  };
  new IntersectionObserver(([e]) => {
    if (still) return;
    running = e.isIntersecting;
    if (running) { last = null; raf = requestAnimationFrame(draw); } else cancelAnimationFrame(raf);
  }).observe(hero);
  addEventListener('resize', resize); resize();
}
