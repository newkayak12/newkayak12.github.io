# 확장

## 확장 함수

- 언떤 클래스의 멤버인 것처럼 호출할 수 있지만 실제로는 아닌 함수를 의미한다.
- 해당 함수 안 에서는 this로 접근할 수 있다.
- 이런 사용법은 굳이 문제라면 캡슐화를 파괴할 수 있어 보이진 실제로는 비공개 멤버에 접근할 수 없으므로 ***캡슐화를 깰 수 없다***.
- 만약 클래스 내부에서 확장함수를 정의한다면 멤버인 동시에 확장함수가 되며, 캡슐화를 깰 수 있다.


> 정리하면
> 1. 바깥에서 정의 -> 캡슐화 못 깬다.
> 2. 내부에서 정의 -> 멤버이자 확장함수, 캡슐화 부술 수 있다. (이건 그냥 함수랑 비슷하잖아?)


- 정의된 함수와 시그니쳐가 겹친다면 멤버 함수를 우선으로 선택한다. 그리고 해당 확장함수는 사용되지 않으므로 shadowing 이라는 경고를 발생시킨다.
- 지역 확장 함수를 정의할 수도 있다. (확장 함수 안에 확장함수)
  - 이 경우 안에서 밖을 참조하려면 `this@~`와 같이 명시해야 한다.

- 마지막으로 확장함수는 java의 클래스 내 static 메소드로 컴파일 된다.

```kotlin
fun String.truncate(maxLength: Int): String? {
    if( this == null ) return null
    return if (length <= maxLength ) this else substring(0, maxLength)
}
```


## 확장 프로퍼티

- 확장함수와 비슷하게 프로퍼티도 정의할 수 있다.
- 멤버와 확장 프로퍼티의 가장 큰 차이는 확장 프로퍼티에는 뒷받침하는 필드를 쓸 수 없다는 점이다. 
- 확장 프로퍼티를 초기화 할 수도 없고, 접근자 안에서 field를 쓸 수도 없다는 의미다.
- `lateinit`으로 확장 프로퍼티를 정의할 수도 없다.
- 항상 명시적 게터, 세터를 작성해야 한다. (불변/ 가변에 따라)

```kotlin
val IntArray.midIndex
    get() = lastIndex / 2 

var intArray.midValue
    get() = this[midIndex]
    set(value) {
         this[midIndex] = value
    }
```

- delegate 패턴을 사용할 수 있다. 
- 다만 위임 식이 property 수신 객체에 접근할 수 없다.
- 그래서 크게 쓸모가 없다.
```kotlin
val String.message by lazy { "String" }

fun main(){
    println("Hello".message) //String
    println("Bye".message) //String
}
```
- object는 살짝 논외다. 어차피 싱글톤이기 때문에
```kotlin
object Messages
val Messages.HELLO by lazy { "Hello" }

fun main() {
    println(Messages.HELLO)
}
```

## 동반 확장

- 동반 객체는 내포된 객체 중에서 바깥 클래스의 이름을 통해서 객체 멤버에 접근할 수 있는 특별한 객체다.
- 확장에서도 이를 응용할 수 있다.

- `Companion`을 붙여서 확장하면 된다.
- 단, 동반 객체가 원래부터 있어야 동반 객체에 대한 확장을 정의할 수 있다.

## 람다, 수신 객체 지정 함수 타입
- kotlin에서 람다, 익명 함수에 대해서도 확장 수신 객체를 활용할 수 있다.
- 수신 객체 지정 함수 타입(functional type with receiver)라고 부른다.

```kotlin
fun aggregate(numbers: IntArray, op: Int.(Int) -> Int): Int {
  var result = numbers.firstOrNull() ?: throw IllegalArgumentException("Empty")
  
  for ( i in 1 .. numbers.lastIndex ) result = result.op(numbers[i])
  return result
}
```

- `op: Int.(Int) -> Int`와 같이 수신 객체의 타입을 지정할 수 있다.