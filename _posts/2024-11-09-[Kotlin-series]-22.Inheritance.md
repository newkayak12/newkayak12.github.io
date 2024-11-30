---
layout: post
categories: [KOTLIN]
---


# 상속

## 하위 클래스 선언
- 주생성자 뒤에 `:`을 넣고 그 뒤에 상위 클래스가 될 클래스 명을 넣으면 된다.
- `extends`, `implements` 구분이 없다. 대신 `super`에 대한 call을 해야 하기 떄문에 생성을 위임하는 목적으로 `()`을 붙인다.
- java에서는 상속을 금지하려면 final을 명시해야 하지만 kotlin은 기본이 상속을 막기 떄문에 `open`으로 선언해야 한다.
- 몇몇 클래스는 아예 상속이 불가한 경우도 있다. `data class`는 제한적으로, `inline class`는 subclassing도 불가능하고 super가 될 수도 없다.
- kotlin에서 오버라이드를 하려면 `override`를 붙여야 한다. `@Override`가 아니다.
- 클래스 멤버는 final이 아니라면 오버라이드 할 수 있고, 그에 따라 어떻게 호출될지 정해질 수 있다.
- 불변 프로퍼티는 가변으로도 오버라이드할 수 있다.
- 확장은 항상 정적으로 호출할 대상이 결정된다.
- `protected`는 java와 같다.


## 하위 클래스 초기화
- 기본적으로 인스턴스화하면 상위 클래스에 대한 초기화도 연쇄적으로 일어나는데 `Any`에 이를 떄까지 진행된다.
- 이런 호출을 `delegate call`이라고 한다.
```kotlin
open class Person(val name: String, val age: Int)
class Student(name: String, age: Int, val university: String): Person(name, age)
```
- java와 다르게 생성자 간 호출이 클래스 내부로 들어가는 경우는 없다.
- 추가적으로 주생성자가 있으면 부생성자로 상위 클래스 위임 호출이 불가하다.
- 아예 주생성자 없이 부생성자로만 이루는 것도 방법이다.
- 추가로 `leacking this` 문제가 있을 수 있다.

```kotlin
open class Person(val name: String, val age: Int) {
    override fun toString(): String = "$name, $age"

    init {
        print(this)
    }
}

class Student(name: String, age: Int, val university: String) : Person(name, age) {
    override fun toString(): String = super.toString() + "(student at $university)"
}
/**
 * 이러면 super의 init이 돌면서 override된 함수가 실행, 
 * university가 초기화되지 않은 상태에서 실행된다.
 * 몇 없는 null이 될 수 있는 상황이다.
**/
```


