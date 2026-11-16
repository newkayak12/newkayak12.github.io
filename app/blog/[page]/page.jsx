import { notFound } from 'next/navigation';
import PostList from '../../../components/PostList';
import Pager from '../../../components/Pager';
import { pageCount, pagePosts } from '../../../lib/paging.mjs';

// Jekyll paginate_path "blog/page:num" 을 그대로 쓴다: /blog/page2 …
export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: pageCount() - 1 }, (_, i) => ({ page: `page${i + 2}` }));
}
export default async function Page({ params }) {
  const { page } = await params;
  const n = Number(String(page).replace('page', ''));
  if (!n || n < 2 || n > pageCount()) notFound();
  return (<><PostList posts={pagePosts(n)} /><Pager page={n} total={pageCount()} /></>);
}
