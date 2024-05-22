---
layout: post
categories: [DESIGN_PATTERN]
---
from [Dictionary - Template Callback](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/18.TemplateCallback.md)


# Template Callback
탬플릿 콜백 패턴(Template Callback Pattern)은 스프링 프레임워크에서 DI(Dependency injection) 의존성 주입에서 사용하는 특별한 전략 패턴이다.
스프링의 JdbcTemplate, RestTemplate, TransactionTemplate, RedisTemplate과 같은곳에 사용된다.

존의 전략 패턴은 변화되는 전략 알고리즘 부분을 컴파일 타임에서 클래스로 만든뒤 구현체를 주입해 주어야 되지만, 템플릿 콜백 패턴은 런타임 타임에서 익명 클래스를 이용해 동적으로 전략 알고리즘을 주입한다.
용어도 그냥 전략 패턴에서의 컨텍스트(Context)를 템플릿으로 치환한 것일 뿐이며 콜백은 익명 클래스를 만들어진 메서드를 칭하는 것이다.
정리하자면 템플릿 콜백 패턴은 복잡하지만 바뀌지 않는 일정한 패턴을 갖는 작업 흐름이 존재하고 그중 일부분만 자주 바꿔서 사용해야 하는 경우에 적합한 패턴이라고 보면 된다.

# 흐름
```java
// 콜백
interface Callback {
    int execute(final int n);
}

// 템플릿
class Template {
    int workflow(Callback cb) {
        System.out.println("Workflow 시작");
        int num = 100;
        int result = cb.execute(num);
        return result;
    }
}

// 클라이언트
public class Client {
    public static void main(String[] args) {
        int x = 100;
        int y = 20;

        Template t = new Template();
        int result = t.workflow(new Callback() {
            @Override
            public int execute(final int n) {
                return n * n;
            }
        });
        System.out.println(result); // 100 * 100 = 10000
    }
}
```

## 특징
- 전략 패턴과 스프링의 의존성 주입(DI)의 장점을 익명 내부 클래스 사용 전략과 결합해 독특하게 활용되는 패턴

## 장점
- 전략패턴은 따로 전략 알고리즘을 정해놓은 별도의 전략 클래스가 필요했지만, 템플릿-콜백 패턴은 별도의 전략 클래스 없이, 전략을 사용하는 메소드에 매개변수값으로 전략 로직을 넘겨 실행하기 때문에 전략 객체를 일일히 만들 필요가 없다.
- 외부에서 어떤 전략을 사용하는지 감추고 중요한 부분에 집중할 수 있다.

## 단점
- 스프링 클라이언트에서 DI를 사용하지 않게 되면, Bean으로 등록되지 않아 싱글톤 객체가 되지 않게 된다.
- 인터페이스를 사용하지만 실제 사용할 클래스를 직접 선언하기 때문에 결합도가 증가하게 된다. 다만, 그렇다고 해서 무리하게 결합도를 낮추는 행위를 할 필요는 없다.