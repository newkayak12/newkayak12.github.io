import Script from 'next/script';
import 'katex/dist/katex.min.css';
import './code-theme.css';
import './globals.css';
import { site } from '../lib/site.mjs';

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
  icons: { icon: '/assets/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" />
      </head>
      <body>
        <header className="site-header">
          <div className="branding">
            <a href="/"><img className="avatar" src={site.avatar} alt="" /></a>
            <h1 className="site-title"><a href="/">{site.title}</a></h1>
          </div>
          <nav className="site-nav">
            <a href="/about/">About</a>
            <a href="/tags.html">Tags</a>
            <a href={`https://github.com/${site.github}`}>GitHub</a>
            <form action="/search.html" method="get">
              <input type="search" name="query" placeholder="Search" aria-label="Search" />
            </form>
          </nav>
        </header>
        <div className="header-text" dangerouslySetInnerHTML={{ __html: site.headerHtml }} />
        <main className="wrapper">{children}</main>
        <footer className="site-footer">© 2024–2026 newkayak12. 글과 그림은 <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.ko" rel="license noopener" target="_blank">CC BY-NC-ND 4.0</a>, 코드는 MIT.</footer>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.ga}`} strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.ga}');`}</Script>
      </body>
    </html>
  );
}
