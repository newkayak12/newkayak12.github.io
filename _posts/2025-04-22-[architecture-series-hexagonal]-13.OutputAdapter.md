---
layout: post
categories: [ARCHITECTURE, DDD, HEXAGONAL]
---



# OutputAdapter
- Port interface를 구현하고 Service에서는 이를 통해서 호출한다.
- Hexagonal에서 Driven, Outgoing adapter다.
- 영속성 어댑터 입력 모델이 영속성 어댑터 내부가 아니라 application core에 있기에 영속성 adpater 내부를 변경하는 것이 core에 영향이 없다.
- port는 모든 연산을 하나에 인터페이스에 넣어둘 수도 있지만 `ISP`에 따라서 클라이언트가 오로지 자신이 필요로 하는 메소드만 알면 되기에 특화된 인터페이스로 분리하는 것이 더 추천된다.
- 이렇게 하면 plug-and-play, 의존성을 두고 뭘 쓸지 고민하는 상황이 필요가 없어진다.
- 영속성 포트에 의해 정의된 명세를 어떤 클래스가 구현하는지는 관심사가 아니게 된다.
- aggregate 당 하나의 persistence adapter는 bounded context의 영속성 요구사항을 분리하기 위한 좋은 토대가 된다.
- 어떤 맥락이 다른 맥락에 있는 무엇인가를 필요로 하면 전용 incoming port로 접근해야 한다.