from [Dictionary - Enum Factory Method](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/20.EnumFactoryMethod.md)


# EnumFactoryMethod

FactoryMethod 단점을 보완하기 위한 패턴이다.

Factory Method 패턴의 가장 큰 단점은 제품 객체의 갯수마다 공장 서브 클래스를 모두 구현해야 된다는 점이다.
즉, 제품 객체가 50개면 공장 객체도 50개를 구현해야 된다는 말이다.
또한 기본적으로 팩토리 클래스는 한번 인스턴스화 하고 제품 객체를 생성하는 역할만 하면 되지 여러개 생성될수 있는 낭비적인 가능성이 있기 때문에 싱글톤을 일일히 적용하여야 하며 이로인해 코드가 복잡해진 다는 문제점도 있었다.


이러한 문제점을 Enum으로 팩토리 메서드 패턴을 구성해 준다면, 일일히 서브 공장 클래스 구현 없이 하나의 enum Factory에서 SOLID 원칙 위반 없이 팩토리 클래스를 구성해 줄 수 있다.
그러나 단점은 클래스 상속이 필요할때, enum 외의 클래스 상속은 불가능하기 때문에 다시 일반 클래스로 재구성 해야된다는 한계점이 존재한다.

# 기존 팩토리 메서드 패턴
Factory Method 패턴에서 유의할 부분은 Factory 인스턴스가 여러번 생성될 필요가 없다는 점이다.
공장 객체는 한번만 생성되면 필요할때마다 제품 객체들을 얼마든지 생성할수 있기 때문에 괜히 매번 제품을 생성할때마다 인스턴스화 하면 GC에 의해 STW(Stop The World)가 일어나는 원인이 된다.

# Enum으로 구현한 팩토리 메소드 패턴 
Enum 확장 기능을 이용해 싱글톤을 구성해 줄수 도 있다. 왜냐하면 Enum 타입 자체가 public static final 이기 때문에 따로 싱글톤을 구현하지 않아도 단일한 객체만 생성됨이 보장되기 때문이다.
```java
enum EnumShapeFactory {
    RECTANGLE {
        public Shape createShape() {
            return new Rectangle();
        }
    },
    CIRCLE {
        public Shape createShape() {
            return new Circle();
        }
    };

    public Shape create(String color) {
        Shape shape = createShape();
        shape.setColor(color);
        return shape;
    }

    // 팩토리 메서드
    abstract protected Shape createShape();
}

class Client {
    public static void main(String[] args) {
        Shape rectangle = EnumShapeFactory.RECTANGLE.create("red");
        rectangle.draw();

        Shape circle = EnumShapeFactory.CIRCLE.create("yellow");
        circle.draw();
    }
}
```