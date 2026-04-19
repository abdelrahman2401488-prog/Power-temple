(function() {
  const track = document.getElementById('classesCarousel');
  const cards = track.querySelectorAll('.classes-slide-card');
  const dots = document.querySelectorAll('.carousel-dot');
  const TOTAL = 4; // real cards
  let current = 0;
  let autoTimer;
  let isDragging = false;
  let startX = 0;
  let dragDelta = 0;

  function getCardWidth() {
    if (!cards[0]) return 360;
    return cards[0].getBoundingClientRect().width + 20; // + gap
  }

  function goTo(idx, animate = true) {
    current = ((idx % TOTAL) + TOTAL) % TOTAL;
    const offset = current * getCardWidth();
    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 3500);
  }

  document.getElementById('carouselNext').addEventListener('click', () => {
    next();
    startAuto();
  });

  document.getElementById('carouselPrev').addEventListener('click', () => {
    prev();
    startAuto();
  });

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      goTo(parseInt(d.dataset.idx, 10));
      startAuto();
    });
  });

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragDelta = e.clientX - startX;
    track.style.transform = `translateX(${-current * getCardWidth() + dragDelta}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (dragDelta < -60) next();
    else if (dragDelta > 60) prev();
    else goTo(current);
    dragDelta = 0;
    startAuto();
  });

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -50) next();
    else if (diff > 50) prev();
    else goTo(current);
    startAuto();
  });

  goTo(0, false);
  startAuto();
})();