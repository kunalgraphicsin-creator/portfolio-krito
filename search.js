/* ============================================================
   KRITO STOREFRONT — Global Ultra-Fast Live Search Overlay
   Features:
   - Live Instant Search across Titles, Genres, & Keywords
   - Trending / Popular Search Quick Pills
   - Keyboard Navigation (Esc to close, Cmd/Ctrl + K to open)
   - Dynamic Results List with Artwork & Instant Links
   ============================================================ */

var SEARCH_PRODUCTS = [
  {
    id: 'p1',
    title: 'THE ARCHIVE Beat Pack (50+ Beats)',
    genre: 'Full Beat Pack',
    price: '₹4,999',
    oldPrice: '₹15,999',
    badge: 'BESTSELLER',
    img: 'img/beats/beat-b1.png?v=archive1',
    tags: 'the archive beat pack 50+ beats bundle 2026 ultimate all kits trap drill dholki melody wav mp3 stems royalty free'
  }
];

function openSearchOverlay() {
  var overlay = document.getElementById('searchOverlayBackdrop');
  if (!overlay) return;

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';

  var input = document.getElementById('searchInputField');
  if (input) {
    input.value = '';
    setTimeout(function() { input.focus(); }, 150);
  }
  performSearch('');
}

function closeSearchOverlay(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('search-close-btn')) return;
  var overlay = document.getElementById('searchOverlayBackdrop');
  if (overlay) {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function performSearch(query) {
  var resultsContainer = document.getElementById('searchResultsGrid');
  if (!resultsContainer) return;

  var q = (query || '').toLowerCase().trim();
  
  var filtered = SEARCH_PRODUCTS.filter(function(item) {
    if (!q) return true; // Show all when query is empty
    return (
      item.title.toLowerCase().indexOf(q) !== -1 ||
      item.genre.toLowerCase().indexOf(q) !== -1 ||
      item.tags.toLowerCase().indexOf(q) !== -1
    );
  });

  if (filtered.length === 0) {
    resultsContainer.innerHTML = 
      '<div class="search-empty-state">' +
        '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
        '<h3>No beat packs found for "' + escapeHtml(query) + '"</h3>' +
        '<p>Try searching for popular terms like <strong>"Bundle"</strong>, <strong>"Trap"</strong>, or <strong>"Dholki"</strong>.</p>' +
      '</div>';
    return;
  }

  var html = '';
  filtered.forEach(function(item) {
    html += 
      '<div class="search-result-card" onclick="window.location.href=\'product.html?id=' + item.id + '\'">' +
        '<div class="search-thumb-wrap">' +
          '<img src="' + item.img + '" alt="' + item.title + '">' +
          '<span class="search-badge">' + item.badge + '</span>' +
        '</div>' +
        '<div class="search-info">' +
          '<span class="search-genre">' + item.genre + '</span>' +
          '<h4 class="search-title">' + item.title + '</h4>' +
          '<div class="search-price-row">' +
            '<span class="search-price-now">' + item.price + '</span>' +
            '<span class="search-price-old">' + item.oldPrice + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="search-action">' +
          '<a href="product.html?id=' + item.id + '" class="btn-search-view">View Pack →</a>' +
        '</div>' +
      '</div>';
  });

  resultsContainer.innerHTML = html;
}

function setSearchQuery(term) {
  var input = document.getElementById('searchInputField');
  if (input) {
    input.value = term;
    input.focus();
  }
  performSearch(term);
}

function escapeHtml(text) {
  return (text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Global Event Attachments
document.addEventListener('DOMContentLoaded', function() {
  // Attach search open listeners to search buttons
  document.querySelectorAll('a[href*="#SEARCH_LINK"], button[title="Search"], .header-action-btn[title="Search"], button[aria-label="Search"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openSearchOverlay();
    });
  });

  // Keyboard shortcut Ctrl+K / Cmd+K / Esc
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchOverlay();
    } else if (e.key === 'Escape') {
      closeSearchOverlay();
    }
  });
});
