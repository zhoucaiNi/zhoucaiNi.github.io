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
