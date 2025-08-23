---
layout: post
categories: [ARCHITECTURE, DDD, HEXAGONAL]
---

# 지름길

- 쓸 때는 좋지만 결국은 부채가 된다.
- 그렇기에 지름길을 알고 의식적으로 쓰지 않아야 한다.

## UseCase간 모델 공유
- UseCase 간 모델을 공유하면 한 UseCase에서 모델을 수정할 필요가 생기면 다른 UseCase에도 영향이 간다.
- 즉, '결합이 생긴다.'
- 이는 '변경할 이유를 공유하게 된다.'
- 물론 무조건 하지 말아야 하는 것은 아니다. 기능적으로 묶여있다면 상관 없다.

## Domain Entity를 입출력으로 사용
- 간단하게 사용할 수 있어 유혹을 느끼기 쉽지만 도메인 엔티티에 불필요한 필드를 늘리는 우를 범할 수도 있다.
- UseCase의 변경이 domain Entity로 전이될 수도 있다. 

## IncomingPort 건너뛰기
- inputPort 없이 Service에 직결하고 싶을 수 있다.
- 그러면 Adpater가 너무 많은 정보를 알아야만 한다. 강결합이다.
- 또한 아키텍쳐를 무너뜨리기 쉬어지기 때문에 아키텍쳐를 위해서라도 건너뛰지 말아야 한다.

## Service 건너뛰기
- Input, Output 간 강결합이 생긴다.
- UseCase, Service가 없어지면 InputAdapter에 비즈니스 로직이 생기고 본연의 책임이 희석된다.
- 물론 '절대 하지마'는 없다. 최소한 팀 내 합의가 필요한 부분임은 확실하다.