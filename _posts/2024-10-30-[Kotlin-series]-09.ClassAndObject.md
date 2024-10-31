---
layout: post
categories: [KOTLIN]
---


# Class
- java와 비슷한 형태로 class를 운용한다.

## 생성자
- kotlin의 생성자는 주 생성자와 부 생성자들로 이뤄진다.
- 주 생성자는 class header의 파라미터 목록을 의미한다.
- 또한 `init` 키워드가 붙은 초기화 블록으로 복잡한 초기화 로직을 수행할 수도 있다. init에는 return이 불가하다.
- **주 생성자의 파라미터를 초기화나 init 블록 바깥에서 사용할 수 없다.** 만약 사용하려거든 이 값을 받는 프로퍼티를 만들어야 한다.
- java와 같은 형태로 생성자를 작성하는 방식은 **부 생성자**로 할 수 있다. `constructor` 키워드로 작성한다.
- 기본적으로 부 생성자는 Unit 타입을 반환하는 함수와 같다.
- java와 같이 부 생성자에서 다른 생성자를 호출할 수도 있다. kotlin에서는 이를 **위임 호출**이라고 한다.

## 가시성
- public: 어디서나 볼 수 있다.
- internal: 멤버가 속한 클래스가 포함된 컴파일 모듈 내에서만 볼 수 있다.
- protected: 멤버가 속한 클래스, subClassing한 하위 클래스에서 볼 수 있다.
- private: 클래스 내에서만 볼 수 있다.

## 내포된 클래스(중첩 클래스)
- kotlin에서 클래스는 다른 클래스를 멤버로 가질 수도 있다. 이를 nestedClass라고 한다.
- 중첩 클래스는 본문 밖에서는 바깥부터 차례로 접근해야 한다. `Person.Id`같이 말이다.
- 당연히 내포된 클래스에도 가시성을 적용할 수 있다.
- java와 달리 바깥 클래스가 private 선언한 내포된 클래스의 멤버에 접근할 수 없다.

```kotlin
class A (private val id: Int) {
    class B (private val password: String) {
        
    }
    
    fun printIdAndPassword (): Unit {
        println("$id $password")//Error
    }
}
```

- `inner` 키워드를 중첩 클래스 앞에 붙이면 해소할 수 있다.
- 추가적으로 `this` 지칭에 감싸는 클래스, 내부 클래스 지칭이 모호하다면 `this@A`와 같이 지목할 수도 있다.

## 지역 클래스
- java와 같이 함수 본문에서 클래스를 정의할 수 있다.
- 지역클래스는 자신을 둘러싼 코드 블록 안에서만 사용할 수 있다.
- 이 지역함수는 주변의 값을 capturing(포획) 할 수 있고 또한 변경할 수도 있다.

