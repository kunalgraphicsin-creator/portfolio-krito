/* ============================================================
   KRITO STOREFRONT — Global Amazon/Shopify Cart Engine
   Features:
   - Dynamic LocalStorage Persistence
   - Slide-over Cart Drawer Navigation
   - Toast Notifications
   - Real-time Subtotal & Badge Calculations
   - Amazon-grade Quantity Controls
   ============================================================ */

// Product Database (THE ARCHIVE BEAT PACK Only)
var PRODUCTS_DB = {
  'p1': {
    id: 'p1',
    title: 'THE ARCHIVE Beat Pack (50+ Beats)',
    genre: 'Full Beat Pack',
    price: 4999,
    oldPrice: 15999,
    img: 'img/beats/beat-b1.png?v=archive1',
    specs: '50+ Premium Beats · WAV + MP3 + Stems'
  }
};

// State
function getCart() {
  try {
    var stored = localStorage.getItem('krito_cart');
    if (stored !== null) {
      var parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Normalize legacy IDs
        parsed.forEach(function(item) {
          var strId = String(item.id || '1');
          item.id = strId.startsWith('p') ? strId : 'p' + strId;
        });
        
        // Merge duplicates
        var merged = [];
        parsed.forEach(function(item) {
          var exist = merged.find(function(m) { return m.id === item.id; });
          if (exist) { exist.qty += item.qty; } else { merged.push(item); }
        });
        return merged;
      }
    }
  } catch (e) {}
  // Default cart with Product 1 on initial visit
  return [{ id: 'p1', qty: 1 }];
}

function saveCart(cart) {
  try {
    localStorage.setItem('krito_cart', JSON.stringify(cart));
  } catch (e) {}
  updateCartUI();
}

function addToCart(pid, autoOpenDrawer) {
  if (typeof autoOpenDrawer === 'undefined') autoOpenDrawer = true;
  var rawPid = String(pid || '1');
  var pidToUse = rawPid.startsWith('p') ? rawPid : 'p' + rawPid;
  var cart = getCart();
  
  var existing = cart.find(function(item) { return item.id === pidToUse; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: pidToUse, qty: 1 });
  }
  
  saveCart(cart);

  var itemData = PRODUCTS_DB[pidToUse] || PRODUCTS_DB['p1'];
  showCartToast('Item Added to Cart!', itemData.title);

  if (autoOpenDrawer) {
    setTimeout(function() {
      openCartDrawer();
    }, 200);
  }
}

function updateCartQty(pid, delta) {
  var cart = getCart();
  var item = cart.find(function(i) { return i.id === pid; });
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(function(i) { return i.id !== pid; });
  }
  saveCart(cart);
}

function removeFromCart(pid) {
  var cart = getCart();
  cart = cart.filter(function(i) { return i.id !== pid; });
  saveCart(cart);
}

function getTotalCount() {
  var cart = getCart();
  return cart.reduce(function(sum, i) { return sum + i.qty; }, 0);
}

function getTotalSubtotal() {
  var cart = getCart();
  return cart.reduce(function(sum, i) {
    var pId = String(i.id).startsWith('p') ? i.id : 'p' + i.id;
    var p = PRODUCTS_DB[pId] || PRODUCTS_DB['p1'];
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

function updateCartUI() {
  var count = getTotalCount();
  var subtotal = getTotalSubtotal();

  // Update Badges
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.innerText = count;
    el.classList.add('badge-pulse');
    setTimeout(function() { el.classList.remove('badge-pulse'); }, 400);
  });

  // Drawer Title Badge
  var drawerBadge = document.getElementById('cartDrawerBadge');
  if (drawerBadge) drawerBadge.innerText = count + (count === 1 ? ' item' : ' items');

  // Subtotal Texts
  var formattedSubtotal = '₹' + subtotal.toLocaleString('en-IN');
  var subtotalEl = document.getElementById('cartDrawerSubtotal');
  if (subtotalEl) subtotalEl.innerText = formattedSubtotal;

  var checkoutTotalEl = document.getElementById('cartDrawerCheckoutTotal');
  if (checkoutTotalEl) checkoutTotalEl.innerText = formattedSubtotal;

  // Render Items List
  renderCartDrawerItems();
}

function renderCartDrawerItems() {
  var container = document.getElementById('cartDrawerItems');
  if (!container) return;

  var cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><h3>Your Cart is Empty</h3><p>Explore our beat library &amp; add your favorite packs.</p><button class="btn-cart-drawer-continue" onclick="closeCartDrawer()" style="margin-top:16px;">Browse Kits</button></div>';
    return;
  }

  var html = '';
  cart.forEach(function(item) {
    var p = PRODUCTS_DB[item.id] || PRODUCTS_DB['p1'];
    var itemTotal = p.price * item.qty;

    html += '<div class="cart-drawer-item-row">' +
      '<div class="cart-item-thumb">' +
        '<img src="' + p.img + '" alt="' + p.title + '">' +
      '</div>' +
      '<div class="cart-item-details">' +
        '<span class="cart-item-genre">' + p.genre + '</span>' +
        '<h4 class="cart-item-title">' + p.title + '</h4>' +
        '<div class="cart-item-specs">' + p.specs + '</div>' +
        '<div class="cart-item-controls">' +
          '<div class="qty-selector">' +
            '<button type="button" class="qty-btn" onclick="updateCartQty(\'' + p.id + '\', -1)">-</button>' +
            '<span class="qty-num">' + item.qty + '</span>' +
            '<button type="button" class="qty-btn" onclick="updateCartQty(\'' + p.id + '\', 1)">+</button>' +
          '</div>' +
          '<button type="button" class="btn-remove-item" onclick="removeFromCart(\'' + p.id + '\')">Remove</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-item-price-wrap">' +
        '<span class="cart-item-price">₹' + itemTotal.toLocaleString('en-IN') + '</span>' +
      '</div>' +
    '</div>';
  });

  container.innerHTML = html;
}

// Drawer Open / Close
function openCartDrawer() {
  updateCartUI();
  var drawer = document.getElementById('cartDrawerBackdrop');
  if (drawer) {
    drawer.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('cart-drawer-close-btn')) return;
  var drawer = document.getElementById('cartDrawerBackdrop');
  if (drawer) {
    drawer.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Toast
function showCartToast(title, sub) {
  var toast = document.getElementById('cartToast');
  if (!toast) return;

  var tTitle = document.getElementById('toastTitle');
  var tSub = document.getElementById('toastSub');
  if (tTitle) tTitle.innerText = title;
  if (tSub) tSub.innerText = sub;

  toast.classList.add('show');
  setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

// Auto Init
document.addEventListener('DOMContentLoaded', function() {
  updateCartUI();
  
  // Attach click listener to Header Cart Buttons
  document.querySelectorAll('a[href*="#BUY_LINK"], a[title="Cart"], .header-action-btn[title="Cart"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openCartDrawer();
    });
  });
});
