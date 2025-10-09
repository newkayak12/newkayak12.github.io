---
layout: post
categories: [KOTLIN]
---




# 고차 함수

## 함수 타입
- 함수 타입은 함수처럼 쓰일 수 있는 값들을 표시하는 타입이다. 문법적으로 이런 타입은 함수 시그니쳐와 비슷하다.

  1. 괄호로 둘러싸인 파라미터 타입 목록은 함숫 값에 전달될 데이터의 종류와 수를 정의한다.
  2. 반환 타입은 함수 타입의 함숫 값을 호출하면 돌려 받게 되는 값의 타입을 정의한다.( 반환 값이 없다면 Unit을 반환 타입으로 사용한다.)

- java는 SAM(SingleAbstractMethod)를 문맥에 따라 적절히 함수 타입처럼 취급한다. 그래서 람다, 메소드 참조로 SAM 인터페이스를 인스턴스화 할 수 있다.
- kotlin은 `(p1...) -> R`은 함수 타입이기에 SAM 인터페이스를 암시적으로 변환할 수 없다. (1.4부터는 가능하다.)


## 람다와 익명함수

### 람다
```kotlin
fun aggregate( numbers: Array<Int>, op: (Int, Int) -> Int ):Int  {
  return 0
}
aggregate(numbers, {a, b -> a + b})
aggregate(numbers) {a, b -> a + b} //trailingClosure 같다.
```
- 이런 식(`{}`)이 람다다.
- 람다의 파라미터 목록은 괄호로 둘러싸지 않는다. 괄호로 감싸면 구조분해 할당`(destructuring)`이 된다.
- 람다에 인자가 없으면 `->` 도 생략할 수 있다.
- 인자가 하나 밖에 없는 람다는 미리 정해진 `it`라는 이름을 사용해서 가리킬 수 있다.
- 마지막으로 파라미터에서 사용하지 않는 목록은 `_`으로 지정하면 된다.

### 익명함수
```kotlin
fun aggregate( numbers: Array<Int>, op: (Int, Int) -> Int ):Int  {
    return 0
}
aggregate(numbers, fun(result, op): Int { return  result + op })
```
- `fun() =`의 식으로 익명함수를 사용할 수 있다.
- `fun` 키워드를 사용해서 표현한다.
- 파라미터 타입을 추론할 수 있다면 파라미터 타입을 지정하지 않아도 된다.
- 함수 정의와 달리 익명함수이기에 인자로 함수에 넘기거나 변수에 대입하는 등 일반 값처럼 사용할 수 있다.

### 호출 가능 참조
- 함수 정의가 있고 이 함수 정의를 함수 값처럼 고차 함수에 넘기려면 
  1. 람다로 감싸면 된다.
  2. 호출 가능 참조(callable reference)로 사용하면 된다.
```kotlin
fun check( s: String, condition: (Char) -> Boolean ):Boolean {
    return true
}
fun isLowerCase(c: Char) = c.isLowerCase()
fun main() {
    println(check("Hello", {c: Char ->  c.isLowerCase()})) //lambda
    println(check("Hello"){c: Char ->  c.isLowerCase()}) //lambda (like trailingClosure)
    println(check("Hello", ::isLowerCase)) //callableReference
  
}
```
- `::`를 클래스 앞에 하면 생성자 호출 가능 참조를 얻는다.
- 바인딩된 호출 가능 참조(bound callable reference)는 주어진 클래스 인스턴스 문맥 안에서 멤버 함수를 호출하고 싶을 때 사용할 수 있다.
- 코틀린 프로퍼티에 대한 호출 가능 참조를 만들 수 있다. 실제로 함숫 값은 아니고, reflection이다.

### 인라인 함수 프로퍼티
- 고차함수, 함수 값을 사용하면 함수가 객체로 표현되기 때문에 성능적으로 비용이 발생한다.
- 익명함수, 람다가 외부 영역을 사용하면 캡쳐링이 필요하다.
- kotlin은 `inline`으로 이를 해결한다.
- `inline`을 붙이면 객체를 생성하거나 하지 않고 컴파일 타임에 그냥 함수 본문을 그 곳에 넣어버린다.

### 비지역적 제어흐름
- 고차함수를 사용하면 일부러 제어 흐름을 깰 때 문제가 된다.
- 