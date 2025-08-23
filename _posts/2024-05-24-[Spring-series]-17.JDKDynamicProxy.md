---
layout: post
categories: [SPRING]
---



from [Dictionary - JDK Dynamic Proxy](https://github.com/newkayak12/Dictionary/blob/master/spring/17.JDKDynamicProxy.md)





# Jdk Dynamic Proxy

인터페이스를 기반으로 프록시르 생성한다.
`java.lang.reflect`의 `InvocationHandler`를 구현하면 된다. 내부에 `public Object invoke(Object proxy, Method method, Object[] args)`
메소드가 존재한다. relfect의 invoke와 구조가 유사하다.

```java
public class Target implements TargetInterface{
    @Override
    public void echo(String text) {
        System.out.println(text);
    }
}
```

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class TargetHandler implements InvocationHandler {
    private TargetInterface target;

    public TargetHandler(TargetInterface target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("before");

        Object result = method.invoke(target, args);

        System.out.println("after");
        return result;
    }
}
```

```java
public interface TargetInterface {

    public void echo(String text);
}
```

```java
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;

public class ProxyTest {

    @Test
    public void test() {
        TargetInterface tar = new Target();
        TargetHandler handler = new TargetHandler(tar);

        TargetInterface proxy = (TargetInterface) Proxy.newProxyInstance(
                TargetInterface.class.getClassLoader(),
                new Class[] {TargetInterface.class},
                handler
                );

        proxy.echo("HI");
    }
}
```