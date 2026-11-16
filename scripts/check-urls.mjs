// 라이브(Jekyll) URL 목록과 새 URL을 비교한다. 사용: node scripts/check-urls.mjs <urls.txt>
import fs from 'node:fs';
import { getAllPosts } from '../lib/posts.mjs';
const live = new Set(fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean));
const mine = new Set(getAllPosts().map((p) => p.url));
const missing = [...live].filter((u) => !mine.has(u));
const extra = [...mine].filter((u) => !live.has(u));
console.log(`live ${live.size} / new ${mine.size} / missing ${missing.length} / extra ${extra.length}`);
for (const u of missing.slice(0, 20)) console.log('- ', u);
for (const u of extra.slice(0, 20)) console.log('+ ', u);
