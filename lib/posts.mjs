// _posts/*.md 를 읽어 Jekyll과 같은 URL·메타데이터를 만든다.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';

export const ROOT = process.cwd();
export const POSTS_DIR = path.join(ROOT, '_posts');
const FILE_RE = /^(\d{4})-(\d{2})-(\d{2})-(.*)\.(md|markdown)$/;

// Jekyll 기본 permalink(date) = /:categories/:year/:month/:day/:title.html
// :title = Utils.slugify(파일명, mode: "pretty", cased: true)
export function jekyllSlug(name) {
  return name.replace(/[^\p{L}\p{N}._~!$&'()+,;=@]+/gu, '-').replace(/^-+|-+$/g, '');
}

const engines = { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) || {} };

function toList(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(String);
  return String(v).split(/\s+/).filter(Boolean);
}

let cache;
export function getAllPosts() {
  if (cache) return cache;
  const posts = [];
  for (const file of fs.readdirSync(POSTS_DIR)) {
    const m = file.match(FILE_RE);
    if (!m) continue; // Jekyll도 날짜 형식이 아닌 파일은 글로 보지 않는다
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    let parsed;
    try { parsed = matter(raw, { engines }); }
    catch { parsed = matter(raw); }
    const data = parsed.data || {};
    if (data.published === false) continue;
    const categories = [...toList(data.categories), ...toList(data.category)];
    const [, y, mo, d, rest] = m;
    // Jekyll 기본(future: false)처럼 날짜가 아직 안 온 글은 빼둔다. 미리보기: SHOW_FUTURE=1
    if (!process.env.SHOW_FUTURE && new Date(`${y}-${mo}-${d}T00:00:00+09:00`) > new Date()) continue;
    const slug = jekyllSlug(rest);
    // 카테고리 안의 '/'(예: ci/cd)는 Jekyll처럼 경로 단계가 된다
    const segs = [...categories.flatMap((c) => c.toLowerCase().split('/').filter(Boolean)), y, mo, d, slug];
    const date = new Date(`${y}-${mo}-${d}T00:00:00+09:00`);
    posts.push({
      file,
      title: data.title != null ? String(data.title) : rest,
      date: date.toISOString(),
      dateLabel: `${y}.${mo}.${d}`,
      categories,
      tags: toList(data.tags),
      segments: segs,
      url: '/' + segs.join('/') + '.html',
      content: parsed.content,
      hide: !!data.hide,
    });
  }
  // Jekyll과 같은 순서: 날짜 내림차순, 같은 날이면 파일명 내림차순
  posts.sort((a, b) => (a.date === b.date ? (a.file < b.file ? 1 : -1) : a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
}

export function getPostBySegments(segs) {
  const key = segs.map((s) => decodeURIComponent(s)).join('/');
  return getAllPosts().find((p) => p.segments.join('/') === key);
}
