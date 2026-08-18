/* =========================================================
   BPSGMUN — Rules of Procedure briefing page
   Requires js/common.js to load first.
   ========================================================= */
(() => {
  'use strict';

  /* ---------- countdown to Day One ---------- */
  /* Adjust the exact start time here once confirmed — currently 5:00 PM IST. */
  window.BPS.initCountdown({
    targetDate: new Date('2026-10-24T17:00:00+05:30'),
    containerId: 'ropCountdown', dayId: 'ropDays', hourId: 'ropHours', minId: 'ropMinutes', secId: 'ropSeconds',
    liveText: 'The Briefing Is Live'
  });

  /* ---------- add to calendar ---------- */
  const calBtn = document.getElementById('addToCalendar');
  if (calBtn) {
    const start = '20261024T113000Z'; // 5:00 PM IST = 11:30 UTC
    const end = '20261024T133000Z';   // 7:00 PM IST = 13:30 UTC
    const pageUrl = window.location.href.split('#')[0];
    const title = encodeURIComponent('BPSGMUN III — Rules of Procedure Briefing');
    const details = encodeURIComponent(`Rules of Procedure briefing for all BPSGMUN III delegates and Secretariat. Details: ${pageUrl}`);
    const location = encodeURIComponent(pageUrl);
    calBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    calBtn.target = '_blank';
    calBtn.rel = 'noopener noreferrer';
  }
})();
