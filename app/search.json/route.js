import { getAllPosts } from '../../lib/posts.mjs';
import { plainText } from '../../lib/markdown.mjs';
export const dynamic = 'force-static';
export function GET() {
  return Response.json(getAllPosts().map((p) => ({
    t: p.title, u: p.url, d: p.dateLabel, c: p.categories.join(' '), g: p.tags.join(' '), x: plainText(p.content, 4000),
  })));
}
