# Collection

- 컬렉션을 조작하는 모든 연산은 `inline 함수`다.


## 컬렉션 타입
- 타입은 기본적으로 `Array`, `Iterable`, `Sequence`, `Map`이 있다.

![diagram.png](image/diagram.png)

## iterable
- 일반적으로 `Iterable<T>`으로 표현되며, 일반적으로 즉시 계산되는 상태가 있는 컬렉션을 포함한다.
- `hasNext()`, `next()`가 있다. `remove()`가 빠졌다.
- java와 kotlin의 차이점은 불변/ 가변을 나눈다는 것이다.


## collection, list, set

### List
1. ArrayList
2. LinkedList

### set
1. LinkedHashSet
2. TreeSet

## sequence
- sequence 구현은 내부적이므로 외부에서 직접 사용할 수 없다. 대신 특별한 함수를 통해 시퀀스를 만들어야 한다.
- java의 stream과 비슷하다. 

## map
- key-value 쌍으로 이뤄진 집합


## 컬렉션 생성하기
- emptyList()/emptySet()
- listOf()/setOf()
- listOfNotNull()
- mutableListOf()/ mutableSetOf()
- arrayListOf()
- hashSetOf()/ linkedSetOf()/ sortedSetOf()
### 시퀀스 얻기
- `asSequence()`/ `generateSequence()`
```kotlin
mapOf(1 to "one", 2 to "Two").asSequence().iterator().next()
generateSequence(10) { it * it }
```

- kotlin 1.3부터 특별한 빌더로 사용해서 시퀀스를 만들 수 있다.
- builder는 시퀀스 원소르 부분부분 지정한다. `SequenceScope`가 수신 객체 타입인 확장 람다를 받는 `sequence()` 함수를 통해 빌더를 구현 할 수 있다.
  1. yield(): 원소를 하나 시퀀스에 추가
  2. yieldAll(): 지정한 iterable, iterable, sequence에 있는 모든 원소를 시퀀스에 추가한다.


## 컬렉션에 대한 조건 검사
- `all()` 함수는 모든 원소가 주어진 술어를 만족하면 true
- `none()` `all()`의 반대
- `any()`는 일부만 만족하면 된다.

## [집계](https://kotlinlang.org/docs/collection-grouping.html)
- `count()`
- `sum()`
- `sumOf{}`
- `average()` 
- `minOrNull()`
- `maxOrNull()`
- `minByOrNull{}`
- `maxByOrNull{}`
- `minWithOrNull()`
- `maxWithOrNull()`
- `joinToString()`
- `reduce()`
- `reduceIndexed()`
- `fold()`
- `foldIndexed()`

> reduce vs. fold
> - 초기 값을 커스텀할 수 있느냐 차이다.
> - reduce는 초기값이 순회 대상의 첫 번째 요소
> - fold는 java와 같이 지정할 수 있다.


## [필터링](https://kotlinlang.org/docs/collection-filtering.html)
- `filter()`
- `filterKeys()`
- `filterValues()`
- `filterInstance()`
- `filterNot()`
- `filterIndexed()`
- `filterIsInstance()`
- `filterNotNull()`
- 위 함수에서 `~to`가 붙은 버전이 존재한다. 이는 원본을 직접 수정하는 함수다. 위의 함수들은 필터링 후 불변 컬렉션을 만들어낸다. 


## [변환](https://kotlinlang.org/docs/collection-transformations.html)
- `map()`
- `mapIndexed()`
- `mapNotNull()`
- `mapIndexedNotNull()`
- `mapKeys()`
- `mapValues()`
- 위의 함수에서 ~to가 붙은 버전은 원본을 수정하는 함수다. 위의 함수들은 변형 후 불변 컬렉션을 만들어낸다.
- `flatMap()`
- `flatMapTo()`
- `flatten()`:각각의 컬렉션을 이어 붙인 한 컬렉션을 내놓는다. `flatMap()`에 단순 변환을 적용한 것으로 볼 수 있다.
````kotlin
println(listOf(listOf(1,2), setOf(3,4), listOf(5,6)).flatten())///[1,2,3,4,5]
````
- `associateWith()` : 변환 함수를 바탕으로 원본 컬렉션 원소를 맵의 키나 맵의 값으로 만들 수 있는 변환이다.
```kotlin
println( listOf("red", "green", "blue" ).associateWith { it.length })// {red=3, green=5, blue=4}
```
- `associateBy()` : `associateWith()`과 유사하지만 컬렉션 원소르 값으로 취급하고 변환함수를 통해서 키를 얻는다는 점이 다르다.
```kotlin
println( listOf("red", "green", "blue" ).associateBy { it.length })// {3=red, 5=green, 4=blue}
```
- `associate()`: 직접 key, value를 정한다.
```kotlin
println( listOf("red", "green", "blue" ).associate { it.length to it.uppercase() })// {3=RED, 5=GREEN, 4=BLUE}
```


## 하위 컬렉션 추출
- `subList()`
- `slice()`: subList와 유사하고 원 컬렉션을 반영할 수 있는 래퍼 객체를 만들어 낸다.
- `sliceArray()`: 배열 원소를 다른 배열로 추출하고 싶다면 `sliceArray()`를 사용하면 된다.
- `take()`/`takeList()`: 이터러블, 배열에서 우너소를 주어진 개수만큼 추출한다.
- `drop()`/`dropLast()`: take류의 연산을 반전시킨 연산이다.
- `chunked()`: 이터러블이나 시퀀스를 주어진 개수를 넘지 않는 작은 리스트들로 나눠준다.
- `windowed()`: 일정한 간격으로 청크를 연속적으로 얻어낸 **slidingWindow**를 얻을 수 있다. 
  - slidingWindow의 규칙을 정할 수 있다.
  1. step: 서로 인접한 윈도우의 첫 번쨰 원소 사이의 거리
  2. partialWindow: 컬렉션의 마지막 부분에서 지정한 윈도우 크기보다 작은 크기의 윈도우를 포함시킬지 여부
- `zipWithNext()`
```kotlin
val list = List(6){ it }
list.zipWithNext() // [(0,1), (1,2), (2,3), (3,4), (4,5)]
```

## 순서
- `sorted()`
- `sortedBy()`
- `sortedWith()`
- `sortedDescending()`
- `sortedArray()`
- `sortedArrayDescending()`