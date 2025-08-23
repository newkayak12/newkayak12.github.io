---
layout: post

categories: [SPRING]
---



from [Dictionary - Spring Event](https://github.com/newkayak12/Dictionary/blob/master/spring/24.SpringEvent.md)



# Spring Event
## 이벤트 등록
`ApplicationEvent`를 상속해야 한다.

## 이벤트 팔행
`ApplicationEventPublisher`를 주입받아 사용해야 함

## 이벤트 구독
`ApplicationListener`를 구현하거나 `@EventListener`를 사용해야 한다.

```java
//Publisher
@RequiredArgsConstructor
public class EventPublisher {
    private final ApplicationEventPublisher publisher;

    public void publish() throws InterruptedException {
        publisher.publishEvent(new CustomEvent("Emitted"));
    }
}


//Listener
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {

    void onApplicationEvent(E event);

    static <T> ApplicationListener<PayloadApplicationEvent<T>> forPayload(Consumer<T> consumer) {
        return event -> consumer.accept(event.getPayload());
    }

}

//or 


@Component
public class CustomEventListener {

    @EventListener
    public void listen(CustomEvent event) {

    }
}
```

## 발행/ 구독
- 멀티 캐스팅으로 동작 (다수의 수신자가 존재할 수 있다.)
- 동기 방식으로 동작 (트랜잭션이 하나의 범위로 묶일 수 있다.)
- 트랜잭션과 결합이 필요하다면 다른 리스너를 사용해야 한다.(`@TransactionEventListener`를 제공하므로 트랜잭션 단계에 관여할 수 있다.)
  - `TransactionPhase.BEFORE_COMMIT`
  - `TransactionPhase.AFTER_COMPETION`
  - `TransactionPhase.AFTER_COMMIT`
  - `TransactionPhase.AFTER_ROLLBACK`

## 비동기로 이벤트 처리
- `@Async` 메소드로 비동기 구현
- `ApplicationEventMulticaster`로 비동기 구현

## 장/단
- 장점
  - 의존성을 분리하여 두 클래스를 느슨하게 결합시킬 수 있다. 
  - 클래스가 독립적이므로 재사용성을 높일 수 있다. 
  - 추후에 별도 서비스로 분리하기 용이함
  - 메세지 구독 모듈을 추가/ 삭제할 때, 다른 모듈에 영향을 주지 않은 채로 수정할 수 있다.
  - 단위 테스트가 용이해짐
- 단점
  - 전반적인 작업량이 많아질 수 있음
  - 코드 흐름 파악이 어려움
  - 메시지 구독 순서를 고려해야 하는 경우 복잡해짐
  - 전체적인 인벤트의 구독/ 발행을 테스트하기 어려움
  - 특정 프레임워크 API에 의존