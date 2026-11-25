# kuro-web

The download page for **Kuro**, the free manga reader for Android with no ads. Visitors read about the app and download the APK.

- `public/`: the page itself (plain HTML, CSS and a few lines of JavaScript), fonts, images and the bundled APK (`kuro-1.3.7.apk`).
- `api/release.mjs`: answers `/api/release` with the newest version. When the owner publishes an update in the app (Profile → Owner → Publish an update), the site links to that APK automatically; until then it offers the bundled one.
- `api/download.mjs`: `/download` sends the visitor to the newest APK.
- `vercel.json`: Vercel settings and security headers. There is no build step.

## Preview locally

Requires Node 24.

```sh
node scripts/serve.mjs
```

Then open http://localhost:3000.

## Deploy on Vercel

1. On vercel.com: **Add New → Project**, then import `aeri-dev/kuro-web`.
2. Leave every setting as it is (`vercel.json` already sets them) and click **Deploy**.

Every push to `main` deploys again by itself.

## Shipping a new APK

The simplest way: upload the new APK as a GitHub Release asset, then publish it in the app (Profile → Owner → Publish an update). The site and every installed app pick it up; nothing in this repo has to change.

To bundle the new APK with the site instead, replace `public/kuro-1.3.7.apk`, then update its name and version in `api/release.mjs` and `public/index.html`.
