from [Dictionary - AbstractFactory](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/11.AbstractFactory.md)


# AbstractFactory

추상 팩토리 패턴은 연관성이 있는 객체 군이 여러개 있을 경우 이들을 묶어 추상화하고, 어떤 구체적인 상황이 주어지면 팩토리 객체에서 집합으로 묶은 객체 군을 구현화 하는 생성 패턴이다.
클라이언트에서 특정 객체을 사용할때 팩토리 클래스만을 참조하여 특정 객체에 대한 구현부를 감추어 역할과 구현을 분리시킬 수 있다.
즉, 추상 팩토리의 핵심은 제품 '군' 집합을 타입 별로 찍어낼수 있다는 점이 포인트 이다.

![](/assets/img/abstractFactory.png)

- AbstractFactory : 최상위 공장 클래스. 여러개의 제품들을 생성하는 여러 메소드들을 추상화 한다.
- ConcreteFactory : 서브 공장 클래스들은 타입에 맞는 제품 객체를 반환하도록 메소드들을 재정의한다.
- AbstractProduct : 각 타입의 제품들을 추상화한 인터페이스
- ConcreteProduct (ProductA ~ ProductB) : 각 타입의 제품 구현체들. 이들은 팩토리 객체로부터 생성된다.
- Client : Client는 추상화된 인터페이스만을 이용하여 제품을 받기 때문에, 구체적인 제품, 공장에 대해서는 모른다.


# Abstract Factory vs. Factory Method
둘다 팩토리 객체를 통해 구체적인 타입을 감추고 객체 생성에 관여하는 패턴 임에는 동일하다. 또한 공장 클래스가 제품 클래스를 각각 나뉘어 느슨한 결합 구조를 구성하는 모습 역시 둘이 유사하다.
그러나 주의할 것은 추상 팩토리 패턴이 팩토리 메서드 패턴의 상위 호환이 아니라는 점이다. 두 패턴의 차이는 명확하기 때문에 상황에 따라 적절한 선택을 해야 한다.
예를 들어 팩토리 메서드 패턴은 객체 생성 이후 해야 할 일의 공통점을 정의하는데 초점을 맞추는 반면, 추상 팩토리 패턴은 생성해야 할 객체 집합 군의 공통점에 초점을 맞춘다.
단, 이 둘을 유사점과 차이점을 조합해서 복합 패턴을 구성하는 것도 가능하다.

<table>
<tr>
<th></th>
<th>FactoryMethod</th>
<th>AbstractFactory</th>
</tr>
<tr>
<td>공통점</td>
<td colspan="2">객체 생성 과정을 추상화한 인터페이스를 제공 <br/> 객체 생성을 캡슐화함으로써 구체적인 타입을 감추고 느슨한 결합 구조를 표방</td>
</tr>
<tr>
<td rowspan="3">차이점</td>
<td>구체적인 객체 생성과정을 하위 또는 구체적인 클래스로 옮기는 것이 목적</td>
<td>관련 있는 여러 객체를 구체적인 클래스에 의존하지 않고 만들 수 있게 해주는 것이 목적</td>
</tr>
<tr>
<td>한 Factory당 한 종류의 객체 생성 지원</td>
<td>한 Factory에서 서로 연관된 여러 종류의 객체 생성을 지원. (제품군 생성 지원)</td>
</tr>
<tr>
<td>메소드 레벨에서 포커스를 맞춤으로써, 클라이언트의 ConcreteProduct 인스턴스의 생성 및 구성에 대한 의존을 감소</td>
<td>클래스(Factory) 레벨에서 포커스를 맞춤으로써, 클라이언트의 ConcreteProduct 인스턴스 군의 생성 및 구성에 대한 의존을 감소</td>
</tr>
</table>

# 흐름
```java
// Product A 제품군
interface AbstractProductA {
}
// Product A - 1
class ConcreteProductA1 implements AbstractProductA {
}
// Product A - 2
class ConcreteProductA2 implements AbstractProductA {
}

// Product B 제품군
interface AbstractProductB {
}
// Product B - 1
class ConcreteProductB1 implements AbstractProductB {
}
// Product B - 2
class ConcreteProductB2 implements AbstractProductB {
}

interface AbstractFactory {
    AbstractProductA createProductA();
    AbstractProductB createProductB();
}

// Product A1와 B1 제품군을 생산하는 공장군 1 
class ConcreteFactory1 implements AbstractFactory {
    public AbstractProductA createProductA() {
        return new ConcreteProductA1();
    }
    public AbstractProductB createProductB() {
        return new ConcreteProductB1();
    }
}
// Product A2와 B2 제품군을 생산하는 공장군 2
class ConcreteFactory2 implements AbstractFactory {
    public AbstractProductA createProductA() {
        return new ConcreteProductA2();
    }
    public AbstractProductB createProductB() {
        return new ConcreteProductB2();
    }
}
```

# 특징
## 사용 시기
- 관련 제품의 다양한 제품 군과 함께 작동해야 할때, 해당 제품의 구체적인 클래스에 의존하고 싶지 않은 경우
- 여러 제품군 중 하나를 선택해서 시스템을 설정해야하고 한 번 구성한 제품을 다른 것으로 대체할 수도 있을 때
- 제품에 대한 클래스 라이브러리를 제공하고, 그들의 구현이 아닌 인터페이스를 노출시키고 싶을 때

## 장점
- 객체를 생성하는 코드를 분리하여 클라이언트 코드와 결합도를 낮출 수 있다.
- 제품 군을 쉽게 대체 할 수 있다.
- 단일 책임 원칙 준수
- 개방 / 폐쇄 원칙 준수

## 단점
- 각 구현체마다 팩토리 객체들을 모두 구현해주어야 하기 때문에 객체가 늘어날때 마다 클래스가 증가하여 코드의 복잡성이 증가한다. (팩토리 패턴의 공통적인 문제점)
- 기존 추상 팩토리의 세부사항이 변경되면 모든 팩토리에 대한 수정이 필요해진다. 이는 추상 팩토리와 모든 서브클래스의 수정을 가져온다.
- 새로운 종류의 제품을 지원하는 것이 어렵다. 새로운 제품이 추가되면 팩토리 구현 로직 자체를 변경해야한다.
