(function () {
  var nav = document.getElementById('site-nav');
  if (!nav) return;

  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-links');
  var mobileQuery = window.matchMedia('(max-width: 640px)');
  var hasHero = !!document.querySelector('.page-hero.has-image');
  var lastY = window.scrollY;
  var ticking = false;

  function isMenuOpen() {
    return toggle && toggle.getAttribute('aria-expanded') === 'true';
  }

  // ── Scroll-aware navbar ──────────────────────────────────────────────────
  function updateNav() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 10 || !hasHero || isMenuOpen());

    // Never hide the navigation while it is open or contains keyboard focus.
    if (y > 80 && y > lastY && !isMenuOpen() && !nav.contains(document.activeElement)) {
      nav.classList.add('is-hidden');
    } else {
      nav.classList.remove('is-hidden');
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // ── Accessible mobile menu ───────────────────────────────────────────────
  function setMenu(open, restoreFocus) {
    if (!toggle || !menu) return;

    var expanded = open && mobileQuery.matches;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
    nav.classList.toggle('is-open', expanded);
    updateNav();

    if (!expanded && restoreFocus) {
      toggle.focus();
    }
  }

  if (toggle && menu) {
    nav.classList.add('is-enhanced');
    toggle.hidden = false;

    toggle.addEventListener('click', function () {
      setMenu(!isMenuOpen(), false);
    });

    document.addEventListener('keydown', function (event) {
      if ((event.key === 'Escape' || event.key === 'Esc') && isMenuOpen()) {
        event.preventDefault();
        setMenu(false, true);
      }
    });

    document.addEventListener('click', function (event) {
      if (isMenuOpen() && !nav.contains(event.target)) {
        setMenu(false, false);
      }
    });

    nav.addEventListener('focusout', function () {
      window.setTimeout(function () {
        if (isMenuOpen() && !nav.contains(document.activeElement)) {
          setMenu(false, false);
        }
      }, 0);
    });

    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        setMenu(false, false);
      });
    }

    function handleBreakpointChange() {
      setMenu(false, false);
    }

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleBreakpointChange);
    } else {
      mobileQuery.addListener(handleBreakpointChange);
    }
  }

  updateNav();

  // ── Theme toggle ─────────────────────────────────────────────────────────
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function getTheme() {
    var saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  btn.addEventListener('click', function () {
    var current = getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
})();
