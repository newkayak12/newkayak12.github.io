---
layout: post
categories: [DESIGN_PATTERN]
---
from [Dictionary - FlyWeight](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/03.FlyWeight.md)


# FlyWeight

플라이웨이트 패턴(Flyweight Pattern)은 재사용 가능한 객체 인스턴스를 공유시켜 메모리 사용량을 최소화하는 구조 패턴이다.
간단히 말하면 캐시(Cache) 개념을 코드로 패턴화 한것으로 보면 되는데, 자주 변화는 속성(extrinsit)과 변하지 않는 속성(intrinsit)을 분리하고 변하지 않는 속성을 캐시하여 재사용해 메모리 사용을 줄이는 방식이다. 
그래서 동일하거나 유사한 객체들 사이에 가능한 많은 데이터를 서로 공유하여 사용하도록 하여 최적화를 노리는 경량 패턴이라고도 불린다.

![](/assets/img/flyWeight.png)

- Flyweight : 경량 객체를 묶는 인터페이스.
- ConcreteFlyweight : 공유 가능하여 재사용되는 객체 (intrinsic state)
- UnsahredConcreteFlyweight : 공유 불가능한 객체 (extrinsic state)
- FlyweightFactory : 경량 객체를 만드는 공장 역할과 캐시 역할을 겸비하는 Flyweight 객체 관리 클래스
  - GetFlyweight() 메서드는 팩토리 메서드 역할을 한다고 보면 된다.
  - 만일 객체가 메모리에 존재하면 그대로 가져와 반환하고, 없다면 새로 생성해 반환한다
- Client : 클라이언트는 FlyweightFactory를 통해 Flyweight 타입의 객체를 얻어 사용한다.

# intrinsic 와 extrinsic 상태
플라이웨이트 패턴에서 가장 주의 깊게 보아야 할 점이 바로 Intrinsic와 Extrinsic의 상태를 구분하는 것이다.
intrinsic란 '고유한, 본질적인' 이라는 의미를 가진다. 본질적인 상태란 인스턴스가 어떠한 상황에서도 변하지 않는 정보를 말한다. 그래서 값이 고정되어 있기에 충분히 언제 어디서 공유해도 문제가 없게 된다.
extrinsic이란 '외적인, 비본질적인' 이라는 의미를 가진다. 인스턴스를 두는 장소나 상황에 따라서 변화하는 정보를 말한다. 그래서 값이 언제 어디서 변화할지 모르기 때문에 이를 캐시해서 공유할수 는 없다.

- intrinsic한 객체 : 장소나 상황에 의존하지 않기 때문에 값이 고정되어 공유할 수 있는 객체
- extrinsic한 객체 : 장소나 상황에 의존하기 때문에 매번 값이 바뀌어 공유할 수 없는 객체

# flyWeight 패턴 특징
## 사용 시기
- 어플리케이션에 의해 생성되는 객체의 수가 많아 저장 비용이 높아질 때
- 생성된 객체가 오래도록 메모리에 상주하며 사용되는 횟수가 많을때
- 공통적인 인스턴스를 많이 생성하는 로직이 포함된 경우
- 임베디드와 같이 메모리를 최소한으로 사용해야하는 경우에 활용

## 장점
- 애플리케이션에서 사용하는 메모리를 줄일 수 있다.
- 프로그램 속도를 개선 할수 있다.
  - new로 인스턴스화를 하면 데이터가 생성되고 메모리에 적재 되는 미량의 시간이 걸리게 된다.
  - 객체를 공유하면 인스턴스를 가져오기만 하면 되기 때문에 메모리 뿐만 아니라 속도도 향상시킬 수 있게 되는 것이다.
## 단점
- 코드 복잡도 증가

## 예시
``````java
class Memory {
    public static long size = 0; // 메모리 사용량

    public static void print() {
        System.out.println("총 메모리 사용량 : " + Memory.size + "MB");
    }
}

// ConcreteFlyweight(intrinsic) - 플라이웨이트 객체는 불변성을 가져야한다. 변경되면 모든 것에 영향을 주기 때문이다.
final class TreeModel {
    // 메시, 텍스쳐 총 사이즈
    long objSize = 90; // 90MB

    String type; // 나무 종류
    Object mesh; // 메쉬
    Object texture; // 나무 껍질 + 잎사귀 텍스쳐

    public TreeModel(String type, Object mesh, Object texture) {
        this.type = type;
        this.mesh = mesh;
        this.texture = texture;

        // 나무 객체를 생성하여 메모리에 적재했으니 메모리 사용 크기 증가
        Memory.size += this.objSize;
    }
}
// UnsahredConcreteFlyweight(extrinsic)
class Tree {
    // 죄표값과 나무 모델 참조 객체 크기를 합친 사이즈
    long objSize = 10; // 10MB

    // 위치 변수
    double position_x;
    double position_y;

    // 나무 모델
    TreeModel model;

    public Tree(TreeModel model, double position_x, double position_y) {
        this.model = model;
        this.position_x = position_x;
        this.position_y = position_y;

        // 나무 객체를 생성하였으니 메모리 사용 크기 증가
        Memory.size +=  this.objSize;
    }
}

// Client
class Terrain {
    // 지형 타일 크기
    static final int CANVAS_SIZE = 10000;

    // 나무를 렌더릴
    public void render(String type, Object mesh, Object texture, double position_x, double position_y) {
        // 나무를 지형에 생성
//        Tree tree = new Tree(
//                type, // 나무 종류
//                mesh, // mesh
//                texture, // texture
//                Math.random() * CANVAS_SIZE, // position_x
//                Math.random() * CANVAS_SIZE // position_y
//        );

        // 1. 캐시 되어 있는 나무 모델 객체 가져오기
        TreeModel model = TreeModelFactory.getInstance(type);

        // 2. 재사용한 나무 모델 객체와 변화하는 속성인 좌표값으로 나무 생성
        Tree tree = new Tree(model, position_x, position_y);
        출처: https://inpa.tistory.com/entry/GOF-💠-Flyweight-패턴-제대로-배워보자 [Inpa Dev 👨‍💻:티스토리]

        System.out.println("x:" + tree.position_x + " y:" + tree.position_y + " 위치에 " + type + " 나무 생성 완료");
    }
}

public static void main(String[] args) {
        // 지형 생성
        Terrain terrain = new Terrain();

        // 지형에 Oak 나무 5 그루 생성
        for (int i = 0; i < 5; i++) {
            terrain.render(
                    "Oak", // type
                    new Object(), // mesh
                    new Object(), // texture
                    Math.random() * Terrain.CANVAS_SIZE, // position_x
                    Math.random() * Terrain.CANVAS_SIZE // position_y
            );
        }

        // 지형에 Acacia 나무 5 그루 생성
        for (int i = 0; i < 5; i++) {
            terrain.render(
                    "Acacia", // type
                    new Object(), // mesh
                    new Object(), // texture
                    Math.random() * Terrain.CANVAS_SIZE, // position_x
                    Math.random() * Terrain.CANVAS_SIZE // position_y
            );
        }

        // 지형에 Jungle 나무 5 그루 생성
        for (int i = 0; i < 5; i++) {
            terrain.render(
                    "Jungle", // type
                    new Object(), // mesh
                    new Object(), // texture
                    Math.random() * Terrain.CANVAS_SIZE, // position_x
                    Math.random() * Terrain.CANVAS_SIZE // position_y
            );
        }

        // 총 메모리 사용률 출력
        Memory.print();
    }

/**
 * 1. intrinsic 객체와 extrinsic 객체 쪼개기
 * -> 같은 객체를 여러 번 올릴 필요가 없기 때문에 공유되는 객체는 따로 빼둔다.
 * 
 * 2. Flyweight 팩토리 만들기
 * -> Flyweight Pool : HashMap 컬렉션을 통해 키와 나무 모델 객체를 저장하는 캐시 저장소 역할
 * -> getInstance : Pool에서 가져오고자 하는 객체가 있는지 검사하고 있으면 가져오고 없으면 생성
 */
// FlyweightFactory
class TreeModelFactory {
    // Flyweight Pool - TreeModel 객체들을 Map으로 등록하여 캐싱
    private static final Map<String, TreeModel> cache = new HashMap<>(); // static final 이라 Thread-Safe 함

    // static factory method
    public static TreeModel getInstance(String key) {
        // 만약 캐시 되어 있다면
        if(cache.containsKey(key)) {
            return cache.get(key); // 그대로 가져와 반환
        } else {
            // 캐시 되어있지 않으면 나무 모델 객체를 새로 생성하고 반환
            TreeModel model = new TreeModel(
                    key,
                    new Object(),
                    new Object()
            );
            System.out.println("-- 나무 모델 객체 새로 생성 완료 --");

            // 캐시에 적재
            cache.put(key, model);

            return model;
        }
    }
}

/**
 * 3. Client 최적화 
 * -> TreeModel에서 공유되고 있는 나무 모델을 가져온다.
 * -> 가져온 나무 모델과 좌표값으로 나무 객체를 생성
 */
``````

## Garbage Collection 처리 주의사항
'인스턴스를 관리' 하는 기능을 자바 프로그래밍에서 구현하여 사용할 때에는 반드시 '관리되고 있는 인스턴스는 GC(Garbage Collection) 처리되지 않는다' 라는 점을 주의해야 한다.

즉, 나무를 모두 렌더링을 완료하여 더이상 나무를 생성할 일이 없다라면, 반드시 TreeModelFactory에 잔존해있는 Flyweight Pool 을 비워줄 필요가 있는 것이다. 
그래야 인스턴스에 대한 참조를 잃은 TreeModel 인스턴스들이 GC에 의해 메모리 청소가 되게 된다. 
그렇지 않으면 더이상 나무를 생성할 일이 없는데도 TreeModel 데이터가 메모리에 쓸데없이 잔존하게 된다.


## 실제 예시
### String Constant Pool

- String Constant Pool 개념이 바로 Flyweight Pool 개념이다.
- 자바는 String 데이터에 대해 별도로 string constant pool 영역에 적재한다.
- 같은 문자열 데이터 다시 사용될때 pool을 검사해 있다면 이를 공유한다.
- 만일 pool에 없다면 새로 메모리를 할당하여 pool에 등록한 후 재사용한다.
- String 클래스는 Flyweight 패턴을 통해 리터럴 문자열 데이터에 대한 캐싱을 하고 있는 것이다.
- String 클래스는 불변(immutable) 객체 특성을 가지고 있다.
