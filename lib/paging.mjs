import { getAllPosts } from './posts.mjs';
import { plainText } from './markdown.mjs';
import { site } from './site.mjs';
export function pageCount() { return Math.ceil(getAllPosts().length / site.pageSize); }
export function pagePosts(n) {
  return getAllPosts().slice((n - 1) * site.pageSize, n * site.pageSize)
    .map(({ content, ...p }) => ({ ...p, excerpt: plainText(content, 160) }));
}
