// Listens for real-time database change events and silently updates the page in place
(function () {
  if (typeof io === 'undefined') return;

  var socket = io();

  function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('powertemple_user') || 'null'); } catch (e) { return null; }
  }

  function fadeRemove(el) {
    if (!el) return;
    el.style.transition = 'opacity 0.25s ease';
    el.style.opacity = '0';
    setTimeout(function () { el.remove(); }, 250);
  }

  // Re-fetches the current page in the background and swaps in a fresh copy of the
  // matching container, so other users see new/updated rows without a full reload
  function morphSection(selector) {
    var existing = document.querySelector(selector);
    if (!existing) return;

    fetch(window.location.pathname + window.location.search, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var fresh = new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
        var current = document.querySelector(selector);
        if (fresh && current) current.replaceWith(fresh);
      })
      .catch(function () {});
  }

  // ---- Class capacity changes (booking / cancellation) ----
  socket.on('class:capacityChanged', function (data) {
    var pill = document.getElementById('capacityPill-' + data.id);
    if (!pill) return;

    var card = document.getElementById('class-' + data.id);
    var full = data.booked >= data.capacity;

    if (card && card.hasAttribute('data-capacity')) {
      pill.textContent = full ? 'Full' : (data.capacity - data.booked) + ' spots left';
      pill.classList.toggle('success', !full);
      pill.classList.toggle('danger', full);

      var actionBox = document.getElementById('bookAction-' + data.id);
      var user = getStoredUser();
      if (actionBox && user && user.role === 'member') {
        var hasForm = !!actionBox.querySelector('form');
        if (full && hasForm) {
          actionBox.innerHTML = '<button class="btn btn-secondary" disabled style="flex: 1; opacity: 0.6;">Class Full</button>';
        } else if (!full && !hasForm) {
          actionBox.innerHTML =
            '<form action="/member/book/' + data.id + '" method="POST" style="flex: 1;">' +
            '<button class="btn btn-primary" type="submit" style="width: 100%;">Book Class →</button>' +
            '</form>';
        }
      }
    } else {
      pill.textContent = data.booked + '/' + data.capacity;
    }
  });

  // ---- Classes created / updated / deleted ----
  socket.on('class:changed', function (data) {
    if (data.action === 'deleted' && data.id) {
      fadeRemove(document.getElementById('class-' + data.id));
      return;
    }
    morphSection('#classSection');
  });

  // ---- Bookings created / cancelled (own bookings only) ----
  socket.on('booking:changed', function (data) {
    var user = getStoredUser();
    if (!user || !data.memberId || String(user.id) !== String(data.memberId)) return;

    if (data.action === 'deleted' && data.id) {
      fadeRemove(document.getElementById('booking-' + data.id));
      return;
    }
    morphSection('#bookingsSection');
  });

  // ---- Trainers / members / roles created / updated / deleted ----
  socket.on('user:changed', function (data) {
    if (data.action === 'deleted' && data.id) {
      fadeRemove(document.getElementById('user-' + data.id));
      return;
    }

    if (data.action === 'updated' && data.id && document.getElementById('statusPill-' + data.id)) {
      morphSection('#memberSection');
      return;
    }

    ['#userList', '#memberSection', '#trainerSection'].forEach(function (selector) {
      if (document.querySelector(selector)) morphSection(selector);
    });
  });
})();
