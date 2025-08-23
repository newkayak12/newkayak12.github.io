---
layout: post
categories: [GIT]
---
from [Dictionary - Convention](https://github.com/newkayak12/Dictionary/blob/master/git/03.Convention.md)



# Convention

## 메시지 컨베션
1. 제목과 본문을 한 줄 띄워서 분리하기
2. 제목은 영문 기준 50자 이내
3. 제목 첫 글자는 대문자
4. 제목 끝 `.` 금지
5. 본문은 무엇, 왜에 맞춰 작성

> 태그: 제목
> (한 줄 띄우기)
> 본문
> (한 줄 띄우기)
> 꼬리말

## 태그
|     TagName      |                          Description                          |
|:----------------:|:-------------------------------------------------------------:|
|       Feat       |                           새로운 기능 추가                           |
|       Fix        |                             버그 수정                             |
|      Design      |                        CSS, UI 디자인 변경                         |
| !BREAKING CHANGE |                           큰 API 변경                            |
|     !HOTFIX      |                            HOTFIX                             |
|      Style       |               코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우                |
|     Refactor     |                         프로덕션 코드 리팩토링                          |
|     Comment      |                        필요한 주석 추가 및 변경                         |
|       Docs       |                             문서 수정                             |
|       Test       |         테스트 코드, 리펙토링 테스트 코드 추가 (ProductionCode 변경 X)          |
|      Chore       | 빌드 업무 수정, 패키지 매니저 수정, 패키지 관리자 구성 등 업데이트 (ProductionCode 변경 X) |
|      Rename      |                          파일/ 폴더명 수정                           |
|      Remove      |                             파일 삭제                             |

## 깃 모지
| Git moji |  코드   | 설명|
|:--------:|:-----:|:----:|
|    🎨    | :art: |코드의 구조/형태 개선|
|    ⚡     |:zap:|성능 개선|
|    🔥    |:fire:|코드/파일 삭제|
|    🐛    |:bug:|버그 수정|
|    ✨     |:sparkles:|새 기능|
|    📝    |:memo:|문서 추가/수정|
|    💄    |:lipstick:|UI/스타일 파일 추가/수정|
|    🎉    |:tada:|프로젝트 시작|
|    ✅     |:white_check_mark:|테스트 추가/수정|
|    🔒    |:lock:|보안 이슈 수정|
|    🔖    |:bookmark:|릴리즈/버전 태그|
|    💚    |:green_heart:|CI 빌드 수정|
|    📌    |:pushpin:|특정 버전 의존성 고정|
|    👷    |:construction_worker:|CI 빌드 시스템 추가/수정|
|    📈    |:chart_with_upwards_trend:|분석, 추적 코드 추가/수정|
|    ♻     |:recycle:|코드 리팩토링|
|    ➕     |:heavy_plus_sign:|의존성 추가|
|    ➖     |:heavy_minus_sign:|의존성 제거|
|    🔧    |:wrench:|구성 파일 추가/삭제|
|    🔨    |:hammer:|개발 스크립트 추가/수정|
|    🌐    |:globe_with_meridians:|국제화/현지화|
|    💩    |:poop:|똥싼 코드|
|    ⏪     |:rewind:|변경 내용 되돌리기|
|    🔀    |:twisted_rightwards_arrows:|브랜치 합병|
|    📦    |:package:|컴파일된 파일 추가/수정|
|    👽    |:alien:|외부 API 변화로 인한 수정|
|    🚚    |:truck:|리소스 이동, 이름 변경|
|    📄    |:page_facing_up:|라이센스 추가/수정|
|    💡    |:bulb:|주석 추가/수정|
|    🍻    |:beers:|술 취해서 쓴 코드|
|    🗃    |:card_file_box:|데이버베이스 관련 수정|
|    🔊    |:loud_sound:|로그 추가/수정|
|    🙈    |:see_no_evil:| .gitignore 추가/수정|