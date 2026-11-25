// Small touches for the Kuro download page. Everything still works without JavaScript.
document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sections fade up as they scroll into view.
const reveal = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
}, {rootMargin: '0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

// The hero phone cycles through real app screens.
const slides = [...document.querySelectorAll('[data-carousel] img')];
if (slides.length > 1 && !reduce) {
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    slides[i].classList.remove('on');
    i = (i + 1) % slides.length;
    slides[i].loading = 'eager';
    slides[i].classList.add('on');
  }, 3200);
}

// The trailer plays (muted) while it's on screen; the button turns the sound on and off.
const video = document.querySelector('.phone-video video');
const sound = document.querySelector('[data-sound]');
if (video) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { video.preload = 'auto'; video.play().catch(() => {}); } else video.pause();
  }, {threshold: 0.4}).observe(video);
  sound?.addEventListener('click', () => {
    video.muted = !video.muted;
    if (!video.muted) video.play().catch(() => {});
    sound.setAttribute('aria-pressed', String(!video.muted));
    sound.querySelector('span').textContent = video.muted ? 'Turn sound on' : 'Mute';
  });
}

// Phones: a download bar slides in once the first download button has scrolled away.
const dock = document.querySelector('[data-dock]');
const first = document.querySelector('.hero [data-download]');
if (dock && first) {
  new IntersectionObserver(([e]) => {
    const show = !e.isIntersecting && e.boundingClientRect.top < 0;
    dock.classList.toggle('show', show);
    dock.setAttribute('aria-hidden', String(!show));
    dock.querySelector('a').tabIndex = show ? 0 : -1;
  }).observe(first);
}

// iPhone and iPad visitors learn it's an Android app before downloading.
if (/iphone|ipad|ipod/i.test(navigator.userAgent)) document.querySelector('[data-ios-note]')?.removeAttribute('hidden');

// The newest published version, shown on the buttons.
fetch('/api/release', {headers: {Accept: 'application/json'}})
  .then(r => r.ok ? r.json() : null)
  .then(release => {
    if (!release || !/^\d+\.\d+\.\d+$/.test(release.version || '')) return;
    document.querySelectorAll('[data-version]').forEach(el => { el.textContent = `Version ${release.version}`; });
  })
  .catch(() => {});
