---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# 의존 관계 주입을 사용하자. 

사용하는 자원에 따라 달라지는 클래스의 경우에는 정적 유틸(이니셜라이즈 불가하며 static 메소드로 구성된) 클래스나 싱글턴은 그리 적합하지 않다.
대신 인스턴스를 생성할 때 생성자로 필요한 자원을 넘겨줘서 유연하게 대처하는 방식을 채택할 수 있다. 

이에 대한 쓸만한 변형으로 생성자에 `factory`를 넘기는 방법이 있다. java 1.8 부터는 `Supplier`를 던져서 해결할 수도 있다. 