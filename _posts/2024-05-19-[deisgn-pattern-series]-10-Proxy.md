from [Dictionary - Proxy](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/10.Proxy.md)


# Proxy
프록시 패턴(Proxy Pattern)은 대상 원본 객체를 대리하여 대신 처리하게 함으로써 로직의 흐름을 제어하는 행동 패턴이다.
프록시(Proxy)의 사전적인 의미는 '대리인'이라는 뜻이다. 즉, 누군가에게 어떤 일을 대신 시키는 것을 의미하는데, 
이를 객체 지향 프로그래밍에 접목해보면 클라이언트가 대상 객체를 직접 쓰는게 아니라 중간에 프록시(대리인)을 거쳐서 쓰는 코드 패턴이라고 보면 된다. 
따라서 대상 객체(Subject)의 메소드를 직접 실행하는 것이 아닌, 대상 객체에 접근하기 전에 프록시(Proxy) 객체의 메서드를 접근한 후 추가적인 로직을 처리한뒤 접근하게 된다.


이런 방법을 사용하는 이유는 대상 클래스가 민감한 정보를 가지고 있거나 인스턴스화 하기에 무겁거나 추가 기능을 가미하고 싶은데, 
원본 객체를 수정할 수 없는 상황일 때를 극복하기 위해서다.

- 안(Security) : 프록시는 클라이언트가 작업을 수행할 수 있는 권한이 있는지 확인하고 검사 결과가 긍정적인 경우에만 요청을 대상으로 전달한다.
- 캐싱(Caching) : 프록시가 내부 캐시를 유지하여 데이터가 캐시에 아직 존재하지 않는 경우에만 대상에서 작업이 실행되도록 한다.
- 데이터 유효성 검사(Data validation) : 프록시가 입력을 대상으로 전달하기 전에 유효성을 검사한다.
- 지연 초기화(Lazy initialization) : 대상의 생성 비용이 비싸다면 프록시는 그것을 필요로 할때까지 연기할 수 있다.
- 로깅(Logging) : 프록시는 메소드 호출과 상대 매개 변수를 인터셉트하고 이를 기록한다.
- 원격 객체(Remote objects) : 프록시는 원격 위치에 있는 객체를 가져와서 로컬처럼 보이게 할 수 있다.

# 패턴 구조
![](img/proxy.png)

- Subject : Proxy와 RealSubject를 하나로 묶는 인터페이스 (다형성)
  - 대상 객체와 프록시 역할을 동일하게 하는 추상 메소드 operation() 를 정의한다.
  - 인터페이스가 있기 때문에 클라이언트는 Proxy 역할과 RealSubject 역할의 차이를 의식할 필요가 없다.
- RealSubject : 원본 대상 객체
- Proxy : 대상 객체(RealSubject)를 중계할 대리자 역할
  - 프록시는 대상 객체를 합성(composition)한다.
  - 프록시는 대상 객체와 같은 이름의 메서드를 호출하며, 별도의 로직을 수행 할수 있다 (인터페이스 구현 메소드)
  - 프록시는 흐름제어만 할 뿐 결과값을 조작하거나 변경시키면 안 된다.
- Client : Subject 인터페이스를 이용하여 프록시 객체를 생성해 이용.
  - 클라이언트는 프록시를 중간에 두고 프록시를 통해서 RealSubject와 데이터를 주고 받는다.

# 종류
## 일반 프록시
```java
interface ISubject {
    void action();
}

class RealSubject implements ISubject {
    public void action() {
        System.out.println("원본 객체 액션 !!");
    }
}
class Proxy implements ISubject {
    private RealSubject subject; // 대상 객체를 composition

    Proxy(RealSubject subject) {
        this.subject = subject;
    }

    public void action() {
        subject.action(); // 위임
        /* do something */
        System.out.println("프록시 객체 액션 !!");
    }
}

class Client {
    public static void main(String[] args) {
        ISubject sub = new Proxy(new RealSubject());
        sub.action();
    }
}
```

## 가상 프록시
- 지연 초기화 방식
- 가끔 필요하지만 항상 메모리에 적재되어 있는 무거운 서비스 객체가 있는 경우
- 이 구현은 실제 객체의 생성에 많은 자원이 소모 되지만 사용 빈도는 낮을 때 쓰는 방식이다.
- 서비스가 시작될 때 객체를 생성하는 대신에 객체 초기화가 실제로 필요한 시점에 초기화될수 있도록 지연할 수 있다.
```java
class Proxy implements ISubject {
    private RealSubject subject; // 대상 객체를 composition

    Proxy() {
    }

    public void action() {
    	// 프록시 객체는 실제 요청(action(메소드 호출)이 들어 왔을 때 실제 객체를 생성한다.
        if(subject == null){
            subject = new RealSubject();
        }
        subject.action(); // 위임
        /* do something */
        System.out.println("프록시 객체 액션 !!");
    }
}

class Client {
    public static void main(String[] args) {
        ISubject sub = new Proxy();
        sub.action();
    }
}
```

## 보호 프록시
- 프록시가 대상 객체에 대한 자원으로의 엑세스 제어(접근 권한)
- 특정 클라이언트만 서비스 객체를 사용할 수 있도록 하는 경우
- 프록시 객체를 통해 클라이언트의 자격 증명이 기준과 일치하는 경우에만 서비스 객체에 요청을 전달할 수 있게 한다.
```java
class Proxy implements ISubject {
    private RealSubject subject; // 대상 객체를 composition
    boolean access; // 접근 권한

    Proxy(RealSubject subject, boolean access) {
        this.subject = subject;
        this.access = access;
    }

    public void action() {
        if(access) {
            subject.action(); // 위임
            /* do something */
            System.out.println("프록시 객체 액션 !!");
        }
    }
}

class Client {
    public static void main(String[] args) {
        ISubject sub = new Proxy(new RealSubject(), false);
        sub.action();
    }
}
```

## 로깅 프록시
- 대상 객체에 대한 로깅을 추가하려는 경우
- 프록시는 서비스 메서드를 실행하기 전달하기 전에 로깅을 하는 기능을 추가하여 재정의한다.
```java
class Proxy implements ISubject {
    private RealSubject subject; // 대상 객체를 composition

    Proxy(RealSubject subject) {
        this.subject = subject;
    }

    public void action() {
        System.out.println("로깅..................");
        
        subject.action(); // 위임
        /* do something */
        System.out.println("프록시 객체 액션 !!");

        System.out.println("로깅..................");
    }
}

class Client {
    public static void main(String[] args) {
        ISubject sub = new Proxy(new RealSubject());
        sub.action();
    }
}
```

## 원격 프록시
- 프록시 클래스는 로컬에 있고, 대상 객체는 원격 서버에 존재하는 경우
- 프록시 객체는 네트워크를 통해 클라이언트의 요청을 전달하여 네트워크와 관련된 불필요한 작업들을 처리하고 결과값만 반환
- 클라이언트 입장에선 프록시를 통해 객체를 이용하는 것이니 원격이든 로컬이든 신경 쓸 필요가 없으며, 프록시는 진짜 객체와 통신을 대리하게 된다

## 캐싱 프록시
- 데이터가 큰 경우 캐싱하여 재사용을 유도
- 클라이언트 요청의 결과를 캐시하고 이 캐시의 수명 주기를 관리

# 특징
## 사용 시기
- 접근을 제어하거가 기능을 추가하고 싶은데, 기존의 특정 객체를 수정할 수 없는 상황일때
- 초기화 지연, 접근 제어, 로깅, 캐싱 등, 기존 객체 동작에 수정 없이 가미하고 싶을 때

## 장점
- 개방 폐쇄 원칙(OCP) 준수
  - 기존 대상 객체의 코드를 변경하지 않고 새로운 기능을 추가할 수 있다.

- 단일 책임 원칙(SRP) 준수
  - 대상 객체는 자신의 기능에만 집중 하고, 그 이외 부가 기능을 제공하는 역할을 프록시 객체에 위임하여 다중 책임을 회피 할 수 있다.

- 원래 하려던 기능을 수행하며 그외의 부가적인 작업(로깅, 인증, 네트워크 통신 등)을 수행하는데 유용하다
- 클라이언트는 객체를 신경쓰지 않고, 서비스 객체를 제어하거나 생명 주기를 관리할 수 있다.
- 사용자 입장에서는 프록시 객체나 실제 객체나 사용법은 유사하므로 사용성에 문제 되지 않는다.

## 단점
- 많은 프록시 클래스를 도입해야 하므로 코드의 복잡도가 증가한다.
  - 예를들어 여러 클래스에 로깅 기능을 가미 시키고 싶다면, 동일한 코드를 적용함에도 각각의 클래스에 해당되는 프록시 클래스를 만들어서 적용해야 되기 때문에 코드량이 많아지고 중복이 발생 된다.
  - 자바에서는 리플렉션에서 제공하는 동적 프록시(Dynamic Proxy) 기법을 이용해서 해결할 수 있다. (후술)

- 프록시 클래스 자체에 들어가는 자원이 많다면 서비스로부터의 응답이 늦어질 수 있다.