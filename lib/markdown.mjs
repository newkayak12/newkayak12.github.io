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
import fs from 'node:fs';
import path from 'node:path';

// 목록 안에서 들여 쓴 ``` 블록의 본문·닫는 줄이 덜 들여 쓰여 있으면(Obsidian에서 흔함)
// CommonMark는 목록을 끊고 코드 블록을 깨뜨린다. 여는 줄 들여쓰기에 맞춰 블록 전체를 다시 들여 쓴다.
const cols = (ws) => [...ws].reduce((n, c) => (c === '\t' ? n + 4 - (n % 4) : n + 1), 0);
function fixIndentedFences(src) {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^([ \t]*)(`{3,}|~{3,})/);
    if (!open) continue;
    const [, indent, fence] = open;
    const close = new RegExp(`^[ \\t]*${fence[0] === '`' ? '`' : '~'}{${fence.length},}[ \\t]*$`);
    let j = i + 1;
    while (j < lines.length && !close.test(lines[j])) j++;
    if (j >= lines.length) break;
    const need = cols(indent);
    const body = lines.slice(i + 1, j);
    const lead = (l) => cols(l.match(/^[ \t]*/)[0]);
    const broken = need > 0 && [...body, lines[j]].some((l) => l.trim() && lead(l) < need);
    if (broken) {
      const min = Math.min(...body.filter((l) => l.trim()).map(lead), Infinity);
      const strip = (l) => { let n = 0, k = 0; while (k < l.length && n < min && /[ \t]/.test(l[k])) { n = l[k] === '\t' ? n + 4 - (n % 4) : n + 1; k++; } return l.slice(k); };
      for (let k = i + 1; k < j; k++) lines[k] = lines[k].trim() ? indent + strip(lines[k]) : '';
      lines[j] = indent + lines[j].trim();
    }
    i = j;
  }
  return lines.join('\n');
}

// kramdown·Obsidian 전용 문법을 CommonMark 쪽으로 맞춘다.
function preprocess(src) {
  return fixIndentedFences(src)
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

// 경로 오타로 파일이 없으면 assets/img 에서 같은 이름을 찾는다.
//   /assets/imgjvm.png → /assets/img/jvm.png,  img%2Fimg.png → /assets/img/img.png
const exists = (p) => fs.existsSync(path.join(process.cwd(), p));
function resolveImage(src) {
  if (src.startsWith('/') && exists(src)) return src;
  const tries = [];
  const typo = src.match(/^\/?assets\/img([^/].*)$/);
  if (typo) tries.push(`/assets/img/${typo[1]}`);
  tries.push(`/assets/img/${path.basename(src)}`);
  return tries.find(exists) || src;
}

// 공백이 들어간 이미지 경로(스크린샷 2024-…png) 등을 인코딩한다.
function rehypeFixImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img' || typeof node.properties?.src !== 'string') return;
      let src = node.properties.src;
      if (/^(https?:|data:)/.test(src)) return;
      try { src = decodeURI(src); } catch {}
      try { src = decodeURIComponent(src); } catch {}
      src = resolveImage(src);
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
