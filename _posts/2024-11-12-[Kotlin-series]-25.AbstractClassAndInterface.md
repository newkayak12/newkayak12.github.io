---
layout: post
categories: [KOTLIN]
---


# 추상 클래스와 인터페이스

## 추상 클래스와 추상 멤버
- java와 kotlin도 abstract class를 지원한다.
- 상위 클래스 역할만 할 수 있다.

```kotlin
abstract class Entity(val name: String)
```

- 추상 클래스에도 생성자가 있을 수 있다. 추상 클래스와 비추상클래스의 차이는 추상 클래스의 생성자가 오직 하위 클래서의 생성자에서 위임 호출될 수 있다.
- 추상 멤버를 정의할 수 있다.( 타입, 파라미터, 반환 타입 등 함수나 프로퍼티의 시그니쳐만 정의한다. ) -> 오버라이드 해야 한다.


## 인터페이스
- java interface와 상당히 비슷하다.
- interface의 멤버는 기본적으로 추상멤버다.
- 클래스나 다른 인터페이스의 상위 타입이 될 수 있다.
- java랑 같이 구현을 강요할 수 있다.
- 구현에 implements, extends 구분 없이 `:`으로 작성한다.