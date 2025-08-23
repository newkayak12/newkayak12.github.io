---
layout: post
categories: [JAVA, ANTI-PATTERN]
---

# Sabotage Performance

- 일반적인 성능을 저하시킬 수 있는 안티 패턴

## 1. 루프의 문자열 연결
```kotlin
val n: IntRange = 1..10

var result: String = ""
for ( i in n ) {
    result += i
}

val builder:StringBuilder = StringBuilder()
for ( i in n ) {
    builder.append(i)
}
```

- 루프를 반복할 때마다 새로운 문자열 객체가 생성되어 불필요한 메모리 할당이 벌어진다. 
- StringBuilder를 사용하는 것이 나을 수 있다.

## 2. 과도한 객체 인스턴스화 
- 애플리케이션이 객체를 너무 많이 생성하면 메모리 사용량이 증가하고 CG가 자주 발생해서 애플리케이션 성능이 저하될 수 있다.
- 최대한 객체를 재사용하거나 Pooling을 사용하는 방법도 있다.

## 3. 비효율적 데이터 구조
- 예를 들어 무작위 액세스가 필요한 경우 LinkedList를 사용한다던가 하면 성능이 저하될 수 있다.

## 4. 비효율적 알고리즘
- 상황에 맞는 알고리즘을 사용하지 않으면 성능 병목이 생길 수 있다.
- 예를 들어 O(n)인 알고리즘인 경우 길이가 길면 성능 저하가 발생한다.

## 5. 적절한 예외 처리 부족
- 부적절한 예외 처리는 성능에 영향을 미친다. 
- 필요 이상으로 높은 수준에서 예외를 잡거나 예외를 과도하게 로깅해도 성능이 저하된다.