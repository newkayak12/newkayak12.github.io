export default function PostList({ posts }) {
  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={p.url}>
          <a className="post-title" href={encodeURI(p.url)}>{p.title}</a>
          <div className="meta">
            {p.dateLabel}
            {p.categories.length > 0 && <> · {p.categories.join(', ')}</>}
          </div>
          {p.excerpt && <p className="excerpt">{p.excerpt}</p>}
        </li>
      ))}
    </ul>
  );
}
