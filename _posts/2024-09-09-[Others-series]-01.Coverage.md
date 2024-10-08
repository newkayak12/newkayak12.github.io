---
layout: post
categories: [OTHERS]
---


# 커버리지 
## 테스트 커버리지

테스트 커버리지란 시스템 및 소프트웨어에 대해 충분히 테스트 되었는지를 나타내는 정도다. 

## 코드 커버리지
코드 커버리지란 테스트에 의해서 실행된 소스 코드의 양을 나타낸 것이다. 테스트로 코드가 얼마나 커버 되었는지를 나타내는 것이다. 소스 코드
기반 테스트는 화이트 박스 테스트를 통해서 측정된다.

> ### 화이트 박스
> 소브트웨어 내부 소스 코드의 논리적인 모든 경로를 테스트하여 모듈 내부의 작동을 확인하는 것이다. 모듈을 한 번 이상 실행하므로써 수행된다.

> ### 블랙박스 테스트
> 사용자 입장에서 구현된 기능이 완전하게 동작되는지를 확인하는 테스트이다. 소브트웨어 내부 코드 및 세부 동작을 알 필요없으며, 입력 값에 따라
> 올바른 출력값이 나오는지 확인하는 테스트이다.


### 필요성
코드 커버리지는 테스트를 수치화 하여 놓친 부분을 보완할 수 있게 해준다.

### 기준

#### 구문 커버리지(Statement Coverage)
라인 커버리지라고도 하며, 코드 한 줄이 한 번 이상 실행된다면 충족된다.

#### 결정 커버리지(Decision Coverage)
브랜치 커버리지라고도 하며 조건식이 True/ False를 가지는 경우 충족된다.

#### 조건 커버리지
모든 내부 조건에 대해서 True/False를 가지게 되면 충족된다.
