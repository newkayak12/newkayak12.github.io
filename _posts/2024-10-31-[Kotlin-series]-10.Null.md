---
layout: post
categories: [KOTLIN]
---



# Null

## Nullable
- java와 다른 점은 kotlin은 null될 가능성을 명시적으로 표현한다는 것이다.
- 예를 들어 `String`에 null을 할당할 수 없다. 대신 `String?`은 Null을 할당할 수 없다.
- `String?`같은 타입을 nullableType이라고 한다.

## Nullable, SmartCast
- swift의 guard 같이 `if( a == null) `로 표현해서 null을 방지할 수 있다.

## NotNullAssert
- `!!`은 nullable을 강제로 Eject해서 Nonull타입으로 캐스트한다.
- 만약 Null이라면 `NPE`가 난다.

## Optional
- `?.`형태로 사용하고 Null이 아니라면 행위를 하고 아니면 Null을 반환하는 식으로 진행한다.

## Elvis(NullishCoalescing)
- ElvisPersley를 닮아서 Elvis 연산자다.
- Null이 아니라면 원본 값을 내놓고 아니라면 뒤에 있는 기본 값을 뱉는다.