---
layout: post
categories: [JAVA_OTHERS]
---
from [Dictionary - SOLID](https://github.com/newkayak12/Dictionary/blob/master/java/oop/01.SOLID.md)

# SOLID
- SRP(Single Responsibility Principle): 단일 책임 원칙
- OCP(Open Closed Priciple): 개방 폐쇄 원칙
- LSP(Listov Substitution Priciple): 리스코프 치환 원칙
- ISP(Interface Segregation Principle): 인터페이스 분리 원칙
- DIP(Dependency Inversion Principle): 의존 역전 원칙


## 1. SRP
단일 책임 원칙은 클래스(객체)는 단 하나의 책임만 가져야 한다는 원칙이다.
여기서 '책임' 이라는 의미는 하나의 '기능 담당'으로 보면 된다.
즉, 하나의 클래스는 하나의 기능 담당하여 하나의 책임을 수행하는데 집중되도록 클래스를 따로따로 여러개 설계하라는 원칙이다.
만일 하나의 클래스에 기능(책임)이 여러개 있다면 기능 변경(수정) 이 일어났을때 수정해야할 코드가 많아진다.
예를 들어 A를 고쳤더니 B를 수정해야하고 또 C를 수정해야하고, C를 수정했더니 다시 A로 돌아가서 수정해야 하는, 마치 책임이 순환되는 형태가 되어버린다.
따라서 SRP 원칙을 따름으로써 한 책임의 변경으로부터 다른 책임의 변경으로의 연쇄작용을 극복할 수 있게 된다.
최종적으로 단일 책임 원칙의 목적은 프로그램의 유지보수 성을 높이기 위한 설계 기법이다.
이때 책임의 범위는 딱 정해져있는 것이 아니고, 어떤 프로그램을 개발하느냐에 따라 개발자마다 생각 기준이 달라질 수 있다.

```java
class Employee {
    String name;
    String positon;

    Employee(String name, String position) {
        this.name = name;
        this.positon = position;
    }

	// * 초과 근무 시간을 계산하는 메서드 (두 팀에서 공유하여 사용)
    void calculateExtraHour() {
        // ...
    }

    // * 급여를 계산하는 메서드 (회계팀에서 사용)
    void calculatePay() {
        // ...
        this.calculateExtraHour();
        // ...
    }

    // * 근무시간을 계산하는 메서드 (인사팀에서 사용)
    void reportHours() {
        // ...
        this.calculateExtraHour();
        // ...
    }

    // * 변경된 정보를 DB에 저장하는 메서드 (기술팀에서 사용)
    void saveDababase() {
        // ...
    }
}
```


## 2. OCP
OCP 원칙은 클래스는 '확장에 열려있어야 하며, 수정에는 닫혀있어야 한다' 를 뜻한다.
기능 추가 요청이 오면 클래스를 확장을 통해 손쉽게 구현하면서, 확장에 따른 클래스 수정은 최소화 하도록 프로그램을 작성해야 하는 설계 기법이다.

[ 확장에 열려있다 ] - 새로운 변경 사항이 발생했을 때 유연하게 코드를 추가함으로써 큰 힘을 들이지 않고 애플리케이션의 기능을 확장할 수 있음
[ 변경에 닫혀있다 ] - 새로운 변경 사항이 발생했을 때 객체를 직접적으로 수정을 제한함.


어렵게 생각할 필요없이, OCP 원칙은 추상화 사용을 통한 관계 구축을 권장을 의미하는 것이다.
즉, 다형성과 확장을 가능케 하는 객체지향의 장점을 극대화하는 기본적인 설계 원칙

```java
class Animal {
	String type;
    
    Animal(String type) {
    	this.type = type;
    }
}

// 동물 타입을 받아 각 동물에 맞춰 울음소리를 내게 하는 클래스 모듈
class HelloAnimal {
    void hello(Animal animal) {
        if(animal.type.equals("Cat")) {
            System.out.println("냐옹");
        } else if(animal.type.equals("Dog")) {
            System.out.println("멍멍");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        HelloAnimal hello = new HelloAnimal();
        
        Animal cat = new Animal("Cat");
        Animal dog = new Animal("Dog");

        hello.hello(cat); // 냐옹
        hello.hello(dog); // 멍멍
    }
}
```


## 3. LSP
LSP 원칙은 서브 타입은 언제나 기반(부모) 타입으로 교체할 수 있어야 한다는 원칙이다.
쉽게 말하면 LSP는 다형성 원리를 이용하기 위한 원칙 개념으로 보면 된다.
간단히 말하면 리스코프 치환 원칙이란, 다형성의 특징을 이용하기 위해 상위 클래스 타입으로 객체를 선언하여 하위 클래스의 인스턴스를 받으면, 업캐스팅된 상태에서 부모의 메서드를 사용해도 동작이 의도대로 흘러가야 하는 것을 의미하는 것이다.
따라서 기본적으로 LSP 원칙은 부모 메서드의 오버라이딩을 조심스럽게 따져가며 해야한다.
왜냐하면 부모 클래스와 동일한 수준의 선행 조건을 기대하고 사용하는 프로그램 코드에서 예상치 못한 문제를 일으킬 수 있기 때문이다.

```java
void myData() {
	// Collection 인터페이스 타입으로 변수 선언
    Collection data = new LinkedList();
    data = new HashSet(); // 중간에 전혀 다른 자료형 클래스를 할당해도 호환됨
    
    modify(data); // 메소드 실행
}

void modify(Collection data){
    list.add(1); // 인터페이스 구현 구조가 잘 잡혀있기 때문에 add 메소드 동작이 각기 자료형에 맞게 보장됨
    // ...
}
```

## 4. ISP
ISP 원칙은 인터페이스를 각각 사용에 맞게 끔 잘게 분리해야한다는 설계 원칙이다.
SRP 원칙이 클래스의 단일 책임을 강조한다면, ISP는 인터페이스의 단일 책임을 강조하는 것으로 보면 된다.

즉, SRP 원칙의 목표는 클래스 분리를 통하여 이루어진다면, ISP 원칙은 인터페이스 분리를 통해 설계하는 원칙.

ISP 원칙은 인터페이스를 사용하는 클라이언트를 기준으로 분리함으로써, 클라이언트의 목적과 용도에 적합한 인터페이스 만을 제공하는 것이 목표이다.
다만 ISP 원칙의 주의해야 할점은 한번 인터페이스를 분리하여 구성해놓고 나중에 무언가 수정사항이 생겨서 또 인터페이스들을 분리하는 행위를 가하지 말아야 한다.
(인터페이스는 한번 구성하였으면 왠만해선 변하면 안되는 정책 개념)

```java
interface ISmartPhone {
    void call(String number); // 통화 기능
    void message(String number, String text); // 문제 메세지 전송 기능
    void wirelessCharge(); // 무선 충전 기능
    void AR(); // 증강 현실(AR) 기능
    void biometrics(); // 생체 인식 기능
}

class S20 implements ISmartPhone {
    public void call(String number) {
    }

    public void message(String number, String text) {
    }

    public void wirelessCharge() {
    }

    public void AR() {
    }

    public void biometrics() {
    }
}

class S21 implements ISmartPhone {
    public void call(String number) {
    }

    public void message(String number, String text) {
    }

    public void wirelessCharge() {
    }

    public void AR() {
    }

    public void biometrics() {
    }
}
```

## 5. DIP
DIP 원칙은 어떤 Class를 참조해서 사용해야하는 상황이 생긴다면, 그 Class를 직접 참조하는 것이 아니라 그 대상의 상위 요소(추상 클래스 or 인터페이스)로 참조하라는 원칙
쉽게 이야기해서 구현 클래스에 의존하지 말고, 인터페이스에 의존하라는 뜻
의존 관계를 맺을 때 변화하기 쉬운 것 또는 자주 변화하는 것보다는, 변화하기 어려운 것 거의 변화가 없는 것에 의존하라는 것
```java
// 인터페이스
interface Toy {}

class Robot implements Toy {}
class Lego implements Toy {}
class Doll implements Toy {}

// 클라이언트
class Kid {
	Toy toy; // 합성
    
    void setToY(Toy toy) {
    	this.toy = toy;
    }
    
    void play() {}
}

// 메인 메소드
public class Main {
	public static void main(String[] args) {
        Kid boy = Kid();
        
        // 1. 아이가 로봇을 가지고 놀 때
        Toy toy = new Robot();
        boy.setToy(toy);
        boy.play();
        
        // ...
        
        // 2. 아이가 레고를 가지고 놀 때
        Toy toy = new Lego();
        boy.setToy(toy);
        boy.play();
    }
}
```