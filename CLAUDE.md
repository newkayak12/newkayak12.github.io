# newkayak12.github.io

Next.js(App Router) 정적 export 블로그. Jekyll에서 옮겼고, 글 원본(`_posts/`)과 주소 규칙은 Jekyll 그대로다. 개요와 명령은 `README.md`.

@AGENTS.md

## 구조
- `_posts/YYYY-MM-DD-제목.md` — 글. Obsidian 볼트이기도 하다(`.obsidian/`). 원본 마크다운은 되도록 고치지 않고, 차이는 `lib/markdown.mjs`의 전처리에서 흡수한다.
- `lib/posts.mjs` — 글 목록·주소(`/:categories/:yyyy/:mm/:dd/:slug.html`). `lib/markdown.mjs` — 마크다운→HTML.
- `app/` 페이지, `components/` 검색·페이저·mermaid. `assets/` → 빌드 때 `public/assets`로 복사.
- `_draft/` 저장소 안 초안. `source/` 비공개 글감 창고(gitignore, **절대 커밋 금지**).

## 글 게시
글을 올릴 때는 `publish-post` 스킬(`.claude/skills/publish-post/SKILL.md`)의 순서를 따른다.
요약: 초안 → `_posts/` → `npm run build` → `npm run check:posts -- <파일명>` → 사용자 화면 확인 → 그 글만 커밋 → push는 사용자가 말할 때만(`master` push = 배포).

## 규칙
- 회사 정보(회사·제품·벤더 이름, 티켓 키, 테이블명, 사업 규모 절대값)는 글에 넣지 않는다.
- 한 번 올린 글의 파일명·categories·날짜는 바꾸지 않는다(주소가 바뀐다).
- 사용자는 SSH로 접속해 있는 경우가 많다. 미리보기 링크는 `localhost` 대신 `hostname -I`의 LAN 주소로 준다.
- `next dev`는 `/search.html`처럼 `.html` 정적 경로를 못 연다. 배포와 같은 화면은 `npm run build` 후 `out/`을 정적 서버로 띄워 본다.
