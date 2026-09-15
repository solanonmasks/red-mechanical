/* ==========================================================================
   Red Mechanical — interactions
   Everything here is progressive enhancement: with this file removed the
   page still renders in full and every link and the nav still work.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ header shrink ----- */
  var header = document.querySelector('[data-header]');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------- mobile nav ----- */
  var panel = document.querySelector('[data-mobile-nav]');
  var burger = document.querySelector('[data-burger]');

  function setNav(open) {
    if (!panel) return;
    panel.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var first = panel.querySelector('[data-close]');
      if (first) first.focus();
    } else if (burger) {
      burger.focus();
    }
  }

  if (burger) burger.addEventListener('click', function () { setNav(true); });

  if (panel) {
    var closeBtn = panel.querySelector('[data-close]');
    if (closeBtn) closeBtn.addEventListener('click', function () { setNav(false); });

    // Tapping a link navigates, so close the overlay behind it.
    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNav(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) setNav(false);
    });

    // If the window grows past the nav-collapse breakpoint while the overlay
    // is open, drop back to the desktop nav.
    window.addEventListener('resize', function () {
      if (!panel.hidden && window.innerWidth > 1120) setNav(false);
    });
  }

  /* ------------------------------------------------ scroll reveals ---- */
  /* Elements starting below 92% of the viewport are hidden, then animated
     to rest the first time they intersect. Anything already on screen is
     left alone so the fold never flashes. */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-hidden');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.classList.add('is-hidden');
      }
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------- counters ----- */
  /* Integers ease out over ~1s the first time they are 60% visible. */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var start = performance.now();

    function tick(now) {
      var p = Math.min(1, (now - start) / 1000);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('[data-count]');

  if (counters.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        countUp(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ----------------------------------------------- bid request form --- */
  var form = document.querySelector('[data-bid-form]');
  if (!form) return;

  var scopeField = form.querySelector('[data-scope-value]');
  var chips = form.querySelectorAll('[data-chip]');

  function syncScope() {
    var picked = [];
    chips.forEach(function (chip) {
      if (chip.getAttribute('aria-pressed') === 'true') picked.push(chip.textContent.trim());
    });
    if (scopeField) scopeField.value = picked.join(', ');
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var on = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', on ? 'false' : 'true');
      syncScope();
    });
  });

  /* IMPORTANT — the form has no endpoint yet, so this only swaps the button
     label. Before launch, replace this handler with a real submission (POST
     to a form service or your own handler) so enquiries actually arrive.
     See README.md → "Wire up the bid-request form". */
  var label = form.querySelector('[data-submit-label]');
  var status = form.querySelector('[data-bid-status]');
  var resetTimer;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    syncScope();
    if (label) label.textContent = 'Received — we’ll be in touch';
    if (status) status.textContent = 'Thanks — we have your details and will reply shortly.';
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () {
      if (label) label.textContent = 'Send bid request';
      if (status) status.textContent = '';
    }, 3200);
  });
}());
