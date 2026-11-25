(() => {
  const trigger = document.querySelector('[data-open-polaroid]');
  const dialog = document.querySelector('#polaroid-dialog');
  const close = dialog.querySelector('button');
  const portrait = trigger.querySelector('.polaroid-avatar');
  const preview = dialog.querySelector('[data-expanded-avatar]');
  const copy = () => NEZ_COPY[document.documentElement.lang];

  function syncPortraitAlt() {
    portrait.alt = copy().scrapAvatarAlt;
    preview.alt = portrait.alt;
  }

  preview.width = Number(portrait.getAttribute('width'));
  preview.height = Number(portrait.getAttribute('height'));
  syncPortraitAlt();

  trigger.disabled = false;
  trigger.addEventListener('click', () => {
    preview.src = portrait.currentSrc || portrait.src;
    preview.toggleAttribute('data-pixel-art', portrait.hasAttribute('data-pixel-art'));
    dialog.showModal();
    close.focus();
  });

  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));

  const cat = document.querySelector('[data-hero-cat]');
  const bubble = document.querySelector('[data-hero-cat-message]');
  const messages = () => copy().catMessages;
  let tip = -1;
  let timer;

  function showMessage() {
    bubble.textContent = messages()[tip];
  }

  cat.hidden = false;
  document.querySelector('.hero-cat-fallback').hidden = true;
  cat.addEventListener('click', () => {
    tip = (tip + 1) % messages().length;
    showMessage();
    cat.classList.remove('is-happy');
    requestAnimationFrame(() => cat.classList.add('is-happy'));
    clearTimeout(timer);
    timer = setTimeout(() => { bubble.textContent = ''; }, 3200);
  });

  new MutationObserver(() => {
    syncPortraitAlt();
    if (bubble.textContent) showMessage();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
