(function () {
  // ── Scroll-aware navbar ──────────────────────────────────────────────────
  var nav = document.getElementById('site-nav');
  if (!nav) return;

  var hasHero = !!document.querySelector('.page-hero.has-image');

  if (!hasHero) {
    nav.classList.add('is-solid');
  }

  var lastY = 0;
  var ticking = false;

  function update() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 10 || !hasHero);
    if (y > 80) {
      if (y > lastY) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
    } else {
      nav.classList.remove('is-hidden');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // Close mobile menu when a nav link is clicked
  var links = document.querySelectorAll('.nav-links a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      var toggle = document.getElementById('nav-toggle');
      if (toggle) toggle.checked = false;
    });
  }

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
