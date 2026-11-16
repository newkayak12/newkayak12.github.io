import PostList from '../components/PostList';
import Pager from '../components/Pager';
import { pageCount, pagePosts } from '../lib/paging.mjs';
export default function Home() {
  return (<><PostList posts={pagePosts(1)} /><Pager page={1} total={pageCount()} /></>);
}
