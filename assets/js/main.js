/* =================================
   POWER TEMPLE - MAIN APPLICATION LOGIC
   ================================= */

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // Always wire login modal first so Home login works even if another init step fails.
  try {
    initializeQuickLoginModal();
  } catch (error) {
    console.error('Quick login init error:', error);
  }

  try {
    initializeApp();
  } catch (error) {
    console.error('Initialize app error:', error);

    // Minimal fallback for anchor behavior if full app init failed.
    try {
      initializeCommonFeatures();
    } catch (fallbackError) {
      console.error('Common features fallback error:', fallbackError);
    }
  }

  // Fallback: always wire pricing subscribe buttons.
  initializePricingSubscribeFallback();

  // Reflect current auth state in the shared header controls.
  initializeAuthHeaderState();
});

function initializeAuthHeaderState() {
  if (typeof auth === 'undefined' || typeof auth.getCurrentUser !== 'function') return;

  const loginLinks = document.querySelectorAll('.header-actions a.header-icon-link');
  if (!loginLinks.length) return;

  const currentUser = auth.getCurrentUser();
  const userChip = document.getElementById('headerAuthUserChip');
  const headerActions = loginLinks[0]?.closest('.header-actions');
  let logoutTextBtn = document.getElementById('headerLogoutTextBtn');
  if (userChip) userChip.remove();

  const performLogout = () => {
    auth.logout();
    showNotification('Logged out successfully', 'success', 900);

    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const homePath = /(\/admin\/|\/member\/|\/trainer\/|\/auth\/)/.test(path)
      ? '../indexxx.html'
      : 'indexxx.html';

    setTimeout(() => {
      window.location.href = homePath;
    }, 200);
  };

  if (currentUser && headerActions) {
    if (!logoutTextBtn) {
      logoutTextBtn = document.createElement('button');
      logoutTextBtn.id = 'headerLogoutTextBtn';
      logoutTextBtn.type = 'button';
      logoutTextBtn.className = 'btn btn-ghost';
      logoutTextBtn.textContent = 'Logout';
      logoutTextBtn.style.minHeight = '36px';
      logoutTextBtn.style.padding = '8px 12px';
      logoutTextBtn.style.fontSize = '0.92rem';
      logoutTextBtn.style.lineHeight = '1';
      logoutTextBtn.style.whiteSpace = 'nowrap';
      headerActions.prepend(logoutTextBtn);
    }

    if (logoutTextBtn.dataset.bound !== 'true') {
      logoutTextBtn.addEventListener('click', performLogout);
      logoutTextBtn.dataset.bound = 'true';
    }
  } else if (logoutTextBtn) {
    logoutTextBtn.remove();
  }

  loginLinks.forEach((link) => {
    const srLabel = link.querySelector('.sr-only');

    if (!link.dataset.loginHref) link.dataset.loginHref = link.getAttribute('href') || '#login';
    if (!link.dataset.loginTitle) link.dataset.loginTitle = link.getAttribute('title') || 'Login';
    if (!link.dataset.loginAria) link.dataset.loginAria = link.getAttribute('aria-label') || 'Login';
    if (srLabel && !srLabel.dataset.loginText) {
      srLabel.dataset.loginText = srLabel.textContent || 'Login';
    }

    if (link.dataset.logoutBound !== 'true') {
      link.addEventListener(
        'click',
        (e) => {
          if (link.dataset.authState !== 'logged-in') return;

          e.preventDefault();
          e.stopPropagation();

          performLogout();
        },
        true
      );
      link.dataset.logoutBound = 'true';
    }

    if (currentUser) {
      link.dataset.authState = 'logged-in';
      link.setAttribute('href', '#logout');
      link.setAttribute('title', `Logout (${currentUser.name})`);
      link.setAttribute('aria-label', `Logout (${currentUser.name})`);
      if (srLabel) srLabel.textContent = 'Logout';
    } else {
      link.dataset.authState = 'logged-out';
      link.setAttribute('href', link.dataset.loginHref);
      link.setAttribute('title', link.dataset.loginTitle);
      link.setAttribute('aria-label', link.dataset.loginAria);
      if (srLabel) srLabel.textContent = srLabel.dataset.loginText || 'Login';
    }
  });
}

function initializePricingSubscribeFallback() {
  const subscribeButtons = document.querySelectorAll('[data-subscribe-plan]');
  subscribeButtons.forEach((btn) => {
    if (btn.dataset.subBound === 'true') return;

    btn.dataset.subBound = 'true';
    btn.addEventListener('click', async function () {
      const planId = this.getAttribute('data-subscribe-plan');
      const planPrice = parseFloat(this.getAttribute('data-plan-price') || '0');

      if (typeof handlePlanSubscription === 'function') {
        await handlePlanSubscription(planId, planPrice);
      } else {
        showNotification('Checkout is loading, please refresh once.', 'error');
      }
    });
  });
}

function initializeApp() {
  // Initialize animations
  initializeAnimations();

  // Initialize subscriptions and payment checkout
  initializeCommerceFeatures();

  // Initialize member features
  initializeMemberFeatures();

  // Initialize trainer features
  initializeTrainerFeatures();

  // Initialize admin features
  initializeAdminFeatures();

  // Initialize common features
  initializeCommonFeatures();

  // Egyptian market memberships page interactions
  initializeEgyptianMarketPage();
}

const egyptianMarketProducts = [
  {
    id: 'm1',
    name: '1 Month Membership',
    branch: 'maadi',
    price: 2500,
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm3',
    name: '3 Months Membership',
    branch: 'maadi',
    price: 6000,
    image:
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm6',
    name: '6 Months Membership',
    branch: 'maadi',
    price: 8000,
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
  },
];

let egyptianMarketCart = [];
let currentVoucherCode = null;
const voucherDefinitions = {
  SAVE10: { amount: 0.1, minTotal: 0, label: '10% off' },
  POWER15: { amount: 0.15, minTotal: 1000, label: '15% off orders LE 1000+' },
  WELCOME20: { amount: 0.2, minTotal: 2000, label: '20% off orders LE 2000+' },
};

function initializeEgyptianMarketPage() {
  const page = document.body.getAttribute('data-page');
  const hasMarketUI = !!document.getElementById('marketCartDrawer');
  if (!(['memberships', 'landing', 'shop'].includes(page)) || !hasMarketUI) return;

  egyptianMarketCart = loadMarketCart();
  wireMarketCartActions();
  wireBranchFilters();
  startOfferCountdowns();
  renderMarketCart();
  renderMarketRecommendations();
}

function wireBranchFilters() {
  document.querySelectorAll('[data-branch-filter]').forEach((btn) => {
    btn.addEventListener('click', function () {
      const branch = this.getAttribute('data-branch-filter');

      document.querySelectorAll('[data-branch-filter]').forEach((chip) => {
        chip.classList.remove('active');
      });
      this.classList.add('active');

      document.querySelectorAll('[data-branch]').forEach((item) => {
        const isVisible = branch === 'all' || item.getAttribute('data-branch') === branch;
        item.style.display = isVisible ? '' : 'none';
      });
    });
  });
}

function startOfferCountdowns() {
  const updateCountdown = () => {
    document.querySelectorAll('[data-countdown-end]').forEach((el) => {
      const endDate = new Date(el.getAttribute('data-countdown-end')).getTime();
      const now = Date.now();
      const diff = endDate - now;

      if (diff <= 0) {
        el.textContent = 'Offer Ended';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      el.textContent = `Offer Ends In ${days}d ${hours}h ${minutes}m`;
    });
  };

  updateCountdown();
  setInterval(updateCountdown, 60000);
}

function wireMarketCartActions() {
  const openBtn = document.querySelector('[data-open-market-cart]');
  const closeBtn = document.querySelector('[data-close-market-cart]');
  const overlay = document.getElementById('marketCartOverlay');

  openBtn?.addEventListener('click', openMarketCart);
  closeBtn?.addEventListener('click', closeMarketCart);
  overlay?.addEventListener('click', closeMarketCart);

  document.querySelectorAll('[data-market-add]').forEach((btn) => {
    btn.addEventListener('click', function () {
      addProductToMarketCart(this.getAttribute('data-market-add'));
    });
  });

  document.querySelectorAll('.add-to-cart-btn:not([data-market-add])').forEach((btn) => {
    btn.addEventListener('click', function () {
      const productId = this.dataset.productName
        ? this.dataset.productName.trim().replace(/\s+/g, '-').toLowerCase()
        : `shop-${Math.random().toString(36).slice(2, 8)}`;
      addProductToMarketCart(productId, this);
    });
  });

  document.getElementById('marketApplyVoucherBtn')?.addEventListener('click', () => {
    const input = document.getElementById('marketVoucherInput');
    const message = document.getElementById('marketVoucherMessage');
    if (!input || !message) return;

    const code = input.value.trim().toUpperCase();
    const result = applyMarketVoucher(code);
    message.textContent = result.message;
    message.classList.toggle('success', result.success);
    message.classList.toggle('error', !result.success);
    renderMarketCart();
  });

  document.getElementById('shopNewsletterBtn')?.addEventListener('click', () => {
    const emailInput = document.getElementById('shopNewsletterEmail');
    if (!emailInput) return;
    subscribeToMarketNewsletter(emailInput.value.trim());
    emailInput.value = '';
  });

  document.getElementById('marketCheckoutBtn')?.addEventListener('click', async () => {
    const total = getMarketCartTotal();
    if (total <= 0) {
      showNotification('Your cart is empty.', 'error');
      return;
    }

    closeMarketCart();

    const paymentData = await openPaymentModal({
      title: 'Membership Checkout',
      itemName: `${egyptianMarketCart.length} item(s)`,
      amount: total,
    });

    if (!paymentData) return;

    const user = typeof auth !== 'undefined' ? auth.getCurrentUser() : null;
    const memberId = user?.id || 5;
    const paymentResult = PowerTempleAPI.processPayment({
      ...paymentData,
      memberId,
      amount: total,
    });

    if (!paymentResult.success) {
      showNotification(paymentResult.message, 'error');
      return;
    }

    egyptianMarketCart = [];
    persistMarketCart();
    renderMarketCart();
    renderMarketRecommendations();
    showNotification('Payment completed successfully. Welcome to Power Temple!', 'success');
  });
}

function addProductToMarketCart(productId, button = null) {
  let item = egyptianMarketProducts.find((product) => product.id === productId);
  if (!item && button) {
    const card = button.closest('.product-card');
    const name = button.dataset.marketName || button.dataset.productName || card?.querySelector('.product-name')?.textContent?.trim() || '';
    const price = Number(button.dataset.marketPrice || button.dataset.productPrice || 0);
    const image = button.dataset.marketImage || card?.querySelector('.product-img-wrap img')?.src || '';
    if (!name || !price) return;
    item = { id: productId, name, price, image };
  }

  if (!item) return;

  const existing = egyptianMarketCart.find((cartItem) => cartItem.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    egyptianMarketCart.push({ ...item, qty: 1 });
  }

  persistMarketCart();
  renderMarketCart();
  renderMarketRecommendations();
}

function removeProductFromMarketCart(productId) {
  egyptianMarketCart = egyptianMarketCart.filter((item) => item.id !== productId);
  persistMarketCart();
  renderMarketCart();
  renderMarketRecommendations();
}

function changeMarketCartQty(productId, delta) {
  const item = egyptianMarketCart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeProductFromMarketCart(productId);
    return;
  }

  persistMarketCart();
  renderMarketCart();
}

function renderMarketRecommendations() {
  const recoList = document.getElementById('marketRecoList');
  if (!recoList) return;

  const shown = egyptianMarketProducts.filter(
    (product) => !egyptianMarketCart.some((cartItem) => cartItem.id === product.id)
  );

  recoList.innerHTML = shown
    .map(
      (item) => `
      <article class="market-reco-item">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h4>${item.name}</h4>
          <p class="market-price">${formatEGP(item.price)}</p>
          <button class="market-link-btn" type="button" data-market-reco-add="${item.id}">Add To Cart →</button>
        </div>
      </article>
    `
    )
    .join('');

  recoList.querySelectorAll('[data-market-reco-add]').forEach((btn) => {
    btn.addEventListener('click', function () {
      addProductToMarketCart(this.getAttribute('data-market-reco-add'));
    });
  });
}

function renderMarketCart() {
  const list = document.getElementById('marketCartList');
  const count = document.getElementById('marketCartCount');
  const checkoutBtn = document.getElementById('marketCheckoutBtn');
  if (!list || !count || !checkoutBtn) return;

  if (!egyptianMarketCart.length) {
    list.innerHTML = '<p class="market-cart-meta">Your cart is empty.</p>';
  } else {
    list.innerHTML = egyptianMarketCart
      .map(
        (item) => `
      <article class="market-cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h4>${item.name}</h4>
          <p class="market-cart-price">${formatEGP(item.price)}</p>
          <div class="market-qty">
            <button type="button" data-qty-minus="${item.id}">−</button>
            <span>${item.qty}</span>
            <button type="button" data-qty-plus="${item.id}">+</button>
          </div>
        </div>
        <button class="market-remove" type="button" data-market-remove="${item.id}" aria-label="Remove">🗑</button>
      </article>
    `
      )
      .join('');
  }

  count.textContent = String(egyptianMarketCart.reduce((sum, item) => sum + item.qty, 0));

  const subtotal = getMarketCartTotal();
  const discount = getMarketCartDiscountAmount();
  const total = subtotal - discount;

  const existingDiscount = document.querySelector('.market-cart-discount');
  if (discount > 0) {
    if (existingDiscount) {
      existingDiscount.textContent = `Voucher ${currentVoucherCode}: -${formatEGP(discount)}`;
    } else {
      const discountRow = document.createElement('p');
      discountRow.className = 'market-cart-discount';
      discountRow.textContent = `Voucher ${currentVoucherCode}: -${formatEGP(discount)}`;
      list.parentNode?.insertBefore(discountRow, list.nextSibling);
    }
  } else {
    existingDiscount?.remove();
  }

  checkoutBtn.textContent = `CHECK OUT — ${formatEGP(total)}`;

  list.querySelectorAll('[data-qty-minus]').forEach((btn) => {
    btn.addEventListener('click', () => changeMarketCartQty(btn.getAttribute('data-qty-minus'), -1));
  });

  list.querySelectorAll('[data-qty-plus]').forEach((btn) => {
    btn.addEventListener('click', () => changeMarketCartQty(btn.getAttribute('data-qty-plus'), 1));
  });

  list.querySelectorAll('[data-market-remove]').forEach((btn) => {
    btn.addEventListener('click', () => removeProductFromMarketCart(btn.getAttribute('data-market-remove')));
  });
}

function getMarketCartTotal() {
  return egyptianMarketCart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getMarketCartDiscountAmount() {
  if (!currentVoucherCode) return 0;
  const voucher = voucherDefinitions[currentVoucherCode];
  if (!voucher) return 0;

  const subtotal = getMarketCartTotal();
  if (subtotal < voucher.minTotal) return 0;
  return Math.round(subtotal * voucher.amount);
}

function applyMarketVoucher(code) {
  if (!code) {
    currentVoucherCode = null;
    return { success: false, message: 'Please enter a voucher code.' };
  }

  const normalized = code.replace(/\s+/g, '').toUpperCase();
  const voucher = voucherDefinitions[normalized];
  if (!voucher) {
    currentVoucherCode = null;
    return { success: false, message: 'Invalid voucher code. Try SAVE10, POWER15, or WELCOME20.' };
  }

  const subtotal = getMarketCartTotal();
  if (subtotal < voucher.minTotal) {
    currentVoucherCode = null;
    return { success: false, message: `Minimum order LE ${voucher.minTotal} required for this voucher.` };
  }

  currentVoucherCode = normalized;
  return { success: true, message: `Voucher applied: ${voucher.label}` };
}

function subscribeToMarketNewsletter(email) {
  if (!email || !email.includes('@')) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }

  localStorage.setItem('powertemple_news_subscriber', email);
  showNotification('Thank you! Latest news and offers will be sent to your inbox.', 'success');
}

function openMarketCart() {
  document.getElementById('marketCartOverlay')?.classList.remove('hidden');
  document.getElementById('marketCartDrawer')?.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeMarketCart() {
  document.getElementById('marketCartOverlay')?.classList.add('hidden');
  document.getElementById('marketCartDrawer')?.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function persistMarketCart() {
  localStorage.setItem('powertemple_market_cart', JSON.stringify(egyptianMarketCart));
}

function loadMarketCart() {
  try {
    const raw = localStorage.getItem('powertemple_market_cart');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function formatEGP(amount) {
  return `LE ${Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function initializeCommerceFeatures() {
  ensurePaymentModal();
}

async function handlePlanSubscription(planId, planPrice) {
  const authService = typeof auth !== 'undefined' ? auth : null;

  if (!authService || typeof authService.getCurrentUser !== 'function') {
    showNotification('Authentication service is unavailable. Please refresh.', 'error');
    return;
  }

  const user = authService.getCurrentUser();
  if (!user) {
    localStorage.setItem(
      'powertemple_pending_subscription',
      JSON.stringify({ planId, planPrice })
    );
    window.location.href = 'auth/login.html';
    return;
  }

  if (user.role !== 'member') {
    showNotification('Only members can purchase monthly subscriptions.', 'error');
    return;
  }

  const paymentData = await openPaymentModal({
    title: 'Monthly Subscription Checkout',
    itemName: `${planId.toUpperCase()} Plan`,
    amount: planPrice,
  });

  if (!paymentData) return;

  const result = PowerTempleAPI.subscribePlan(user.id, planId, paymentData);
  if (result.success) {
    showNotification(result.message, 'success');
  } else {
    showNotification(result.message, 'error');
  }
}

function ensurePaymentModal() {
  if (document.getElementById('paymentModal')) return;

  const modal = document.createElement('div');
  modal.id = 'paymentModal';
  modal.className = 'pt-modal hidden';
  modal.innerHTML = `
    <div class="pt-modal-backdrop" data-close-payment></div>
    <div class="pt-modal-card">
      <div class="pt-modal-head">
        <h3 id="paymentTitle">Secure Checkout</h3>
        <button type="button" class="btn btn-ghost" data-close-payment>Close</button>
      </div>
      <p id="paymentSummary" class="pt-modal-summary"></p>
      <form id="paymentForm" class="pt-payment-form">
        <label>
          Payment Method
          <select id="paymentMethod" required>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="wallet">Digital Wallet</option>
            <option value="cash">Cash at Gym</option>
          </select>
        </label>

        <div id="cardFields" class="field-grid">
          <label>
            Card Holder Name
            <input id="cardHolder" type="text" placeholder="John Doe" required />
          </label>
          <label>
            Card Number
            <input id="cardNumber" type="text" inputmode="numeric" placeholder="4111 1111 1111 1111" required />
          </label>
          <label>
            Expiry (MM/YY)
            <input id="cardExpiry" type="text" placeholder="12/28" required />
          </label>
          <label>
            CVV
            <input id="cardCVV" type="password" inputmode="numeric" placeholder="123" required />
          </label>
        </div>

        <div class="pt-modal-actions">
          <button class="btn btn-secondary" type="button" data-close-payment>Cancel</button>
          <button class="btn btn-primary" type="submit" id="payNowBtn">Pay Now</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById('paymentMethod')?.addEventListener('change', toggleCardFields);
}

function toggleCardFields() {
  const method = document.getElementById('paymentMethod')?.value;
  const cardFields = document.getElementById('cardFields');
  const cardHolder = document.getElementById('cardHolder');
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCVV = document.getElementById('cardCVV');
  const requiresCard = method !== 'cash';

  if (cardFields) {
    cardFields.style.display = requiresCard ? 'grid' : 'none';
  }

  [cardHolder, cardNumber, cardExpiry, cardCVV].forEach((field) => {
    if (!field) return;
    field.required = requiresCard;
  });
}

function openPaymentModal({ title, itemName, amount }) {
  const modal = document.getElementById('paymentModal');
  const form = document.getElementById('paymentForm');
  const titleEl = document.getElementById('paymentTitle');
  const summary = document.getElementById('paymentSummary');
  const payNowBtn = document.getElementById('payNowBtn');
  const closeButtons = modal ? modal.querySelectorAll('[data-close-payment]') : [];

  if (!modal || !form || !titleEl || !summary || !payNowBtn) {
    return Promise.resolve(null);
  }

  titleEl.textContent = title;
  summary.textContent = `${itemName} - ${formatCurrency(amount)}`;
  payNowBtn.textContent = `Pay ${formatCurrency(amount)}`;

  form.reset();
  const methodSelect = document.getElementById('paymentMethod');
  if (methodSelect) methodSelect.value = 'visa';
  toggleCardFields();

  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  return new Promise((resolve) => {
    const onSubmit = (e) => {
      e.preventDefault();
      const paymentData = {
        method: document.getElementById('paymentMethod')?.value,
        cardHolder: document.getElementById('cardHolder')?.value.trim(),
        cardNumber: document.getElementById('cardNumber')?.value.trim(),
        cardExpiry: document.getElementById('cardExpiry')?.value.trim(),
        cardCVV: document.getElementById('cardCVV')?.value.trim(),
      };

      cleanup();
      closePaymentModal();
      resolve(paymentData);
    };

    const onClose = () => {
      cleanup();
      closePaymentModal();
      resolve(null);
    };

    const cleanup = () => {
      form.removeEventListener('submit', onSubmit);
      closeButtons.forEach((btn) => btn.removeEventListener('click', onClose));
    };

    form.addEventListener('submit', onSubmit);
    closeButtons.forEach((btn) => btn.addEventListener('click', onClose));
  });
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

// === ANIMATIONS ===
function initializeAnimations() {
  // Stagger animation for grid items
  const grids = document.querySelectorAll('.stagger');
  grids.forEach((grid) => {
    const items = grid.querySelectorAll('> *');
    items.forEach((item, index) => {
      item.style.setProperty('--index', index);
    });
  });

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.classList.contains('fade-in')) {
        entry.target.style.animation = `fadeInUp 0.6s ease-out forwards`;
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.observe(el);
  });
}

// === MEMBER DASHBOARD ===
function initializeMemberFeatures() {
  syncClassBookingVisibility();

  // Browse Classes filters (optional)
  if (document.getElementById('memberSearch')) {
    const searchInput = document.getElementById('memberSearch');
    const categoryFilter = document.getElementById('memberCategory');
    const levelFilter = document.getElementById('memberLevel');

    searchInput?.addEventListener('input', filterClasses);
    categoryFilter?.addEventListener('change', filterClasses);
    levelFilter?.addEventListener('change', filterClasses);
  }

  // Browse Classes booking buttons
  const currentUser = typeof auth !== 'undefined' ? auth.getCurrentUser() : null;
  const canBook = !!currentUser && currentUser.role === 'member';
  if (canBook && document.querySelector('[data-book-class]')) {
    document.querySelectorAll('[data-book-class]').forEach((btn) => {
      if (btn.dataset.bookBound === 'true') return;
      btn.addEventListener('click', bookClass);
      btn.dataset.bookBound = 'true';
    });
  }

  // My Bookings Page
  if (document.getElementById('memberMessage') && document.querySelector('.booking-item')) {
    const bookingCancelButtons = document.querySelectorAll('[data-cancel-booking]');
    bookingCancelButtons.forEach((btn) => {
      btn.addEventListener('click', cancelBooking);
    });
  }
}

function syncClassBookingVisibility() {
  const bookingRows = document.querySelectorAll('.inline-actions');
  if (!bookingRows.length) return;

  const currentUser = typeof auth !== 'undefined' ? auth.getCurrentUser() : null;
  const canBook = !!currentUser && currentUser.role === 'member';

  bookingRows.forEach((row) => {
    row.style.display = canBook ? '' : 'none';
  });
}

// Filter classes by search and filters
function filterClasses() {
  const search = document.getElementById('memberSearch')?.value.toLowerCase() || '';
  const category = document.getElementById('memberCategory')?.value || '';
  const level = document.getElementById('memberLevel')?.value || '';

  const classCards = document.querySelectorAll('.class-card');
  let visibleCount = 0;

  classCards.forEach((card) => {
    const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const text = card.textContent.toLowerCase();
    const categoryMatch = !category || category === 'All' || text.includes(category.toLowerCase());
    const levelMatch = !level || level === 'All' || text.includes(level.toLowerCase());
    const searchMatch = !search || name.includes(search) || text.includes(search);

    if (categoryMatch && levelMatch && searchMatch) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show empty state if no results
  const emptyState = document.querySelector('.empty-state');
  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

// Book a class
async function bookClass(e) {
  const btn = e.target.closest('[data-book-class]');
  const classCard = btn.closest('.class-card');
  const className = classCard.querySelector('h3').textContent;
  const classFee = parseFloat(btn.dataset.classFee || '12');

  const user = auth.getCurrentUser();
  if (!user) {
    showNotification('Please log in to book a class', 'error');
    return;
  }

  if (user.role !== 'member') {
    showNotification('Only members can book classes.', 'error');
    return;
  }

  const paymentData = await openPaymentModal({
    title: 'Class Booking Payment',
    itemName: className,
    amount: classFee,
  });

  if (!paymentData) return;

  const result = PowerTempleAPI.bookClassWithPayment(
    user.id,
    parseInt(btn.dataset.bookClass),
    paymentData
  );

  if (result.success) {
    btn.textContent = '✓ Booked & Paid';
    btn.disabled = true;
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-success');
    showNotification(`${className} booked successfully. Payment confirmed.`, 'success');
  } else {
    showNotification(result.message, 'error');
  }
}

// Cancel a booking
function cancelBooking(e) {
  const btn = e.target.closest('[data-cancel-booking]');
  const bookingId = parseInt(btn.dataset.cancelBooking);

  if (!confirm('Are you sure you want to cancel this booking?')) {
    return;
  }

  const result = PowerTempleAPI.cancelBooking(bookingId);

  if (result.success) {
    btn.closest('.booking-item').remove();
    showNotification('Booking cancelled', 'success');
  } else {
    showNotification(result.message, 'error');
  }
}

// === TRAINER DASHBOARD ===
function initializeTrainerFeatures() {
  // Trainer session search
  if (document.getElementById('trainerSessionSearch')) {
    document.getElementById('trainerSessionSearch').addEventListener('input', filterSessions);
  }

  // Start session buttons
  document.querySelectorAll('[data-start-session]').forEach((btn) => {
    btn.addEventListener('click', startSession);
  });

  // View attendance buttons
  document.querySelectorAll('[data-view-attendance]').forEach((btn) => {
    btn.addEventListener('click', viewAttendance);
  });
}

// Filter trainer sessions
function filterSessions() {
  const search = document.getElementById('trainerSessionSearch').value.toLowerCase();
  const sessionItems = document.querySelectorAll('.session-item');

  sessionItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(search) ? 'block' : 'none';
  });
}

// Start a session
function startSession(e) {
  const btn = e.target.closest('[data-start-session]');
  const sessionName = btn.dataset.startSession;

  showNotification(`Starting ${sessionName}...`, 'success');
  btn.textContent = '⏱ Session Active';
  btn.disabled = true;
}

// === ADMIN DASHBOARD ===
function initializeAdminFeatures() {
  // Add Trainer Form
  if (document.getElementById('adminTrainerForm')) {
    document.getElementById('adminTrainerForm').addEventListener('submit', addTrainer);
  }

  // Trainer search
  if (document.getElementById('adminTrainerSearch')) {
    document.getElementById('adminTrainerSearch').addEventListener('input', filterTrainers);
  }

  // Add Class Form
  if (document.getElementById('adminClassForm')) {
    document.getElementById('adminClassForm').addEventListener('submit', addClass);
  }

  // Class search and filter
  if (document.getElementById('adminClassSearch')) {
    document.getElementById('adminClassSearch').addEventListener('input', filterClasses);
    document.getElementById('adminClassFilter')?.addEventListener('change', filterClasses);
  }

  // Populate trainer select dropdown
  populateTrainerSelects();
}

// Add new trainer
function addTrainer(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const trainerData = {
    name: formData.get('name'),
    username: formData.get('username'),
    specialty: formData.get('specialty'),
    bio: `${formData.get('specialty')} specialist`,
  };

  const result = PowerTempleAPI.addTrainer(trainerData);

  if (result) {
    showNotification('Trainer added successfully!', 'success');
    e.target.reset();

    // Add to UI
    const trainerList = document.getElementById('adminTrainerList');
    if (trainerList) {
      const newTrainer = document.createElement('article');
      newTrainer.className = 'row-card fade-in';
      newTrainer.innerHTML = `
        <div class="row-main">
          <strong>${trainerData.name}</strong>
          <span class="row-meta">@${trainerData.username} · ${trainerData.specialty} · New trainer</span>
        </div>
        <span class="pill success">Active</span>
      `;
      trainerList.insertBefore(newTrainer, trainerList.querySelector('.empty-state'));
    }

    // Refresh trainer selects
    populateTrainerSelects();
  }
}

// Filter trainers
function filterTrainers() {
  const search = document.getElementById('adminTrainerSearch').value.toLowerCase();
  const trainerRows = document.querySelectorAll('#adminTrainerList .row-card');

  trainerRows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(search) ? 'block' : 'none';
  });
}

// Populate trainer select dropdowns
function populateTrainerSelects() {
  const trainerSelects = document.querySelectorAll('#adminTrainerSelect');
  trainerSelects.forEach((select) => {
    select.innerHTML = '<option value="">Select a trainer...</option>';
    PowerTempleAPI.trainers.forEach((trainer) => {
      const option = document.createElement('option');
      option.value = trainer.id;
      option.textContent = trainer.name;
      select.appendChild(option);
    });
  });
}

// Add new class
function addClass(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const classData = {
    name: formData.get('name'),
    category: formData.get('category'),
    level: formData.get('level'),
    trainerId: parseInt(formData.get('trainer')),
    trainer: 'Coach ' + formData.get('trainer'),
    time: formData.get('time') || '18:00 PM',
    duration: 60,
    capacity: parseInt(formData.get('capacity')),
    room: formData.get('room'),
    description: formData.get('description'),
    image: '💪',
  };

  const result = PowerTempleAPI.addClass(classData);

  if (result) {
    showNotification('Class created successfully!', 'success');
    e.target.reset();

    // Add to UI
    const classList = document.getElementById('adminClassList');
    if (classList) {
      const newClass = document.createElement('article');
      newClass.className = 'class-card fade-in';
      newClass.innerHTML = `
        <div class="toolbar">
          <span class="pill success">${classData.category}</span>
          <span class="pill success">0/${classData.capacity}</span>
        </div>
        <h3>${classData.name}</h3>
        <p>${classData.description}</p>
        <div class="meta-row">
          <span>${classData.time}</span>
          <span>${classData.room}</span>
          <span>${classData.level}</span>
        </div>
      `;
      classList.insertBefore(newClass, classList.querySelector('.empty-state'));
    }
  }
}

// === COMMON FEATURES ===
function initializeCommonFeatures() {
  initializeQuickLoginModal();
  initializeHomeVideoLoginPanel();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      if (this.hasAttribute('data-open-login-modal')) {
        return;
      }

      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Mobile menu toggle (if needed)
  const mobileMenuBtn = document.querySelector('[data-mobile-menu]');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Form validation
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', validateForm);
  });
}

function initializeHomeVideoLoginPanel() {
  if (document.body.getAttribute('data-page') !== 'landing') return;

  const panel = document.querySelector('.home-video-login');
  if (!panel) return;

  const openTriggers = document.querySelectorAll('[data-open-home-login]');
  const closeTriggers = panel.querySelectorAll('[data-close-home-login]');

  const openPanel = () => {
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
    document.getElementById('loginUsername')?.focus();
  };

  const closePanel = () => {
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
  };

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPanel();
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closePanel);
  });

  if (window.location.hash === '#login') {
    openPanel();
  }
}

function initializeQuickLoginModal() {
  const modal = document.getElementById('quickLoginModal');
  if (!modal) return;
  if (modal.dataset.bound === 'true') return;
  modal.dataset.bound = 'true';

  const openTriggers = document.querySelectorAll('[data-open-login-modal]');
  const closeTriggers = modal.querySelectorAll('[data-close-login-modal]');
  const form = document.getElementById('quickLoginForm');
  const roleInput = document.getElementById('quickLoginRole');
  const roleButtons = modal.querySelectorAll('[data-role-choice]');
  const demoButtons = modal.querySelectorAll('[data-quick-demo]');

  const openModal = () => {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  roleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedRole = button.getAttribute('data-role-choice');
      if (roleInput) roleInput.value = selectedRole;

      roleButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  const demoCredentials = {
    admin: { username: 'admin', password: 'admin123' },
    trainer: { username: 'coach_maya', password: 'maya123' },
    member: { username: 'john_doe', password: 'john123' },
  };

  demoButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const role = button.getAttribute('data-quick-demo');
      const demo = demoCredentials[role];
      if (!demo) return;

      const usernameInput = document.getElementById('quickLoginUsername');
      const passwordInput = document.getElementById('quickLoginPassword');
      if (usernameInput) usernameInput.value = demo.username;
      if (passwordInput) passwordInput.value = demo.password;
      if (roleInput) roleInput.value = role;

      roleButtons.forEach((item) => item.classList.remove('active'));
      const activeButton = modal.querySelector(`[data-role-choice="${role}"]`);
      if (activeButton) activeButton.classList.add('active');
    });
  });

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const identifier = document.getElementById('quickLoginUsername')?.value.trim() || '';
    const password = document.getElementById('quickLoginPassword')?.value.trim() || '';
    const selectedRole = roleInput?.value || null;

    if (!identifier || !password) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (typeof auth === 'undefined') {
      showNotification('Authentication service is unavailable. Please refresh.', 'error');
      return;
    }

    const result = auth.login(identifier, password, selectedRole);

    if (result.success) {
      showNotification(result.message, 'success', 1200);
      initializeAuthHeaderState();
      closeModal();
      setTimeout(() => {
        auth.redirectToDashboard();
      }, 400);
    } else {
      showNotification(result.message, 'error');
    }
  });
}

// Validate forms
function validateForm(e) {
  const requiredFields = this.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = 'var(--danger-color)';
      isValid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  if (!isValid) {
    showNotification('Please fill in all required fields', 'error');
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  const nav = document.querySelector('.nav');
  nav?.classList.toggle('mobile-active');
}

// === UTILITY FUNCTIONS ===

// Format currency
function formatCurrency(amount) {
  return formatEGP(amount);
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success', 2000);
  });
}

// Export data as CSV
function exportAsCSV(data, filename) {
  const csv = Papa.unparse(data);
  const link = document.createElement('a');
  link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  link.download = filename;
  link.click();
}
