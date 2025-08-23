---
layout: post
categories: [KOTLIN]
---


# 공통 메소드

- `Any`에 여러 가지가 미리 선언되어 있다.
```kotlin
open class Any {
    public open operator  fun equals(other: Any?): Boolean
    public open fun hashCode(): Int
    public open fun toString(): String
}
```
- operator로 구조적 동등성 (==, !=)을 구분할 수 있다.
- 해시코드 계산, HashSet, HashMap 등의 일부 컬렉션 타입이 해시 코드를 사용한다.
- String으로 변환하는 기본적인 방법을 제공한다.