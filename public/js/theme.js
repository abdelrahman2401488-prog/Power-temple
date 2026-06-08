// Light / dark theme toggle.
// The saved theme is applied early by an inline script in head.ejs to avoid a
// flash; this file builds the toggle button and places it in the header next
// to the login/profile icon, using the site's existing circular icon style.
(function () {
  var STORAGE_KEY = 'powertemple_theme';
  var root = document.documentElement;
  var btn, svg;

  // SVG icons (fill: currentColor, like the other header icons).
  var SUN = '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4 11a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h1Zm17 0a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1ZM5.64 5.64a1 1 0 0 1 1.42 0l.7.7A1 1 0 1 1 6.34 7.76l-.7-.7a1 1 0 0 1 0-1.42Zm11.3 11.3a1 1 0 0 1 1.42 0l.7.7a1 1 0 0 1-1.42 1.42l-.7-.7a1 1 0 0 1 0-1.42Zm1.42-11.3a1 1 0 0 1 0 1.42l-.7.7a1 1 0 1 1-1.42-1.42l.7-.7a1 1 0 0 1 1.42 0ZM7.76 16.94a1 1 0 0 1 0 1.42l-.7.7a1 1 0 0 1-1.42-1.42l.7-.7a1 1 0 0 1 1.42 0Z"/>';
  var MOON = '<path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.91-.1-1.35a5.5 5.5 0 0 1-7.55-7.55C12.91 3.04 12.46 3 12 3Z"/>';

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    updateButton(theme);
  }

  function toggleTheme() {
    applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
  }

  function updateButton(theme) {
    if (!btn) return;
    var isLight = theme === 'light';
    // Show the icon of the mode you'll switch TO.
    svg.innerHTML = isLight ? MOON : SUN;
    var label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    btn.title = label;
    btn.setAttribute('aria-label', label);
  }

  function injectStyles() {
    // The button reuses the .header-icon-link circle style; just a couple of
    // resets plus a fixed-position fallback for pages with no header actions.
    var css = [
      '#theme-toggle{cursor:pointer;padding:0;}',
      '#theme-toggle.theme-toggle--fixed{position:fixed;top:16px;right:16px;',
      'width:42px;height:42px;border-radius:50%;border:1px solid var(--border-color);',
      'background:var(--glass-strong);color:var(--text-primary);',
      'z-index:var(--z-notification,1200);box-shadow:var(--shadow-md);}'
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Place the toggle beside the login/profile icon (start of header actions);
  // fall back to the nav, the header, or a fixed top-right position.
  function placeButton() {
    // Logged-out pages: beside the login icon in the actions area (right side).
    var actions = document.querySelector('.site-header .header-actions');
    if (actions) { actions.insertBefore(btn, actions.firstChild); return; }
    // Logged-in dashboard headers have no actions area — append to the END of
    // the nav so the toggle sits on the right, not after the first link.
    var nav = document.querySelector('.site-header .nav');
    if (nav) { nav.appendChild(btn); return; }
    var header = document.querySelector('.site-header');
    if (header) { header.appendChild(btn); return; }
    btn.classList.add('theme-toggle--fixed');
    document.body.appendChild(btn);
  }

  function buildButton() {
    btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    btn.className = 'header-icon-link'; // inherit the circular icon style
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    btn.appendChild(svg);
    btn.addEventListener('click', toggleTheme);
    placeButton();
    updateButton(currentTheme());
  }

  function init() {
    injectStyles();
    buildButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
