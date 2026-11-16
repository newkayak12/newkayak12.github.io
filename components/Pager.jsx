const href = (n) => (n === 1 ? '/' : `/blog/page${n}`);

// 처음·끝 쪽은 늘 보이고, 현재 쪽 앞뒤로 2쪽씩 보인다. 사이가 비면 … 로 줄인다.
function pages(page, total, around = 2) {
  const keep = new Set([1, total]);
  for (let n = page - around; n <= page + around; n++) if (n >= 1 && n <= total) keep.add(n);
  const list = [...keep].sort((a, b) => a - b);
  const out = [];
  list.forEach((n, i) => {
    if (i > 0 && n - list[i - 1] === 2) out.push(n - 1);
    else if (i > 0 && n - list[i - 1] > 2) out.push(null);
    out.push(n);
  });
  return out;
}

export default function Pager({ page, total }) {
  if (total <= 1) return null;
  return (
    <nav className="pager" aria-label="페이지">
      {page > 1 ? <a className="pager-step" href={href(page - 1)} aria-label="이전 페이지">‹</a> : <span className="pager-step off">‹</span>}
      {pages(page, total).map((n, i) =>
        n === null ? <span key={`gap${i}`} className="pager-gap">…</span>
          : n === page ? <span key={n} className="pager-num current" aria-current="page">{n}</span>
            : <a key={n} className="pager-num" href={href(n)}>{n}</a>)}
      {page < total ? <a className="pager-step" href={href(page + 1)} aria-label="다음 페이지">›</a> : <span className="pager-step off">›</span>}
    </nav>
  );
}
