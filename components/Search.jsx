'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// /search.json 을 한 번 받아 브라우저에서 찾는다. 낱말을 모두 포함한 글만, 제목 일치를 먼저.
export default function Search() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('query') || '');
  const [docs, setDocs] = useState(null);
  useEffect(() => { fetch('/search.json').then((r) => r.json()).then(setDocs); }, []);
  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!docs || !words.length) return [];
    return docs
      .map((d) => {
        const head = `${d.t} ${d.c} ${d.g}`.toLowerCase();
        const body = d.x.toLowerCase();
        if (!words.every((w) => head.includes(w) || body.includes(w))) return null;
        return { d, score: words.filter((w) => head.includes(w)).length };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }, [q, docs]);
  return (
    <div className="search">
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" autoFocus />
      {!docs && <p>불러오는 중…</p>}
      {docs && q && results.length === 0 && <p>결과가 없습니다.</p>}
      <ul className="post-list">
        {results.map(({ d }) => (
          <li key={d.u}><a className="post-title" href={encodeURI(d.u)}>{d.t}</a><div className="meta">{d.d}</div></li>
        ))}
      </ul>
    </div>
  );
}
