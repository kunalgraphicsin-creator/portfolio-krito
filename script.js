// ============================================================
//  KRITO BEAT STORE — Script
//  Clean, minimal JS for the premium store
// ============================================================



// ===== NAVBAR =====
(function() {
  var nav = document.getElementById('navbar');
  var bar = document.getElementById('announcementBar');

  if (nav) {
    window.addEventListener('scroll', function() {
      var sy = window.scrollY;
      
      // Scrolled state
      if (sy > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('has-announcement');
      } else {
        nav.classList.remove('scrolled');
        if (bar) nav.classList.add('has-announcement');
      }
    }, { passive: true });
  }

  // Mobile menu
  var hamburger = document.getElementById('navHamburger');
  var menu = document.getElementById('mobileMenu');
  var overlay = document.getElementById('mobileOverlay');

  function closeMenu() {
    if (hamburger) hamburger.classList.remove('open');
    if (menu) menu.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      if (menu) menu.classList.toggle('show');
      if (overlay) overlay.classList.toggle('show');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close on link click
  document.querySelectorAll('.mobile-menu a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });
})();

// ===== SCROLL REVEAL =====
(function() {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Stagger children
        var delay = 0;
        var parent = entry.target.closest('.trust-grid, .testimonial-grid, .faq-list');
        if (parent) {
          var siblings = parent.querySelectorAll('.reveal');
          for (var i = 0; i < siblings.length; i++) {
            if (siblings[i] === entry.target) {
              delay = i * 100;
              break;
            }
          }
        }
        
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, delay);
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(function(el) {
    observer.observe(el);
  });
})();

// ===== FAQ ACCORDION =====
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var wasOpen = item.classList.contains('open');
  
  // Close all
  document.querySelectorAll('.faq-item').forEach(function(fi) {
    fi.classList.remove('open');
  });

  // Toggle clicked
  if (!wasOpen) {
    item.classList.add('open');
  }
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href === '#' || href === '#BUY_LINK') return; // Skip placeholder links
    
    e.preventDefault();
    var target = document.querySelector(href);
    if (target) {
      var offset = 80; // navbar height
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});
