// Jekyll 시절 디렉터리형 주소(/about/, /blog/page2/)도 열리도록 index.html 사본을 만든다.
import fs from 'node:fs';
import path from 'node:path';
import { getAllPosts } from '../lib/posts.mjs';
import { site } from '../lib/site.mjs';
const out = 'out';
const copies = [['about.html', 'about/index.html']];
for (const f of fs.existsSync(path.join(out, 'blog')) ? fs.readdirSync(path.join(out, 'blog')) : []) {
  const m = f.match(/^(page\d+)\.html$/);
  if (m) copies.push([`blog/${f}`, `blog/${m[1]}/index.html`]);
}
for (const [from, to] of copies) {
  const src = path.join(out, from);
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.dirname(path.join(out, to)), { recursive: true });
  fs.copyFileSync(src, path.join(out, to));
}
// front matter redirect_from: 옛 주소에 새 주소로 넘겨주는 페이지를 쓴다 (jekyll-redirect-from 과 같은 모양)
let redirects = 0;
for (const p of getAllPosts()) {
  for (const from of p.redirectFrom) {
    const rel = decodeURI(from).replace(/^\/+/, '');
    const file = path.join(out, rel.endsWith('.html') ? rel : path.join(rel, 'index.html'));
    if (fs.existsSync(file)) { console.warn(`redirect_from 건너뜀(이미 있는 페이지): ${from}`); continue; }
    const to = encodeURI(p.url);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Redirecting…</title><link rel="canonical" href="${site.url}${to}"><meta http-equiv="refresh" content="0; url=${to}"><meta name="robots" content="noindex"></head><body><a href="${to}">${p.title}</a>(으)로 옮겼습니다.<script>location.replace(${JSON.stringify(to)} + location.hash)</script></body></html>\n`);
    redirects++;
  }
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`legacy paths: ${copies.length}, redirects: ${redirects}`);
