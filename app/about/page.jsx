import fs from 'node:fs';
import matter from 'gray-matter';
import { renderMarkdown } from '../../lib/markdown.mjs';
export const metadata = { title: 'About' };
export default async function About() {
  const { content } = matter(fs.readFileSync('about.md', 'utf8'));
  return <article className="page post-content" dangerouslySetInnerHTML={{ __html: await renderMarkdown(content) }} />;
}
