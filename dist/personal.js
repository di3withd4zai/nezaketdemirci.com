globalThis.NEZ_PERSONAL_VIEW = (() => {
  const statuses = {
    watching: { tr: 'İzliyorum', en: 'Watching' },
    completed: { tr: 'Tamamladım', en: 'Completed' },
    planned: { tr: 'İzleyeceğim', en: 'Plan to watch' },
    paused: { tr: 'Ara verdim', en: 'On hold' },
    dropped: { tr: 'Bıraktım', en: 'Dropped' }
  };
  const copy = {
    tr: {
      search: 'Anime adına göre ara', status: 'İzleme durumu', all: 'Tüm durumlar', favorites: 'Yalnızca favoriler',
      favorite: 'Favori', sort: 'Sıralama', archive: 'Arşiv sırası', name: 'Ada göre', rating: 'Puana göre',
      episodes: 'Bölümler', score: 'Puan', started: 'Başlangıç', finished: 'Bitiş',
      empty: 'Arşive henüz anime eklenmedi.', noResults: 'Aramana uyan bir anime bulunamadı.', count: n => n + ' kayıt',
      more: 'Daha fazla göster',
      notes: 'Deftere henüz not eklenmedi.', art: 'Bu köşeye henüz çizim eklenmedi.',
      current: 'Pano henüz boş.', memories: 'Bu albüme henüz fotoğraf eklenmedi.'
    },
    en: {
      search: 'Search by anime title', status: 'Watch status', all: 'All statuses', favorites: 'Favorites only',
      favorite: 'Favorite', sort: 'Sort by', archive: 'Archive order', name: 'Title', rating: 'Rating',
      episodes: 'Episodes', score: 'Rating', started: 'Started', finished: 'Finished',
      empty: 'No anime has been added to the shelf yet.', noResults: 'No anime matches your search.', count: n => n + (n === 1 ? ' entry' : ' entries'),
      more: 'Show more',
      notes: 'No notes have been added yet.', art: 'No artwork has been added to this corner yet.',
      current: 'The board is empty for now.', memories: 'No photos have been added to this album yet.'
    }
  };
  const textIn = (value, lang) => typeof value === 'string' ? value : value?.[lang];
  const titleOf = (item, lang) => textIn(item.name, lang) || '';
  const searchable = value => value.normalize('NFKD').toLowerCase().replace(/\p{M}/gu, '').replace(/ı/g, 'i').trim();
  const ratingOf = item => typeof item.rating === 'number' ? item.rating : -1;
  function filterAnime(items, options = {}, lang = 'tr') {
    const needle = searchable(options.query || '');
    const filtered = items.filter(item => {
      const titles = typeof item.name === 'string' ? [item.name] : Object.values(item.name || {});
      return titleOf(item, lang) && Object.hasOwn(statuses, item.status) &&
        (!needle || titles.some(title => typeof title === 'string' && searchable(title).includes(needle))) &&
        (!options.status || options.status === item.status) && (!options.favorites || item.favorite === true);
    });
    const byTitle = (left, right) => titleOf(left, lang).localeCompare(titleOf(right, lang), lang);
    if (options.sort === 'name') filtered.sort(byTitle);
    if (options.sort === 'rating') filtered.sort((left, right) => ratingOf(right) - ratingOf(left) || byTitle(left, right));
    return filtered;
  }

  const filters = new Map();
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'tr';
  const baseFrom = mount => mount.dataset.mediaBase === '../' ? '../' : '';
  const field = (label, content) => '<div><dt>' + NEZ_VIEW.esc(label) + '</dt><dd>' + content + '</dd></div>';
  const empty = label => '<p class="paper-empty">' + NEZ_VIEW.esc(label) + '</p>';
  function dateMarkup(date, lang) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return '';
    const value = new Date(date + 'T00:00:00Z');
    if (!Number.isFinite(+value) || value.toISOString().slice(0, 10) !== date) return '';
    const label = new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeZone: 'UTC' }).format(value);
    return '<time datetime="' + date + '">' + label + '</time>';
  }
  function animeCard(item, lang, base) {
    const { esc, icon, imageMarkup } = NEZ_VIEW;
    const t = copy[lang];
    const name = titleOf(item, lang);
    const { watched, total } = item.episodes || {};
    const started = dateMarkup(item.started, lang);
    const finished = dateMarkup(item.finished, lang);
    const note = textIn(item.note, lang);
    return '<article class="anime-card">' + imageMarkup(item.cover, lang, base) +
      '<div class="anime-card-body"><h3>' + esc(name) + '</h3><p class="anime-ribbon">' + statuses[item.status][lang] + '</p>' +
      (item.favorite === true ? '<span class="anime-favorite">' + icon('heart', base) + ' ' + t.favorite + '</span>' : '') +
      '<dl class="anime-facts">' +
      (Number.isSafeInteger(watched) && watched >= 0 ? field(t.episodes, watched + (Number.isSafeInteger(total) && total > 0 ? ' / ' + total : '')) : '') +
      (ratingOf(item) >= 0 && ratingOf(item) <= 10 ? field(t.score, item.rating + ' / 10') : '') +
      (started ? field(t.started, started) : '') + (finished ? field(t.finished, finished) : '') + '</dl>' +
      (note ? '<p>' + esc(note) + '</p>' : '') + '</div></article>';
  }
  function renderAnime(mount, lang = language()) {
    const { esc } = NEZ_VIEW;
    const t = copy[lang];
    const options = filters.get(mount.dataset.animeArchive) || { query: '', status: '', favorites: false, sort: 'archive' };
    const items = NEZ_PERSONAL.anime;
    const available = filterAnime(items, {}, lang).length;
    const disabled = available ? '' : ' disabled';
    const option = (value, label, selected) => '<option value="' + value + '"' + (selected ? ' selected' : '') + '>' + label + '</option>';
    mount.innerHTML = '<div class="anime-filters">' +
      '<label>' + t.search + '<input type="search" data-anime-query value="' + esc(options.query) + '"' + disabled + '></label>' +
      '<label>' + t.status + '<select data-anime-status' + disabled + '>' + option('', t.all, !options.status) +
      Object.entries(statuses).map(([key, value]) => option(key, value[lang], options.status === key)).join('') + '</select></label>' +
      '<label>' + t.sort + '<select data-anime-sort' + disabled + '>' +
      ['archive', 'name', 'rating'].map(key => option(key, t[key], options.sort === key)).join('') + '</select></label>' +
      '<label class="anime-check"><input type="checkbox" data-anime-favorites' + (options.favorites ? ' checked' : '') + disabled + '>' + t.favorites + '</label>' +
      '</div><p class="anime-count" role="status"></p><div data-anime-results></div>' +
      '<div class="button-row" data-anime-more-row hidden><button type="button" class="pixel-button">' + t.more + '</button></div>';
    const output = mount.querySelector('[data-anime-results]');
    const more = mount.querySelector('[data-anime-more-row]');
    const pageSize = mount.dataset.animeArchive === 'home' ? 12 : 24;
    const renderCards = entries => entries.map(item => animeCard(item, lang, baseFrom(mount))).join('');
    let results = [];
    let shown = 0;
    function update() {
      results = filterAnime(items, options, lang);
      shown = Math.min(pageSize, results.length);
      mount.querySelector('.anime-count').textContent = available ? t.count(results.length) : '';
      output.innerHTML = results.length
        ? '<div class="anime-grid">' + renderCards(results.slice(0, shown)) + '</div>'
        : empty(available ? t.noResults : t.empty);
      more.hidden = shown >= results.length;
    }
    more.querySelector('button').addEventListener('click', () => {
      const start = shown;
      shown = Math.min(shown + pageSize, results.length);
      const grid = output.querySelector('.anime-grid');
      grid.insertAdjacentHTML('beforeend', renderCards(results.slice(start, shown)));
      more.hidden = shown >= results.length;
      const firstNew = grid.children[start].querySelector('h3');
      firstNew.tabIndex = -1;
      firstNew.focus();
    });
    const bind = (selector, event, key, property = 'value') => {
      mount.querySelector(selector).addEventListener(event, ({ currentTarget }) => {
        options[key] = currentTarget[property];
        filters.set(mount.dataset.animeArchive, options);
        update();
      });
    };
    bind('[data-anime-query]', 'input', 'query');
    bind('[data-anime-status]', 'change', 'status');
    bind('[data-anime-sort]', 'change', 'sort');
    bind('[data-anime-favorites]', 'change', 'favorites', 'checked');
    update();
  }

  const personalSections = [['personal-notes', 'notes'], ['art-corner', 'art'], ['currently-into', 'current'], ['personal-memories', 'memories']];
  function renderSection(mount, kind, lang) {
    const { esc, imageMarkup, mediaPath } = NEZ_VIEW;
    const base = baseFrom(mount);
    const entries = NEZ_PERSONAL[kind].map(entry => {
      const title = textIn(entry.title, lang);
      const text = textIn(entry.text, lang);
      const date = dateMarkup(entry.date, lang);
      const image = imageMarkup(entry.image, lang, base);
      if (!title && !text && !image) return '';
      if (kind === 'art' || kind === 'memories') {
        const label = textIn(entry.image?.alt, lang) || title || NEZ_COPY[lang].gallery;
        return '<figure class="personal-polaroid">' +
          (image ? '<a href="' + esc(mediaPath(entry.image.src, base)) + '" data-gallery-image aria-label="' +
            esc(NEZ_COPY[lang].enlarge + ' ' + label) + '">' + image + '</a>' : '') +
          (title || text || date ? '<figcaption>' + [title, text].filter(Boolean).map(esc).join(' · ') +
            (date ? '<br>' + date : '') + '</figcaption>' : '') + '</figure>';
      }
      if (kind === 'notes' && title && text) {
        return '<details class="personal-note"><summary>' + esc(title) + '</summary><p>' + esc(text) + '</p>' + date + image + '</details>';
      }
      return '<article class="personal-note">' + (title ? '<h3>' + esc(title) + '</h3>' : '') +
        (text ? '<p>' + esc(text) + '</p>' : '') + date + image + '</article>';
    }).filter(Boolean);
    mount.classList.add('personal-collection');
    mount.dataset.galleryGroup = '';
    mount.innerHTML = entries.join('') || empty(copy[lang][kind]);
  }
  function render() {
    const lang = language();
    const homeShelf = document.querySelector('#anime-shelf');
    if (homeShelf) homeShelf.dataset.animeArchive = 'home';
    document.querySelectorAll('[data-anime-archive]').forEach(mount => renderAnime(mount, lang));
    for (const [id, kind] of personalSections) {
      const mount = document.getElementById(id);
      if (mount) renderSection(mount, kind, lang);
    }
  }
  if (typeof document !== 'undefined') {
    render();
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  return { filterAnime, renderAnime };
})();
