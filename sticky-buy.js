/* ============================================================
   KRITO STOREFRONT — Full-Width Luxury Sticky Bottom Buy Bar
   Features:
   - Reliable Scroll Trigger (Scroll Position + Target Detection)
   - Zero Permanent Lockouts (Never permanently blocked)
   - Dynamic Product Synchronization
   - Interactive License Selector Menu
   - High-Conversion 1-Click Buy & Slide-Over Cart Drawer
   ============================================================ */

(function() {
  'use strict';

  var isDismissed = false;

  function initStickyBuyBar() {
    var dock = document.getElementById('stickyBuyDock');
    if (!dock) return;

    // Reset dismissed state on page load
    isDismissed = false;

    // Determine target product
    var urlParams = new URLSearchParams(window.location.search);
    var pid = urlParams.get('id') || 'p1';
    if (!pid.startsWith('p')) pid = 'p' + pid;

    if (window.PRODUCTS_DB && window.PRODUCTS_DB[pid]) {
      syncStickyProductData(window.PRODUCTS_DB[pid]);
    }

    // Setup Scroll Trigger
    setupScrollTrigger(dock);

    // Close variant menu on outside click
    document.addEventListener('click', function(e) {
      var menu = document.getElementById('stickyVariantMenu');
      var btn = document.getElementById('stickyVariantBtn');
      if (menu && menu.classList.contains('show')) {
        if (!btn || !btn.contains(e.target)) {
          menu.classList.remove('show');
        }
      }
    });
  }

  function syncStickyProductData(p) {
    var thumb = document.getElementById('stickyThumbImg');
    var title = document.getElementById('stickyTitle');
    var priceNow = document.getElementById('stickyPriceNow');
    var priceOld = document.getElementById('stickyPriceOld');
    var btnPrice = document.getElementById('stickyBtnPrice');
    var quickBuy = document.getElementById('stickyQuickBuyBtn');

    if (thumb && p.img) thumb.src = p.img;
    if (title && p.title) title.innerText = p.title;
    if (priceNow) priceNow.innerText = (typeof p.price === 'number') ? '₹' + p.price.toLocaleString('en-IN') : p.price;
    if (priceOld && p.oldPrice) priceOld.innerText = (typeof p.oldPrice === 'number') ? '₹' + p.oldPrice.toLocaleString('en-IN') : p.oldPrice;
    if (btnPrice) btnPrice.innerText = (typeof p.price === 'number') ? '₹' + p.price.toLocaleString('en-IN') : p.price;
    if (quickBuy) quickBuy.href = 'checkout.html?id=' + p.id;
  }

  function setupScrollTrigger(dock) {
    var triggerTarget = document.querySelector('.product-actions-area') || 
                        document.querySelector('.product-pricing-box');

    function checkVisibility() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Auto reset dismissal if user scrolls back to top
      if (scrollY < 60) {
        isDismissed = false;
      }
      if (isDismissed) return;

      var shouldShow = false;
      if (triggerTarget) {
        var rect = triggerTarget.getBoundingClientRect();
        // Show if user scrolled past 120px OR hero actions button is scrolled up
        if (scrollY > 120 || rect.bottom < 220) {
          shouldShow = true;
        }
      } else {
        if (scrollY > 120) {
          shouldShow = true;
        }
      }

      if (shouldShow) {
        dock.classList.add('is-visible');
      } else {
        dock.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    // Check on load
    checkVisibility();
    setTimeout(checkVisibility, 200);
    setTimeout(checkVisibility, 600);
  }

  // Global functions accessible by inline HTML handlers
  window.handleStickyAddToCart = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var pid = urlParams.get('id') || 'p1';
    
    // Trigger cart engine
    if (typeof window.addToCart === 'function') {
      window.addToCart(pid, true);
    } else {
      window.location.href = 'checkout.html?id=' + pid;
    }
  };

  window.toggleStickyVariantMenu = function(e) {
    if (e) e.stopPropagation();
    var menu = document.getElementById('stickyVariantMenu');
    if (menu) {
      menu.classList.toggle('show');
    }
  };

  window.selectStickyTier = function(name, desc, badge) {
    var selectedTier = document.getElementById('stickySelectedTier');
    var selectedDesc = document.getElementById('stickySelectedDesc');
    var menu = document.getElementById('stickyVariantMenu');

    if (selectedTier) selectedTier.innerText = name;
    if (selectedDesc) selectedDesc.innerText = desc;
    if (menu) menu.classList.remove('show');

    // Update active highlight in menu
    var options = document.querySelectorAll('.sticky-variant-option');
    options.forEach(function(opt) {
      if (opt.innerText.indexOf(name) !== -1) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });

    if (typeof window.showCartToast === 'function') {
      window.showCartToast('License Selected', name);
    }
  };

  window.dismissStickyBuyDock = function(e) {
    if (e) e.stopPropagation();
    var dock = document.getElementById('stickyBuyDock');
    if (dock) {
      dock.classList.remove('is-visible');
      isDismissed = true;
    }
  };

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyBuyBar);
  } else {
    initStickyBuyBar();
  }

})();
