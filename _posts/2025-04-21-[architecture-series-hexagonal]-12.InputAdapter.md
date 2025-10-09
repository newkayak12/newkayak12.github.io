---
layout: post
categories: [ARCHITECTURE, DDD, HEXAGONAL]
---

# InputAdapter

- inputAdapter는 Driving, incoming adapter이다.
- controller -> application 계층에 있는 service로 흐른다.
- DIP가 적용되어 있다.
- 보통 입력 유효성 검증을 한다. 그러니까 웹 어댑터의 입력 모델을 UseCase의 입력 모델로 변환할 수 있음을 검증해야 한다.
- Http와 관련된 것은 application으로 침투시키지 않도록 해야 한다.
- 한 개 이상의 클래스로 구성해도 된다.(UseCase 같이 의도를 명확하게 드러내는 이름으로, 응집성을 높이는 방향으로 말이다.)