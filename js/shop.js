document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      productCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.removeAttribute('data-hidden');
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const toast = document.getElementById('cartToast');
  const toastMsg = document.getElementById('cartToastMsg');
  let toastTimer;

  document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.productName;
      const price = parseInt(btn.dataset.productPrice, 10);

      if (toast && toastMsg) {
        toastMsg.textContent = `${name} added to cart!`;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
      }

      const badge = document.getElementById('marketCartCount');
      if (badge) {
        badge.textContent = String((parseInt(badge.textContent || '0', 10) || 0) + 1);
      }

      btn.classList.add('added');
      btn.textContent = '✓ ADDED';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg> ADD`;
      }, 1500);
    });
  });
});