---
layout: post
categories: [KOTLIN]
---



# Property

## 최상위 프로퍼티
- 클래스나 함수와 마찬가지로 최상위 수준에 프로퍼티를 정의할 수도 있다.

## 늦은 초기화
- 프로퍼티를 최대한 늦게, 효율적으로 초기화 해야할 수도 있다. 의존 관계 주입 등과 같이 말이다.
- 이 경우 default 값을 주고 늦게 초기화할 수도 있다.
- `lateinit`이라는 키워드로 이를 알린다.
  - 프로퍼티가 코드에 따라서 변경되어야 하므로 `var`로 선언한다.
  - NonNullType이어야 한다.
  - Int, Boolean 같은 원시 타입이 아니어야 한다. (초기화 되어 있지 않음을 표시하기 위해서 Null을 사용해야 한다.)


## 커스텀 접근자 사용하기
- kotlin 프로퍼티는 변수와 함수의 동작을 한 선언 안에서 조합할 수 있다는 것에 있다.
- 참고로 Swift의 get/set과 같다.
```swift
var _name
var fullName: String  {
    get {
        return _name
    } 
    set(val) {
        self._name = val
    }
}
```
```kotlin
var hello: String = "world"
    public get() = "Hello $field"
    protected set(value) {field = value.replace("Hello ", "")}

var age: Int = 20
    get() = field * 10
    private set
```
- 내부에서 `field`라는 키워드로 필드 참조가 가능하다.
- 사용하는 경우는
  1. 예외 가능성이 없거나
  2. 계산 비용이 싸거나
  3. 값을 캐시해두거나
  4. 여러 번 읽거나
  5. 함수를 호출해도 같은 결과를 내는 경우
- 참고로 `lateinit`은 항상 자동으로 접근자가 생성되므로 직접 커스텀 접근자를 정의할 수 없다.
- 주생성자, 파라미터로 선언된 프로퍼티에 대한 접근자도 지원하지 않는다.


## 지연 계산 프로퍼티
- 지연 + 계산 프로퍼티를 쓰고 싶을 수 있다.
- 이 경우 `lazy` 프로퍼티를 이용하면 된다.
```kotlin
import java.io.File
val text by lazy { 
    File("data.txt").readText();
}
```
- 위 구문은 실질적으로는 `delegateObject`를 이용해서 구현하는 위임 프로퍼티라는 경우다.