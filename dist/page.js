(() => {
  const main = document.querySelector('main');
  const selector = document.querySelector('.language');
  const english = document.querySelector('#english-content');
  const turkish = document.createElement('template');
  turkish.innerHTML = main.innerHTML;
  let language = 'tr';
  function setLanguage(next) {
    const t = NEZ_COPY[next];
    if (language !== next) {
      main.replaceChildren((next === 'en' ? english : turkish).content.cloneNode(true));
      language = next;
    }
    document.documentElement.lang = next;
    for (const node of document.querySelectorAll('[data-copy]')) {
      if (Object.hasOwn(t, node.dataset.copy)) node.textContent = t[node.dataset.copy];
    }
    for (const button of selector.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.lang === next));
    selector.setAttribute('aria-label', t.language);
    try {
      localStorage.setItem('nez-language', next);
    } catch {}
  }
  let saved = 'tr';
  try {
    if (localStorage.getItem('nez-language') === 'en') saved = 'en';
  } catch {}
  const requested = new URLSearchParams(location.search).get('lang');
  setLanguage(requested === 'tr' || requested === 'en' ? requested : saved);
  selector.hidden = false;
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
  selector.addEventListener('click', event => {
    const button = event.target.closest('[data-lang]');
    if (button) setLanguage(button.dataset.lang);
  });
  main.addEventListener('click', event => {
    if (event.target.closest('[data-print]')) window.print();
  });
  if (main.classList.contains('cv-page')) {
    const origin = document.querySelector('link[rel="canonical"]').href;
    const links = new Map();
    window.addEventListener('beforeprint', () => {
      for (const link of main.querySelectorAll('.cv-card a[href]')) {
        const href = link.getAttribute('href');
        if (/^[a-z]+:/i.test(href)) continue;
        links.set(link, href);
        link.href = new URL(href, origin).href;
      }
    });
    window.addEventListener('afterprint', () => {
      links.forEach((href, link) => link.setAttribute('href', href));
      links.clear();
    });
  }
  if (location.hash === '#print') main.querySelector('#print')?.focus();
})();
