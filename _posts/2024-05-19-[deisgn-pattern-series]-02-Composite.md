---
layout: post
categories: [DESIGN_PATTERN]
---
from [Dictionary - Composite](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/02.Composite.md)

# Composite
합체 패턴(Composite Pattern)은 복합 객체(Composite) 와 단일 객체(Leaf)를 동일한 컴포넌트로 취급하여, 
클라이언트에게 이 둘을 구분하지 않고 동일한 인터페이스를 사용하도록 하는 구조 패턴이다.

복합체 패턴은 전체-부분의 관계를 갖는 객체들 사이의 관계를 트리 계층 구조로 정의해야 할때 유용하다.
윈도우나 리눅스의 파일 시스템 구조를 떠올려보면 쉽게 이해할 수 있다.

폴더(디렉토리) 안에는 파일이 들어 있을수도 있고 파일을 담은 또 다른 폴더도 들어있을 수 있다.
이를 복합적으로 담을수 있다 해서 Composite 객체라고 불리운다. 반면 파일은 단일 객체 이기 때문에 이를 Leaf 객체라고 불리운다. 즉 Leaf는 자식이 없다.

![](/assets/img/composite.png)

복합체 패턴은 바로 이 폴더와 파일을 동일한 타입으로 취급하여 구현을 단순화 시키는 것이 목적이다.
폴더 안에는 파일 뿐만 아니라 서브 폴더가 올수 있고 또 서브 폴더안에 서브 폴더가 오고.. 
이런식으로 계층 구조를 구현하다 보면, 자칫 복잡해 질 수 도 있는 복합 객체를 재귀 동작을 통해 하위 객체들에게 작업을 위임한다. 
그러면 복합 객체와 단일 객체를 대상으로 똑같은 작업을 적용할 수 있어 단일 / 복합 객체를 구분할 필요가 거의 없어진다.


# 패턴

![](/assets/img/compositePattern.png)

- Component : Leaf와 Compsite 를 묶는 공통적인 상위 인터페이스
- Composite : 복합 객체로서, Leaf 역할이나 Composite 역할을 넣어 관리하는 역할을 한다.
  - Component 구현체들을 내부 리스트로 관리한다
  - add 와 remove 메소드는 내부 리스트에 단일 / 복합 객체를 저장
  - Component 인터페이스의 구현 메서드인 operation은 복합 객체에서 호출되면 재귀 하여, 추가 단일 객체를 저장한 하위 복합 객체를 순회하게 된다.
- Leaf: 단일 객체로서, 단순하게 내용물을 표시하는 역할을 한다.
- Component 인터페이스의 구현 메서드인 operation은 단일 객체에서 호출되면 적절한 값만 반환한다
- Client : 클라이언트는 Component를 참조하여 단일 / 복합 객체를 하나의 객체로서 다룬다.

# 패턴 흐름
````java
// Component 인터페이스
interface ItemComponent {
    int getPrice();
    String getName();
}
// Composite 객체
class Bag implements ItemComponent {
    // 아이템들과 서브 가방 모두를 저장하기 위해 인터페이스 타입 리스트로 관리
    List<ItemComponent> components = new ArrayList<>();

    String name; // 가방 이름

    public Bag(String name) {
        this.name = name;
    }

    // 리스트에 아이템 & 가방 추가
    public void add(ItemComponent item) {
        components.add(item);
    }

    // 현재 가방의 내용물을 반환
    public List<ItemComponent> getComponents() {
        return components;
    }

    @Override
    public int getPrice() {
        int sum = 0;

        for (ItemComponent component : components) {
            // 만일 리스트에서 가져온 요소가 Item이면 정수값을 받을 것이고, Bag이면 '재귀 함수' 동작이 되게 된다 ☆
            sum += component.getPrice(); // 자기 자신 호출(재귀)
        }

        return sum; // 그렇게 재귀적으로 돌아 하위 아이템들의 값을 더하고 반환하게 된다.
    }

    @Override
    public String getName() {
        return name;
    }
}
// Leaf 객체
class Item implements ItemComponent {
    String name; // 아이템 이름
    int price; // 아이템 가격

    public Item(String name, int price) {
        this.name = name;
        this.price = price;
    }

    @Override
    public int getPrice() {
        return price;
    }

    @Override
    public String getName() {
        return name;
    }
}



class Client {
    public static void main(String[] args) {

        // 1. 메인 가방 인스턴스 생성
        Bag bag_main = new Bag("메인 가방");

        // 2. 아이템 인스턴스 생성
        Item armor = new Item("갑옷", 250);
        Item sword = new Item("장검", 500);

        // 3. 메인 가방에는 모험에 필요한 무구 아이템만을 추가
        bag_main.add(armor);
        bag_main.add(sword);

        // 4. 서브 가방 인스턴스 생성
        Bag bag_food = new Bag("음식 가방");

        // 5. 아이템 인스턴스 생성
        Item apple = new Item("사과", 400);
        Item banana = new Item("바나나", 130);

        // 6. 서브 가방에는 음식 아이템만을 추가
        bag_food.add(apple);
        bag_food.add(banana);

        // 7. 서브 가방을 메인 가방에 넣음
        bag_main.add(bag_food);

        // ----------------------------------------------------- //

        Client client = new Client();

        // 가방 안에 있는 모든 아이템의 총 값어치를 출력 (가방안에 아이템 뿐만 아니라 서브 가방도 들어있음)
        client.printPrice(bag_main);

        // 서브 가방 안에 있는 모든 아이템의 총 값어치를 출력
        client.printPrice(bag_food);
    }

    public void printPrice(ItemComponent bag) {
        int result = bag.getPrice();
        System.out.println(bag.getName() + "의 아이템 총합 : " + result + " 골드");
    }
}

````

# 패턴 특징
## 사용 시기
- 데이터를 다룰때 계층적 트리 표현을 다루어야 할때
- 복잡하고 난해한 단일 / 복합 객체 관계를 간편히 단순화하여 균일하게 처리하고 싶을때

## 장점
- 단일체와 복합체를 동일하게 여기기 때문에 묶어서 연산하거나 관리할 때 편리하다.
- 다형성 재귀를 통해 복잡한 트리 구조를 보다 편리하게 구성 할 수 있다.
- 수평적, 수직적 모든 방향으로 객체를 확장할 수 있다.
- 새로운 Leaf 클래스를 추가하더라도 클라이언트는 추상화된 인터페이스 만을 바라보기 때문에 개방 폐쇄 원칙(OCP)Visit Website을 준수 한다. (단일 부분의 확장이 용이)

## 단점
- 재귀 호출 특징 상 트리의 깊이(depth)가 깊어질 수록 디버깅에 어려움이 생긴다.
- 설계가 지나치게 범용성을 갖기 때문에 새로운 요소를 추가할 때 복합 객체에서 구성 요소에 제약을 갖기 힘들다.
- 계층형 구조에서 leaf 객체와 composite 객체들을 모두 동일한 인터페이스로 다루어야하는데, 이 공통 인터페이스 설계가 까다로울 수 있다.
  - 복합 객체가 가지는 부분 객체의 종류를 제한할 필요가 있을 때
  - 수평적 방향으로만 확장이 가능하도록 Leaf를 제한하는 Composite를 만들때



