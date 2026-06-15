/* LCARGO — shared interactions */
(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });

  /* ---- Count-up stats ---- */
  var counted = false;
  var strip = document.querySelector('.stat-strip');
  function countUp() {
    if (counted || !strip) return;
    var rect = strip.getBoundingClientRect();
    if (rect.top > window.innerHeight - 80) return;
    counted = true;
    document.querySelectorAll('.num[data-to]').forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400, start = null;
      function tick(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = to * eased;
        el.textContent = (to % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  window.addEventListener('scroll', countUp, { passive: true });
  countUp();

  /* ---- Tracking demo ---- */
  var trackForm = document.querySelector('[data-track]');
  if (trackForm) {
    trackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = document.querySelector('.track-result');
      var input = trackForm.querySelector('input');
      var id = (input.value || 'LCX-7842-PH').toUpperCase().replace(/\s+/g, '');
      var ref = document.getElementById('track-ref');
      if (ref) ref.textContent = id.length > 4 ? id : 'LCX-7842-PH';
      if (out) out.classList.add('show');
    });
  }

  /* ---- Contact form ----
     If a real Web3Forms access key is set (hidden input name="access_key"),
     the message is sent in the BACKGROUND via AJAX — no page reload, inline
     success. Until a key is added it falls back to opening the visitor's
     email app (mailto), so the form works either way with zero backend. */
  document.querySelectorAll('[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.checkValidity && !form.checkValidity()) { form.reportValidity(); return; }

      var ok = form.querySelector('.form-ok');
      var btn = form.querySelector('button[type=submit]');
      var keyEl = form.querySelector('[name="access_key"]');
      var key = keyEl ? keyEl.value.trim() : '';
      var hasKey = key && key.indexOf('YOUR_') !== 0;

      function flash(msg, hold) {
        if (!ok) return;
        ok.innerHTML = msg;
        ok.classList.add('show');
        setTimeout(function () { ok.classList.remove('show'); }, hold || 9000);
      }

      /* --- Background send via Web3Forms --- */
      if (hasKey) {
        var orig = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.success) {
            flash('✓ Thank you! Your message has been sent — we\'ll get back to you shortly.');
            form.reset();
          } else {
            flash('⚠ Sorry, that didn\'t go through. Please email <strong>info@lcargologistics.com</strong> directly.');
          }
        })
        .catch(function () {
          flash('⚠ Network error. Please email <strong>info@lcargologistics.com</strong> directly.');
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = orig; }
        });
        return;
      }

      /* --- Fallback: open the visitor's email app (mailto) --- */
      var to = form.getAttribute('data-to') || 'info@lcargologistics.com';
      var val = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var name = val('name'), email = val('email'), subject = val('subject'), message = val('message');
      var subj = subject || ('Website inquiry from ' + (name || 'a visitor'));
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n\n' +
        message + '\n\n' +
        '— Sent via lcargologistics.com contact form';
      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subj) +
        '&body=' + encodeURIComponent(body);
      flash('✓ Opening your email app with the message ready to send to info@lcargologistics.com…');
    });
  });

  /* ---- Demo-only forms (no real destination) ---- */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form-ok');
      if (ok) ok.classList.add('show');
      form.querySelectorAll('input, textarea, select').forEach(function (f) {
        if (f.type !== 'submit') f.value = '';
      });
      setTimeout(function () { if (ok) ok.classList.remove('show'); }, 6000);
    });
  });

  /* ---- Random rotating hero background (cross-fade slideshow) ---- */
  (function () {
    var box = document.querySelector('.bg-photo[data-rotate]');
    if (!box) return;
    var pool = (box.getAttribute('data-images') || '')
      .split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (pool.length < 2) return;

    // Fisher–Yates shuffle for a random order each load
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }

    // Two stacked layers to cross-fade between
    var a = box.querySelector('img') || document.createElement('img');
    a.setAttribute('aria-hidden', 'true');
    if (!a.parentNode) box.appendChild(a);
    var b = a.cloneNode(false);
    box.appendChild(b);
    box.classList.add('rotating');

    var layers = [a, b], top = 0, idx = 0;
    a.src = pool[0]; a.style.opacity = '1';
    b.style.opacity = '0';

    // Respect reduced-motion: show one random image, don't auto-cycle
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Preload the rest for smooth fades
    pool.slice(1).forEach(function (src) { var p = new Image(); p.src = src; });

    function next() {
      idx = (idx + 1) % pool.length;
      var cur = layers[top], nxt = layers[1 - top];
      var swap = function () { nxt.style.opacity = '1'; cur.style.opacity = '0'; top = 1 - top; };
      nxt.src = pool[idx];
      if (nxt.complete) swap(); else nxt.onload = swap;
    }
    setInterval(next, 6500);
  })();

  /* ---- Signature beside the footer social icons (shows only if the image exists) ---- */
  (function () {
    var SRC = 'assets/signature.png';
    var fb = document.querySelector('.foot-bottom');
    if (!fb) return;
    var socials = fb.querySelector('.socials');
    if (!socials) return;
    var probe = new Image();
    probe.onload = function () {
      var end = document.createElement('div');
      end.className = 'foot-end';
      var sig = document.createElement('span');
      sig.className = 'foot-sig';
      var logo = document.createElement('img');
      logo.src = SRC;
      logo.alt = 'Ninja';
      sig.appendChild(logo);
      fb.insertBefore(end, socials);   // group signature + socials together on the right
      end.appendChild(sig);
      end.appendChild(socials);
    };
    probe.src = SRC;
  })();

  /* ---- Footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Active nav by path ---- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach(function (a) {
    if (a.getAttribute('data-page') === path) a.classList.add('active');
  });
})();
