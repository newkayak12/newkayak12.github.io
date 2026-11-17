---
name: publish-post
description: Use when a blog post should go up on newkayak12.github.io — moving a finished draft (source/ 초안, _draft/, or a pasted md) into _posts/, checking it renders, and committing for deploy. Triggers: "글 올려줘", "게시해줘", "포스팅하자", "이 초안 _posts로", "블로그에 올리자", "publish this post".
---

# 블로그 글 게시

초안 하나를 `_posts/`에 넣고, 빌드해서 깨진 곳이 없는지 보고, 사용자가 화면을 확인한 뒤 커밋한다.
**push(=배포)는 사용자가 말할 때만 한다.**

## 0. 무엇을 올리는지 정한다

| 출처 | 위치 | 꺼내는 방법 |
|---|---|---|
| 글감 창고 초안 | `source/[SAB]/<주제>/초안/*.md` | 1-A |
| 저장소 초안 | `_draft/*.md` | 1-B |
| 사용자가 준 글 | 대화·파일 | 1-B와 같다 |

- `source/`는 비공개 창고다(gitignore). 이 체크아웃에 없으면 `git worktree list`로 다른 워크트리의 `source/`를 찾는다. **`source/`의 파일, `_원본/`, `_비공개_참고/`, 카드의 "근거 원본" 절은 절대 `_posts`나 커밋에 들어가면 안 된다.**
- 어느 글인지 모호하면 `source/_status.md`에서 단계 4(게시 가능) 목록을 보여주고 고르게 한다.

## 1-A. source/ 초안 꺼내기

```bash
python3 <source>/_tools/publish.py <초안.md> <이 저장소> --date YYYY-MM-DD
```
- 초안의 `## 4. 초안` 절만 `_posts/<날짜>-<초안명>.md`로 쓰고, `img/<초안명>/`을 `assets/img/posts/<초안명>/`로 복사한다.
- 자리표시(`[[본인: …]]`)나 식별자가 남으면 멈춘다. **`--force`를 쓰지 않는다.** 멈추면 무엇이 남았는지 사용자에게 보여주고 초안을 먼저 고친다.
- 나온 파일명은 초안명 그대로다(`2026-11-16-01-헬스체크가-DB를-물면.md`). 기존 글처럼 `[분류]-제목` 형식으로 바꿀지 사용자에게 한 번 묻는다. 파일명이 곧 주소다.

## 1-B. 그 밖의 글

`_posts/YYYY-MM-DD-[분류]-제목.md`로 옮긴다(`_draft/`에서라면 `git mv`). 날짜는 사용자가 말하지 않으면 오늘.

**예약 게시:** 날짜를 미래로 두면 그날 00:05 KST 예약 빌드 때 공개된다. 그 전에는 빌드에서 빠지므로, 미리 볼 때는 `SHOW_FUTURE=1 npm run build`로 빌드하고 `check:posts`도 `SHOW_FUTURE=1`을 붙여 돌린다.

## 2. 형식 점검 (손으로)

- **front matter**: `title`, `categories`, `tags`. `layout: post`는 있어도 되고 없어도 된다.
  - 주소 = `/<categories 소문자, '/'는 경로 단계>/<yyyy>/<mm>/<dd>/<파일명 slug>.html` (`lib/posts.mjs`).
  - **한 번 올린 글은 파일명·categories·날짜를 바꾸지 않는다.** 주소가 바뀌어 기존 링크가 깨진다. 꼭 바꿔야 하면 `redirect_from:`에 옛 주소를 남긴다.
- **회사 정보**: 회사·제품·파트너·벤더 이름, 티켓 키, 테이블명, 사업 규모 절대값이 없는지 본문을 훑는다. 의심되면 사용자에게 묻는다.
- **이미지**: `assets/img/posts/<글이름>/`에 두고 `/assets/img/posts/<글이름>/x.png`로 참조한다. `../../image/…` 같은 상대 경로나 Obsidian 볼트 밖 경로는 빌드에 안 들어간다.
- **도식**: mermaid는 ` ```mermaid ` 코드 블록으로 쓴다. 목록 안 코드 블록은 여는 줄과 같은 깊이로 들여 쓴다(어긋나도 렌더러가 보정하지만 원본을 맞추는 게 낫다).

## 3. 빌드와 자동 점검

글을 Write/Edit하면 훅(`scripts/lint-post.mjs --hook`)이 바로 렌더 깨짐을 알려 준다. 알림이 오면 먼저 고친다.

```bash
npm run build
npm run check:posts -- <_posts 파일명>
```
- `check:posts`는 페이지 생성, 로컬 이미지 존재, 렌더 실패, 빈 코드 블록을 본다. 인자 없이 돌리면 옛 글의 기존 문제(파일이 없는 이미지, categories 없는 옛 글)까지 나오므로 **새 글 파일명을 꼭 넘긴다.**
- ✗가 나오면 고치고 다시 돌린다. 고칠 수 없는 것(원본 이미지가 없음 등)은 사용자에게 알린다.

## 4. 사용자 확인

사용자는 보통 SSH로 접속해 있다. `localhost`가 아니라 서버 LAN 주소를 준다.

```bash
cd out && python3 -m http.server 8088   # 백그라운드로
hostname -I                              # 첫 번째 주소
```
- 링크: `http://<서버IP>:8088<글 주소>` (주소의 한글은 그대로 줘도 된다).
- 사용자가 "괜찮다"고 할 때까지 커밋하지 않는다. 다 보면 서버를 끈다.

## 5. 커밋

- 지금 브랜치에 커밋한다. 넣는 것은 **새 글 파일과 그 이미지(`assets/img/posts/<글이름>/`)만**이다. `git add -A` 금지. `out/`, `public/assets/`, `source/`가 스테이징되지 않았는지 `git status`로 확인한다.
- 메시지: `post: <제목>`
- `_draft/`에서 옮겼다면 그 삭제도 같은 커밋에 넣는다.

## 6. 배포 (사용자가 말할 때만)

- `master`에 push하면 `.github/workflows/deploy.yaml`이 빌드해서 GitHub Pages에 올린다. 다른 브랜치 push는 배포되지 않는다.
- push 후 `gh run watch`로 Actions가 끝나는 걸 보고, 실제 주소 `https://newkayak12.github.io<글 주소>`가 200인지 확인해서 알린다.

## 끝나면 알릴 것

글 제목, 주소, 점검 결과(✓/남은 문제), 커밋 해시, push 여부. source/ 초안이었다면 `python3 <source>/_tools/status.py`로 현황을 다시 만들었는지도.
