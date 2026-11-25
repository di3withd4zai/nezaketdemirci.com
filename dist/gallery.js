(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'media-lightbox';
  dialog.setAttribute('aria-label', NEZ_COPY[document.documentElement.lang]?.gallery || NEZ_COPY.tr.gallery);
  dialog.innerHTML = '<button type="button" class="media-close" autofocus>×</button>' +
    '<figure><img alt=""><figcaption aria-live="polite"></figcaption></figure>' +
    '<div class="media-navigation"><button type="button">‹</button><button type="button">›</button></div>';
  document.body.append(dialog);
  const close = dialog.querySelector('.media-close');
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  const [previous, next] = dialog.querySelectorAll('.media-navigation button');
  let links = [];
  let index = 0;
  let opener;

  const copy = () => NEZ_COPY[document.documentElement.lang] || NEZ_COPY.tr;
  const isLocal = link => {
    const url = new URL(link.href, location.href);
    return url.origin === location.origin && url.protocol === location.protocol;
  };
  function showImage() {
    const link = links[index];
    image.hidden = false;
    image.alt = link.querySelector('img')?.alt || '';
    image.src = link.href;
    const label = link.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
    const position = (index + 1) + ' / ' + links.length;
    caption.textContent = label ? label + ' · ' + position : position;
  }
  function step(distance) {
    index = (index + distance + links.length) % links.length;
    showImage();
  }
  function open(link) {
    const group = link.closest('[data-gallery-group]');
    links = group ? [...group.querySelectorAll('[data-gallery-image]')].filter(isLocal) : [link];
    index = links.indexOf(link);
    opener = link;
    dialog.setAttribute('aria-label', copy().gallery);
    close.setAttribute('aria-label', copy().close);
    previous.setAttribute('aria-label', copy().previousImage);
    next.setAttribute('aria-label', copy().nextImage);
    previous.hidden = next.hidden = links.length < 2;
    showImage();
    dialog.showModal();
  }
  close.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  image.addEventListener('error', () => {
    if (!dialog.open) return;
    image.hidden = true;
    caption.textContent = copy().imageError;
  });
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
    links = [];
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
    } else if (links.length > 1 && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });

  document.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('[data-gallery-image]');
    if (link) {
      if (typeof dialog.showModal !== 'function' || !isLocal(link)) return;
      event.preventDefault();
      open(link);
      return;
    }
    const button = event.target.closest('[data-video-embed]');
    if (!button) return;
    const url = NEZ_VIEW.embedUrl(button.dataset.videoEmbed);
    if (!url) return;
    const player = document.createElement('iframe');
    player.src = url;
    player.title = button.dataset.videoTitle;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.allowFullscreen = true;
    player.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    button.replaceWith(player);
    player.focus();
  });
})();
