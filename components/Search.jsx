'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// /search.json 을 한 번 받아 브라우저에서 찾는다.
// 낱말을 모두 포함한 글만 남기고, 제목 > 카테고리·태그 > 본문 등장 횟수 순으로 점수를 매긴다. 같으면 최신 글이 먼저.
const PAGE = 50;
const SNIPPET = 140;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const count = (hay, w) => { let n = 0, i = hay.indexOf(w); while (i !== -1) { n++; i = hay.indexOf(w, i + w.length); } return n; };

function snippet(text, lower, words) {
  const hits = words.map((w) => lower.indexOf(w)).filter((i) => i >= 0);
  if (!hits.length) return text.slice(0, SNIPPET) + (text.length > SNIPPET ? '…' : '');
  const start = Math.max(0, Math.min(...hits) - 40);
  const end = Math.min(text.length, start + SNIPPET);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

function Highlight({ text, words }) {
  if (!words.length) return text;
  const re = new RegExp(`(${words.map(escapeRe).join('|')})`, 'gi');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

export default function Search() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('query') || '');
  const [docs, setDocs] = useState(null);
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    fetch('/search.json').then((r) => r.json()).then((list) => setDocs(list.map((d) => ({
      ...d, title: d.t.toLowerCase(), meta: `${d.c} ${d.g}`.toLowerCase(), body: d.x.toLowerCase(),
    }))));
  }, []);

  // 검색어를 주소에 남겨 뒤로가기·공유에도 유지한다.
  useEffect(() => {
    const t = setTimeout(() => {
      const url = q.trim() ? `?query=${encodeURIComponent(q.trim())}` : location.pathname;
      history.replaceState(null, '', url);
    }, 300);
    setLimit(PAGE);
    return () => clearTimeout(t);
  }, [q]);

  const words = useMemo(() => [...new Set(q.toLowerCase().split(/\s+/).filter(Boolean))], [q]);

  const results = useMemo(() => {
    if (!docs || !words.length) return [];
    return docs
      .map((d) => {
        let score = 0;
        for (const w of words) {
          const inTitle = d.title.includes(w), inMeta = d.meta.includes(w), inBody = count(d.body, w);
          if (!inTitle && !inMeta && !inBody) return null;
          score += (inTitle ? 100 : 0) + (inMeta ? 30 : 0) + Math.min(inBody, 20);
        }
        return { d, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || b.d.d.localeCompare(a.d.d));
  }, [words, docs]);

  return (
    <div className="search">
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" autoFocus />
      {!docs && <p className="meta">불러오는 중…</p>}
      {docs && words.length > 0 && (
        <p className="meta search-count">{results.length ? `${results.length}건` : '결과가 없습니다.'}</p>
      )}
      <ul className="post-list">
        {results.slice(0, limit).map(({ d }) => (
          <li key={d.u}>
            <a className="post-title" href={encodeURI(d.u)}><Highlight text={d.t} words={words} /></a>
            <div className="meta">{d.d}{d.c && <> · {d.c}</>}</div>
            <p className="search-snippet"><Highlight text={snippet(d.x, d.body, words)} words={words} /></p>
          </li>
        ))}
      </ul>
      {results.length > limit && (
        <button className="search-more" onClick={() => setLimit(limit + PAGE)}>더 보기 ({results.length - limit})</button>
      )}
    </div>
  );
}
