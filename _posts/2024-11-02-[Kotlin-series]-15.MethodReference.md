# 수신 객체가 있는 호출 가능 참조
- kotlin에서는 수신 객체가 있는 호출 가능한 참조를 만들 수 있다.
- 클래스 멤버, 확장 선언 등을 바탕으로 만들 수 있다.


```kotlin
fun aggregate(numbers: IntArray, op: Int.(Int) -> Int): Int {
  var result = numbers.firstOrNull() ?: throw IllegalArgumentException("Empty")
  
  for ( i in 1 .. numbers.lastIndex ) result = result.op(numbers[i])
  return result
}

fun Int.max(other: Int) = if ( this > other )  this else other

fun main() {
    val numbers = intArrayOf(1, 2, 3, 4)
    println(aggregate(numbers, Int::plus))
    println(aggregate(numbers, Int::max))
}
```


## 영역함수
- kotlin 내부에서 문맥 내부에서 임시로 사용할 수 있게 해주는 몇 가지 함수가 있다.
- 기본적으로 인자로 제공한 람다를 간단하게 실행해 주는 것이다.

  1. 문맥 식을 계산한 값을 영역 함수로 전달할 때 수신 객체로 전달하는가? 아니면 일반적인 함수 인자로 전달하는가?
    - 영역함수가 확장 함수인 경우 vs. 영역 함수가 일반 함수인 경우
  2. 영역 함수의 람다 파라미터가 수신 객체 지정 람다인가? 아닌가?
  3. 영역 함수가 반환하는 값이 람다의 결과 값인가 컨텍스트 식을 계산한 값인가?

### run, with
- run: 확장 람다를 받는 확장 함수, 람다의 결과를 돌려준다. 
- with: run과 유사하지만 확장 함수 타입이 아니므로 문맥 식을 with에 던져야 한다.

```kotlin
class Address {
    var zipCode: Int = 0
    var city: String = ""
    var street: String = ""
    var house: String = ""

    constructor()
    constructor(city: String, street: String, house: String) {
        this.city = city
        this.street = street
        this.house = house
    }
}

fun main() {
    Address().run {
        zipCode = 1234
        city = "Daejeon"
        street = "yusung"
        house = "Chunggu"
    }
    
    with(Address("Daejeon", "yusung", "Chunggu")) {
        "Address $city $street $house"
    }
}
```

### 문맥 없는 run
- run()을 오버로딩한 함수도 제공한다. 문맥 식이 없고 람다의 값을 반환하기만 한다.
- 수신 객체도, 파라미터도 없다.
- 그냥 블록을 두는 것 정도로 보면 된다.

```kotlin
class Address(city: String, street: String, house: String)

run {
    city = "Daejeon"
    street = "yusung"
    house = "Chunggu"
    
    Address(city, street, house)
}
```

## let
- run과 유사하지만 확장 함수 타입의 람다를 받지 않고 인자가 하나인 함수 타입의 람다를 받는다. 
- let의 반환 값은 람다가 반환하는 값과 같다.
- 외부 영역에 새로운 변수를 도입하는 일을 피하고 싶을 떄 사용한다.
```kotlin
class Address(city: String, street: String, house: String) {
    fun post (): Unit {
        println("$city $street $house")
    }
}

Address("Daejeon", "yusung", "Chunggu").let {
    //it로 Address에 접근 가능
    it.post()
}

```

- null이 될 수 있는 값을 안정성 검사를 거쳐서 null이 될 수 없는 함수에 전달하는 용법이 있다.

## apply/also
- apply 확장 함수는 확장 람다를 받는 확장 함수이며, 자신의 수신 객체를 반환한다. 
- run과 달리 반환 값 없이 객체 상태를 설정하는 경우 사용한다.
```kotlin
class Address(){
  var city: String = ""
  var street: String = ""
  var house: String = ""
} 
Address().also { 
    it.city = "Daejeon"
    it.street = "Expo"
    it.house = "Chunggu"
}
```


## 클래스 멤버인 확장
- 클래스 멤버로 확장 함수를 선언할 수 있다.
- 최상위 확장과 달리 확장 수신 객체(extension receiver), 디스패치 수신 객체(dispatch receiver)가 있다.
```kotlin
class Address(val city: String, val street: String, val house: String)
class Person(val firstName: String, val familyName: String) {
    fun Address.post(message: String ) {
      val city = city
      val street = this.street
      val house = this@post.house
      val firstName = firstName
      val familyName = this@Person.familyName
    }
}
```

- 복잡하다. 보퉁 최상위 확장이 간단하고 읽기 보기 좋은 코드를 만든다.