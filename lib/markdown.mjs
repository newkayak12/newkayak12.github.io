// Jekyll(kramdown) 글을 HTML로 바꾼다. 원본 마크다운은 고치지 않고 여기서 차이를 흡수한다.
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

// kramdown·Obsidian 전용 문법을 CommonMark 쪽으로 맞춘다.
function preprocess(src) {
  return src
    .replace(/\{%-?\s*(raw|endraw)\s*-?%\}/g, '')          // Liquid raw 블록 표시
    .replace(/^\{:[^}\n]*\}\s*$/gm, '')                    // kramdown IAL
    .replace(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, (_, p) => `![](${encodeURI('/' + p.replace(/^\/+/, ''))})`) // Obsidian 임베드
    .replace(/\]\((?:\.\/)?_site\/assets\//g, '](/assets/')
    .replace(/(src=["'])(?:\.\/)?_site\/assets\//g, '$1/assets/')
    .replace(/\]\(assets\//g, '](/assets/');
}

// ```mermaid 블록은 브라우저에서 그리도록 <pre class="mermaid">로 바꾼다.
function rehypeMermaid() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent) return;
      const code = node.children?.[0];
      const cls = code?.properties?.className || [];
      if (code?.tagName === 'code' && cls.includes('language-mermaid')) {
        const text = code.children.map((c) => c.value || '').join('');
        parent.children[index] = { type: 'element', tagName: 'pre', properties: { className: ['mermaid'] }, children: [{ type: 'text', value: text }] };
      }
    });
  };
}

// 공백이 들어간 이미지 경로(스크린샷 2024-…png) 등을 인코딩한다.
function rehypeFixImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img' || typeof node.properties?.src !== 'string') return;
      let src = node.properties.src;
      if (/^(https?:|data:)/.test(src)) return;
      try { src = decodeURI(src); } catch {}
      node.properties.src = encodeURI(src);
      node.properties.loading = 'lazy';
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath, { singleDollarTextMath: false }) // kramdown처럼 $$만 수식으로 ("$10" 보호)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeMermaid)
  .use(rehypeFixImages)
  .use(rehypeSlug)
  .use(rehypeKatex, { throwOnError: false, strict: false })
  .use(rehypeHighlight, { detect: false, ignoreMissing: true })
  .use(rehypeStringify);

export async function renderMarkdown(src) {
  try {
    return String(await processor.process(preprocess(src)));
  } catch (e) {
    console.warn('[markdown] 렌더 실패, 원문으로 표시:', e.message);
    return `<pre>${src.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])}</pre>`;
  }
}

export function plainText(src, limit = 0) {
  const t = preprocess(src)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`|_~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return limit ? t.slice(0, limit) : t;
}
