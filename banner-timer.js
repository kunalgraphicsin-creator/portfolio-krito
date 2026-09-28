// ============================================================
//  KRITO STORE — Luxury Flash Sale & Countdown Timer Engine
//  Synchronized real-time countdown with persistent urgency
// ============================================================

(function() {
  'use strict';

  var STORAGE_KEY = 'krito_sale_countdown_v2';
  // Default countdown duration: 3 Hours, 28 Minutes, 48 Seconds (Matches benchmark design)
  var DURATION_MS = (3 * 3600 + 28 * 60 + 48) * 1000;

  function getTargetTime() {
    var stored = localStorage.getItem(STORAGE_KEY);
    var now = Date.now();

    if (stored) {
      var target = parseInt(stored, 10);
      if (!isNaN(target) && target > now) {
        return target;
      }
    }

    // Initialize new deadline
    var newTarget = now + DURATION_MS;
    try {
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
    } catch (e) {
      // Storage might be disabled in private mode
    }
    return newTarget;
  }

  function pad(num) {
    return num < 10 ? '0' + num : String(num);
  }

  function updateTimer() {
    var target = getTargetTime();
    var now = Date.now();
    var diff = target - now;

    if (diff <= 0) {
      // Reset smoothly for continuous conversion
      target = now + DURATION_MS;
      try {
        localStorage.setItem(STORAGE_KEY, target.toString());
      } catch (e) {}
      diff = DURATION_MS;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var mins = Math.floor((totalSeconds % 3600) / 60);
    var secs = totalSeconds % 60;

    var daysEl = document.getElementById('bannerDays');
    var hoursEl = document.getElementById('bannerHours');
    var minsEl = document.getElementById('bannerMins');
    var secsEl = document.getElementById('bannerSecs');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(mins);
    if (secsEl) secsEl.textContent = pad(secs);
  }

  // CTA Click handler
  window.handleBannerCta = function(e) {
    var path = window.location.pathname.toLowerCase();
    var isProductPage = path.indexOf('product.html') !== -1;

    if (isProductPage) {
      if (e) e.preventDefault();
      var target = document.getElementById('buyBtnLink') || document.querySelector('.product-actions-area') || document.getElementById('pPriceNow');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('flash-sale-highlight');
        setTimeout(function() {
          target.classList.remove('flash-sale-highlight');
        }, 2000);
      }
    } else {
      // Navigate to product page checkout target
      window.location.href = 'product.html#buyBtnLink';
    }
  };

  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      updateTimer();
      setInterval(updateTimer, 1000);
    });
  } else {
    updateTimer();
    setInterval(updateTimer, 1000);
  }
})();
