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

## 자동 점검
- **훅**(`.claude/settings.json`): `_posts/`·`_draft/`의 `.md`를 Write/Edit하면 `scripts/lint-post.mjs --hook`이 빌드 없이 렌더해서 깨진 이미지·`**`·코드 블록 누출 등을 찾는다. 문제가 있으면 Claude에게 알림이 온다 → 원본을 고치거나, 여러 글에 걸친 문법 차이면 `lib/markdown.mjs` 전처리로 흡수한다.
- **CI**(`npm run check:posts`): 같은 패턴(`lib/lint.mjs`)을 빌드 결과 전체에 돌린다. 새 글(파일명 지정)은 실패, 옛 글은 경고.
- 손으로: `node scripts/lint-post.mjs <md 파일>…`

## 규칙
- 회사 정보(회사·제품·벤더 이름, 티켓 키, 테이블명, 사업 규모 절대값)는 글에 넣지 않는다.
- 한 번 올린 글의 파일명·categories·날짜는 바꾸지 않는다(주소가 바뀐다).
- 파일명 날짜가 미래인 글은 빌드에서 빠진다(Jekyll `future: false`와 같다). 매일 00:05 KST 예약 빌드가 그날 글을 공개한다. 로컬에서 미리 보려면 `SHOW_FUTURE=1 npm run build`.
- 사용자는 SSH로 접속해 있는 경우가 많다. 미리보기 링크는 `localhost` 대신 `hostname -I`의 LAN 주소로 준다.
- `next dev`는 `/search.html`처럼 `.html` 정적 경로를 못 연다. 배포와 같은 화면은 `npm run build` 후 `out/`을 정적 서버로 띄워 본다.
