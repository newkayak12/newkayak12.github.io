---
layout: post
categories: [JAVA]
---

from [Dictionary - JNI](https://github.com/newkayak12/Dictionary/blob/master/java/04.JNI.md)
# JNI(Java Native Interface)

자바 네이티브 인터페이스는 JVM위에서 실행되고 있는 자바 코드가 네이티브 응용 프로그램(하드웨어, 운영체제 플랫폼에 종속된 프로그램들), C, C++, 어셈블리 같은 다른 언어들로
작성된 라이브러리들을 호출하거나 반대로 호출되는 것을 가능하게 하는 프로그래밍 프레임워크

## 1. 네이티브 메소드
Java는 메소드 구현이 네이티브 코드에서 제공될 것임을 나타내는 데 사용되는 네이티브 키워드를 제공한다. 일반적으로 네이티브 실행 프로그램을 만들 때 정적 또는 공유 라이브러리를 사용할 수 있다.


## 2. 예약어
- native: 다른 언어에서 사요할 수 있게 해주는 키워드
- volatile: Thread safe를 하게 해주는 키워드
- strictfp: 자바와 타 플랫폼 간 부동소수점 정밀도를 맞추기 위한 키워드
- assert: 인자로 주어진 값이 참인지 거짓인지 판별하는 메소드