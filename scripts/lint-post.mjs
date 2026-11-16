// 글 하나를 빌드 없이 렌더해서 깨진 곳을 찾는다.
//   node scripts/lint-post.mjs <md 파일>…   → 사람이 직접 실행
//   node scripts/lint-post.mjs --hook       → Claude Code PostToolUse 훅 (stdin JSON의 file_path)
// 검사: front matter·categories, 로컬 이미지 존재, 렌더 깨짐 패턴(lib/lint.mjs).
// 훅 모드에서 문제가 있으면 exit 2 + stderr 로 Claude에게 알린다. _posts/·_draft/ 의 .md 가 아니면 조용히 넘어간다.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { renderMarkdown } from '../lib/markdown.mjs';
import { lintHtml } from '../lib/lint.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
process.chdir(ROOT); // lib/markdown.mjs 의 이미지 경로 해석이 cwd 기준

async function lint(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const problems = [];
  let data = {}, content = raw;
  try { ({ data, content } = matter(raw)); } catch (e) { problems.push(`front matter 해석 실패: ${e.message}`); }
  const isPost = path.relative(ROOT, file).startsWith('_posts' + path.sep);
  if (isPost && !/^\d{4}-\d{2}-\d{2}-.+\.md$/.test(path.basename(file))) problems.push('파일명이 YYYY-MM-DD-제목.md 형식이 아님 (글로 인식되지 않는다)');
  if (data.categories == null && data.category == null) problems.push('categories 없음 (주소에 카테고리가 빠진다)');
  const html = await renderMarkdown(content);
  for (const [, src] of html.matchAll(/<img[^>]*?src="([^"]+)"/g)) {
    if (/^(https?:|data:)/.test(src)) continue;
    let dec = src; try { dec = decodeURI(src); } catch {}
    if (!dec.startsWith('/') || !fs.existsSync(path.join(ROOT, dec))) problems.push(`이미지 없음: ${dec} (assets/ 아래에 두고 /assets/… 로 참조)`);
  }
  problems.push(...lintHtml(html));
  return problems;
}

async function main() {
  const hook = process.argv.includes('--hook');
  let files = process.argv.slice(2).filter((a) => a !== '--hook');
  if (hook) {
    const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
    const f = input.tool_input?.file_path || input.tool_response?.filePath;
    if (!f) return;
    const rel = path.relative(ROOT, path.resolve(f));
    if (!/^(_posts|_draft)\//.test(rel) || !rel.endsWith('.md') || !fs.existsSync(f)) return;
    files = [f];
  }
  let bad = 0;
  for (const f of files) {
    const problems = await lint(path.resolve(f));
    if (!problems.length) { if (!hook) console.log(`✓ ${f}`); continue; }
    bad++;
    const msg = `✗ ${path.relative(ROOT, path.resolve(f))}\n${problems.map((p) => '  - ' + p).join('\n')}`;
    (hook ? console.error : console.log)(msg);
  }
  if (bad) {
    if (hook) console.error('\n글이 렌더될 때 위처럼 깨진다. 원본을 고치거나, 렌더러(lib/markdown.mjs)에서 흡수할 문제면 그쪽을 고쳐라.');
    process.exit(hook ? 2 : 1);
  }
}
main().catch((e) => { console.error('lint-post 실패:', e.message); process.exit(1); });
