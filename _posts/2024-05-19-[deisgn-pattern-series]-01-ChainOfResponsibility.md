from [Dictionary - Chain Of Responsibility](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/01.ChainOfResponsibility.md)
# Chain Of Responsibility
책임 연쇄 패턴(Chain Of Responsibility Pattern, COR)은 클라이어트의 요청에 대한 세세한 처리를 하나의 객체가 몽땅 하는 것이 아닌,
여러개의 처리 객체들로 나누고, 이들을 사슬(chain) 처럼 연결해 집합 안에서 연쇄적으로 처리하는 행동 패턴이다.

이러한 처리 객체들을 핸들러(handler)라고 부르는데, 요청을 받으면 각 핸들러는 요청을 처리할 수 있는지, 없으면 체인의 다음 핸들러로 처리에 대한 책임을 전가한다.
한마디로 책임 연쇄라는 말은 요청에 대한 책임을 다른 객체에 떠넘긴다는 소리이다. 떠넘긴다고 하니까 부정적인 의미로 들릴수도 있겠지만, 
이러한 체인 구성은 하나의 객체에 처리에 대한 책임을 요청을 보내는 쪽(sender)과 요청을 처리하는(receiver) 쪽을 분리하여 각 객체를 부품으로 독립시키고 결합도를 느슨하게 만들며,
상황에 따라서 요청을 처리할 객체가 변하는 프로그램에도 유연하게 대응할 수 있다는 장점을 가지고 있다. 특히나 중첩 if-else 들을 최적화하는데 있어 실무에서도 많이 애용되는 패턴중 하나이기도 하다.

# 특징
## 패턴 사용 시기
- 특정 요청을 2개 이상의 여러 객체에서 판별하고 처리해야 할때
- 특정 순서로 여러 핸들러를 실행해야 하는 경우
- 프로그램이 다양한 방식과 종류의 요청을 처리할 것으로 예상되지만 정확한 요청 유형과 순서를 미리 알 수 없는 경우
- 요청을 처리할 수 있는 객체 집합이 동적으로 정의되어야 할 때 (체인 연결을 런타임에서 동적으로 설정)

## 패턴 장점
- 클라이언트는 처리 객체의 체인 집합 내부의 구조를 알 필요가 없다.
- 각각의 체인은 자신이 해야하는 일만 하기 때문에 새로운 요청에 대한 처리객체 생성이 편리해진다.
- 클라이언트 코드를 변경하지 않고 핸들러를 체인에 동적으로 추가하거나 처리 순서를 변경하거나 삭제할 수 있어 유연해진다
- 요청의 호출자(invoker)와 수신자(receiver)  분리시킬 수 있다.
  - 요청을 하는 쪽과 요청을 처리하는 쪽을 디커플링 시켜 결합도를 낮춘다
  - 요청을 처리하는 방법이 바뀌더라도 호출자 코드는 변경되지 않는다.

## 패턴 단점
- 실행 시에 코드의 흐름이 많아져서 과정을 살펴보거나 디버깅 및 테스트가 쉽지 않다.
- 충분한 디버깅을 거치지 않았을 경우 집합 내부에서 무한 사이클이 발생할 수 있다.
- 요청이 반드시 수행된다는 보장이 없다. (체인 끝까지 갔는데도 처리되지 않을 수 있다)
- 책임 연쇄로 인한 처리 지연 문제가 발생할 수 있다. 다만 이는 트레이드 오프로서 요청과 처리에 대한 관계가 고정적이고 속도가 중요하면 책임 연쇄 패턴 사용을 유의하여야 한다.

ex)
```java
// 구체적인 핸들러를 묶는 인터페이스 (추상 클래스)
abstract class Handler {
    // 다음 체인으로 연결될 핸들러
    protected Handler nextHandler = null;

    // 생성자를 통해 연결시킬 핸들러를 등록
    public Handler setNext(Handler handler) {
        this.nextHandler = handler;
        return handler; // 메서드 체이닝 구성을 위해 인자를 그대로 반환함
    }

    // 자식 핸들러에서 구체화 하는 추상 메서드
    protected abstract void process(String url);

    // 핸들러가 요청에 대해 처리하는 메서드 
    public void run(String url) {
        process(url);

        // 만일 핸들러가 연결된게 있다면 다음 핸들러로 책임을 떠넘긴다
        if (nextHandler != null)
            nextHandler.run(url);
    }
}

class ProtocolHandler extends Handler {
    @Override
    protected void process(String url) {
        int index = url.indexOf("://");
        if (index != -1) {
            System.out.println("PROTOCOL : " + url.substring(0, index));
        } else {
            System.out.println("NO PROTOCOL");
        }
    }
}

class DomianHandler extends Handler {
    @Override
    protected void process(String url) {
        int startIndex = url.indexOf("://");
        int lastIndex = url.lastIndexOf(":");

        System.out.print("DOMAIN : ");
        if (startIndex == -1) {
            if (lastIndex == -1) {
                System.out.println(url);
            } else {
                System.out.println(url.substring(0, lastIndex));
            }
        } else if (startIndex != lastIndex) {
            System.out.println(url.substring(startIndex + 3, lastIndex));
        } else {
            System.out.println(url.substring(startIndex + 3));
        }
    }
}

class PortHandler extends Handler {
    @Override
    protected void process(String url) {
        int index = url.lastIndexOf(":");
        if (index != -1) {
            String strPort = url.substring(index + 1);
            try {
                int port = Integer.parseInt((strPort));
                System.out.println("PORT : " + port);
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
    }
}


class Client {
    public static void main(String[] args) {
        // 1. 핸들러 생성
        Handler handler1 = new ProtocolHandler();
        Handler handler2 = new DomianHandler();
        Handler handler3 = new PortHandler();

        // 2. 핸들러 연결 설정 (handler1 → handler2 → handler3)
        handler1.setNext(handler2).setNext(handler3);

        // 3. 요청에 대한 처리 연쇄 실행
        String url1 = "http://www.youtube.com:80";
        System.out.println("INPUT: " + url1);
        handler1.run(url1);

        System.out.println();

        String url2 = "https://www.inpa.tistory.com:443";
        System.out.println("INPUT: " + url2);
        handler1.run(url2);

        System.out.println();

        String url3 = "http://localhost:8080";
        System.out.println("INPUT: " + url3);
        handler1.run(url3);
    }
}
```

## 실수에서 예시
- java.util.logging.Logger의 log()
- javax.servlet.Filter의 doFilter()