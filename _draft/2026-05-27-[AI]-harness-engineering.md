---
layout: post
title: "하네스 엔지니어링은 도구인가 패러다임인가"
tags:
  - AI
  - LLM
  - HarnessEngineering
  - MCP
  - SKILL
  - Claude
categories:
  - AI
status: draft
verification: devil's advocate 검증 완료 / 외부 1차 자료 검증 전
---

> **읽기 전 주의**
> Claude Opus와 한 세션 대화한 내용을 정리한 글입니다. 외부 아티클을 충분히 읽고 쓴 글이 아니라, **사고 흐름을 기록한 가설 단계**입니다. devil's advocate로 자가 검증을 거쳤으며, 외부 자료 검증 후 수정될 수 있습니다.

---

## 대화의 구조

이 글은 크게 세 구간으로 나뉜다.

**[웜업 · 1~5]** "Harness Engineering이 뭔지" 파악하고, Opus가 "MCP를 trust boundary로 삼자"는 아이디어를 제안해 실제로 blueprint까지 그려본 구간.

**[전환점 · 6]** 그 과정에서 "Harness의 본질이 진짜 뭔가?"라는 의문이 생겨 OPUS의 프레임을 다시 보기 시작한 지점.

**[내 반론 · 7]** 4~5에서 OPUS가 주장한 "MCP = 결정적 게이트, 환경 이식성, 재현성"에 대해 직접 밀어붙인 구간. "MCP도 결국 모델 협조 기반 아닌가?"

이 흐름을 염두에 두고 읽으면 논증 구조가 더 잘 보인다.

---

## [웜업] 1. 하네스 엔지니어링이라는 단어

"Harness Engineering"이라는 표현을 AI 맥락에서 본 게 비교적 최근이라 정의부터 짚었다.

- **Agent = Model + Harness**: 모델 자체를 제외한 모든 것(도구 디스패치, 컨텍스트 관리, 메모리, 상태 지속, 안전 강제, 세션 운영)을 통칭 (Martin Fowler 등)
- **하네스의 목표**: LLM의 확률적 출력을 신뢰 가능한 결과로 변환
- **프롬프트 엔지니어링과의 관계**: 프롬프트 엔지니어링은 하네스의 한 구성요소. 하네스는 더 큰 아키텍처

백엔드 개발자 입장에서 보면 Spring 컨테이너 + 횡단 관심사 인프라에 가까운 위치다.

---

## [웜업] 2. 내 환경에 대입해보면

SKILL.md와 Remote MCP를 이미 운영 중인 상태에서 하네스 관점으로 확장하면 어디를 보강해야 하는가.

현재 갖춘 것:
- Guides (feedforward): SKILL.md
- Tools dispatch: Remote MCP (sequential-thinking, reasoner, context7, task-manager, memory, GSuite)
- 일부 Context 관리: memory MCP

비어있는 영역:
- **Sensors / Verification Loop**: SKILL은 "어떻게 해라"는 지시만 있고 결과 검증 게이트가 없다
- **PEV 강제 루프**: SKILL이 있어도 모델이 건너뛰면 그만
- **Context Governance**: memory MCP의 저장 정책 부재 → 회사/사이드/개인 컨텍스트 혼재 위험
- **Observability**: 도구 호출 실패율, 토큰, hallucination 가시성 없음

---

## [웜업] 3. 이건 Claude Code에서나 쓰는 거 아닌가

첫 번째 의문. 위 설계는 대부분 Claude Code 의존이다.

| 구성요소 | Claude Code | Desktop | Web/Mobile |
|---|---|---|---|
| CLAUDE.md / AGENTS.md 자동 로드 | ✅ | ❌ | ❌ |
| 로컬 SKILL 자동 트리거 | ✅ | ❌ (Unverified) | ❌ |
| Hooks | ✅ | ❌ | ❌ |
| Slash commands | ✅ | ❌ | ❌ |
| Remote MCP | ✅ | ✅ | ✅ |
| Projects (instruction + 파일) | ❌ | ❌ | ✅ |

이식 가능한 후보를 추리면 Remote MCP와 Projects custom instruction 정도다. Projects는 시스템 프롬프트성 가이드를 주입할 수 있지만 결정적 게이트는 불가능하다 — 모델이 instruction을 무시하면 그만. 반면 Remote MCP는 서버 단에서 파라미터 검증·정책 검사를 강제할 수 있다.

→ 결정적 게이트를 환경 무관하게 두려면 **MCP 서버 쪽으로 옮기는 것이 유일한 경로**처럼 보였다.

---

## [웜업 · OPUS 제안] 4. Harness를 MCP로 옮긴다는 아이디어

Opus가 제시한 방향:

> "Harness의 강제력을 클라이언트(Code/Web/Desktop) 밖으로 빼서, MCP 서버를 신뢰 경계(trust boundary)로 삼는다."

논거:
- 클라이언트 SKILL은 확률적 — 모델이 따를 수도, 무시할 수도 있음
- MCP 서버 측 파라미터 검증·정책은 결정적 — 빈 값이면 422 반환
- 환경 이식성: 어느 클라이언트에서 호출해도 동일 게이트 통과

```
Client Layer (Claude Code / Web / Desktop)
  - SKILL.md: "어떻게 호출할지" 권고
  - 확률적 compliance
        ↓ MCP 호출
Harness MCP Servers (신뢰 경계)
  - 파라미터 스키마 검증
  - 정책 게이트
  - 상태 머신 (단계 전이 강제)
  - 감사 로그
  → 위반 시 거부 응답
        ↓
실제 저장소/외부 시스템
```

그럴듯했다. 그래서 실제로 해봤다.

---

## [웜업 · OPUS 제안] 5. 단일 SKILL을 MCP화 해보면

`portfolio-feedback` SKILL을 예로 들어 도메인 모델, 상태머신, 도구 분할, 게이트 설계까지 blueprint를 짰다.

- `PortfolioReview` aggregate + 상태머신 (DRAFT → PERSONA_SET → FIRST_READ_DONE → SCORED → CHALLENGED → ...)
- 도구 12개 (`review.start`, `set_persona`, `first_read`, `score_dimension`, `challenge_score`, ...)
- 게이트: Order Gate, Evidence Gate, Rubric Gate, Challenge Gate, Specificity Gate, Persona Consistency Gate, Vulnerability Distinct Gate

여기서 멈추고 물었다: **"명시적으로 SKILL을 호출하는 것과 MCP 이식의 차별점이 뭔가?"**

Opus는 차이는 "기능"이 아니라 **"보장의 종류"**에 있다고 정리했다.

- SKILL: 확률적 권고
- MCP: 결정적 게이트, 환경 이식성, 재현성

단일 SKILL을 MCP로 옮기는 게 정당화되려면 세 조건이 모두 성립해야 한다:

1. 같은 작업을 Web/모바일에서도 똑같이 쓰고 싶은가
2. 결과의 재현성/감사 추적이 필요한가
3. SKILL이 실제로 자주 우회되어 품질이 흔들리는가

`portfolio-feedback`에 적용하면 — Web 사용 빈도 낮고, 품질 흔들림 거의 없고, 셋 중 하나만 부분 충족. 오버엔지니어링. Opus는 "별로 의미 없다"고 결론 내렸다.

이쯤에서 다른 의문이 생겼다.

---

## [전환점] 6. Harness의 본질이 진짜 뭔가

> Harness 단계는 플래닝 → quality gateway → 작업 → quality gateway 같은 구조로 **AI 판단 포인트를 줄이는 것**이 목적이다.

- SKILL = "잘 판단해라" (판단을 모델에 맡김)
- Harness = "판단할 일을 줄여라" (결정 지점을 사전에 제거하거나 결정적 규칙으로 치환)

판단 포인트가 많을수록 확률적 실패가 누적되고, 장기 자율 작업에서 폭발적으로 어긋난다. 반대로 **Harness가 진짜 빛나는 영역은 AI-Driven Development, Full Self-Develop 같은 장기 자율 워크플로**다. 단일 작업 단위에선 가치가 작다.

여기서 4~5를 다시 봤을 때 의심이 생겼다.

---

## [내 반론] 7. MCP에 강제력을 박는 발상에 대한 반론

4~5에서 Opus는 MCP를 신뢰 경계로 삼으면 결정적 게이트와 환경 이식성을 얻는다고 했다. 그런데 정말 그런가.

**반론 1 — 토큰 비용**

- 도구 호출마다 페이로드 누적
- 상태머신 단계가 많으면 라운드트립 증가
- 거부 응답 → 재호출 → 토큰 배가
- 경험적 추정으로 동일 작업 대비 1.5~2배 증가 (Unverified)

**반론 2 — MCP는 본래 정책 엔진이 아니다**

MCP의 설계 의도는 모델이 **판단**하고 MCP가 **실행**하는 구조다. 정책을 MCP에 박는 건 용도 외 사용이다. 결정적으로, **게이트가 작동하려면 모델이 그 도구를 호출하기로 먼저 결정해야 한다.** 모델이 "MCP 안 쓰고 직접 답할게"를 선택하면 게이트는 존재하지 않는 것과 같다. MCP에 박은 강제력도 여전히 모델 협조 기반이다.

→ 정말 결정적 강제가 필요하면 MCP가 아니라 **CI/CD, sandbox, 권한 분리, 환경 단**에서 해야 한다.

### 강제력의 계층

이걸 정리하면 강제력은 단층이 아니다.

| 계층 | 도구 | 강제력 | 모델 협조 필요? |
|---|---|---|---|
| L1 인프라/환경 | sandbox, 권한, 네트워크 격리 | 결정적 | ❌ |
| L2 CI/CD 게이트 | 머지 차단, 배포 차단 | 결정적 | ❌ |
| L3 정적 검사기 | 린트, 타입, 테스트 | 결정적 | ❌ |
| L4 LLM-as-judge | 별도 모델 검증 | 추론적 | 부분 |
| L5 MCP 도구 | 파라미터 검증, 상태머신 | 부분적 | ✅ |
| L6 SKILL/AGENTS.md | 권고 | 확률적 | ✅ |

진짜 강제력은 L1~L3에 있다. Opus가 "MCP = trust boundary"라고 한 건 L5를 L2~L3 수준으로 오인한 것에 가깝다.

---

## 8. 그러면 Harness의 진짜 정체는

7장의 반론과 6장의 재정의를 합치면:

> Harness는 결국 **지침 덩어리이고, 그 지침을 준수하는 판단력 자체도 AI에 위임한다.** 외부에 결정적 안전망(L1~L3)을 두되, 워크플로 본체는 지침으로 모델 협조를 끌어내는 구조다.

7장과 8장이 모순처럼 보이지만 층위가 다르다:
- 7장 = 결정적 강제는 인프라에 두어야 한다 (외부 강제력의 위치)
- 8장 = 워크플로 본체는 지침과 협조다 (모델 운영 방식)

둘은 공존한다. 결과적으로 Harness는 **프로젝트 템플릿** 형태로 응결된다.

```
project-root/
├── CLAUDE.md (또는 AGENTS.md) — 톱레벨 지침
├── .claude/
│   ├── skills/
│   │   ├── plan-gateway/SKILL.md
│   │   ├── code-quality-gateway/SKILL.md
│   │   ├── review-gateway/SKILL.md
│   │   └── ...
│   ├── commands/
│   └── settings.json — MCP, hook 설정
├── docs/
│   ├── architecture.md
│   └── decisions/ (ADR)
```

이 묶음이 곧 "그 프로젝트의 Harness"다.

---

## 9. 기존 SE 원리의 재발견인가

Harness = (Command + SKILL + MCP + Terminal) × (Quality Gate + Loop)

표면 형식은 달라도 구조는 기존 SE와 동형이다.

| 일반 SE | LLM 도구 |
|---|---|
| 함수/모듈 | command, SKILL |
| 라이브러리 | MCP |
| 빌드 시스템 | orchestrator |
| 린트/테스트/CI | quality gate |
| 프로젝트 템플릿 | Harness preset |
| 사내 표준/규약 | CLAUDE.md, AGENTS.md |

**새 개념이라기보다는 기존 SE 원리에 LLM 특성을 입힌 재발견이다.**

### 다만 하나는 진짜 새롭다

**모델 자신이 자가 검증 루프에 참여한다**는 것. 기존 SE의 quality gate는 결정적(linter, test)이다. LLM-as-judge, devil's advocate pass, multi-model voting은 일반 SE에 없던 패턴이다. 이 부분만 진짜 새롭고, 나머지는 기존 패러다임의 재포장이라는 게 현재 가설이다.

---

## 10. 도구가 아니라 패러다임 후보

패러다임은 후대가 부여하는 이름이지 지금 선언할 수 있는 것이 아니다. 그러나 **패러다임 후보**로서 Harness Engineering이 주장하는 것:

1. 모델은 확률적이다 — 결정적 강제는 모델 바깥에 두어야 한다
2. 판단 포인트가 많을수록 누적 실패율이 높아진다 — 판단을 줄이는 것이 일관성의 본질
3. 단일 도구로 해결되지 않는다 — 조합과 게이트·루프가 본질
4. 기존 SE 원리(CI/CD, 게이트, 멱등성)가 그대로 적용된다

| 패러다임 전환 | 도구 수준 | 패러다임 수준 |
|---|---|---|
| DevOps | "Jenkins 쓰자" | "개발과 운영의 경계를 없앤다" |
| Microservices | "Spring Cloud 쓰자" | "조직 구조와 시스템 구조를 일치시킨다" |
| Harness Engineering | "MCP/SKILL 쓰자" | **"LLM 출력 신뢰성을 모델 바깥의 구조로 만든다"** |

이 명제들이 도구가 바뀌어도 살아남는다면 — 그게 패러다임의 증거다. 지금은 그걸 알 수 없다.

---

## 11. Devil's Advocate — 자가 검증

### Steel-man

LLM을 프로덕션에서 안정적으로 운영하려면 모델의 확률적 특성을 인정하고 모델 외부에 결정적 게이트를 두는 아키텍처 사고가 필요하다. 이 구조적 사고가 특정 도구를 초월해 유지된다면 "패러다임"이라는 명칭이 정당화된다.

### 숨은 가정

1. 현재 모델의 확률적 특성이 앞으로도 Harness를 필요로 할 만큼 지속된다
2. "판단 포인트 감소 → 누적 실패율 감소"가 단조 관계다
3. "Harness Engineering"이라는 명칭이 업계에서 충분히 수렴 중이다

### 반론 1: 패러다임 선언은 규범적 주장을 서술적 사실로 포장한다 `[structural]` · severity: **high**

DevOps도 당시엔 "좋은 관행의 묶음"이었다. "특정 도구가 사라져도 살아남는지"는 지금 알 수 없고 10년 뒤에 판명된다. 이 글이 할 수 있는 최대치는 "패러다임 후보"다.

*선례: Design Patterns (GoF, 1994) — 저자들은 패러다임이라 선언하지 않았다. 패턴 언어라는 어휘로 정착한 것이다.*

### 반론 2: "판단 포인트 감소 = 일관성"은 모델 진화를 무시한 현재 스냅샷이다 `[assumption]` · severity: **high**

실제 LLM은 앞 단계 출력을 보고 뒤 단계에서 자가 수정한다 — 판단 포인트가 오히려 오류 수정 기회일 수 있다. 모델 성능이 올라가면 "복잡한 Harness"보다 "더 좋은 모델에게 그냥 맡기기"가 나을 수 있다.

*선례: Expert Systems → Neural Networks. 정교한 규칙 기반 강제 구조가 확률적 학습에 밀렸다.*

### 반론 3: "MCP는 모델 협조 기반"이라는 주장이 부분적으로 틀렸다 `[assumption]` · severity: **medium**

Tool Calling API의 `tool_choice: required`로 특정 도구 호출을 API 레벨에서 강제할 수 있다. "MCP는 L5, 부분적 강제"라는 계층 분류가 현재 API 기능을 충분히 반영하지 않을 수 있다.

*선례: no clear precedent — 현재 문서 확인이 우선.*

### 핵심 취약점

글 스스로 "MCP도 모델 협조 기반"이라고 인정하면서 "CLAUDE.md + SKILL + MCP 조합이 Harness"라고 결론 낸다. 이 구조는 Harness의 신뢰성 근거가 결국 모델 성능에 의존한다는 순환이 된다 — "모델 바깥의 구조로 신뢰성을 만든다"는 핵심 명제와 정면 충돌한다.

### 가역성: reversible (지금 단계에서는)

사고방식도 외부 자료 검증 후 수정 가능하다. 다만 "패러다임이다"라는 확신이 굳어지면 반증 앞에서도 사후 합리화가 작동하기 시작한다.

---

## 12. 검증되지 않은 것들

- "Harness가 패러다임 후보"라는 명제 — 업계 합의 여부 미확인
- `tool_choice: required`가 실제로 MCP L5의 강제력을 얼마나 올리는지
- 토큰 1.5~2배 증가 수치는 경험적 추정
- "Agentic terminal이 더 인기"의 정량적 근거

읽어볼 1차 자료:
- Martin Fowler — *Harness engineering for coding agent users*
- Augment Code — *Harness Engineering for AI Coding Agents*
- LangChain — *The Anatomy of an Agent Harness*
- Adnan Masood (Medium) — *Agent Harness Engineering: The Rise of the AI Control Plane*

---

## 13. 그래서 할 일

- 이 글을 외부 자료와 충돌시켜 검증
- Kotlin/Spring 백엔드 프로젝트용 Harness 템플릿 1개 시작
- plan/code quality/review 게이트 중 약한 곳부터 보강
- 새 도구가 나오면 "이게 기존 어느 자리를 대체/보완하나"로 평가
