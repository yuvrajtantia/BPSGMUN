/* =========================================================
   BPSGMUN — Documents page
   Requires js/committees-data.js and js/common.js to load first.
   ========================================================= */
(() => {
  'use strict';

  /* Paste the live matrix link here (e.g. a published Google Sheet URL)
     once allotments open. Leave empty to show "Coming Soon". */
  const MATRIX_URL = '';

  const GENERAL_DOCS = [
    { id: 'matrix', tag: 'General &middot; Live', title: 'Country / Portfolio Matrix', desc: 'Live allotment matrix — country or portfolio assigned to each delegate, by committee.', type: 'external', url: MATRIX_URL, cta: 'View Live Matrix', liveLabel: 'Live' },
    { id: 'brochure', tag: 'General', title: 'Conference Brochure', desc: 'Overview of BPSGMUN III — theme, structure and committees.', file: 'assets/docs/brochure.pdf' },
    { id: 'itinerary', tag: 'General', title: 'Itinerary &amp; Schedule', desc: 'Day-wise schedule across 27&ndash;29 October 2026.', file: 'assets/docs/itinerary.pdf' },
    { id: 'rules-of-procedure', tag: 'General', title: 'Rules of Procedure', desc: 'Governing rules for debate, motions and voting.', file: 'assets/docs/rules-of-procedure.pdf' },
    { id: 'position-paper-format', tag: 'General', title: 'Position Paper Format', desc: 'Formatting guide for submitted position papers.', file: 'assets/docs/position-paper-format.pdf' },
    { id: 'delegate-handbook', tag: 'General', title: 'Delegate Handbook', desc: 'Conduct, dress code and general delegate guidance.', file: 'assets/docs/delegate-handbook.pdf' }
  ];

  function fileCardHTML(id, tag, title, desc, file){
    return `
      <div class="doc-card" data-tilt data-reveal id="${id}">
        <div class="doc-card-top">
          <span class="doc-tag">${tag}</span>
          <span class="doc-status pending">Checking&hellip;</span>
        </div>
        <h3 class="doc-title">${title}</h3>
        <p class="doc-desc">${desc}</p>
        <a class="doc-download is-disabled" href="${file}" target="_blank" rel="noopener noreferrer" aria-disabled="true" data-file="${file}">
          Download PDF <i>&#8595;</i>
        </a>
      </div>`;
  }

  function externalCardHTML(d){
    const live = !!d.url;
    return `
      <div class="doc-card" data-tilt data-reveal id="gd-${d.id}">
        <div class="doc-card-top">
          <span class="doc-tag">${d.tag}</span>
          <span class="doc-status ${live ? 'available' : 'pending'}">${live ? d.liveLabel : 'Coming Soon'}</span>
        </div>
        <h3 class="doc-title">${d.title}</h3>
        <p class="doc-desc">${d.desc}</p>
        <a class="doc-download ${live ? '' : 'is-disabled'}" href="${live ? d.url : '#'}" target="_blank" rel="noopener noreferrer" ${live ? '' : 'aria-disabled="true"'}>
          ${d.cta} <i>&#8599;</i>
        </a>
      </div>`;
  }

  const generalGrid = document.getElementById('generalDocsGrid');
  if (generalGrid) {
    generalGrid.innerHTML = GENERAL_DOCS.map(d =>
      d.type === 'external' ? externalCardHTML(d) : fileCardHTML(`gd-${d.id}`, d.tag, d.title, d.desc, d.file)
    ).join('');
  }

  const committeeGrid = document.getElementById('committeeDocsGrid');
  if (committeeGrid && window.COMMITTEES) {
    committeeGrid.innerHTML = window.COMMITTEES.map(c =>
      fileCardHTML(`c-${c.slug}`, `File No. ${c.code} &mdash; Background Guide`, c.acronym, c.name, `assets/docs/committees/${c.slug}.pdf`)
    ).join('');
  }

  /* ---------- availability check (file-based cards only) ---------- */
  document.querySelectorAll('.doc-download[data-file]').forEach(link => {
    const file = link.dataset.file;
    const card = link.closest('.doc-card');
    const statusEl = card.querySelector('.doc-status');

    fetch(file, { method: 'HEAD', cache: 'no-store' })
      .then(res => {
        if (res.ok) {
          statusEl.textContent = 'Available';
          statusEl.classList.remove('pending');
          statusEl.classList.add('available');
          link.classList.remove('is-disabled');
          link.removeAttribute('aria-disabled');
        } else {
          markPending();
        }
      })
      .catch(markPending);

    function markPending(){
      statusEl.textContent = 'Coming Soon';
      statusEl.classList.add('pending');
    }
  });

  /* ---------- reveal + tilt via shared helpers ---------- */
  if (window.BPS) {
    window.BPS.staggerObserve('.doc-card');
    window.BPS.observeReveal();
    window.BPS.attachTilt('[data-tilt]');
  }

  /* ---------- deep link from committee modal ---------- */
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('doc-card-highlight');
        setTimeout(() => target.classList.remove('doc-card-highlight'), 2200);
      }, 350);
    }
  }
})();
