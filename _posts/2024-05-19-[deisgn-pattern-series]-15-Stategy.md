from [Dictionary - Strategy](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/15.Stategy.md)


# Strategy
전략 패턴은 실행(런타임) 중에 알고리즘 전략을 선택하여 객체 동작을 실시간으로 바뀌도록 할 수 있게 하는 행위 디자인 패턴 이다.
여기서 '전략'이란 일종의 알고리즘이 될 수 도 있으며, 기능이나 동작이 될 수도 있는 특정한 목표를 수행하기 위한 행동 계획을 말한다.
즉, 어떤 일을 수행하는 알고리즘이 여러가지 일때, 동작들을 미리 전략으로 정의함으로써 손쉽게 전략을 교체할 수 있는, 알고리즘 변형이 빈번하게 필요한 경우에 적합한 패턴이다.

![](/assets/img/strategy.png)

- 전략 알고리즘 객체들 : 알고리즘, 행위, 동작을 객체로 정의한 구현체
- 전략 인터페이스 : 모든 전략 구현제에 대한 공용 인터페이스
- 컨텍스트(Context) : 알고리즘을 실행해야 할 때마다 해당 알고리즘과 연결된 전략 객체의 메소드를 호출.
- 클라이언트 : 특정 전략 객체를 컨텍스트에 전달 함으로써 전략을 등록하거나 변경하여 전략 알고리즘을 실행한 결과를 누린다.

# 특징
## 정의
- 동일 계열의 알고리즘군을 정의하고
- 각각의 알고리즘을 캡슐화하여
- 이들을 상호 교환이 가능하도록 만든다.
- 알고리즘을 사용하는 클라이언트와 상관없이 독립적으로
- 알고리즘을 다양하게 변경할 수 있게 한다.

## 흐름
```java
// 전략(추상화된 알고리즘)
interface IStrategy {
    void doSomething();
}

// 전략 알고리즘 A
class ConcreteStrateyA implements IStrategy {
    public void doSomething() {}
}

// 전략 알고리즘 B
class ConcreteStrateyB implements IStrategy {
    public void doSomething() {}
}


// 컨텍스트(전략 등록/실행)
class Context {
    IStrategy Strategy; // 전략 인터페이스를 합성(composition)

    // 전략 교체 메소드
    void setStrategy(IStrategy Strategy) {
        this.Strategy = Strategy;
    }

    // 전략 실행 메소드
    void doSomething() {
        this.Strategy.doSomething();
    }
}
```

## 사용 시기
- 전략 알고리즘의 여러 버전 또는 변형이 필요할 때 클래스화를 통해 관리
- 알고리즘 코드가 노출되어서는 안 되는 데이터에 액세스 하거나 데이터를 활용할 때 (캡슐화)
- 알고리즘의 동작이 런타임에 실시간으로 교체 되어야 할 때

## 주의점
- 알고리즘이 많아질수록 관리해야할 객체의 수가 늘어난다는 단점이 있다.
- 만일 어플리케이션 특성이 알고리즘이 많지 않고 자주 변경되지 않는다면, 새로운 클래스와 인터페이스를 만들어 프로그램을 복잡하게 만들 이유가 없다.
- 개발자는 적절한 전략을 선택하기 위해 전략 간의 차이점을 명확이 알고 있어야 한다.

# 실사용 예제
- Collections의 sort() 메서드에 의해 구현되는 compare() 메서드에 이용
- javax.servlet.http.HttpServlet에서 service() 메서드와 모든 doXXX() 메서드에 이용
- javax.servlet.Filter의 doFilter() 메서드에 이용
