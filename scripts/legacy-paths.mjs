// Jekyll 시절 디렉터리형 주소(/about/, /blog/page2/)도 열리도록 index.html 사본을 만든다.
import fs from 'node:fs';
import path from 'node:path';
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
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`legacy paths: ${copies.length}`);
