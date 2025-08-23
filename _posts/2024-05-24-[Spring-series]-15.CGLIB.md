---
layout: post
categories: [SPRING]
---



from [Dictionary - Refresh Context](https://github.com/newkayak12/Dictionary/blob/master/spring/15.CGLIB.md)




# CGLIB(Code Generator Library)
코드 생성 라이브러리로서 런타임에 동적으로 자바 클래스의 프록시를 생성해주는 기능을 제공한다. 
인터페이스가 아닌 클래스에 대해서 동적 프록시를 생성할 수 있다.

인터페이스가 없어도 concrete class만 있어도 동적 프록시(DynamicProxy)를 생성할 수 있다. 
원리는 타겟에 대한 정보를 직접적으로 제공 받아서 바이트 코드를 조작하여 프록시를 생성하는 것이다.
리플렉션을 사용하지는 않는다.([JDK Dynamic Proxy](https://newkayak12.github.io/2024/05/24/16.DynamicProxy.html)는 리플렉션을 사용한다.)

## 장점
- 인터페이스 없이 클래스만으로 프록시 객체를 동적으로 생성할 수 있다.
- 리플렉션이 아닌 바이트 코드 조작을 사용하며, 타겟에 대한 정보를 알고 있기에 JDK Dynamic Proxy에 비해 성능이 좋다.

## 단점
- default 생성자가 필요하다.
- 타겟의 생성자가 두 번 호출된다. 


```java
public class Target {

    public Target() {
    }

    public void echo (String text ) {
        System.out.println(text);
    }
}

```

```java
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class TargetMethodInterceptor implements MethodInterceptor {
    private final Target target;

    public TargetMethodInterceptor(Target target) {
        this.target = target;
    }


    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
        System.out.println("Before");
        method.invoke(target, args);
        System.out.println("After");
        return null;
    }
}
```

```java
import net.sf.cglib.proxy.Enhancer;
import org.junit.jupiter.api.Test;

public class TestCGLIB {

    @Test
    public void test () {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(Target.class);
        enhancer.setCallback(new TargetMethodInterceptor(new Target()));;
        Target target = (Target) enhancer.create();

        target.echo("CGLIB");
    }
}
```