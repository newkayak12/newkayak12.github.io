from [Dictionary - Inner class에서의 문제점](https://github.com/newkayak12/Dictionary/blob/master/java/09.InnerClassProblem.md)

# Inner Class Problem

Inner Class를 선언하면 Inner Class를 `static`으로 설정하라고 경고한다.
이는 Inner Class가 Inner static 보다 메모리를 더 많이 쓰고, 느리고, 바깥 클래스가 GC 대상에서 빠져 메모리 관리에 문제가 될 수 있다.

## Inner class는 외부 참조를 한다. 
일반적으로 내부 클래스를 만들기 위해서는 외부 클래스를 초기화 해야한다. 이러한 문제 때문에 inner 클래스는 `외부 참조`를 갖게 된다. 심지어 내부 클래스가 외부 멤버를
사용하지 않아도 숨겨진 외부 참조가 생성된다. 
```java
public class Outer_Class {
    int field = 10;

    class Inner_Class {
        int inner_field = 20;
    }
}

// Outer_class$Inner_class.class
// Outer_class.class

// 바이트 코드를 디컴파일하면
class Outer_Class$Inner_Class {
    int inner_field;
    
    Outer_Class$Inner_Class(Outer_Class this$0) { //생성자로 외부 클래스를 매개 변수로 받아서 초기화
        this.this$0 = this$0;
        this.inner_field = 20;
    }
}

// 즉 바깥 클래스의 인스턴스와 암묵적으로 연결
```

## Inner 클래스의 메모리 누수
Inner 클래스가 바깥 클래스를 외부 참조하므로 외부 클래스는 필요가 없고 내부 클래스만 남아있을 경우, 외부 참조로 내부 클래스와
연결되어 있기 때문에 메모리에 잔존하고 누수로 이어진다.


## 해결법은 static
1. static inner는 외부 참조가 없다.
2. static inner는 메모리 누수가 없다.