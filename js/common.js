/* =========================================================
   BPSGMUN — shared page chrome (nav, cursor, reveal, tilt)
   Loaded on every page before the page-specific script.
   ========================================================= */
window.BPS = (function () {
  'use strict';

  /* ---------- registration link ----------
     Paste the Google Form URL here once it's ready. Every element
     with [data-register-link] (hero button + nav "Register" CTAs)
     will point to it. Left empty, they fall back to their existing
     href (the Correspondence section). */
  const REGISTER_URL = 'https://forms.gle/TKGV1wE5Wuso7GZW7';
  if (REGISTER_URL) {
    document.querySelectorAll('[data-register-link]').forEach(el => {
      el.href = REGISTER_URL;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  }

  /* ---------- whatsapp community link ----------
     Paste the invite link here once the community is created. */
  const WHATSAPP_URL = '';
  const waLink = document.querySelector('[data-whatsapp-link]');
  if (waLink && WHATSAPP_URL) {
    waLink.href = WHATSAPP_URL;
    waLink.classList.remove('is-disabled');
    waLink.removeAttribute('aria-disabled');
    const waStatus = waLink.querySelector('small');
    if (waStatus) waStatus.textContent = 'join the community';
  }

  /* ---------- loader ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 400));
    setTimeout(() => loader.classList.add('hidden'), 2200);
  }

  /* ---------- nav scroll state / scroll progress / back-to-top ---------- */
  const nav = document.getElementById('siteNav');
  const scrollBar = document.getElementById('scrollProgressBar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('show', y > 700);
    if (scrollBar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollBar.style.width = h > 0 ? `${(y / h) * 100}%` : '0%';
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  function closeMenu() {
    if (!navToggle) return;
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('footYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- reveal-on-scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function observeReveal(root) {
    (root || document).querySelectorAll('[data-reveal]:not(.in-view)').forEach(el => revealObserver.observe(el));
  }
  observeReveal();

  function staggerObserve(selector, root) {
    (root || document).querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
      revealObserver.observe(el);
    });
  }

  /* ---------- tilt hover ---------- */
  function attachTilt(selector, root) {
    (root || document).querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- custom cursor ---------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = `${mx}px`;
      cursorDot.style.top = `${my}px`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = `${rx}px`;
      cursorRing.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, input, [data-tilt]')) cursorRing.classList.add('active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, input, [data-tilt]')) cursorRing.classList.remove('active');
    });
  }

  /* ---------- reusable countdown ---------- */
  /* opts: { targetDate: Date, containerId, dayId, hourId, minId, secId, liveText } */
  function initCountdown(opts){
    const container = document.getElementById(opts.containerId);
    if (!container) return;
    const cdDays = document.getElementById(opts.dayId);
    const cdHours = document.getElementById(opts.hourId);
    const cdMinutes = document.getElementById(opts.minId);
    const cdSeconds = document.getElementById(opts.secId);
    const pad = (n) => String(n).padStart(2, '0');
    let timer = null;

    function tick(){
      const diff = opts.targetDate.getTime() - Date.now();
      if (diff <= 0) {
        container.classList.add('countdown-live');
        container.innerHTML = `<span class="countdown-live-text">${opts.liveText || 'It has begun'}</span>`;
        if (timer) clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      cdDays.textContent = pad(days);
      cdHours.textContent = pad(hours);
      cdMinutes.textContent = pad(minutes);
      cdSeconds.textContent = pad(seconds);
      cdSeconds.classList.remove('tick');
      void cdSeconds.offsetWidth;
      cdSeconds.classList.add('tick');
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  return { revealObserver, observeReveal, staggerObserve, attachTilt, closeMenu, initCountdown };
})();
