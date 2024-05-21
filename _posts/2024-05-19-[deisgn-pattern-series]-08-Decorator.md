from [Dictionary - Decorator](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/08.Decorator.md)


# Decorator
데코레이터 패턴(Decorator Pattern)은 대상 객체에 대한 기능 확장이나 변경이 필요할때 객체의 결합을 통해 서브클래싱 대신 쓸수 있는 유연한 대안 구조 패턴이다.
Decorator을 해석하자면 '장식자' 라는 의미를 가지고 있는데,  마치 기본 제품에 포장지나 외부 디자인을 살짝 변경해 줌으로써 새로운 기능을 부여하는 것과 같이,
객체 지향 프로그래밍에서 원본 객체에 대해서 무언가를 장식하여 더 멋진 기능을 가지게 만드는 것이기 때문에 이 명칭이 붙었다고 보면 된다.
데코레이터 패턴을 이용하면 필요한 추가 기능의 조합을 런타임에서 동적으로 생성할 수 있다. 데코레이터할 대상 객체를 새로운 행동들을 포함한 특수 장식자 객체에 넣어서 
행동들을 해당 장식자 객체마다 연결시켜, 서브클래스로 구성할때 보다 훨씬 유연하게 기능을 확장 할 수 있다. 그리고 기능을 구현하는 클래스들을 분리함으로써 수정이 용이해진다

![](img/decorator.png)

- Component (Interface) : 원본 객체와 장식된 객체 모두를 묶는 역할
- ConcreteComponent : 원본 객체 (데코레이팅 할 객체)
- Decorator : 추상화된 장식자 클래스
  - 원본 객체를 합성(composition)한 wrappee 필드와 인터페이스의 구현 메소드를 가지고 있다
- ConcreteDecorator : 구체적인 장식자 클래스
  - 부모 클래스가 감싸고 있는 하나의 Component를 호출하면서 호출 전/후로 부가적인 로직을 추가할 수 있다.

# 흐름
```java
// 원본 객체와 장식된 객체 모두를 묶는 인터페이스
interface IComponent {
    void operation();
}

// 장식될 원본 객체
class ConcreteComponent implements IComponent {
    public void operation() {
    }
}

// 장식자 추상 클래스
abstract class Decorator implements IComponent {
    IComponent wrappee; // 원본 객체를 composition

    Decorator(IComponent component) {
        this.wrappee = component;
    }

    public void operation() {
        wrappee.operation(); // 위임
    }
}

// 장식자 클래스
class ComponentDecorator1 extends Decorator {

    ComponentDecorator1(IComponent component) {
        super(component);
    }

    public void operation() {
        super.operation(); // 원본 객체를 상위 클래스의 위임을 통해 실행하고
        extraOperation(); // 장식 클래스만의 메소드를 실행한다.
    }

    void extraOperation() {
    }
}

class ComponentDecorator2 extends Decorator {

    ComponentDecorator2(IComponent component) {
        super(component);
    }

    public void operation() {
        super.operation(); // 원본 객체를 상위 클래스의 위임을 통해 실행하고
        extraOperation(); // 장식 클래스만의 메소드를 실행한다.
    }

    void extraOperation() {
    }
}
```

# 패턴
## 사용 시기
- 객체 책임과 행동이 동적으로 상황에 따라 다양한 기능이 빈번하게 추가/삭제되는 경우
- 객체의 결합을 통해 기능이 생성될 수 있는 경우
- 객체를 사용하는 코드를 손상시키지 않고 런타임에 객체에 추가 동작을 할당할 수 있어야 하는 경우
- 상속을 통해 서브클래싱으로 객체의 동작을 확장하는 것이 어색하거나 불가능 할 때

## 장점
- 데코레이터를 사용하면 서브클래스를 만들때보다 훨씬 더 유연하게 기능을 확장할 수 있다.
- 객체를 여러 데코레이터로 래핑하여 여러 동작을 결합할 수 있다.
- 컴파일 타임이 아닌 런타임에 동적으로 기능을 변경할 수 있다.
- 각 장식자 클래스마다 고유의 책임을 가져 단일 책임 원칙(SRP)을 준수
- 클라이언트 코드 수정없이 기능 확장이 필요하면 장식자 클래스를 추가하면 되니 개방 폐쇄 원칙(OCP)을 준수
- 구현체가 아닌 인터페이스를 바라봄으로써 의존 역전 원칙(DIP) 준수

## 단점
- 만일 장식자 일부를 제거하고 싶다면, Wrapper 스택에서 특정 wrapper를 제거하는 것은 어렵다.
- 데코레이터를 조합하는 초기 생성코드가 보기 안좋을 수 있다. new A(new B(new C(new D())))
- 어느 장식자를 먼저 데코레이팅 하느냐에 따라 데코레이터 스택 순서가 결정지게 되는데, 만일 순서에 의존하지 않는 방식으로 데코레이터를 구현하기는 어렵다.

