// Local preview of the site as Vercel serves it: files from public/, /download and /api/release.
//   node scripts/serve.mjs   → http://localhost:3000
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {extname, join, normalize, resolve} from 'node:path';
import {GET as release} from '../api/release.mjs';
import {GET as download} from '../api/download.mjs';

const root = resolve(import.meta.dirname, '..', 'public');
const types = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.apk': 'application/vnd.android.package-archive'};
const port = Number(process.env.PORT) || 3000;

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const api = {'/api/release': release, '/download': download, '/api/download': download}[url.pathname];
  if (api) {
    const response = await api(new Request(url));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
    return;
  }
  const path = normalize(join(root, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)));
  try {
    if (!path.startsWith(root) || !(await stat(path)).isFile()) throw new Error();
    res.writeHead(200, {'Content-Type': types[extname(path)] || 'application/octet-stream'});
    res.end(await readFile(path));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, () => console.log(`Kuro site on http://localhost:${port}`));
