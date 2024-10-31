---
layout: post
categories: [KOTLIN]
---



# 함수

- kotlin에서 함수는 fun 키워드로 시작하며, 중간 식별자와 파라미터 그리고 반환 타입을 작성한다.
- {} 블록으로 함수 구현을 기술한다.

```kotlin
fun test( intTest: Int ): Int {
    return intTest
}
```

> 특이사항
> - java에서 파라미터는 final을 붙이지 않는 이상 가변이다.
> - kotlin은 기본 불변이다. 추가적으로 val, var도 못 붙인다. kotlin은 값에 의한 호출 의미론을 사용한다.


## 위치 기반, 이름이 붙은 인자
- kotlin도 swift 같이 위치, 이름 기반 인자 식별을 지원한다.
```kotlin
fun rectangleArea(width: Double, height: Double): Double = width*height


fun main() {
    rectangleArea(1.0, 1.0)
    rectangleArea(height = 1.0, width = 1.0)
}
```

## 오버로딩, default 값
- java와 마찬가지로 kotlin도 overload가 된다.
- java와 달리 js 같이 기본 값을 둘 수 있다.

```kotlin
fun plus( a: String, b: String ): String = "$a, $b"
fun plus( a: String, b: String = "HELLO" ): String = "$a, $b"
```

- overload를 찾는 규칙은 자바와 같다.

## 가변 인자
- java의 가변인자를 사용하려면 `vararg`를 붙여야 한다.
```kotlin
fun print(vararg text: String) {
    println(text.contentToString())
}
```

- 추가적으로 배열을 풀어내려면 spread 연산자를 사용하면 된다.

```kotlin
fun printFunction(vararg text: String) {
    println(text.contentToString())
}
val test = Array<String>(10) { "$it + 1" }


printFunction(test)
/**
 * Type mismatch.
 * Required:String
 * Found:Array<String>
 */
printFunction(*test)

// 얕은 복사가 된다.
```

## 함수 영역, 가시성
- kotlin 함수는 세 가지로 구분된다.
    1. 파일에 직접 선언된 최상위 함수
    2. 어떤 타입 내부에 선언된 멤버 함수
    3. 다른 함수 안에 선언된 지역 함수