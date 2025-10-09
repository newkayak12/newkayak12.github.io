---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---










# private 생성자나 열거 타입으로 싱글톤임을 보증하기

싱글톤은 인스턴스를 오직 하나만 만들 수 있는 클래스를 말한다. 싱글톤이 무조건 좋은건 아니다. 예를 들어 mocking을 하기 어려워 진다는 단점이 생긴다.
그러나 싱글턴을 무력화 할 수도 있다. `ReflectionAPI`를 사용하면 가능하다. `AcessibleObject.setAccessible`을 사용하면 된다.

물론 생성자를 수정하여 두 번째 인스턴스가 생성되면 예외를 던져서 막을 수는 있다. 혹은 필드에 본인을 new로 생성하고 정적 팩토리 메소드로 그 인스턴스를 던지면 된다.
(여기에서도 동시성 문제가 있을 수 있지만 일단 넘어가자)

싱글톤에서 `Serialize`를 하려면 `Serializable`을 구현하는 것 뿐만 아니라 인스턴스 필드를 `@Transient`로 두고 `readResolve`, `WriteReplace`를 
구현해야 한다. 

이런 작업들이 복잡하다면 `Enum`으로 싱글톤을 만들 수도 있다. 

```java
public enum Singleton {
    INSTANCE;
    
    public void bark() {
        System.out.println("BARK");
    }
}
```

물론! Enum 외의 클래스를 상속해야한다면 이 방법도 문제가 있다. 
