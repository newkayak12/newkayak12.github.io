---
layout: post
categories: [KOTLIN]
---


# 문법

## 주석
- `/ 주석 /`
- `/* 주석  */`
- `/** 주석  */`


## 변수 정의
- `val`: 불변(final)
- `var`: 가변
- 타입은 직접 적어도 되지만 기본적으로 추론하게 냅두는 편이다.

> 특이사항
> kotlin에서 `$`은 특수한 문법에서 사용하는 예약어다.
> kotlin에서 "`"으로 띄어쓰기가 있는 변수명을 지정할 수 있다.(쓰지는 말자)
> java와 달리 kotlin의 식은 statement라 return 이 없다.

## 식과 연산자
### 1. 기본 연산
- ++, --
- +, -, ++, --, !
- *, /, %
- <, >, <=, >=
- ==, !=, 
- &&, ||
- =, +=, *=, /=, -=, %=

### bit
shl: <<
shr: >>
ushr: >>>
and: &
or: |
xor: ^
inv: ~


## 기본 타입
- Byte: byte, Byte
- Short: short, Short
- Int: int, Integer
- Long: long, Long
- Float: float, Float
- Double: double, Double
- Char: char, Character
- Boolean: boolean, Boolean
- String: String

## 비교, 동등성
- ==, !=
- <, >, <=, >=

> 특이 사항
> kotlin에서는 java가 ==, equals를 구분해서 호출해야하는 것과 달리 syntax sugar에 따라 ==만 호출하면 알아서 비교된다.


## 배열
- kotlin 배열은 `Array<T>` 형식이다.
- 각 항수는 generic하다.
- `val square = Array(10) { (it + 1) * (it + 1) }`와 같이 람다로 초기화할 수 있다.(swift에서 closure)

> 특이사항
> - kotlin에서는 `new` 연산자를 사용하지 않는다.
> - 배열을 Array<Int> 같이 만들면 박싱하므로 IntArray 등과 같은 함수로 만들면 된다.
> - java와 달리 상위 타입의 배열에 하위 타입의 배열 대입이 안된다.
