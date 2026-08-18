/* =========================================================
   BPSGMUN — FAQ page accordion
   Requires js/common.js to load first.
   ========================================================= */
(() => {
  'use strict';

  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
    });
  });

  if (window.BPS) {
    window.BPS.observeReveal();
  }

  /* deep link: open + scroll to a question via #faq-id if ever linked */
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target && target.classList.contains('faq-item')) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.querySelector('.faq-question').click();
      }, 300);
    }
  }
})();
