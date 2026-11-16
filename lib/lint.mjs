// 렌더된 글 HTML에서 "깨져 보이는" 흔적을 찾는다. check:posts(CI)와 lint-post(훅)가 같이 쓴다.
// 코드 블록·인라인 코드 안은 검사하지 않는다.
export const PATTERNS = [
  ['코드 블록 누출 (``` 가 글자로 보임)', /```/],
  ['굵게 미적용 (** 가 글자로 보임)', /\*\*/],
  ['목록·제목 기호가 문단에 들어감 (#, - )', /<p>(#{1,6} |[-*+] \S)/],
  ['인용 기호가 글자로 보임 (> )', /<p>&gt; /],
  ['표 미적용 (|---|)', /\|\s*:?-{3,}\s*\|/],
  ['수식 미적용 ($$)', /\$\$/],
  ['Liquid 잔재 ({{ / {%)', /\{\{|\{%/],
  ['KaTeX 오류', /katex-error/],
  ['mermaid 원문 노출', /<p>(graph|flowchart|sequenceDiagram|gitGraph|classDiagram|erDiagram)\b/],
  ['HTML 태그가 글자로 보임 (&lt;div 등)', /&lt;\/?(div|br|img|span|table|details|summary|p)\b/],
];

const snippet = (text, i) => text.slice(Math.max(0, i - 40), i + 60).replace(/<[^>]*>|<[^>]*$|^[^<]*>/g, ' ').replace(/\s+/g, ' ').trim();

/** @returns {string[]} 문제 설명 목록 (비어 있으면 통과) */
export function lintHtml(html) {
  const problems = [];
  if (/<pre><code[^>]*>\s*<\/code><\/pre>/.test(html)) problems.push('빈 코드 블록 (목록 안 ``` 들여쓰기 확인)');
  const text = html.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<code[\s\S]*?<\/code>/g, '');
  for (const [name, re] of PATTERNS) {
    const i = text.search(re);
    if (i >= 0) problems.push(`${name}: …${snippet(text, i)}…`);
  }
  return problems;
}
