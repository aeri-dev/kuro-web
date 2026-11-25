// Shows the newest published version on the buttons, and a hint for visitors on a computer.
(async () => {
  if (!/android/i.test(navigator.userAgent)) {
    const note = document.querySelector('[data-desktop-note]');
    if (note) note.hidden = false;
  }
  try {
    const response = await fetch('/api/release', {headers: {Accept: 'application/json'}});
    if (!response.ok) return;
    const release = await response.json();
    if (typeof release.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(release.version)) return;
    for (const el of document.querySelectorAll('[data-version]')) el.textContent = `Version ${release.version}`;
  } catch { /* the bundled version stays on the page */ }
})();
