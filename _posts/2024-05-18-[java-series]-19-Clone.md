---
layout: post
categories: [JAVA]
---

from [Dictionary - Clone](https://github.com/newkayak12/Dictionary/blob/master/java/19.Clone.md)

# Clone

## Object.clone()
 인스턴스 객체 복제를 위한 메소드, 해당 인스턴스를 복제해서 새로운 인스턴스를 생성해서 그 `참조 값`을 반환한다.
 `clone()` 사용을 위해서 Cloneable을 구현해야한다. 
 
## Deep vs. Shallow
Deep은 값 타입이든, 참조 타입이든 복사하여 원본과 구분되는 결과물을 생성해 내는 것을 의미하며, 얕은 복사는 값이든 참조든 복사하여 원본과 같은 결과물을 만들어
내는 것을 의미한다. 

## Deep의 주의사항
만일 필드에 참조형이 있다면 아무리 대상을 깊은 복사했어도 필드는 참조를 복사한다. 따라서 필드의 클래스도 따로 처리를 해야한다. 
