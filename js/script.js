/* =========================================================
   BPSGMUN — THE THIRD CHRONICLE — homepage interactions
   Requires js/committees-data.js and js/common.js to load first.
   ========================================================= */
(() => {
  'use strict';

  const COMMITTEES = window.COMMITTEES;

  const SECRETARIAT = [
    { rank: 'I', name: 'Mr. Akshit Aggarwal', post: 'Secretary General', phone: '+91 83026 88013' },
    { rank: 'II', name: 'Mr. Yuvraj Tantia', post: 'President', phone: '+91 79769 42322' },
    { rank: 'III', name: 'Ms. Dhanya Saharan', post: 'Director General', phone: '+91 78788 89051' },
    { rank: 'IV', name: 'Mr. Vivaan Bihani', post: 'Chargé d’affaires', phone: '+91 85020 12525' }
  ];

  const initials = (name) => name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, '').split(' ').map(w => w[0]).slice(0,2).join('');

  /* ---------- render committees ---------- */
  const grid = document.getElementById('committeeGrid');
  const emptyMsg = document.getElementById('committeeEmpty');

  function renderCommittees(list){
    grid.innerHTML = list.map((c) => `
      <button class="committee-card" data-index="${COMMITTEES.indexOf(c)}" data-tilt>
        <span class="card-category">${c.category}</span>
        <span class="card-code">File No. ${c.code}</span>
        <h3 class="card-acronym">${c.acronym}</h3>
        <p class="card-name">${c.name}</p>
        <p class="card-agenda">${c.agenda}</p>
        <span class="card-link">Read Full Dossier <i>&#8594;</i></span>
      </button>
    `).join('');
    emptyMsg.hidden = list.length !== 0;
    window.BPS.staggerObserve('.committee-card');
    window.BPS.attachTilt('[data-tilt]');
    attachCardClicks();
  }

  /* ---------- committee search ---------- */
  const searchInput = document.getElementById('committeeSearch');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = COMMITTEES.filter(c =>
      c.acronym.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.agenda.toLowerCase().includes(q)
    );
    renderCommittees(filtered);
  });

  /* ---------- render secretariat ---------- */
  const secGrid = document.getElementById('secretariatGrid');
  secGrid.innerHTML = SECRETARIAT.map(o => `
    <div class="officer-card">
      <span class="officer-rank">Post ${o.rank}</span>
      <div class="officer-avatar"><span>${initials(o.name)}</span></div>
      <h3 class="officer-name">${o.name}</h3>
      <p class="officer-post">${o.post}</p>
      <a class="officer-phone" href="tel:${o.phone.replace(/\s/g,'')}">
        <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.3 1L6.6 10.8z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
        ${o.phone}
      </a>
    </div>
  `).join('');
  window.BPS.staggerObserve('.officer-card');

  /* ---------- active nav link on scroll ---------- */
  const sections = ['about', 'gallery', 'committees', 'secretariat', 'contact'].map(id => document.getElementById(id));
  const navAnchors = document.querySelectorAll('.nav-links a[data-nav], .mobile-menu a[data-nav]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && navObserver.observe(s));

  /* ---------- counters ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + (p >= 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- modal ---------- */
  const modal = document.getElementById('committeeModal');
  const modalClose = document.getElementById('modalClose');
  let lastFocused = null;

  function openModal(index){
    const c = COMMITTEES[index];
    document.getElementById('modalDoc').textContent = `Dossier File No. ${c.code}`;
    document.getElementById('modalCategory').textContent = c.category;
    document.getElementById('modalAcronym').textContent = c.acronym;
    document.getElementById('modalName').textContent = c.name;
    document.getElementById('modalAgenda').textContent = c.agenda;
    document.getElementById('modalEmailLink').href = `mailto:bpsgmun@gmail.com?subject=${encodeURIComponent('Query — ' + c.acronym + ' — BPSGMUN III')}`;
    document.getElementById('modalDocsLink').href = `docs.html#c-${c.slug}`;
    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  function attachCardClicks(){
    document.querySelectorAll('.committee-card').forEach(card => {
      card.addEventListener('click', () => openModal(parseInt(card.dataset.index, 10)));
    });
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ---------- photo gallery lightbox ---------- */
  const photoModal = document.getElementById('photoModal');
  const photoModalImg = document.getElementById('photoModalImg');
  const photoModalCaption = document.getElementById('photoModalCaption');
  const photoModalClose = document.getElementById('photoModalClose');
  let lastFocusedPhoto = null;

  function openPhotoModal(src, caption){
    photoModalImg.src = src;
    photoModalImg.alt = caption;
    photoModalCaption.textContent = caption;
    lastFocusedPhoto = document.activeElement;
    photoModal.classList.add('open');
    photoModal.setAttribute('aria-hidden', 'false');
    photoModalClose.focus();
    document.body.style.overflow = 'hidden';
  }
  function closePhotoModal(){
    photoModal.classList.remove('open');
    photoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedPhoto) lastFocusedPhoto.focus();
  }
  document.querySelectorAll('.photo-frame').forEach(frame => {
    frame.addEventListener('click', () => openPhotoModal(frame.dataset.src, frame.dataset.caption));
  });
  photoModalClose.addEventListener('click', closePhotoModal);
  photoModal.addEventListener('click', (e) => { if (e.target === photoModal) closePhotoModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoModal.classList.contains('open')) closePhotoModal();
  });
  window.BPS.staggerObserve('.photo-frame');

  /* ---------- copy email ---------- */
  const copyEmail = document.getElementById('copyEmail');
  copyEmail.addEventListener('click', (e) => {
    if (navigator.clipboard) {
      e.preventDefault();
      navigator.clipboard.writeText('bpsgmun@gmail.com').then(() => {
        copyEmail.classList.add('copied');
        setTimeout(() => copyEmail.classList.remove('copied'), 1800);
      }).catch(() => { window.location.href = copyEmail.href; });
    }
  });

  /* ---------- hero stamp subtle parallax ---------- */
  const heroStamp = document.getElementById('heroStamp');
  const heroSection = document.getElementById('hero');
  if (heroStamp && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const r = heroSection.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroStamp.style.transform = `translate(${x * 16}px, ${y * 16}px)`;
    });
  }

  /* ---------- seamless ticker duplication ---------- */
  const track = document.getElementById('tickerTrack');
  track.insertAdjacentHTML('beforeend', track.innerHTML);

  /* ---------- countdown to opening ceremony ---------- */
  /* Adjust the exact opening time here once confirmed — currently 9:00 AM IST on day one. */
  window.BPS.initCountdown({
    targetDate: new Date('2026-11-30T09:00:00+05:30'),
    containerId: 'countdown', dayId: 'cdDays', hourId: 'cdHours', minId: 'cdMinutes', secId: 'cdSeconds',
    liveText: 'The Chronicle Has Begun'
  });

  /* ---------- initial render ---------- */
  renderCommittees(COMMITTEES);

})();
