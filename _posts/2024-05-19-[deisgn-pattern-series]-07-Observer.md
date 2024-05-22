---
layout: post
categories: [DESIGN_PATTERN]
---
from [Dictionary - Observer](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/07.Observer.md)


# Observer
옵저버 패턴(Observer Pattern)은 옵저버(관찰자)들이 관찰하고 있는 대상자의 상태가 변화가 있을 때마다 대상자는 직접 목록의 각 관찰자들에게 통지하고, 관찰자들은 알림을 받아 조치를 취하는 행동 패턴이다.
옵저버 패턴은 여타 다른 디자인 패턴들과 다르게 일대다(one-to-many) 의존성을 가지는데, 주로 분산 이벤트 핸들링 시스템을 구현하는 데 사용된다. Pub/Sub(발행/구독) 모델로도 알려져 있다.

![](/assets/img/observer.png)

- ISubject : 관찰 대상자를 정의하는 인터페이스
- ConcreteSubject : 관찰 당하는 대상자 / 발행자 / 게시자
  - Observer들을 리스트(List, Map, Set ..등)로 모아 합성(compositoin)하여 가지고 있음
  - Subject의 역할은 관찰자인 Observer들을 내부 리스트에 등록/삭제 하는 인프라를 갖고 있다. (register, remove)
  - Subject가 상태를 변경하거나 어떤 동작을 실행할때, Observer 들에게 이벤트 알림(notify)을 발행한다.
- IObserver : 구독자들을 묶는 인터페이스 (다형성)
- Observer : 관찰자 / 구독자 / 알림 수신자.
  - Observer들은 Subject가 발행한 알림에 대해 현재 상태를 취득한다.
  - Subject의 업데이트에 대해 전후 정보를 처리한다.

# 흐름
![](/assets/img/observer2.png)

```java
// 관찰 대상자 / 발행자
interface ISubject {
    void registerObserver(IObserver o);
    void removeObserver(IObserver o);
    void notifyObserver();
}

class ConcreteSubject implements ISubject {
    // 관찰자들을 등록하여 담는 리스트
    List<IObserver> observers = new ArrayList<>();

    // 관찰자를 리스트에 등록
    @Override
    public void registerObserver(IObserver o) {
        observers.add(o);
        System.out.println(o + " 구독 완료");
    }

    // 관찰자를 리스트에 제거
    @Override
    public void removeObserver(IObserver o) {
        observers.remove(o);
        System.out.println(o + " 구독 취소");
    }

    // 관찰자에게 이벤트 송신
    @Override
    public void notifyObserver() {
        for(IObserver o : observers) { // 관찰자 리스트를 순회하며
            o.update(); // 위임
        }
    }
}

// 관찰자 / 구독자
interface IObserver {
  void update();
}

class ObserverA implements IObserver {
  public void update() {
    System.out.println("ObserverA 한테 이벤트 알림이 왔습니다.");
  }

  public String toString() { return "ObserverA"; }
}

class ObserverB implements IObserver {
  public void update() {
    System.out.println("ObserverB 한테 이벤트 알림이 왔습니다.");
  }

  public String toString() { return "ObserverB"; }
}
```

# 특징
## 사용 시기
- 앱이 한정된 시간, 특정한 케이스에만 다른 객체를 관찰해야 하는 경우
- 대상 객체의 상태가 변경될 때마다 다른 객체의 동작을 트리거해야 할때
- 한 객체의 상태가 변경되면 다른 객체도 변경해야 할때. 그런데 어떤 객체들이 변경되어야 하는지 몰라도 될 때
- MVC 패턴에서도 사용됨 (Model, View, Controller)
  - MVC의 Model과 View의 관계는 Observer 패턴의 Subject 역할과 Observer 역할의 관계에 대응된다.
  - 하나의 Model에 복수의 View가 대응한다.

## 장점
- Subject의 상태 변경을 주기적으로 조회하지 않고 자동으로 감지할 수 있다.
- 발행자의 코드를 변경하지 않고도 새 구독자 클래스를 도입할 수 있어 개방 폐쇄 원칙(OCP)Visit Website 준수한다
- 런타임 시점에서에 발행자와 구독 알림 관계를 맺을 수 있다.
- 상태를 변경하는 객체(Subject)와 변경을 감지하는 객체(Observer)의 관계를 느슨하게 유지할 수 있다. (느슨한 결합)

## 단점
- 구독자는 알림 순서를 제어할수 없고, 무작위 순서로 알림을 받음
  - 하드 코딩으로 구현할수는 있겠지만, 복잡성과 결합성만 높아지기 때문에 추천되지는 않는 방법이다.
- 옵저버 패턴을 자주 구성하면 구조와 동작을 알아보기 힘들어져 코드 복잡도가 증가한다.
- 다수의 옵저버 객체를 등록 이후 해지하지 않는다면 메모리 누수가 발생할 수도 있다.


