---
layout: post
categories: [ARCHITECTURE, DDD, HEXAGONAL]
---

# UseCase

- UseCase는 incoming adapter로부터 입력을 받는다.
- UseCase는 비즈니스 규칙을 검증할 책임이 있다.
> - 비즈니스 규칙 검증을 위해서 도메인 모델의 현재 상태에 접근할 필요가 있다.
> - 더 맥락에 입각해서 검증해야 한다.
> - 비즈니스 규칙은 UseCase의 맥락 속에서 semantical( 의미적인 ) 유효성을 검증해야 한다.
- 비즈니스 규칙을 충족하면 UseCase 입력을 기반으로 어떤 방법으로든 모델의 상태를 변경한다.
- Output adapter에서 출력 값을, UseCase를 호출한 adapter로 반환한다.
- AntiCorruptionLayer의 역할을 하기도 한다.
- UseCase마다 동일한 입력 모델을 쓸 수도 있다. (같은 관심사, 같은 사이클에 속한다면 말이다.) 그러나 대부분의 경우 관심사 오염 방지, 불필요한 부수 효과를 피하기 위해서 분리한다.
- 비즈니스 로직은 보통 엔티티에 넣고 사용한다. 이는 DDD의 풍부한 도메인 모델의 방향성에 부합한다.
- 도메인 로직이 유스케이스 클래스에 구현돼 있다는 것이다. 비즈니스 규칙을 검증하고, 엔티티 상태를 바꾸는 식이다.
- 출력 모델은 UseCase의 입력모델과 같이 맞춰서 구체적으로 작성하면 좋다. 이를 공용으로 사용하면 UseCase 간 강결합이 생긴다.
- 더 나아가 Query, Command 역할의 UseCase를 나누는 방법도 있다. 이를 더 심화해서 CQRS(Command-Query Responsibility Segregation)를 개념을 만들기도 한다.