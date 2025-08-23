---
layout: post
categories: [KOTLIN]
---


# DataClass

- 데이터를 저장하기 위한 목적으로 만들어진 타입
- java14의 record와 유사하다.

## 데이터 클래스와 데이터 클래스에 대한 연산

- 원래 java는 클래스 간 비교로 `equals()` and `hashCode()`를 구현하면 된다.
- 이런 boilerplate 코드를 줄이기 위해서 java에서는 record가 도입됐다.
- kotlin에서는 `data class`가 있다. 역시 boilberplate를 줄여주는 방향으로 구현됐다.
- 또한 property는 `copy()` 함수를 제공한다. 

## 구조 분해 선언

```kotlin
import kotlin.random.Random

data class Person(
    val firstName: String,
    val familyName: String,
    val age: Int
) 
fun newPerson() = Person(readLine()!!, readLine()!!, Random.nextInt())

fun main() {
    val person = newPerson()
    val (firstName, familyName, age) = person
    //괄호로 감싼 식별자 목록으로 여러 변수로 한꺼번에 정의할 수 있게 해주는 일반화된 지역 변수 선언 구문이다.
}
```
- 사용하지 않는 변수는 `_`으로 씹을 수 있다.
- `var`이나 `val` 중 하나로 선언해서 사용할 수 있다. 