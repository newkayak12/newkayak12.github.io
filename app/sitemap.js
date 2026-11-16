import { getAllPosts } from '../lib/posts.mjs';
import { site } from '../lib/site.mjs';
export const dynamic = 'force-static';
export default function sitemap() {
  return [{ url: site.url + '/' }, ...getAllPosts().map((p) => ({ url: site.url + encodeURI(p.url), lastModified: p.date }))];
}
