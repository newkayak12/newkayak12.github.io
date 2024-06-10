---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# 인터페이스는 타입 정의 용도로 사용하자

인터페이스를 구현한다는 것은 '자신의 인스턴스로 무엇을 할 수 있는지'를 클라이언트에게 알리는 역할을 한다. 이런 인터페이스에

```java
public interface Fruits {
    static final String STRAWBERRY = "Strawberry";
    static final String PINE_APPLE = "Pineapple";
}
```

와 같은 상수 인터페이스를 구현하는 것은 내부 구현을 외부에 노출하는 것과 같다. 차라리 위와 같이 사용할 거라면

```java
public class Fruits {
    
    private Fruits(){};
    
    public static final String STRAWBERRY = "Strawberry";
    public static final String PINE_APPLE = "Pineapple";
}
```

와 같은 상수 유틸 클래스나.

```java
public enum Fruits{
    STRAWBERRY("Strawberry"), PINE_APPLE("Pineapple");
    
    private String name;
    public Fruits (String name) {
        this.name = name;
    }
    
    public String getName() { return this.name; }
}
```

와 같은 enum을 쓰는게 낫다.