---
layout: post
categories: [KOTLIN]
---


# 위임 프로퍼티

## 기본 위임 프로퍼티
- lazy 같은 것을 의미한다.
- lazy는 여러 버전의 구현이 있다. `LazyThreadSafetyMode`로 이를 정할 수 있다.
  1. SYNCHRONIZED: 프로퍼티 접근을 동기화한다. 따라서 한 번에 한 쓰레드만 프로퍼티 값을 초기화 할 수 있다.(default)
  2. PUBLICATION: 초기화 함수가 여러 번 호출될 수 있지만 가장 처음 도착한 결과가 프로퍼티 값이 되도록 둔다.
  3. NONE: 프로퍼티 접근을 동기화 하지 않는다. 쓰레드 safe하지 않다.
- 초기화 함수가 예외를 던지면 초기화되지 않는다.
- `kotlin.properties.Delegates`의 멤버를 통해서 몇 가지 표준 위임을 사용할 수 있다.
- `NotNull`은 함수 프로퍼티 초기화를 미루면서 Null이 아닌 프로퍼티를 정의할 수 있게 해준다. (lateinit과 결과적으로 같다.)
- `observable`은 변화에 따라 통지받을 수 있다.
- `vetoable`은 observable과 비슷하지만 초깃값을 받고 boolean을 뱉는 람다를 받는 인자를 가진다. 변경 시도에 따라 변경 전 이 람다가 콜되고 true면 변경된다.
- `beforeChange`, `afterChange`등도 있다.


## 커스텀 위임 프로퍼티
- 커스텀 위임을 만들고자 한다면 읽고 쓰는 방법을 구현해야 한다.
- 연산자 함수들을 정의하는 특별한 타입이 필요하다. 읽기 함수 이름은 `getValue`여야 하고 `receiver`, `property`를 받는다.
- receiver는 수신 객체 값이 들어 있고, 위임된 프로퍼티의 수신 객체와 같은 타입이어야 한다.
- property는 프로퍼티 선언을 표현하는 리플렉션이 들어 있다. `KProperty<*>`이거나 상위 타입이어야 한다.
- 이 두 파라미터는 이름보다 타입이 중요하다. `getValue()`는 반드시 위임 프로퍼티 타입과 같거나 하위 타입이어야 한다.

```kotlin

import com.sun.org.apache.xml.internal.security.Init
import kotlin.reflect.KProperty

class Cachable<in R, out T : Any>(val init: R.() -> T) {
  private val map = HashMap<R, T>()

  operator fun getValue(receiver: R, property: KProperty<*>): T {
    return map.getOrPut(receiver) { receiver.init() }
  }
}

fun <R, T : Any> cached(init: R.() -> T) = Cachable(init)
class Person(val firstName: STring, val familyName: String) 
val Person.fullName: String by cached { "$firstName $familyName" }


//여기서 읽기 전용을 만들고 싶다면 `kotlin.properties.ReadOnlyProperty`
```
- 읽고 쓰는 것을 정의하려면 `getValue()`, `setValue()`를 정의해야 한다.  receiver, property, newValue 세 가지 파라미터를 받는다
- kotlin 1.1부터는 `provideDelegate()` 함수를 통해서 위임 인스턴스화를 제어할 수 있다. 기본적으로 프로퍼티 선언 뒤의 by 키워드 다음에 오는 식을 통해 위임 인스턴스를 정의한다.

## 위임 표현
- 러타임에 위임은 별도의 필드에 저장한다. 반면 프로퍼티 자체에 대해서는 접근자가 자동으로 생성된다. 이 접근자는 위임에 있는 적절한 메소드를 호출한다.
```kotlin
class Person (val firstName: String, val familyName: String ) {
    var age: Int by finalLateInit()
}
//이 코드는

class Person (val firstName: String, val familyName: String ) {
  private val `age$delegate` = finalLateInit<Person, Int>()
  
  var age: Int
    get() = `age$delegate`.getValue(this, this::age)
    set(value) {
      `age$delegate`.setValue(this, this::age, value)
    }
}

```