// Wavy name: split the title into letters for the CSS wave.
const title = document.querySelector('.title');
if (title) {
  const text = title.textContent.trim();
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = ch === ' ' ? 'space' : 'letter';
    span.textContent = ch === ' ' ? '' : ch;
    span.style.setProperty('--i', i);
    visual.append(span);
  });
  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = text;
  title.replaceChildren(label, visual);
}

const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

// Ease cards in as they scroll into view.
const reveals = document.querySelectorAll('.reveal');
if (motionOK && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// Parallax: hero layers move at different speeds while scrolling.
const hero = document.querySelector('.hero');
if (hero && motionOK) {
  let queued = false;
  const update = () => {
    queued = false;
    hero.style.setProperty('--scroll', Math.min(window.scrollY, hero.offsetHeight).toFixed(0));
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

// Day/night toggle. The default comes from local time (see setSky in <head>);
// a toggle sticks for this visit only, so the next visit follows the clock again.
const toggle = document.querySelector('.theme-toggle');
const sun = document.querySelector('.hero .sun');
const label = () => {
  if (toggle) {
    const night = document.documentElement.dataset.theme === 'dark';
    toggle.setAttribute('aria-label', night ? 'Switch to day mode' : 'Switch to night mode');
  }
};
const flip = () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try {
    sessionStorage.setItem('theme', next);
  } catch (e) {}
  window.setSky(next);
  label();
};
let switching = false;
const switchSky = () => {
  if (switching) return;
  // With a sun on screen and motion allowed: it sets behind the hills, then the moon rises.
  if (!sun || !motionOK) return flip();
  switching = true;
  hero.classList.add('is-setting');
  setTimeout(() => {
    flip();
    hero.classList.remove('is-setting');
    switching = false;
  }, 600);
};
if (toggle) toggle.addEventListener('click', switchSky);
if (sun) sun.addEventListener('click', switchSky);
label();

// Lighthouse at night: the beam turns like a real lamp. It reaches out to one side,
// narrows as it swings toward you (flashing at the lamp), then passes behind the tower.
const sweeps = document.querySelectorAll('.lighthouse-light .sweep');
const halo = document.querySelector('.lighthouse-light .halo');
if (sweeps.length === 2 && halo && motionOK) {
  const [back, front] = sweeps;
  const period = 8000;
  let frame = 0;
  let onScreen = true;
  const draw = (t) => {
    const angle = (t / period) * 2 * Math.PI;
    const side = Math.cos(angle); // how far the beam reaches left (+) or right (-)
    const depth = Math.sin(angle); // > 0 toward the viewer, < 0 behind the tower
    const spread = 1 + 1.5 * (1 - Math.abs(side)); // a beam seen end-on looks wider
    const transform = `scale(${side.toFixed(3)} ${spread.toFixed(3)})`;
    front.setAttribute('transform', transform);
    back.setAttribute('transform', transform);
    front.style.opacity = depth >= 0 ? 1 : 0;
    back.style.opacity = depth < 0 ? 0.45 : 0;
    halo.style.opacity = (0.35 + 0.65 * Math.max(0, depth) ** 4).toFixed(3);
    frame = requestAnimationFrame(draw);
  };
  const sync = () => {
    const run = document.documentElement.dataset.theme === 'dark' && onScreen && !document.hidden;
    if (run && !frame) frame = requestAnimationFrame(draw);
    if (!run && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    }).observe(front.closest('.hero'));
  }
  sync();
}

// Photo viewer: grid links open in a dialog with previous/next, arrow keys, Esc and swipe.
const grid = document.querySelector('.photo-grid');
const viewer = document.querySelector('.lightbox');
if (grid && viewer && viewer.showModal) {
  const links = [...grid.querySelectorAll('a')];
  const big = viewer.querySelector('img');
  const caption = viewer.querySelector('.lightbox-caption');
  let current = 0;
  const show = (n) => {
    current = (n + links.length) % links.length;
    const thumb = links[current].querySelector('img');
    big.src = links[current].href;
    big.alt = thumb.alt;
    caption.textContent = thumb.alt;
  };
  grid.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    show(links.indexOf(link));
    viewer.showModal();
  });
  viewer.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  viewer.querySelector('.lightbox-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  let touchX = null;
  viewer.addEventListener('touchstart', (e) => (touchX = e.touches[0].clientX), { passive: true });
  viewer.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) show(dx < 0 ? current + 1 : current - 1);
  });
  viewer.addEventListener('close', () => links[current].focus());
}

// Projects: turn the cards into one Finder-style window, a list on the left and the
// chosen project on the right. The cards stay in the HTML, so without this script
// (or before it runs) visitors still see them all.
const projectList = document.querySelector('.projects');
if (projectList) buildFinder(projectList);

function buildFinder(list) {
  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  };
  const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const groups = [
    ['work', 'Work'],
    ['featured', 'Featured'],
    ['more', 'More projects'],
  ];
  const groupName = Object.fromEntries(groups);

  // read each card once
  const projects = [...list.querySelectorAll('.project-box')].map((card) => {
    const tech = card.querySelector('.project-tech');
    return {
      id: card.id,
      group: groupName[card.dataset.group] ? card.dataset.group : 'more',
      title: card.querySelector('h2').textContent.trim(),
      date: (card.querySelector('.project-date') || {}).textContent || '',
      img: card.querySelector('.project-pic img'),
      tall: !!card.querySelector('.project-pic--tall'),
      tagline: (card.querySelector('.project-tagline') || {}).textContent || '',
      desc: card.querySelector('.project-detail > p:not([class])'),
      tech: tech ? tech.textContent.replace('Built with:', '').trim() : '',
      link: card.querySelector('.btn'),
    };
  });
  const order = groups.flatMap(([key]) => projects.filter((p) => p.group === key));

  // the window
  const win = make('div', 'finder');
  win.setAttribute('role', 'region');
  win.setAttribute('aria-label', 'Projects window');
  win.innerHTML = `
    <div class="finder-toolbar">
      <div class="finder-dots" role="group" aria-label="Window buttons">
        <button class="finder-close" type="button" data-glyph="×" aria-label="Close the projects window"></button>
        <button class="finder-min" type="button" data-glyph="−" aria-label="Hide the project list" aria-pressed="false"></button>
        <button class="finder-zoom" type="button" data-glyph="+" aria-label="Zoom the window wider" aria-pressed="false"></button>
      </div>
      <div class="finder-nav">
        <button type="button" class="finder-prev" aria-label="Back" disabled>${icon('m15 18-6-6 6-6')}</button>
        <button type="button" class="finder-next" aria-label="Forward" disabled>${icon('m9 18 6-6-6-6')}</button>
      </div>
      <p class="finder-name" aria-hidden="true"></p>
      <label class="finder-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <span class="sr-only">Search projects</span>
        <input type="search" placeholder="Search" autocomplete="off">
      </label>
    </div>
    <div class="finder-main">
      <nav class="finder-list" aria-label="Project list"></nav>
      <div class="finder-pane" aria-live="polite"></div>
    </div>
    <p class="finder-status"></p>`;
  const folder = make('button', 'finder-folder');
  folder.type = 'button';
  folder.hidden = true;
  folder.setAttribute('aria-label', 'Open the projects window');
  folder.innerHTML = `${icon('M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z')}<b>Projects</b><small>${projects.length} items</small>`;

  const $ = (sel) => win.querySelector(sel);
  const side = $('.finder-list');
  const pane = $('.finder-pane');
  const name = $('.finder-name');
  const status = $('.finder-status');
  const search = $('input');
  const prevBtn = $('.finder-prev');
  const nextBtn = $('.finder-next');
  const items = new Map();
  let current = order[0];
  let visible = order.slice();
  let trail = [current];
  let step = 0;

  const showStatus = () => {
    const term = search.value.trim();
    status.textContent = term
      ? `${visible.length} of ${projects.length} match`
      : `${order.indexOf(current) + 1} of ${projects.length} · ${groupName[current.group]}`;
  };

  function renderList() {
    const term = search.value.trim().toLowerCase();
    const hit = (p) => !term || [p.title, p.tagline, p.tech, p.desc ? p.desc.textContent : ''].join(' ').toLowerCase().includes(term);
    side.replaceChildren();
    items.clear();
    visible = [];
    groups.forEach(([key, label]) => {
      const found = order.filter((p) => p.group === key && hit(p));
      if (!found.length) return;
      const heading = make('p', 'finder-group', label);
      heading.id = `finder-group-${key}`;
      const ul = make('ul');
      ul.setAttribute('role', 'listbox');
      ul.setAttribute('aria-labelledby', heading.id);
      found.forEach((p) => {
        const button = make('button', 'finder-item');
        button.type = 'button';
        button.setAttribute('role', 'option');
        const thumb = make('img');
        thumb.src = p.img.getAttribute('src');
        thumb.alt = '';
        thumb.loading = 'lazy';
        const label = make('span');
        label.append(make('b', '', p.title), make('small', '', p.date || p.tagline));
        button.append(thumb, label);
        button.addEventListener('click', () => {
          open(p);
          win.classList.add('show-project');
          history.replaceState(null, '', `#${p.id}`);
        });
        const li = make('li');
        li.append(button);
        ul.append(li);
        items.set(p, button);
        visible.push(p);
      });
      side.append(heading, ul);
    });
    if (!visible.length) side.append(make('p', 'finder-empty', `No projects match “${search.value.trim()}”.`));
    markSelected();
    showStatus();
  }

  function markSelected() {
    const focusable = visible.includes(current) ? current : visible[0];
    items.forEach((button, p) => {
      button.setAttribute('aria-selected', String(p === current));
      button.tabIndex = p === focusable ? 0 : -1;
    });
  }

  function open(p, fromTrail) {
    current = p;
    if (!fromTrail && trail[step] !== p) {
      trail = trail.slice(0, step + 1).concat(p);
      step = trail.length - 1;
    }
    prevBtn.disabled = step === 0;
    nextBtn.disabled = step >= trail.length - 1;
    name.textContent = p.title;
    markSelected();

    const info = make('article', 'finder-info');
    const back = make('button', 'finder-back');
    back.type = 'button';
    back.innerHTML = `${icon('m15 18-6-6 6-6')}Projects`;
    back.addEventListener('click', () => {
      win.classList.remove('show-project');
      if (items.get(p)) items.get(p).focus();
    });
    const pic = make('div', p.tall ? 'finder-pic finder-pic--tall' : 'finder-pic');
    const img = p.img.cloneNode();
    img.loading = 'eager';
    pic.append(img);
    const text = make('div', 'finder-text');
    text.append(make('h2', '', p.title));
    if (p.tagline) text.append(make('p', 'finder-tagline', p.tagline));
    if (p.desc) text.append(p.desc.cloneNode(true));
    const facts = make('dl', 'finder-facts');
    const fact = (label, value) => value && facts.append(make('dt', '', label), make('dd', '', value));
    fact('Kind', groupName[p.group]);
    fact('When', p.date);
    fact('Built with', p.tech);
    text.append(facts);
    if (p.link) text.append(p.link.cloneNode(true));
    const body = make('div', 'finder-info-body');
    body.append(pic, text);
    info.append(back, body);
    pane.replaceChildren(info);
    pane.scrollTop = 0;
    showStatus();
  }

  prevBtn.addEventListener('click', () => step > 0 && open(trail[--step], true));
  nextBtn.addEventListener('click', () => step < trail.length - 1 && open(trail[++step], true));
  search.addEventListener('input', () => {
    renderList();
    if (visible.length && !visible.includes(current)) open(visible[0]);
  });

  // arrows, Home/End and first-letter jumps in the list; ← → anywhere in the window
  side.addEventListener('keydown', (e) => {
    if (!visible.length) return;
    const i = Math.max(0, visible.indexOf(current));
    let next = null;
    if (e.key === 'ArrowDown') next = visible[Math.min(i + 1, visible.length - 1)];
    else if (e.key === 'ArrowUp') next = visible[Math.max(i - 1, 0)];
    else if (e.key === 'Home') next = visible[0];
    else if (e.key === 'End') next = visible[visible.length - 1];
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const rest = visible.slice(i + 1).concat(visible.slice(0, i + 1));
      next = rest.find((p) => p.title.toLowerCase().startsWith(e.key.toLowerCase())) || null;
    }
    if (next) {
      e.preventDefault();
      open(next);
      items.get(next).focus();
    }
  });
  win.addEventListener('keydown', (e) => {
    if (e.target.closest('input, .finder-list') || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    const i = visible.indexOf(current);
    if (i >= 0) open(visible[(i + (e.key === 'ArrowRight' ? 1 : -1) + visible.length) % visible.length]);
  });

  // window dots: yellow hides the list, green zooms, red closes into a folder
  const toggleButton = (sel, cls) => {
    const button = $(sel);
    button.addEventListener('click', () => button.setAttribute('aria-pressed', String(win.classList.toggle(cls))));
  };
  toggleButton('.finder-min', 'no-list');
  toggleButton('.finder-zoom', 'is-zoomed');

  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const towardFolder = () => {
    // measure where the folder will sit without showing it
    folder.hidden = false;
    folder.style.visibility = 'hidden';
    const w = win.getBoundingClientRect();
    const f = folder.getBoundingClientRect();
    folder.hidden = true;
    folder.style.visibility = '';
    return `translate(${f.left + f.width / 2 - (w.left + w.width / 2)}px, ${f.top + f.height / 2 - (w.top + w.height / 2)}px) scale(0.06)`;
  };
  $('.finder-close').addEventListener('click', () => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      win.hidden = true;
      if (anim) anim.cancel();
      folder.hidden = false;
      folder.focus();
    };
    const anim = motionOK
      ? win.animate([{ transform: 'none', opacity: 1 }, { transform: towardFolder(), opacity: 0 }], { duration: 380, easing, fill: 'forwards' })
      : null;
    if (anim) {
      anim.onfinish = finish;
      setTimeout(finish, 450);
    } else finish();
  });
  folder.addEventListener('click', () => {
    win.hidden = false;
    const from = towardFolder();
    if (motionOK) win.animate([{ transform: from, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing });
    $('.finder-close').focus();
  });

  list.before(folder, win);
  list.hidden = true;
  renderList();

  // links to a project (index.html#slider-fun) open it
  const linked = projects.find((p) => `#${p.id}` === location.hash);
  open(linked || order[0]);
  if (linked) {
    win.classList.add('show-project');
    win.scrollIntoView({ block: 'center' });
  }
}
