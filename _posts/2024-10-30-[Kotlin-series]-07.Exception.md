---
layout: post
categories: [KOTLIN]
---


# Exception

- 전체적으로 java와 비슷하게 운용된다.
- 단, `new`라는 구문이 없다는 점과 kotlin은 checked, unchecked error를 구분하지 않는다는 점이 다르다.
- kotlin의 `throw`는 `break`, `continue`와 같이 `Nothing` 타입이다.

## try 문으로 예외처리
- java에서 같이 kotlin은 try-catch로 Exception을 캐치할 수 있다.
- 단, kotlin에서는 catch에 Exception 타입을 `catch ( A | B ) `와 같이 동시에 캐치하는 것은 아직 지원하지 않는다.