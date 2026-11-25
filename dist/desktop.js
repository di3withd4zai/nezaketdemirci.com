(() => {
  'use strict';
  const { esc, icon, external, tags, cards, detail } = NEZ_VIEW;
  const folders = {
    about: ['ABOUT_ME.EXE', 'person'], games: ['MY_GAMES.EXE', 'game'], coding: ['CODING_PROJECTS.EXE', 'terminal'],
    toolbox: ['TOOLBOX.EXE', 'tools'], experience: ['EXPERIENCE.EXE', 'hour'], creative: ['CREATIVE_CORNER.EXE', 'heart'],
    contact: ['CONTACT.EXE', 'mail'], resume: ['resume.pdf', 'file'], anime: ['ANIME_SHELF.EXE', 'book']
  };
  const inventory = [
    ['C', 'C#', 'Java', 'JavaScript', 'SQL', 'Python'], ['HTML', 'CSS', 'JavaScript', 'UI Design'],
    ['Godot', 'Unity', 'SDL2'], ['Git', 'GitHub', 'Visual Studio', 'VS Code', 'Eclipse', 'Blender', 'Netlify']
  ];
  const profile = {
    email: 'nezaketdemirci1@gmail.com', github: 'https://github.com/di3withd4zai',
    linkedin: 'https://www.linkedin.com/in/nezaketdemirci', website: 'https://nezaketdemirci.com'
  };
  const desktop = document.querySelector('#desktop-base');
  const layer = document.querySelector('#window-layer');
  const tasks = document.querySelector('#tasks');
  const idle = document.querySelector('#task-idle');
  const announcer = document.querySelector('#window-status');
  const mobile = matchMedia('(max-width: 720px)');
  const windows = new Map();
  const visibleStack = [];
  const catButton = document.querySelector('#cat-button');
  const catMessage = document.querySelector('#cat-message');
  let lang = 'tr';
  try {
    if (localStorage.getItem('nez-language') === 'en') lang = 'en';
  } catch {}
  let catIndex = -1;
  let catTimer;
  let drag;

  const copy = () => NEZ_COPY[lang];
  const active = () => visibleStack.at(-1);
  const removeFromStack = state => {
    const index = visibleStack.indexOf(state);
    if (index !== -1) visibleStack.splice(index, 1);
  };
  const announce = (state, verb) => {
    announcer.textContent = `${copy().folders[state.id]} ${copy()[verb]}`;
  };
  const resumeLink = () => `<a class="pixel-button primary" href="cv.html">${esc(copy().cvView)} ${icon('arrow')}</a>`;

  function windowContent(state) {
    const t = copy();
    const list = NEZ_PROJECTS.filter(project => project.section === state.id);
    if (state.project) {
      return `<button class="pixel-button" type="button" data-back>‹ ${esc(t.back)}</button>${detail(state.project, lang, { inWindow: true })}`;
    }
    switch (state.id) {
      case 'about': {
        const portrait = desktop.querySelector('.polaroid-avatar');
        return `<div class="identity">
          <figure><img class="identity-portrait" src="${esc(portrait.getAttribute('src'))}" width="${esc(portrait.getAttribute('width'))}" height="${esc(portrait.getAttribute('height'))}" alt="${esc(t.scrapAvatarAlt)}"><figcaption>${esc(t.scrapAvatar)}</figcaption></figure>
          <div><h3>${esc(t.about)}</h3><p>${esc(t.role)}</p><p>${esc(t.gameDev)}</p></div>
        </div><p>${esc(t.bio)}</p>
        <p><strong>${esc(t.education)}</strong><br>${esc(t.marmara)} · ${esc(t.program)}</p>
        <p><strong>${esc(t.interests)}</strong><br>${esc(t.interestsText)}</p>`;
      }
      case 'games':
      case 'coding':
        return `<h3>${esc(t[state.id])}</h3><div class="project-grid">${cards(list, lang, { interactive: true })}</div>`;
      case 'toolbox':
        return `<h3>${esc(t.folders.toolbox)}</h3><div class="inventory">${inventory.map((values, index) => `<article><h4>${esc(t.skillGroups[index])}</h4>${tags(values)}</article>`).join('')}</div>`;
      case 'experience':
        return `<h3>${esc(t.timelineTitle)}</h3><ul class="timeline">
          <li><strong>${esc(t.marmara)}</strong><span>${esc(t.program)} · ${esc(t.currentStudy)}</span></li>
          <li><strong>${esc(t.school)}</strong><span>${esc(t.schoolDates)}</span></li>
          <li><strong>${esc(t.bunkasai)}</strong><span>${esc(t.event)}</span>${external('assets/certificates/ikhal-bunkasai.pdf', t.certificate, 'certificate')}</li>
        </ul>`;
      case 'anime':
        return `<h3>${esc(t.animeTitle)}</h3><div data-anime-archive="window"></div><p><a class="pixel-button" href="anime.html">${esc(t.animeTitle)} ${icon('arrow')}</a></p>`;
      case 'creative':
        return `<h3>${esc(t.creativeTitle)} ${icon('sparkle')}</h3><p><strong>${esc(t.coming)}</strong></p><p>${esc(t.creativeText)}</p><a class="pixel-button" href="blog.html">${esc(t.notes)} ${icon('arrow')}</a>`;
      case 'contact':
        return `<h3>${esc(t.contactTitle)}</h3><p>${esc(t.contactText)}</p><div class="message-card"><dl>
          <div><dt>${esc(t.email)}</dt><dd><a href="mailto:${profile.email}">${profile.email}</a></dd></div>
          <div><dt>GitHub</dt><dd>${external(profile.github, 'di3withd4zai', 'profile-link')}</dd></div>
          <div><dt>LinkedIn</dt><dd>${external(profile.linkedin, '/in/nezaketdemirci', 'profile-link')}</dd></div>
          <div><dt>${esc(t.visit)}</dt><dd>${external(profile.website, 'nezaketdemirci.com', 'profile-link')}</dd></div>
        </dl></div>${resumeLink()}`;
      case 'resume':
        return `<h3>${esc(t.resumeTitle)}</h3><p>${esc(t.resumeText)}</p><div class="button-row">${resumeLink()}<a class="pixel-button" href="${NEZ_DOCUMENTS.cvFiles[lang]}" download>${esc(t.cvDownload)}</a></div>`;
    }
  }

  function renderWindow(state) {
    const t = copy();
    const group = state.element.querySelector('.window-controls');
    group.setAttribute('aria-label', t.windowControls);
    const languageButton = group.querySelector('[data-lang]');
    languageButton.dataset.lang = lang === 'tr' ? 'en' : 'tr';
    languageButton.lang = languageButton.dataset.lang;
    languageButton.textContent = languageButton.lang.toUpperCase();
    languageButton.setAttribute('aria-label', lang === 'tr' ? 'Switch to English' : 'Türkçeye geç');
    for (const button of group.querySelectorAll('[data-window-action]')) {
      const action = button.dataset.windowAction;
      const label = action === 'maximize' && state.maximized ? t.restore : t[action];
      button.title = label;
      button.setAttribute('aria-label', label);
      if (action === 'maximize') button.textContent = state.maximized ? '❐' : '□';
    }
    state.task.textContent = t.folders[state.id];
    state.body.innerHTML = windowContent(state);
    if (state.id === 'anime') NEZ_PERSONAL_VIEW.renderAnime(state.body.querySelector('[data-anime-archive]'), lang);
  }

  function createWindow(id) {
    const [title, glyph] = folders[id];
    const element = document.createElement('dialog');
    element.id = `window-${id}`;
    element.className = 'os-window';
    element.setAttribute('aria-labelledby', `title-${id}`);
    element.innerHTML = `<div class="window-titlebar">
      <h2 class="window-heading" id="title-${id}">${icon(glyph)} ${title}</h2>
      <div class="window-controls" role="group">
        <button type="button" class="mobile-window-language" data-lang="en">EN</button>
        <button type="button" data-window-action="minimize">–</button>
        <button type="button" data-window-action="maximize" aria-pressed="false">□</button>
        <button type="button" data-window-action="close">×</button>
      </div></div><div class="window-body" tabindex="0"></div>`;
    const task = document.createElement('button');
    task.className = 'task';
    task.type = 'button';
    task.setAttribute('aria-controls', element.id);
    task.dataset.task = id;
    const state = { id, element, task, body: element.querySelector('.window-body'), closeButton: element.querySelector('[data-window-action="close"]'), opener: null, project: null, position: null, maximized: false };
    element.addEventListener('cancel', event => {
      event.preventDefault();
      dismiss(state, false);
    });
    element.addEventListener('pointerdown', () => bringForward(state));
    element.addEventListener('focusin', () => {
      if (!mobile.matches && element.open) bringForward(state);
    });
    element.querySelector('.window-titlebar').addEventListener('pointerdown', event => startDrag(state, event));
    element.addEventListener('animationend', () => element.classList.remove('opening'));
    renderWindow(state);
    layer.append(element);
    tasks.append(task);
    windows.set(id, state);
    return state;
  }

  function syncWindows() {
    visibleStack.forEach((state, index) => {
      state.element.style.zIndex = String(30 + index);
    });
    for (const state of windows.values()) {
      state.element.classList.toggle('is-active', state === active());
      state.task.setAttribute('aria-pressed', String(state === active()));
    }
    for (const link of desktop.querySelectorAll('[data-open]')) {
      const state = windows.get(link.dataset.open);
      link.setAttribute('aria-expanded', String(Boolean(state?.element.open)));
    }
    idle.hidden = windows.size !== 0;
  }

  function bringForward(state) {
    if (active() === state || !state.element.open) return;
    removeFromStack(state);
    visibleStack.push(state);
    syncWindows();
  }

  function place(state) {
    if (mobile.matches || !state.element.open) return;
    const bounds = state.element.getBoundingClientRect();
    const gap = window.innerHeight - document.querySelector('.taskbar').offsetHeight;
    const margin = 12;
    const cascade = Math.max(0, visibleStack.indexOf(state)) % 4 * 22;
    const initial = { x: (window.innerWidth - bounds.width) / 2 + cascade, y: (gap - bounds.height) / 2 + cascade };
    const position = state.maximized ? { x: margin, y: margin } : state.position || initial;
    const x = Math.max(margin, Math.min(position.x, window.innerWidth - bounds.width - margin));
    const y = Math.max(margin, Math.min(position.y, gap - bounds.height - margin));
    state.element.style.left = `${x}px`;
    state.element.style.top = `${y}px`;
    if (!state.maximized) state.position = { x, y };
  }

  function show(state, moveFocus = true) {
    if (!state.element.open) {
      if (mobile.matches) state.element.showModal();
      else state.element.show();
      state.element.classList.add('opening');
    }
    bringForward(state);
    place(state);
    if (moveFocus) state.closeButton.focus({ preventScroll: true });
  }

  function openWindow(id, trigger, project = null) {
    const state = windows.get(id) || createWindow(id);
    if (!state.opener || !state.element.open) state.opener = trigger;
    state.project = project;
    renderWindow(state);
    show(state);
    if (project) state.body.querySelector('[data-detail-title]').focus({ preventScroll: true });
    announce(state, 'opened');
  }

  function dismiss(state, minimize) {
    state.element.close();
    removeFromStack(state);
    if (!minimize) {
      state.element.remove();
      state.task.remove();
      windows.delete(state.id);
    }
    const previousWindow = active();
    if (mobile.matches && previousWindow) show(previousWindow);
    syncWindows();
    if (mobile.matches && previousWindow) previousWindow.closeButton.focus({ preventScroll: true });
    else if (minimize && state.task.isConnected) state.task.focus({ preventScroll: true });
    else if (state.opener?.isConnected && state.opener.getClientRects().length) state.opener.focus({ preventScroll: true });
    else if (active()) active().closeButton.focus({ preventScroll: true });
    else desktop.querySelector(`[data-open="${state.id}"]`)?.focus({ preventScroll: true });
    announce(state, minimize ? 'minimized' : 'closed');
  }

  function toggleMaximized(state) {
    state.maximized = !state.maximized;
    state.element.classList.toggle('is-maximized', state.maximized);
    const control = state.element.querySelector('[data-window-action="maximize"]');
    control.setAttribute('aria-pressed', String(state.maximized));
    control.setAttribute('aria-label', copy()[state.maximized ? 'restore' : 'maximize']);
    control.title = control.getAttribute('aria-label');
    control.textContent = state.maximized ? '❐' : '□';
    place(state);
  }

  function startDrag(state, event) {
    if (mobile.matches || state.maximized || event.button !== 0 || event.target.closest('button')) return;
    const rect = state.element.getBoundingClientRect();
    drag = { state, pointer: event.pointerId, left: event.clientX - rect.left, top: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  window.addEventListener('pointermove', event => {
    if (!drag || drag.pointer !== event.pointerId) return;
    drag.state.position = { x: event.clientX - drag.left, y: event.clientY - drag.top };
    place(drag.state);
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    window.addEventListener(type, event => {
      if (drag?.pointer === event.pointerId) drag = null;
    });
  }

  function setLanguage(next) {
    lang = next;
    const t = copy();
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('nez-language', lang);
    } catch {}
    desktop.querySelectorAll('[data-copy]').forEach(node => {
      const key = node.dataset.copy;
      node.textContent = key.startsWith('folders.') ? t.folders[key.split('.')[1]] : t[key];
    });
    desktop.querySelectorAll('[data-aria]').forEach(node => node.setAttribute('aria-label', t[node.dataset.aria]));
    desktop.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    for (const [section, selector] of [['games', '#featured-projects'], ['coding', '#coding-projects']]) {
      const mount = document.querySelector(selector);
      if (mount) mount.innerHTML = cards(NEZ_PROJECTS.filter(project => project.section === section), lang, { interactive: true });
    }
    windows.forEach(state => {
      if (!state.opener?.isConnected && state.opener?.dataset.project) {
        state.opener = desktop.querySelector(`[data-project="${state.opener.dataset.project}"]`);
      }
      const scroll = state.body.scrollTop;
      renderWindow(state);
      state.body.scrollTop = scroll;
      place(state);
    });
    if (catMessage.textContent) catMessage.textContent = t.catMessages[catIndex];
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    const { lang: next, open, project, task, windowAction } = target.dataset;
    if (target.tagName === 'A' && (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) return;
    if (next) {
      setLanguage(next);
    } else if (open) {
      event.preventDefault();
      openWindow(open, target);
    } else if (project) {
      event.preventDefault();
      const entry = NEZ_PROJECTS.find(item => item.id === project);
      openWindow(entry.section, target, entry);
    } else if (task) {
      const state = windows.get(task);
      if (state === active()) dismiss(state, true);
      else show(state);
    } else if (windowAction || target.hasAttribute('data-back')) {
      const state = windows.get(target.closest('dialog').id.slice('window-'.length));
      if (windowAction === 'close') dismiss(state, false);
      else if (windowAction === 'minimize') dismiss(state, true);
      else if (windowAction === 'maximize') toggleMaximized(state);
      else {
        const previous = state.project.id;
        state.project = null;
        renderWindow(state);
        state.body.querySelector(`[data-project="${previous}"]`).focus();
        place(state);
      }
    }
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.defaultPrevented && !mobile.matches && active() && !document.querySelector('.media-lightbox[open]')) {
      event.preventDefault();
      dismiss(active(), false);
    }
  });

  mobile.addEventListener('change', event => {
    // A dialog opened with show() cannot become modal until closed.
    const selected = active();
    if (!selected) return;
    for (const state of visibleStack) state.element.close();
    if (event.matches) {
      selected.element.showModal();
      selected.closeButton.focus({ preventScroll: true });
    } else {
      for (const state of [...visibleStack]) {
        state.element.show();
        place(state);
      }
      selected.closeButton.focus({ preventScroll: true });
    }
    syncWindows();
  });
  window.addEventListener('resize', () => visibleStack.forEach(place));
  catButton.addEventListener('click', () => {
    clearTimeout(catTimer);
    catIndex = (catIndex + 1) % copy().catMessages.length;
    catMessage.textContent = copy().catMessages[catIndex];
    catButton.classList.add('is-happy');
    catTimer = setTimeout(() => {
      catMessage.textContent = '';
      catButton.classList.remove('is-happy');
    }, 4200);
  });

  setLanguage(lang);
  desktop.querySelector('.language').hidden = false;
  catButton.hidden = false;
  desktop.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
  for (const launcher of desktop.querySelectorAll('[data-open]')) {
    launcher.setAttribute('aria-haspopup', 'dialog');
  }
  syncWindows();
})();
