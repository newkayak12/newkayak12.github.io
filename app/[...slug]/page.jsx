import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySegments } from '../../lib/posts.mjs';
import { renderMarkdown, plainText } from '../../lib/markdown.mjs';
import Mermaid from '../../components/Mermaid';

// 글 주소는 Jekyll과 같다: /:categories/:yyyy/:mm/:dd/:title.html
// trailingSlash:false 정적 export는 마지막 세그먼트를 "<slug>.html" 파일로 쓴다.
export const dynamicParams = false;
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.segments }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySegments(slug);
  if (!post) return {};
  return { title: post.title, description: plainText(post.content, 150), alternates: { canonical: post.url } };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySegments(slug);
  if (!post) notFound();
  const all = getAllPosts();
  const i = all.indexOf(post);
  const newer = all[i - 1];
  const older = all[i + 1];
  const html = await renderMarkdown(post.content);
  return (
    <article className="post">
      <header>
        <h1 className="title">{post.title}</h1>
        <p className="meta">{post.dateLabel}{post.categories.length > 0 && <> · {post.categories.join(', ')}</>}</p>
      </header>
      <section className="post-content" dangerouslySetInnerHTML={{ __html: html }} />
      {post.tags.length > 0 && (
        <p className="tags">{post.tags.map((t) => <a key={t} href={`/tags.html#${encodeURIComponent(t)}`}>#{t}</a>)}</p>
      )}
      <nav className="post-nav">
        {older ? <a href={encodeURI(older.url)}>← 이전 글<br /><span>{older.title}</span></a> : <span />}
        {newer ? <a className="next" href={encodeURI(newer.url)}>다음 글 →<br /><span>{newer.title}</span></a> : <span />}
      </nav>
      {html.includes('class="mermaid"') && <Mermaid />}
    </article>
  );
}
