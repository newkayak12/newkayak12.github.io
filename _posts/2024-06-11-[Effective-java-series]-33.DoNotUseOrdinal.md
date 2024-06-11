# ordinal 대신 인스턴스 필드를 사용하자

일전에 enum에 인스턴스 필드를 선언할 수 있다는 걸 알았다. 

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
```

같이 말이다. 자바에서는 열거에 `ordinal`을 제공한다. 열거 순서에 대한 값이다. 열거를 정수로 변환할 필요가 있을 떄 `ordinal`을 쓰고 싶어지지만 참자.
상수 선언을 바꾸면 오동작할 가능성이 높으며, 이미 사용 중인 정수와 같이 같은 상수는 추가할 방법이 없다. 차라리 인스턴스에 정수를 저장하는게 좋다.

사실 ordinal은 Enum의 API 문서를 보면 `EnumSet`, `EnumMap` 같이 열거 타입 기반의 범용 자료 구조에 쓸 목적으로 설계됐다고 한다. 따라서 이런 용도가 아니면
절대로 사용하지 말자. 