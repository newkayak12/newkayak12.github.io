# 봉인된 클래스, 위임

## sealed
- abstract class로 상속 받는 child class의 종류를 제한하는 특성을 가지고 있다.
- java에서는 `permit`으로 이를 한정하지만 kotlin에서는 같은 패키지에 있는 자식 클래스에만 상속이 가능하다.
- 추가적으로 추상클래스로 직접 객체를 인스턴스 생성이 불가하다.

## delegate
- kotlin은 기본적으로 final이다. 이는 상속 가능한 클래스를 정의하는 것에 심사 숙고하기 위해서다. 이는 클래스가 깨지는 것을 미연에 방지하는 안전장치 역할을 한다.
- 만약 기존 클래스를 변경, 확장할 떄, 그렇지만 상속이 불가능하다면 고려해볼 만한 선택지는 `delegate`다.
- `by`를 붙이고 그 뒤에 위임할 인스턴스를 작성하는 것이다.

```kotlin
interface ExampleData {
    val name: String
    val age: Int
}
open class Example(
    override val name: String,
    override val age: Int
) : ExampleData

class Alias(
    private val oldExampleData: ExampleData,
    private val newExampleData: ExampleData
): ExampleData by newExampleData {
    override val age: Int
        get() = newExampleData.age
    //오버라이드도 가능하다.
    override val name: String
        get() = "name is ${this@newExampleData.name}"
}
```
- 위임은 `composition`과 `inheritance`의 이점을 살릴 수 있다.