---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# 확장 할수 있는 열거 타입이 필요하면 인터페이스를 사용해라

열거는 타입 안전 열거 패턴(type safe enum pattern)보다 우수하다. 타입 안전 열거 패턴은 클래스를 이용하고, 생성자를 private로 만들어 최초 정의된 객체만 참조할 수 있게 했다.
하는 것을 의미한다. 열거가 타입 안전 열거보다 뒤지는건 확장성 하나다. 

보통 열거를 확장할 일은 거의 없다. 사용해야 한다면 열거 타입에 임의의 인터페이스를 구현하는 아이디어다. 

```java
public enum BasicOperation implements Operation {
    
}
```

과 같이 말이다. implements 한 타입을 연산의 타입으로 가져가면 된다. 이렇게 인터페이스로 확장 가능한 열거를 흉내내는데도 한계가 있다. 열거끼리 상속이 
불가하다는 것이다. 아무 상태에도 의존하지 않는다면 디폴트 구현을 이용해서 인터페이스에 추가할 수 있다. 

