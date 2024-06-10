---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# 톱레벨 클래스는 한 파일에 하나만

한 파일에 여러 개의 클래스를 담을 수 있다. ( swift가 한 파일에 여러 struct를 선언하곤 한다. ) 그러나, 이렇게 되면 컴파일 순서에 따라 동작이 달라질 수도 있다. 

Mango.java
```java
class Mango {
    static final String NAME = "mango";
}
class Apple {
    static final String NAME = "apple";
}
```

Apple.java
```java
class Mango {
    static final String NAME = "mango juice";
}
class Apple {
    static final String NAME = "apple juice";
}
```

Main.java
```java
class Main {
    public static void main(String[] args) {
        System.out.println(Apple.NAME + " - " + Mango.NAME);
    }
}
```

이러면 컴파일 순서에 따라서 다르게 출력된다. 