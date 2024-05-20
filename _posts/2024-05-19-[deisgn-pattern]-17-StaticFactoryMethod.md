from [Dictionary - Static Factory Method](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/17.StaticFactoryMethod.md)


# Static Factory Method

정적 팩토리 메서드(Static Factory Method) 패턴은 개발자가 구성한 Static Method를 통해 간접적으로 생성자를 호출하는 객체를 생성하는 디자인 패턴이다. 
우리는 지금까지 객체를 인스턴스화 할때 직접적으로 생성자(Constructor)를 호출하여 생성하였는데, 
별도의 객체 생성의 역할을 하는 클래스 메서드를 통해 간접적으로 객체 생성을 유도하는 것이다. 그리고 이 정적 메서드를 통칭적으로 정적 팩토리 메서드 패턴이라고 부르는 것이다.

```java
class Book {
    private String title;
    
    // 생성자를 private화 하여 외부에서 생성자 호출 차단
    private Book(String title) { this.title = title; }
    
    // 정적 팩토리 메서드
    public static Book titleOf(String title) {
        return new Book(title); // 메서드에서 생성자를 호출하고 리턴함
    }
}
```

# 특징
## 1. 생성 목적에 대한 이름 표현이 가능하다.
지금까지 클래스를 설계할때 다양한 타입의 객체를 생성하기 위해, 생성 목적에 따라 생성자를 오버로딩하여 구분하여 사용해왔다.
하지만 문제는 이러한 객체를 new 키워드를 통해 생성자로 생성하려면, 개발자는 해당 생성자의 인자 순서와 내부 구조를 알고 있어야 목적에 맞게 객체를 생성할수가 있다는 번거로움이 있다.
```java
class Car {
    private String brand;
    private String color;

    // private 생성자
    private Car(String brand, String color) {
        this.brand = brand;
        this.color = color;
    }

    // 정적 팩토리 메서드 (매개변수 하나는 from 네이밍)
    public static Car brandBlackFrom(String brand) {
        return new Car(brand, "black");
    }

    // 정적 팩토리 메서드 (매개변수 여러개는 of 네이밍)
    public static Car brandColorOf(String brand, String color) {
        return new Car(brand, color);
    }
}
```

## 2. 인스턴스에 대해 통제 및 관리가 가능하다. 
메서드를 통해 한단계 거쳐 간접적으로 객체를 생성하기 때문에, 기본적으로 전반적인 객체 생성 및 통제 관리를 할 수 있게 된다.
즉, 필요에 따라 항상 새로운 객체를 생성해서 반환할 수도 있고, 아니면 객체 하나만 만들어두고 이를 공유하여 재사용하게 하여 불필요한 객체를 생성하는 것을 방지 할 수 있는 것이다.

대표적인 예시가 Singleton이다.
```java
class Singleton {
    private static Singleton instance;

    private Singleton() {}

    // 정적 팩토리 메서드
    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

다른 예로는 인스턴스에 대한 캐싱(Caching) 절차 구조를 정적 팩토리 메서드로 구현할 수 있다. 인스턴스에 대해 캐싱을 한다면 필요한 인스턴스만 뽑아 재사용하여 메모리를 절약할 수 있게 된다.
이렇게 인스턴스를 통제하는 것은 인스턴스가 단 하나뿐임을 보장하는 것이고, Flyweight 디자인 패턴의 근간이 되게 된다.

## 3. 하위 자료형 객체를 반환할 수 있다.
클래스의 다형성의 특징을 응용한 정적 팩토리 메서드 특징이다. 메서드 호출을 통해 얻을 객체의 인스턴스를 자유롭게 선택할수 있는 유연성을 갖는 것이다.

```java
interface SmarPhone {}

class Galaxy implements SmarPhone {}
class IPhone implements SmarPhone {}
class Huawei implements SmarPhone {}

class SmartPhones {
    public static SmarPhone getSamsungPhone() {
        return new Galaxy();
    }

    public static SmarPhone getApplePhone() {
        return new IPhone();
    }

    public static SmarPhone getChinesePhone() {
        return new Huawei();
    }
}
```

## 4. 인자에 따라 다른 객체를 반환하도록 분기할 수 있다. 
메서드이니 매개변수를 받을수 있을테고, 메서드 블록 내에서 분기문을 통해 여러 자식 타입의 인스턴스를 반환하도록 응용 구성이 가능하다.
```java
interface SmarPhone {
    public static SmarPhone getPhone(int price) {
        if(price > 100000) {
            return new IPhone();
        }

        if(price > 50000) {
            return new Galaxy();
        }

        return new Huawei();
    }
}
```

## 5. 객체 생성을 캡슐화 할 수 있다.
생성자를 사용하는 경우 외부에 내부 구현을 드러내야 하는데, 정적 팩토리 메서드는 구현부를 외부로 부터 숨길 수 있어 캡슐화(encapsulation) 및 정보 은닉(information hiding)을 할수 있다는 특징이 있다.
또한 노출하지 않는다는 특징은 정보 은닉성을 가지기도 하지만 동시에 사용하고 있는 구현체를 숨겨 의존성을 제거해주는 장점도 지니고 있다.

```java
interface Grade {
    String toText();
}

class A implements Grade {
    @Override
    public String toText() {return "A";}
}

class B implements Grade {
    @Override
    public String toText() {return "B";}
}

class C implements Grade {
    @Override
    public String toText() {return "C";}
}

class D implements Grade {
    @Override
    public String toText() {return "D";}
}

class F implements Grade {
    @Override
    public String toText() {return "F";}
}

class GradeCalculator {
    // 정적 팩토리 메서드
    public static Grade of(int score) {
        if (score >= 90) {
            return new A();
        } else if (score >= 80) {
            return new B();
        } else if (score >= 70) {
            return new C();
        } else if (score >= 60) {
            return new D();
        } else {
            return new F();
        }
    }
}
```

## Static Factory Method 네이밍 규칙
- from : 하나의 매개 변수를 받아서 객체를 생성
- of : 여러개의 매개 변수를 받아서 객체를 생성
- getInstance | instance : 인스턴스를 생성. 이전에 반환했던 것과 같을 수 있음
- newInstance | create : 항상 새로운 인스턴스를 생성
- get[OrderType] : 다른 타입의 인스턴스를 생성. 이전에 반환했던 것과 같을 수 있음
- new[OrderType] : 항상 다른 타입의 새로운 인스턴스를 생성

## 실제 사용 예시
- Optional.of()
- List.of()
- Integer.valueOf()
