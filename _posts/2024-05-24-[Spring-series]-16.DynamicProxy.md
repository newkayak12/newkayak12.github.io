---
layout: post
categories: [SPRING]
---



from [Dictionary - DynamicProxy](https://github.com/newkayak12/Dictionary/blob/master/spring/16.DynamicProxy.md)




# DynamicProxy

## 분류
1. [인터페이스가 존재하는 경우](https://newkayak12.github.io/2024/05/24/17.JDKDynamicProxy.html)
2. [인터페이스가 존재하지 않는 경우](https://newkayak12.github.io/2024/05/24/15.CGLIB.html)

## [프록시 패턴](https://newkayak12.github.io/2024/05/19/deisgn-pattern-series-10-Proxy.html)
초기화 지연, 접근 제어, 로깅 및 캐싱 등 기존 대상의 수정 없이 추가 기능을 구현하고 싶을 때 사용하는 패턴이다. 
추가적으로 개방 폐쇄 원칙[(Open Close Principle)](https://newkayak12.github.io/2024/05/20/04.OOP.html)에서 부합한다.
기본적으로 프록시는 개발자가 직접 하나씩 만들어줘야한다. 

이렇게 컴파일 타임에 만드는게 아닌 런타임에 만드는 방법이 JVM에서 공식적으로 지원하는 동적 프록시(DynmicProxy)이다.
굳이 따지만 `ReflectionAPI`의 연장선이다.