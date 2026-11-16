const href = (n) => (n === 1 ? '/' : `/blog/page${n}`);
export default function Pager({ page, total }) {
  return (
    <nav className="pager">
      {page > 1 ? <a href={href(page - 1)}>← 이전</a> : <span />}
      <span>{page} / {total}</span>
      {page < total ? <a href={href(page + 1)}>다음 →</a> : <span />}
    </nav>
  );
}
