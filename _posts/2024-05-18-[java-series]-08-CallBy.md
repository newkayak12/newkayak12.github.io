---
layout: post
categories: [JAVA]
---

from [Dictionary - CallBy](https://github.com/newkayak12/Dictionary/blob/master/java/08.CallBy.md)

# Call By Value vs. Call By Reference
프로그래밍을 하다보면 반드시 마주치는 것이 바로 call by value / call by reference 개념이다.
함수의 매개변수에서 값을 복사하느냐 주소값을 참조하느냐에 따라 반환 결과가 달라지기 때문에 대부분의 프로그래밍 교육과정에선 중요시 하게 여긴다.

자바에서도 역시 call by value 와 call by reference 동작 차이가 존재한다.
자바의 데이터형을 알아보면 크게 두가지로 나뉘게 된다.

- 기본형(primitive type) - Boolean Type(boolean), Numeric Type(short, int, long, float, double, char)
- 참조형(reference type) - Class Type, Interface Type, Array Type, Enum Type, 기본형을 제외한 모든 것들

