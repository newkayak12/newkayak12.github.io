---
layout: post
categories: [KOTLIN]
---



# java 코드를 kotlin에서 사용하기

## java 메소드와 필드

- 살짝의 뉘앙스 차이가 있을 수 있지만 거의 비슷하다.

## Unit, Void

- java의 void에 kotlin의 Unit이 대응한다.

## 연산자

- java의 몇몇 메소드는 코틀린의 연산자 관습을 만족한다.
- operator가 붙어이지 않지만 kotlin에서는 마치 연산자 함수인 것처럼 연산자를 통해서 사용할 수 있다.

## 합성 프로퍼티

- java는 합성 프로퍼티가 없고 getter/setter가 정의되는 일이 많다.
- 따라서 kotlin으로 합성 프로퍼티를 작성하면 java에서 getter/setter로 바꿔준다.

## 플랫폼 타입

- java, kotlin간 null을 바라보는 관점이 다르다. 그래서 이런 null이 될 수 있는 타입은 kotlin에서 일일히 검사해야 하므로 실용적이지 ㅇ낳다.
- kotlin 컴파일러는 java 코드가 노출하는 타입에 대한 null 안정성을 완화시켜서 명확한 null 가능서잉 지정되지 않은 타입인 것처럼 취급한다.
- platforType이라는 특별한 타입에 속한다. null이 될수도, 아닐 수도 있는 타입이다.

## NULL 가능성 어노테이션

- java에서는 `JSR305`에 맞춰서 not null 보장을 위해서 어노테이션을 쓴다. kotlin은 이를 기반으로 null이 될 수 있거나 아닌 타입으로 정해진다.
- 최소 플랫폼 타입에서 벗어난다.

## java/kotlin type mapping

|      java      |  kotlin   
|:--------------:|:---------:|
|   byte/Byte    |   Byte    |
|  short/Short   |   Short   |
|  int/Integer   |    Int    |
|   long/Long    |   Long    |
| char/Character | Character |
|  float/Float   |   Float   |
| double/Double  |  Double   |

- java Object는 `Any`에 대응한다.
- java의 extneds는 kotlin 공변 프로젝션으로 변환된다.
- java의 super는 kotlin의 반공변 프로젝션으로 변환된다.
- java의 raw type은 kotlin의 `*` 프로젝션으로 변환된다.


## 단이 ㄹ추상 메소드
- 추상 메소드가 하나뿐인 java interface(SAM)가 있으면 이는 kotlin의 함수 타입처럼 작동한다.
