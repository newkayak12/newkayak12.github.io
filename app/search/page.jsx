import { Suspense } from 'react';
import Search from '../../components/Search';
export const metadata = { title: 'Search' };
export default function SearchPage() {
  return (<Suspense fallback={null}><Search /></Suspense>);
}
