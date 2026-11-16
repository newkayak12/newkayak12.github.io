'use client';
import { useEffect } from 'react';
// mermaid는 무거워서 쓰는 글에서만 CDN으로 불러온다.
export default function Mermaid() {
  useEffect(() => {
    const run = () => window.mermaid?.run({ querySelector: 'pre.mermaid' });
    if (window.mermaid) return run();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
    s.onload = () => { window.mermaid.initialize({ startOnLoad: false }); run(); };
    document.body.appendChild(s);
  }, []);
  return null;
}
