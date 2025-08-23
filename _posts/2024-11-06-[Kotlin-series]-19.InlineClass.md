---
layout: post
categories: [KOTLIN]
---


# 인라인 클래스( 값 클래스 )

 - 실제로 사용하다가 보면 래퍼 클래스를 만드는 경우가 있다. 
 - 이 과정에서 불필요한 에너지 소모가 든다. 추가로 부가 비용이 든다.
 - 이를 해결하기 위해서 kotlin에서는 `inline class`를 도입했다.

## 인라인 클래스 정의하기
- 인라인 클래스를 정의하려면 `value class`로 정의하면 된다.
- 또한 `@JvmInline`를 반드시 붙여야 한다.

```kotlin
@JvmInline
value class Dollar(val amount: Int)
@JvmInline
value class Euro(val amount: Int)
```

- 인라인 클래스의 주생성자에는 불변 프로퍼티를 하나만 선언해야 한다.
- 런타임에 클래스 인스턴스는 별도의 래퍼 객체를 생성하지 않고 이 프로퍼티의 값으로 표현한다.
- 인라인 클래스도 자체 함수와 프로퍼티를 포함할 수 있다. 인라인 클래스의 프로퍼티는 상태를 포함할 수 없다.
- 단, kotlin에서는 컴파일러가 오직 한 프로퍼티만 인라인하도록 지원하기에 `lateinit` 등의 위임 객체를 사용할 수 없다.
- 인라인 클래스 내부에는 가변 상태가 없기에 `var`이 없다.

## 부호 없는 정수 
- `UByte`, `UShort`, `UInt`, `ULong`은 unsigned 타입이다.