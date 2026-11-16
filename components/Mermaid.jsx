'use client';
import { useEffect } from 'react';
// mermaid는 무거워서 쓰는 글에서만 CDN으로 불러온다.
// ```mermaid 는 <pre class="mermaid">, 글에 직접 쓴 <div class="mermaid"> 도 같이 그린다.
export default function Mermaid() {
  useEffect(() => {
    const run = () => window.mermaid?.run({ querySelector: '.post-content .mermaid' });
    if (window.mermaid) return run();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
    s.onload = () => {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      window.mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default' });
      run();
    };
    document.body.appendChild(s);
  }, []);
  return null;
}
