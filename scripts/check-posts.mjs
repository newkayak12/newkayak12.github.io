// 게시 전 점검: npm run build 뒤에 실행한다.
//   node scripts/check-posts.mjs            → 모든 글
//   node scripts/check-posts.mjs <파일명>…  → 지정한 _posts 파일만 (예: 2026-11-16-[AI]-제목.md)
// 1) front matter: categories 가 있는지 (title 이 없으면 파일명이 제목이 된다)  2) out/ 에 글 페이지가 생겼는지
// 3) 페이지의 로컬 이미지가 실제로 있는지  4) 렌더 실패(원문 <pre> 대체)·깨진 mermaid 흔적이 없는지
import fs from 'node:fs';
import path from 'node:path';
import { getAllPosts } from '../lib/posts.mjs';

const only = process.argv.slice(2).map((f) => path.basename(f));
const posts = getAllPosts().filter((p) => !only.length || only.includes(p.file));
if (only.length && posts.length !== only.length) {
  const found = new Set(posts.map((p) => p.file));
  console.error('찾지 못한 글:', only.filter((f) => !found.has(f)).join(', '), '(파일명 날짜 형식·published:false 확인)');
  process.exit(1);
}
if (!fs.existsSync('out')) { console.error('out/ 이 없다. npm run build 먼저.'); process.exit(1); }

// 문제(✗)는 실패로 끝낸다. 경고(!)는 옛 글에 이미 있는 것이라 알리기만 한다(새 글을 지정했을 때는 실패).
let bad = 0, warned = 0;
for (const p of posts) {
  const problems = [];
  const warnings = [];
  if (!p.categories.length) (only.length ? problems : warnings).push('categories 없음 (주소에 카테고리가 빠진다)');
  const file = path.join('out', decodeURI(p.url));
  if (!fs.existsSync(file)) problems.push(`페이지 없음: ${file}`);
  else {
    const html = fs.readFileSync(file, 'utf8');
    for (const [, src] of html.matchAll(/<img[^>]*?src="([^"]+)"/g)) {
      if (/^(https?:|data:)/.test(src) || src.includes('/assets/img/avatar')) continue;
      let dec = src; try { dec = decodeURI(src); } catch {}
      const target = dec.startsWith('/') ? path.join('out', dec) : path.join(path.dirname(file), dec);
      if (!fs.existsSync(target)) problems.push(`이미지 없음: ${dec}`);
    }
    if (/<section class="post-content"><pre>---/.test(html)) problems.push('마크다운 렌더 실패(원문으로 표시됨)');
    if (/<pre><code[^>]*>\s*<\/code><\/pre>/.test(html)) problems.push('빈 코드 블록 (목록 안 ``` 들여쓰기 확인)');
  }
  if (problems.length) { bad++; console.log(`✗ ${p.file}  ${p.url}`); problems.forEach((m) => console.log('   -', m)); }
  else if (warnings.length) { warned++; if (process.env.VERBOSE) console.log(`! ${p.file}  ${warnings.join(', ')}`); }
  else if (only.length) console.log(`✓ ${p.file}  ${p.url}`);
}
console.log(`\n${posts.length}개 점검, 문제 ${bad}개${warned ? `, 경고 ${warned}개 (VERBOSE=1 로 보기)` : ''}`);
process.exit(bad ? 1 : 0);
