document.addEventListener('DOMContentLoaded', () => {
  const CAT_LABELS = {
    'pre-workout': 'Pre-Workout',
    'protein': 'Protein',
    'creatine': 'Creatine',
    'bars': 'Protein Bars',
    'vitamins': 'Vitamins',
    'recovery': 'Recovery',
  };

  const grid = document.getElementById('productsGrid');

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
  }

  function productIdFromName(name) {
    return String(name || '').trim().replace(/\s+/g, '-').toLowerCase();
  }

  function getMarketCart() {
    try { return JSON.parse(localStorage.getItem('powertemple_market_cart') || '[]'); }
    catch (e) { return []; }
  }

  function getCartQty(productId) {
    const item = getMarketCart().find((it) => it.id === productId);
    return item ? item.qty : 0;
  }

  function buildFooterMarkup(product) {
    const pid = productIdFromName(product.name);
    const qty = getCartQty(pid);
    const priceHtml = `<div class="product-price">LE ${Number(product.price).toLocaleString()} <span>${escapeHtml(product.unit || '')}</span></div>`;
    if (qty > 0) {
      return priceHtml + `
        <div class="product-qty-stepper" role="group" aria-label="Quantity for ${escapeHtml(product.name)}">
          <button type="button" data-qty-dec="${escapeHtml(pid)}" aria-label="Decrease">−</button>
          <span class="qty-display">${qty}</span>
          <button type="button" data-qty-inc="${escapeHtml(pid)}" aria-label="Increase">+</button>
        </div>`;
    }
    return priceHtml + `
      <button class="add-to-cart-btn" data-product-name="${escapeHtml(product.name)}" data-product-price="${product.price}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
        ADD
      </button>`;
  }

  function refreshAllCardFooters() {
    document.querySelectorAll('.product-card[data-product-name]').forEach((card) => {
      const product = {
        name: card.dataset.productName,
        price: Number(card.dataset.productPrice),
        unit: card.dataset.productUnit,
      };
      const footer = card.querySelector('.product-footer');
      if (!footer) return;
      footer.innerHTML = buildFooterMarkup(product);
    });
    wireFooterActions();
  }

  function wireFilters() {
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.product-card').forEach((card) => {
          card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }

  function wireFooterActions() {
    // ADD buttons → push into market cart (main.js)
    document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const name = btn.dataset.productName || 'Item';
        const productId = productIdFromName(name);
        if (typeof addProductToMarketCart === 'function') {
          addProductToMarketCart(productId, btn);
        }
        showToast(`${name} added to cart!`);
      });
    });

    // Stepper +
    document.querySelectorAll('[data-qty-inc]').forEach((btn) => {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const pid = btn.dataset.qtyInc;
        if (typeof changeMarketCartQty === 'function') changeMarketCartQty(pid, 1);
      });
    });

    // Stepper −
    document.querySelectorAll('[data-qty-dec]').forEach((btn) => {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const pid = btn.dataset.qtyDec;
        if (typeof changeMarketCartQty === 'function') changeMarketCartQty(pid, -1);
      });
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('cartToast');
    const toastMsg = document.getElementById('cartToastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // Sync card footers whenever the market cart changes (from card, drawer, or checkout reset).
  window.addEventListener('market-cart-changed', refreshAllCardFooters);

  // Initial render (server-rendered from DB) → filters → action wiring
  refreshAllCardFooters();
  wireFilters();
});
