# ReadObject 메소드는 방어적으로

readObject는 실질적으로 public 생성자이다. deserialize 하면 객체가 생성되기 때문이다. 그래서 보통의 생성자처럼 readObject 메소드에도 인수가 유효한지
검사하고 필요하다면 매개변수를 방어적으로 복사해야 한다. readObject를 이 작업을 제대로 수행하지 못하면 클래스 불변식이 깨는 공격을 쉬이 당할 수 있기 때문이다.
즉, 불변식이 깨뜨릴 의도로 임의 생성한 바이트 스트림을 건네면 문제가 생긴다.

결론적으로 객체를 역직렬화할 때는 클라이언트가 소유해서는 안되는 객체 참조를 갖는 필드를 모두 반드시 방어적으로 복사해야 한다.

# 인스턴스 수를 통제해야 한다면 readResolve보다는 열거 타입을 사용하자.

readResolve를 사용하면  readObject가 만들어진 인스턴스를 다른 것으로 대체할 수 있다. 역직렬화한 객체의 클래스가 readResolve 메소드를 적절히 정의해뒀다면
역직렬화 후 새로 생성된 객체를 인수로 이 메소드가 호출되고, 이 메소드가 반환한 객체 참조가 새로 생성된 객체를 대신해 반환된다.

이 메소드는 역직렬화한 객체는 무시하고 클래스 초기화 때 만들어진 인스턴스를 반환한다. 추가로 인스턴스 통제 목적으로 사용하면 `@Transient`로 해당 인스턴스를 제외해야
객체 참조 공격을 방어할 수 있다. 만약 그렇지 않으면 메소드가 `readResolve` 메소드가 실행되기 전에 역직렬화된다. 그러면 참조 필드가 역직렬화되는 시점에
그 역직렬화된 인스턴스의 참조를 훔쳐올 수 있다. 인스턴스 통제에 `readResolve`가 효과가 없는건 아니다. 컴파일 타임에 어떤 인스턴스들이 알 수 없다면 (리플렉션같은)
직렬화 가능 인스턴스 통제 클래스를 작성해서 이를 수행할 수 있다. 


# 직렬화된 인스턴스 대신 직렬화 프록시 사용을 검토하자

serializable을 구현하면 비정상적인 방법으로 인스턴스를 생성할 수 있게 돈다. 버그와 보안 문제가 일어날 가능성이 커진다는 뜻이다. 이 위험을 크게 줄일 기법이 있다.
직렬화 프록시 패턴(serialization proxy pattern)이다.

바깥 클래스와 논리적 상태를 정밀하게 표현하는 중첩 클래스를 설계해서 `private static`이 중첩 클래스가 바로 바깥 클래스의 직렬화 프록시다. 중첩 클래스의
생성자는 단 하나여야 하며, 바깥 클래스를 배개변수로 받아야 한다. 이 생성자는 단순히 인수로 넘어온 인스턴스의 데이터를 복사한다. 일관성 검사나 방어적 복사가
필요 없다. 설계상, 직렬화 프록시의 기본 직렬화 형태는 바깥 클래스의 직렬화 형태로 쓰기에 이상적이다. 그리고 바깥 클래스와 직렬화 프록시 모두 `Serializable`을 구현한다고 선언해야 한다.

```java
import java.io.Serializable;
import java.time.Period;

private static class SerializationProxy implements Serializable {
    private final Date start;
    private final Date end;

    SerializationProxy( Period p ) {
        this.start = p.start;
        this.end = p.end;
    }

    private static final long serialVersionUID = 1;
    
    private Object writeReplace() {
        return new Serializationproxy(this);
    }
}
```

writeReplace 덕에 직렬화 시스템은 바깥 클래스의 직렬화된 인스턴스를 생성해낼 수 없다. 