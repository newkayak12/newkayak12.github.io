# 타입 별명

- 기존 타입의 이름을 대신할 수 있는 새 이름을 도입할 수 있게 해준다.

```kotlin
typealias IntPredicate = (Int) -> Boolean
typealias IntMap = HashMap<Int, Int>


val a = IntMap();
a[1] = 1
a[2] = 2
```
- 가시성을 설정해서 별명이 보이는 영역을 제한할 수도 있다.
- 1.5에서 타입 별명은 최상위에만 선언할 수 있다.
- 제네릭 타입 별명에 제약, 바운드를 설정할 수 없다.