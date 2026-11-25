globalThis.NEZ_VIEW = (() => {
  const icons = 'assets/nez/icons.svg';
  const special = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = value => String(value).replace(/[&<>"']/g, char => special[char]);
  const icon = (name, base = '') => '<svg class="icon" aria-hidden="true"><use href="' + base + icons + '#' + esc(name) + '"/></svg>';
  const external = (href, label, className = 'pixel-button') =>
    '<a class="' + className + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ↗</a>';
  const projectUrl = project => 'projects/' + project.id + '.html';
  const localized = (value, lang) => typeof value === 'string' ? value : value?.[lang];
  const IMAGE = /^(?:media\/)(?:[a-z0-9_-]+\/)*[a-z0-9_.-]+\.(?:avif|webp|png|jpg|jpeg)$/i;
  const VIDEO = /^(?:media\/)(?:[a-z0-9_-]+\/)*[a-z0-9_.-]+\.(?:mp4|webm)$/i;
  const mediaPath = (value, base = '', video = false) =>
    typeof value === 'string' && (video ? VIDEO : IMAGE).test(value) ? base + value : '';
  const safeHttps = value => {
    if (typeof value !== 'string' || !value.startsWith('https://')) return null;
    try {
      const url = new URL(value);
      return url.username || url.password ? null : url;
    } catch { return null; }
  };
  const embedUrl = value => {
    const url = safeHttps(value);
    if (!url || url.port || url.search || url.hash) return '';
    const youtube = url.hostname === 'www.youtube-nocookie.com' && /^\/embed\/[\w-]{11}$/.test(url.pathname);
    const vimeo = url.hostname === 'player.vimeo.com' && /^\/video\/\d+$/.test(url.pathname);
    return youtube || vimeo ? url.href : '';
  };
  const dimensions = ({ width, height }) => Number.isSafeInteger(width) && width > 0 && Number.isSafeInteger(height) && height > 0
    ? ' width="' + width + '" height="' + height + '"' : '';
  function imageMarkup(image, lang, base = '') {
    const src = mediaPath(image?.src, base);
    return src ? '<img src="' + esc(src) + '" alt="' + esc(localized(image.alt, lang) || '') + '"' + dimensions(image) + ' loading="lazy" decoding="async">' : '';
  }
  function cover(project, lang, base = '') {
    const image = imageMarkup(project.media?.cover, lang, base);
    if (image) return '<figure class="cover cover--media">' + image + '</figure>';
    return '<figure class="cover cover--' + esc(project.cover) + '">' + icon(project.cover, base) +
      '<figcaption>' + esc(NEZ_COPY[lang].coverMissing) + '</figcaption></figure>';
  }
  const tags = values => values.length ? '<ul class="tags">' + values.map(value => '<li class="tag">' + esc(value) + '</li>').join('') + '</ul>' : '';
  const status = (project, lang) => NEZ_COPY[lang][project.status] || localized(project.status, lang) || NEZ_COPY[lang].unspecified;
  const cards = (projects, lang, { interactive = false, base = '' } = {}) => projects.map(project => {
    const target = interactive ? ' data-project="' + esc(project.id) + '" data-section="' + esc(project.section) + '"' : '';
    return '<article class="project-card project-card--' + esc(project.id) + '">' +
      '<a href="' + base + projectUrl(project) + '"' + target + '>' + cover(project, lang, base) +
      '<div class="project-copy"><span class="project-status">' + esc(project.category[lang]) + '</span>' +
      '<h3>' + esc(project.name[lang]) + '</h3><p>' + esc(project.summary[lang]) + '</p>' + tags(project.tech) +
      '<span class="project-status">' + esc(status(project, lang)) + '</span></div></a></article>';
  }).join('');

  function media(project, lang, base) {
    const copy = NEZ_COPY[lang];
    const { cover: artwork, gallery = [], video } = project.media || {};
    const frames = [artwork, ...gallery].filter(item => mediaPath(item?.src, base));
    const unique = [...new Map(frames.map(item => [item.src, item])).values()];
    const images = unique.map((item, index) => {
      const caption = localized(item.caption, lang);
      const label = localized(item.alt, lang) || project.name[lang] + ' ' + (index + 1);
      return '<figure class="media-frame"><a href="' + esc(mediaPath(item.src, base)) + '" data-gallery-image aria-label="' +
        esc(copy.enlarge + ' ' + label) + '">' + imageMarkup(item, lang, base) + '</a>' +
        (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') + '</figure>';
    }).join('');
    const src = mediaPath(video?.src, base, true);
    const embed = embedUrl(video?.embed);
    const poster = mediaPath(video?.poster, base);
    const title = localized(video?.title, lang) || project.name[lang] + ' · ' + copy.video;
    let player = '';
    if (src) {
      player = '<video controls playsinline preload="none" aria-label="' + esc(title) + '"' +
        (poster ? ' poster="' + esc(poster) + '"' : '') + ' src="' + esc(src) + '"' + dimensions(video) + '></video>' +
        '<a class="media-direct" href="' + esc(src) + '">' + esc(copy.videoDirect) + '</a>';
    } else if (embed) {
      player = '<button type="button" class="media-embed-button" data-video-embed="' + esc(embed) + '" data-video-title="' +
        esc(title) + '">' + (poster ? '<img src="' + esc(poster) + '" alt="" loading="lazy">' : '') +
        '<span>' + esc(copy.videoLoad) + '</span></button><noscript>' + external(embed, copy.videoDirect) + '</noscript>';
    }
    if (!images && !player) return '';
    return '<section class="project-media" data-gallery-group aria-label="' + esc(copy.gallery) + '"><h2>' + esc(copy.gallery) + '</h2>' +
      (images ? '<div class="media-grid">' + images + '</div>' : '') +
      (player ? '<div class="media-video">' + player + '</div>' : '') + '</section>';
  }

  const detail = (project, lang, { inWindow = false, base = '' } = {}) => {
    const copy = NEZ_COPY[lang];
    const heading = inWindow ? 'h3' : 'h1';
    const title = '<' + heading + (inWindow ? ' tabindex="-1" data-detail-title' : '') + '>' + esc(project.name[lang]) + '</' + heading + '>';
    const source = safeHttps(project.source);
    const demo = safeHttps(project.demo);
    const fullPage = inWindow ? '<a class="pixel-button" href="' + projectUrl(project) + '">' + esc(copy.fullPage) + ' ' + icon('arrow') + '</a>' : '';
    const related = project.related;
    const relatedLabel = localized(related?.label, lang);
    const relatedLink = relatedLabel && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(related.id)
      ? '<a class="pixel-button" href="' + base + projectUrl(related) + '">' + esc(relatedLabel) + '</a>'
      : '';
    const actions = (source ? external(source.href, copy.source) : '') + (demo ? external(demo.href, copy.demo) : '') + relatedLink + fullPage;
    const role = localized(project.role, lang);
    const devlog = localized(project.devlog, lang);
    const gallery = media(project, lang, base);
    const target = localized(project.releaseTarget, lang);
    const targetLabel = lang === 'tr' ? 'Hedef sürüm' : 'Release target';
    const sectionHeading = inWindow ? 'h4' : 'h2';
    const sections = (project.sections || []).map(section =>
      '<section class="project-devlog"><' + sectionHeading + '>' + esc(localized(section.heading, lang)) + '</' + sectionHeading + '>' +
      '<ul>' + section.items.map(item => '<li>' + esc(localized(item, lang)) + '</li>').join('') + '</ul></section>'
    ).join('');
    return title + '<p class="plain-lead">' + esc(project.category[lang]) + '</p>' +
      '<p>' + esc(project.detail[lang]) + '</p><dl class="project-facts">' +
      '<div><dt>' + esc(copy.status) + '</dt><dd>' + esc(status(project, lang)) + '</dd></div>' +
      (target ? '<div><dt>' + esc(targetLabel) + '</dt><dd>' + esc(target) + '</dd></div>' : '') +
      (project.tech.length ? '<div><dt>' + esc(copy.tech) + '</dt><dd>' + tags(project.tech) + '</dd></div>' : '') +
      (role ? '<div><dt>' + esc(copy.projectRole) + '</dt><dd>' + esc(role) + '</dd></div>' : '') + '</dl>' +
      (actions ? '<div class="button-row">' + actions + '</div>' : '') +
      (devlog ? '<section class="project-devlog"><h2>' + esc(copy.devlog) + '</h2><p>' + esc(devlog) + '</p></section>' : '') +
      sections + (gallery || '<p class="paper-empty">' + esc(copy.mediaPending) + '</p>');
  };
  return { esc, icon, external, projectUrl, cover, tags, cards, detail, localized, imageMarkup, mediaPath, embedUrl, safeHttps };
})();
