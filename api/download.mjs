// /download: sends the visitor to the newest Kuro APK (see release.mjs).
import {latest} from './release.mjs';

export async function GET(request) {
  const {url} = await latest();
  return new Response(null, {status: 302, headers: {Location: new URL(url, request.url).href, 'Cache-Control': 'public, max-age=60, s-maxage=300'}});
}
