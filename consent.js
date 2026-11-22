/*
 * Cookie choice and the Meta pixel (22 November 2026).
 *
 * Nothing from Meta loads until the person presses Accept. Reject is offered with
 * the same weight. The choice is kept in this browser for twelve months, and the
 * "Cookies" link in every page's footer opens the choice again. Withdrawing a yes
 * removes Meta's cookie and reloads the page without the pixel.
 *
 * Once loaded, the pixel counts page views, and the CV score pages count one Lead
 * for each new CV (cv-score.html and cv-score-introduction.html already do this
 * whenever fbq is present). Nothing about the person or their CV is sent.
 */
(function () {
  var PIXEL_ID = '1773592760670184';
  var KEY = 'cv-cookie-choice';
  var YEAR = 365 * 24 * 60 * 60 * 1000;
  var WORDS = {
    text: "We use cookies to see how our adverts are doing. You can read more in our",
    privacy: 'Privacy Notice',
    accept: 'Accept',
    reject: 'Reject',
    label: 'Cookie choice',
    footer: 'Cookies'
  };

  function read() {
    try {
      var v = JSON.parse(window.localStorage.getItem(KEY) || 'null');
      if (v && (v.choice === 'accept' || v.choice === 'reject') && Date.now() - v.at < YEAR) return v.choice;
    } catch (e) {}
    return '';
  }
  function save(choice) {
    try { window.localStorage.setItem(KEY, JSON.stringify({ choice: choice, at: Date.now() })); } catch (e) {}
  }

  var loaded = false;
  function loadPixel() {
    if (loaded) return;
    loaded = true;
    /* Meta's own loader, unchanged. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function clearMeta() {
    var host = window.location.hostname.replace(/^www\./, '');
    ['_fbp', '_fbc'].forEach(function (name) {
      document.cookie = name + '=; Max-Age=0; path=/';
      document.cookie = name + '=; Max-Age=0; path=/; domain=.' + host;
    });
  }

  var bar = null;
  function style() {
    if (document.getElementById('cv-cookie-style')) return;
    var css = document.createElement('style');
    css.id = 'cv-cookie-style';
    css.textContent =
      '.cv-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#0C1622;color:#F5F3EE;border:1px solid rgba(158,199,224,0.4);border-radius:18px;padding:18px 20px;' +
      'box-shadow:0 24px 60px -20px rgba(0,0,0,0.8);font-family:Lato,system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.5}' +
      '.cv-cookie p{margin:0 0 14px}' +
      '.cv-cookie a{color:#A8C8D8;text-decoration:underline;text-underline-offset:3px}' +
      '.cv-cookie-row{display:flex;gap:10px;flex-wrap:wrap}' +
      '.cv-cookie button{flex:1 1 120px;font:inherit;font-weight:600;font-size:15px;cursor:pointer;border-radius:999px;padding:11px 20px;' +
      'background:#F5F3EE;color:#05080D;border:1px solid #F5F3EE}' +
      '.cv-cookie button:hover{background:#FFFFFF}' +
      '.cv-cookie button:focus-visible,.cv-cookie a:focus-visible{outline:2px solid #A8C8D8;outline-offset:3px}';
    document.head.appendChild(css);
  }
  function close() { if (bar) { bar.remove(); bar = null; } }
  function open() {
    if (bar) return;
    style();
    bar = document.createElement('div');
    bar.className = 'cv-cookie';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', WORDS.label);
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(WORDS.text + ' '));
    var a = document.createElement('a');
    a.href = '/privacy';
    a.textContent = WORDS.privacy;
    p.appendChild(a);
    var row = document.createElement('div');
    row.className = 'cv-cookie-row';
    var yes = document.createElement('button');
    yes.type = 'button'; yes.textContent = WORDS.accept;
    var no = document.createElement('button');
    no.type = 'button'; no.textContent = WORDS.reject;
    yes.addEventListener('click', function () { save('accept'); close(); loadPixel(); });
    no.addEventListener('click', function () {
      var had = loaded;
      save('reject'); close(); clearMeta();
      if (had) window.location.reload();
    });
    row.appendChild(yes); row.appendChild(no);
    bar.appendChild(p); bar.appendChild(row);
    document.body.appendChild(bar);
  }

  function footerLink() {
    var spot = document.querySelector('.cv-flegal');
    if (!spot || spot.querySelector('[data-cookie-choice]')) return;
    var a = document.createElement('a');
    a.href = '#';
    a.setAttribute('data-cookie-choice', '');
    a.textContent = WORDS.footer;
    a.addEventListener('click', function (e) { e.preventDefault(); open(); });
    spot.appendChild(a);
  }

  function start() {
    footerLink();
    var choice = read();
    if (choice === 'accept') loadPixel();
    else if (!choice) open();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
