NEWKAYAK12's Blog

Next.js(App Router) 정적 export로 만든 블로그다. 2026-11 Jekyll에서 옮겼다.

## 글 쓰기
- 글은 그대로 `_posts/YYYY-MM-DD-제목.md`에 쓴다(front matter: `title`, `categories`, `tags`). Obsidian 볼트 구조는 바뀌지 않는다.
- 이미지는 `assets/` 아래에 두고 `/assets/...`로 참조한다. 빌드할 때 `public/assets`로 복사된다.
- 주소는 Jekyll과 같다: `/:categories/:yyyy/:mm/:dd/:title.html` (`lib/posts.mjs`의 `jekyllSlug`).

## 명령
- `npm run dev`: 로컬 미리보기 (http://localhost:3000)
- `npm run build`: `out/`에 정적 사이트 생성
- `npm run check:urls -- <urls.txt>`: 예전 주소 목록과 새 주소 비교
- `npm run check:posts -- <_posts 파일명>`: 빌드 뒤 글 페이지·이미지·렌더 점검 (게시 절차는 `.claude/skills/publish-post`)

## 배포
- 모든 브랜치 push·PR에서 `.github/workflows/deploy.yaml`이 빌드하고 `check:posts`로 글을 점검한다(CI). `master` push일 때만 GitHub Pages에 올린다.
- 저장소 Settings → Pages → Source를 **GitHub Actions**로 바꿔야 한다.
