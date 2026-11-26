// The APK the website offers. The owner publishes new versions in the app (Profile → Owner →
// Publish an update); when one is published, the website links to it. Otherwise it offers the APK
// that ships with this site (public/kuro-<version>.apk).
const BUNDLED = {version: '1.3.8', url: '/kuro-1.3.8.apk'};
const RELEASE_API = 'https://kuro-community.kuro-manga.workers.dev/v1/app/release';

const newer = (a, b) => {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
};

/** The newest release: the published one if it's newer and has a safe https link, else the bundled APK. */
export async function latest() {
  try {
    const response = await fetch(RELEASE_API, {headers: {Accept: 'application/json'}, signal: AbortSignal.timeout(3000)});
    const data = await response.json();
    const url = typeof data?.url === 'string' ? new URL(data.url) : null;
    if (response.ok && typeof data.version === 'string' && /^\d+\.\d+\.\d+$/.test(data.version) && url?.protocol === 'https:' && newer(data.version, BUNDLED.version))
      return {version: data.version, url: url.href};
  } catch { /* fall back to the bundled APK */ }
  return BUNDLED;
}

export async function GET() {
  return Response.json(await latest(), {headers: {'Cache-Control': 'public, max-age=60, s-maxage=300', 'X-Content-Type-Options': 'nosniff'}});
}
