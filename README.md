# kuro-web

The download page for **Kuro**, the free manga reader for Android with no ads. Visitors read about the app and download the APK.

Live: https://kuro-web-sigma.vercel.app

- `public/`: the page itself (plain HTML, CSS and a few lines of JavaScript), fonts, the bundled APK (`kuro-1.3.7.apk`), the trailer (`trailer.mp4`, from the promo reel) and real app screens (`img/app/`).
- `api/release.mjs`: answers `/api/release` with the newest version. When the owner publishes an update in the app (Profile → Owner → Publish an update), the site links to that APK automatically; until then it offers the bundled one.
- `api/download.mjs`: `/download` sends the visitor to the newest APK.
- `vercel.json`: Vercel settings and security headers. There is no build step.

## Preview locally

Requires Node 24.

```sh
node scripts/serve.mjs
```

Then open http://localhost:3000.

## Deploy

The Vercel project is connected to `mikopopp/kuro-web`: every push to its `main` branch goes live by itself. `aeri-dev/kuro-web` holds the same code; push to both (`git push mine main` and `git push origin main`).

The QR code (`public/img/qr.svg`) points at the current address. If the site moves to another domain, make a new one for `<address>/download`.

## Shipping a new APK

The simplest way: upload the new APK as a GitHub Release asset, then publish it in the app (Profile → Owner → Publish an update). The site and every installed app pick it up; nothing in this repo has to change.

To bundle the new APK with the site instead, replace `public/kuro-1.3.7.apk`, then update its name and version in `api/release.mjs` and `public/index.html`.
