---
layout: post
categories: [KOTLIN]
---


# 타입 검사와 캐스팅

- 어떤 인스턴스가 더 구체적인 타입에 속하는지 검사하고 필요할 때 타입을 변환할 필요가 있을 수 있다. 
- kotlin은 타입 검사와 캐스팅 연산을 제공하는데, `is`연산자는 왼쪽 피연산자가 오른쪽에 주어진 타입인 경우 true를 반환한다.
- `null`은 모든 null이 될 수 있는 타입의 인스턴스로 간주되지만, 모든 null이 될 수 없는 타입의 인스턴스는 아닌 것으로 간주된다.
```kotlin
fun main() {
    println(null is Int) //false
    println(null is Int?) //true
    
}
```
- `!is`로 `is`를 부정할 수 있다.
- java의 `instanceOf`와 유사하다 그러나 java은 null에 대해서 모두 false지만 kotlin은 다르다.
- `is`/`!is`를 `in`/`!in`처럼 특별한 조건으로 사용할 수 있는 식 내부에서도 스마트 캐스트가 지원된다.
```kotlin
val objects = arrayOf("1", 2, "3", 4)
var sum = 0
for(obj in objects){
    when(obj){
        is Int -> sum += obj
        is String -> sum += obj.toInt()
    }
}
```
- 스마트 캐스트는 변경 여지가 없다는 가정하에 이뤄진다. 
  - 프로퍼티나 커스텀 접근자가 정의된 변수에 대해서는 스마트 캐스트를 사용할 수 없다.
  - 위임을 사용하는 프로퍼티나 지역변수도 이런 케이스에 포함된다.
  - 열린 멤버의 경우 프로퍼티를 오버라이드하면서 커스텁 접근자 추가 가능성이 있기에 스마트 캐스트 대상이 아니다.
  - 가변 지역 변수의 경우 검사 시점, 읽는 시점간 변경 가능성이 있어서 스마트 캐스트 대상이 아니다.
  - 가변 프로퍼티도 아니다.