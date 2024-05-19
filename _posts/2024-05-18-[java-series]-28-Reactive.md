from [Dictionary - Reactive](https://github.com/newkayak12/Dictionary/blob/master/java/28.Reactive.md)

# Reactive

데이터 흐름과 전달에 대한 프로그래밍 패러다임이다.
기존 명령형 패러다임은 콜을 받아서 당겨오는(Pull) 방식이지만, 리액티브 프로그래밍은 데이터 소스가 변경된 데이터를 밀어주는(Push) 방식이다.
즉, 주변 환경과 상호작용을 하는 것을 주도하는게 아니라 일정 값이 변하면 이벤트를 받아서 동작한다. 일종의 옵저버(Observer) 패턴이다.

> 대략적으로 보면?
> 1. 기본 골자는 Stream API와 비슷하다. 
> 2. Stream API와 같이 끝 맺는 메소드 (subscribe)가 있어야 한다.
> 3. 퍼블리셔가 이벤트를 발행하면 stream을 타고 `subscrbie` 소비가 되는 패턴이다.

## Flow API
Java 9에는  `java.util.concurrent.Flow`를 추가했다.
리액티브 표준에 따라 발행(Pub)/ 구독(Sub)을 할 수 있도록 되어 있다.

- Publisher : 데이터를 발행하는 주체이다.
```java
@FunctionalInterface
public static interface Publisher<T> {
    public void subscribe(Subscriber<? super T> subscriber);
}
```

- Subscriber : 데이터를 소비하는 주체이다.
```java
public static interface Subscriber<T> {
    public void onSubscribe(Subscription subscription);
    public void onNext(T item);
    public void onError(Throwable throwable);
    public void onComplete();
}
```

- Subscription : 구독 그 자체다. Publisher - Subscriber를 연결한다.
```java
public static interface Subscription {
    public void request(long n);
    public void cancel();
}
```

- Processor : 리액티스 스트림에서 처리하는 단계이다.
```java
public static interface Processor<T,R> extends Subscriber<T>, Publisher<R> {
}
```

