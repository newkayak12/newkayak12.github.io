---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# int 상수 대신 열거 타입을 사용하기

정수 열거 패턴(int enum pattern)은 type-safe하지도 않고 표현력도 별로고 궁극적으로 프로그램이 깨지기 쉽다. 문자열 열거 패턴(String enum pattern)은 좋을까?
더 나쁘다. 문자열 상수의 이름 대신 문자열 값을 하드코딩하게 만들기 때문이다. 

차라리 열거를 쓰는게 낫다. 열거는 밖에서 접근할 수 있는 생성자를 제공하지 않으니 사실상 `final`이다. 열거로 만들어진 인스턴스는 딱 하나씩만 존재함이 보장된다.
싱글톤이다. 또한 열거 타입은 각자 네임스페이스가 있어서 열거 원소 간 이름이 겹쳐도 상관 없다. 또한 필드를 선언하고 생성자를 추가하여 열거에 특정 속성들을
매핑할 수도 있다.

```java
public enum Planet {
    MERCURY(1),
    VENUS(2),
    EARTH(3),
    MARS(4),
    JUPITER(5),
    SATURN(6),
    URANUS(7),
    NEPTUNE(8);
    
    private final int order;

    Planet(int order) {
        this.order = order;
    }
}

enum Operator {
    ADD {public double apply(double x, double y) {return x + y;}},
    SUBTRACT {public double apply(double x, double y) {return x - y;}},
    MULTIPLE {public double apply(double x, double y) {return x * y;}},
    DIVIDE {public double apply(double x, double y) {return x / y;}};
    
    public abstract double apply(double x , double y);
}
```

열거를 언제 사용하면 좋을까? 필요한 원소를 컴파일 타임에 다 알 수 있는 상수 집합이라면 열거가 좋다. 열거로 정의된 상수가 영원히 고정될 필요는 없다. 
