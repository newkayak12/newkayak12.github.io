---
layout: post
categories: [JAVA]
---

from [Dictionary - 다이나믹 프록시](https://github.com/newkayak12/Dictionary/blob/master/java/14.DynamicProxy.md)

# Dynamic Proxy

자바 프로그래밍의 디자인 패터중 하나인 프록시 패턴Visit Website은 초기화 지연, 접근 제어, 로깅, 캐싱 등,
기존 대상 원본 객체를 수정 없이 추가 동작 기능들을 가미하고 싶을 때 사용하는 코드 패턴이다.
이 디자인 패턴을 적용하면 개방 폐쇄 원칙(OCP)Visit Website의 효과를 얻을 수 있어 코드 수정없이 유연하게 확장이 가능하여 유지보수 측면에서 플러스 효과를 얻을 수 있다는 장점이 있다.
하지만 프록시 디자인 패턴은 대상 원본 클래스 수만큼 일일히 프록시 클래스를 하나하나 만들어 줘야하는 치명적인 단점이 존재한다. 
즉, 프록시 적용 대상 객체가 100개면 프록시 객체도 100개 만들어줘야 한다는 말이다. 따라서 코드량이 많아지게 되고 중복이 발생하여 코드의 복잡도가 증가한다는 한계점이 존재한다.
바로 이러한 단점들을 보완하여 컴파일 시점이 아닌 런타임 시점에 프록시 클래스를 만들어주는 방식이 자바 가상 머신(JVM)에서 공식적으로 지원하는 동적 프록시(Dynamic Proxy) 기능이다.

동적 프록시는 개발자가 직접 일일히 프록시 객체를 생성하는 것이 아닌, 애플리케이션 실행 도중 java.lang.reflect.Proxy 
패키지에서 제공해주는 API를 이용하여 동적으로 프록시 인스턴스를 만들어 등록하는 방법으로서, 자바의 Reflection APIVisit Website 기법을 응용한 연장선의 개념이다. 
프록시 패턴의 기본 흐름은 거의 같고, 프록시를 클래스로 직접만들어서 등록하냐 이미 지원하는 api를 이용하여 동적으로 등록하느냐에 따른 차이만 있을 뿐이다.

# Dynamic Proxy 구성 요소
## newProxyInstance() Method
```java
public class Proxy implements java.io.Serializable {

	// ...
    
    public static Object newProxyInstance(
        ClassLoader loader,  //클래스 로더 
        Class<?>[] interfaces,  // 타깃의 인터페이스
        InvocationHandler h  // 타깃 정보가 포함된 Handler
    ) throws IllegalArgumentException {
        // ...
    }

}
```

- ClassLoader loader
프록시 클래스를 만들 클래스 로더(Class Loader)
Proxy 객체가 구현할 Interface에 Class Loader를 얻어오는 것이 일반적


- Class<?>[] interfaces
프록시 클래스가 구현하고자 하는 인터페이스 목록 (배열)
메서드를 통해 생성 될 Proxy 객체가 구현할 Interface를 정의한다.


- InvocationHandler h
프록시의 메서드(invoke)가 호출되었을때 실행되는 핸들러 메서드

## InvocationHandler
InvocationHandler 인터페이스는 위에서 본 newProxyInstance() 메서드의 3번째 매개변수에 들어갈 핸들러 메서드를 정의하는 함수형 인터페이스이다.
이 인터페이스 코드 구성을 보면 내부에 invoke() 라는 추상메서드 하나만 정의되어있는 걸 볼 수 있다.
invoke() 메서드는 동적 프록시의 메서드가 호출되었을때, 이를 낚아채어 대신 실행되는 메서드이다. 
메서드의 파라미터를 통해 어떤 메서드가 실행되었는지 메서드 정보와 메서드에 전달된 인자까지 알수있다.
디자인 패턴으로 프록시를 구성하면 단점이 중복된 메서드 코드 로직이 발생한다는 점인데, 이 invoke() 메서드에 동적으로 등록함으로써 반복된 코드를 줄이게 되는 것이다.

```java
public interface InvocationHandler {
    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable;
}
```
- Object proxy : 프록시 객체
- Method method : 호출한 메서드 정보
- Object[] args : 메서드에 전달된 매개변수 (배열)

# 예시
```java
interface AInterface {
    String call();
    void print();
    void run();
}

class AImpl implements AInterface {
    @Override
    public String call() {
        System.out.println("A 호출");
        return "a";
    }

    @Override
    public void print() {
        System.out.println("A print @@@@@@@");
    }

    @Override
    public void run() {
        System.out.println("A Running !!!!!!!!!");
    }
}

public class Client {
    public static void main(String[] arguments) {

        AInterface proxyA = (AInterface) Proxy.newProxyInstance(
                AInterface.class.getClassLoader(),
                new Class[]{AInterface.class},
                (proxy, method, args) -> { // 람다 함수
                    Object target = new AImpl();

                    System.out.println("TimeProxy 실행");
                    long startTime = System.nanoTime();

                    Object result = method.invoke(target, args); // 파라미터로 전달받은 메서드를 invoke로 실행

                    long endTime = System.nanoTime();
                    long resultTime = endTime - startTime;
                    System.out.println("TimeProxy 종료 resultTime = " + resultTime);

                    return result;
                }
        );

        proxyA.call();
        proxyA.print();
        proxyA.run();
    }
}
```

# Dynamic Proxy 제약 사항
지금까지 동적 프록시 구현 및 응용을 다뤄보았다. 아주 약간의 퍼포먼스를 희생하고 자유롭게 프록시를 다이나믹하게 등록할 수 있지만,
여기에 추가로 한가지 제약사항이 존재한다. 동적 프록시에 타켓을 등록할때 타입을 클래스가 아닌 무조건 인터페이스를 파라미터로 넣어야 된다는 점이다.
인터페이스를 기반으로 프록시를 동적으로 만들어주기 때문에, 인터페이스가 필수이기 때문이다.

즉, 자바에서 newProxyInstance()를 이용해 동적 프록시 객체를 만들때 Class 기반으로는 Proxy 객체를 생성할 수 없다는 말이다. 
하지만 클래스의 확장성을 고려할 필요가 없거나 한가지 책임만 분명하게 하는 경우 굳이 인터페이스를 등록해 사용하지 않는 겨우도 있다. 
프록시 때문에 굳이 일일히 인터페이스를 구현해야 하는 것도 결국은 디자인 패턴의 한계점의 회귀이다.


# CGLIB(Code Generator Library)
인터페이스가 아닌 클래스를 대상으로 바이트 코드를 조작해서 프록시 생성할 수 있는 라이브러리다.
효용성을 입증 받아 스프링에 기본으로 내장돼있다. 

>
> 스프링 프레임워크에서 Bean을 등록할 때 Spring AOP를 이용하여 등록을 하는데, 
> Bean으로 등록하려는 기본적으로 객체가 Interface를 하나라도 구현하고 있으면 Dynamic Proxy를 이용하고 Interface를 구현하고 있지 않으면 CGLIB 라이브러리를 이용한다.
> 

## CGLIB 프록시 
CGLIB 에서는 Enhancer 객체로 프록시 객체를 만들며 MethodInterceptor 인터페이스로 프록시 핸들러를 등록한다.
```java
// 프록시 핸들러
class MyProxyInterceptor implements MethodInterceptor {

    private final Object target;

    MyProxyInterceptor(Object target) {
        this.target = target;
    }

    @Override
    public Object intercept(
            Object o,
            Method method,
            Object[] args,
            MethodProxy methodProxy
    ) throws Throwable {

        System.out.println("TimeProxy 실행");
        long startTime = System.nanoTime();

        Object result = method.invoke(target, args); // 파라미터로 전달받은 메서드를 invoke로 실행

        long endTime = System.nanoTime();
        long resultTime = endTime - startTime;
        System.out.println("TimeProxy 종료 resultTime = " + resultTime);

        return result;
    }
}

// 프록시를 적용할 대상 타켓
class Subject {
    public void call() {
        System.out.println("서비스 호출");
    }
}

public class Client {
    public static void main(String[] arguments) {

        // 1. 프록시 등록 (CGLIB는 Enhancer를 사용해서 프록시를 등록한다)
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(Subject.class); // CGLIB는 구체 클래스를 상속 받아서 프록시를 생성하기 때문에 상혹할 구체 클래스를 지정
        enhancer.setCallback(new MyProxyInterceptor(new Subject())); // 프록시 핸들러 할당

        // 2. 프록시 생성
        Subject proxy = (Subject) enhancer.create(); // setSuperclass() 에서 지정한 클래스를 상속 받아서 프록시가 만들어진다.

        // 3. 프록시 호출
        proxy.call();
    }
}
```

## 람다로?
```java
public class Client {
    public static void main(String[] arguments) {
        
        Subject proxy = (Subject) Enhancer.create(Subject.class, (MethodInterceptor) (o, method, args, methodProxy) -> {

            Subject target = new Subject();

            System.out.println("TimeProxy 실행");
            long startTime = System.nanoTime();

            Object result = method.invoke(target, args); // 파라미터로 전달받은 메서드를 invoke로 실행

            long endTime = System.nanoTime();
            long resultTime = endTime - startTime;
            System.out.println("TimeProxy 종료 resultTime = " + resultTime);

            return result;
        });
        
        proxy.call();
    }
}
```

## 주의사항
이렇게 보면 인터페이스 기반일 때는 Dynamic Proxy를 사용하고, 클래스 기반일 때는 CGLIB를 사용하면 되겠지만, 이 라이브러리도 제약사항이 존재한다.
우선 CGLIB는 기본적으로 클래스 상속(extends)을 통해 프록시 구현이 되기 때문에, 타겟 클래스가 상속이 불가능할때는 당연히 프록시 등록이 불가능하다. 
또한 메서드에 final 키워드가 붙게되면 그 메서드를 오버라이딩하여 사용 할수 없게되어 결과적으로 프록시 메서드 로직이 작동되지 않는다. 

정리하자면 프록시 대상 객체는 상속에 있어 제한이 있으면 안된다는 것이다. 

- 클래스와 메소드에 final 키워드 적용
- 추상 클래스(abstract class)
- 클래스의 생성자를 private화 하여 생성자를 제한할 경우

