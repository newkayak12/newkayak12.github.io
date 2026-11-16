import { getAllPosts } from '../../lib/posts.mjs';
export const metadata = { title: 'Tags' };
// Jekyll의 /tags.html 과 같은 주소로 나간다(app/tags → tags.html).
function group(key) {
  const m = new Map();
  for (const p of getAllPosts()) for (const k of p[key]) m.set(k, [...(m.get(k) || []), p]);
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}
export default function Tags() {
  const sections = [['카테고리', group('categories')], ['태그', group('tags')]];
  return (
    <div className="tags-page">
      <h1>Tags</h1>
      {sections.map(([label, groups]) => (
        <section key={label}>
          <h2>{label}</h2>
          <p className="tag-cloud">{groups.map(([k, ps]) => <a key={k} href={`#${encodeURIComponent(k)}`}>{k} <small>{ps.length}</small></a>)}</p>
          {groups.map(([k, ps]) => (
            <div key={k} id={k} className="tag-group">
              <h3>{k}</h3>
              <ul>{ps.map((p) => <li key={p.url}><a href={encodeURI(p.url)}>{p.title}</a> <small>{p.dateLabel}</small></li>)}</ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
