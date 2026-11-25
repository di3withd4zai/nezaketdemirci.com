(() => {
  const patch = document.querySelector('#star-patch');
  const field = patch.querySelector('[data-star-field]');
  const message = patch.querySelector('[data-star-message]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 720px), (pointer: coarse)');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const shapes = [
    [.035, .33, 16, '#dbc1f4'], [.19, .87, 23, '#f4debc'],
    [.55, .70, 12, '#eab5d1'], [.70, .12, 21, '#eac4ed'],
    [.33, .05, 13, '#edc0d7'], [.46, .93, 13, '#d1b6ed'],
    [.98, .85, 21, '#ecd3c7'], [.88, .27, 15, '#d5b9ee'],
  ];
  const copy = () => NEZ_COPY[document.documentElement.lang] || NEZ_COPY.tr;
  const direction = new Map([
    ['ArrowLeft', [-1, 0]], ['ArrowRight', [1, 0]],
    ['ArrowUp', [0, -1]], ['ArrowDown', [0, 1]],
  ]);
  let stars = [];
  let bounds = { x: 0, y: 0 };
  let active = null;
  let visible = false;
  let rewarded = false;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;

  function createStar([left, top, size, color], index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'star';
    button.setAttribute('aria-describedby', 'star-instructions');
    button.style.setProperty('--star-size', size + 'px');
    button.style.setProperty('--star-color', color);
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svgNamespace, 'path');
    path.setAttribute('d', 'M16 0 20.3 11.7 32 16 20.3 20.3 16 32 11.7 20.3 0 16 11.7 11.7Z');
    path.setAttribute('fill', 'currentColor');
    svg.append(path);
    button.append(svg);
    const star = { button, left, top, index, x: 0, y: 0, vx: 0, vy: 0, dx: 0, dy: 0 };
    button.addEventListener('pointerdown', event => start(star, event));
    button.addEventListener('pointermove', event => move(star, event));
    button.addEventListener('pointerup', event => end(star, event, true));
    button.addEventListener('pointercancel', event => end(star, event, false));
    button.addEventListener('lostpointercapture', event => end(star, event, false));
    button.addEventListener('keydown', event => {
      const step = direction.get(event.key);
      if (!step) return;
      event.preventDefault();
      star.x += step[0] * 12;
      star.y += step[1] * 12;
      star.vx = 0;
      star.vy = 0;
      limit(star);
      paint(star);
      reward();
    });
    button.addEventListener('click', event => {
      if (event.detail === 0) nudge(star);
    });
    return star;
  }

  function limit(star) {
    star.x = Math.max(0, Math.min(bounds.x, star.x));
    star.y = Math.max(0, Math.min(bounds.y, star.y));
  }

  function paint(star) {
    const x = Math.min(bounds.x, Math.max(0, star.x + star.dx));
    const y = Math.min(bounds.y, Math.max(0, star.y + star.dy));
    star.button.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
  }

  function measure(initial = false) {
    if (!stars.length) return;
    const previousBounds = bounds;
    const size = stars[0].button.offsetWidth;
    bounds = {
      x: Math.max(0, field.clientWidth - size),
      y: Math.max(0, field.clientHeight - size),
    };
    stars.forEach((star, index) => {
      if (initial) {
        const left = compact.matches ? [0.04, 0.31, 0.69, 0.96][index] : star.left;
        star.x = bounds.x * left;
        star.y = bounds.y * star.top;
      } else {
        if (previousBounds.x) star.x *= bounds.x / previousBounds.x;
        if (previousBounds.y) star.y *= bounds.y / previousBounds.y;
      }
      limit(star);
      paint(star);
    });
  }

  function translate() {
    for (const star of stars) {
      star.button.setAttribute('aria-label', copy().scrapStar + ' ' + (star.index + 1));
    }
    if (message.textContent) message.textContent = copy().scrapStarCatch;
  }

  function reward() {
    if (rewarded) return;
    rewarded = true;
    message.textContent = copy().scrapStarCatch;
    setTimeout(() => { message.textContent = ''; }, 3500);
  }

  function nudge(star) {
    const direction = star.x > bounds.x / 2 ? -1 : 1;
    star.x += direction * 6;
    if (!motion.matches) star.vx = direction * 38;
    limit(star);
    paint(star);
  }

  function start(star, event) {
    if (event.button !== 0 || !event.isPrimary || active) return;
    star.x += star.dx;
    star.y += star.dy;
    star.dx = 0;
    star.dy = 0;
    star.vx = 0;
    star.vy = 0;
    limit(star);
    paint(star);
    active = {
      star, id: event.pointerId, x: event.clientX, y: event.clientY,
      startX: event.clientX, startY: event.clientY,
      time: event.timeStamp, dragged: false,
    };
    star.button.setPointerCapture(event.pointerId);
  }

  function move(star, event) {
    if (active?.star !== star || active.id !== event.pointerId) return;
    const dx = event.clientX - active.x;
    const dy = event.clientY - active.y;
    const seconds = Math.max(0.01, (event.timeStamp - active.time) / 1000);
    const cap = value => Math.max(-140, Math.min(140, value));
    star.x += dx;
    star.y += dy;
    star.vx = cap((dx / seconds) * .55);
    star.vy = cap((dy / seconds) * .55);
    active.x = event.clientX;
    active.y = event.clientY;
    active.time = event.timeStamp;
    active.dragged ||= Math.hypot(active.x - active.startX, active.y - active.startY) >= 12;
    limit(star);
    paint(star);
  }

  function end(star, event, release) {
    if (active?.star !== star || active.id !== event.pointerId) return;
    const { dragged, time } = active;
    active = null;
    if (!release || motion.matches || event.timeStamp - time > 130) {
      star.vx = 0;
      star.vy = 0;
    }
    if (release && dragged) reward();
    if (release && !dragged) nudge(star);
  }

  function animate(now) {
    const dt = previous ? Math.min(.034, (now - previous) / 1000) : 0;
    previous = now;
    elapsed += dt;
    for (const star of stars) {
      if (active?.star === star) continue;
      star.x += star.vx * dt;
      star.y += star.vy * dt;
      const damping = Math.exp(-6 * dt);
      star.vx *= damping;
      star.vy *= damping;
      const phase = elapsed * (.58 + star.index * .04) + star.index * 1.7;
      const settle = Math.min(1, elapsed);
      star.dx = Math.sin(phase * .72) * 5 * settle;
      star.dy = Math.sin(phase) * 3 * settle;
      const sparkle = star.button.firstElementChild;
      sparkle.style.opacity = String(.9 + Math.sin(phase * 1.9) * .10);
      sparkle.style.transform = `scale(${(1 + Math.sin(phase) * .095).toFixed(3)})`;
      limit(star);
      paint(star);
    }
    frame = requestAnimationFrame(animate);
  }

  function syncMotion() {
    if (visible && !document.hidden && !motion.matches) {
      if (!frame) frame = requestAnimationFrame(animate);
      return;
    }
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (!motion.matches) return;
    for (const star of stars) {
      star.dx = 0;
      star.dy = 0;
      star.vx = 0;
      star.vy = 0;
      star.button.firstElementChild.style.cssText = '';
      paint(star);
    }
  }

  function build() {
    if (active) {
      const { star, id } = active;
      active = null;
      if (star.button.hasPointerCapture(id)) star.button.releasePointerCapture(id);
    }
    const count = compact.matches ? 4 : shapes.length;
    const focusedIndex = stars.findIndex(star => star.button === document.activeElement);
    stars = shapes.slice(0, count).map(createStar);
    field.replaceChildren(...stars.map(star => star.button));
    measure(true);
    translate();
    if (focusedIndex >= 0) stars[Math.min(focusedIndex, count - 1)].button.focus();
  }

  patch.hidden = false;
  build();
  new ResizeObserver(() => measure()).observe(field);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncMotion();
  }).observe(patch);
  const languageObserver = new MutationObserver(translate);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  document.addEventListener('visibilitychange', syncMotion);
  motion.addEventListener('change', syncMotion);
  compact.addEventListener('change', build);
})();
