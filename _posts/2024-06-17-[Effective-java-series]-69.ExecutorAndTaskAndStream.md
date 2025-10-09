# 쓰레드보다 실행자, 태스크, 스트림

`ExecutorService exec = Executors.newSingleThreadExecutor();` 로 실행자를 만들 수 있다. `java.util.concurrent`에 있다.
이러고 `exec.execute(runnable);`로 task를 넘길 수 있다.

이외도 
1. 특정 태스크가 완료되길 기다린다.
2. 태스크 셋 중 뭐든 (invokeAny) 혹은 모두(invokeAll) 완료되길 기다린다.
3. 실행자 서비스가 종료되길 기다릴 수 있다.
4. 완료된 태스크들 결과를 차례로 받는다. 
5. 태스크를 특정 시간에 혹은 주기적으로 실행하게 한다.(ScheduledThreadPoolExecutor)

자바 7이 되면서 fork-join이 태스크를 지원하도록 확장됐다. ForkJoinPool을 구성하는 쓰레드들이 이 태스크 들을 처리하며, 일을 먼저 끝낸 쓰레드는 다른 쓰레드의
남은 태스크를 가져와서 대신 처리할 수도 있다.


# wait, notify 보단 동시성 유틸리티

wait, notify는 까다롭다. 차라리 고수준 동시성 유틸리티를 사용하자. 

executorFramework, concurrent collection, synchronizer다. `concurrent collection`는 내부에서 동기화를 실행한다. 동시성 컬렉션에서동시성을 무력화시키는 건 
불가능하며, 외부에서 락을 추가로 사용하면 오히려 속도가 느려진다. 근데, 메소드를 원자적으로 묶어서 호출하는 건 불가하다.(묶어서 하나의 덩어리로) 그래서 기본
동작을 하나의 원자 단위로 묶는 `상태 의존성 수정` 메소드들이 추가됐다. `putIfAbsent`가 예시다. 컬렉션 인터페이스 중 일부는 작업 성공이 확인될 때까지 기다리도록
확장된 경우도 있다. (`BlockingQueue`)

내부 동기화 장치로는 `CountDownLatch`, `Semaphore` 등이 있다. countDownLatch는 일회성 장벽으로, 하나 이상의 쓰레드가 또 다른 쓰레드 작업이 끝날 때까지 
기다리게 한다. 주의할 점은 코어 이상으로 래치를 설정하면 쓰레드 기아 교착에 빠질 수 있다.(Thread starvation deadlock)

굳이 이 둘을 사용해야 한다면 wait은 synchronized 안에서 사용하고 while 내부에서 사용해서 기다리게 해야 한다. 조건이 충족되면 풀어주고 notify해야 한다.
여기서 notifyAll, notify 중 고민하게 될텐데, 일반적으로 `notifyAll`이 나을 수 있다.  모든 쓰레드가 깨어나지만 외부 공격에 의해서 깨운 Thread를 다시 sleep되어 
영원이 sleep하는 경우에서 벗어날 수 있다.

# 문서화

멀티 쓰레드 환경에서도 API를 안전하게 사용하게 하려면 클래스가 지원하는 쓰레드 안정성 수준을 명시해야 한다.

1. 불변(immutable) : 클래스 인스턴스는 마치 상수와 같아서 외부 동기화 필요가 없다.
2. 무조건 쓰레드 안전(unconditionally thread-safe) : 인스턴스는 수정될 수 있으나, 내부에서 충실히 동기화 해서 별도 외부 동기화가 필요 없다.
3. 조건부 쓰레드 안전(conditionally thread-safe) : 무조건적 쓰레드 안전과 같으나 일부 메소드에는 동시에 사용하려면 외부 동기화가 필요
4. 쓰레드 안전하지 않음(not thread-safe) : 이 클래스의 인스턴스는 수정될 수 있다. 동시에 사용하려면 각각의 메소드 호출을 클라이언트가 외부에서 동기화 해야 한다.
5. 쓰레드 적대적(thread-hostile) : 외부 동기화를 해도 멀티쓰레드 환경에서 위험한 경우다. 예를 들어 정적 데이터를 동기화 없이 수정하는 경우다. 

위 기준에 맞춰서 문서화하여 적절한 처리를 할 수 있도록 유도해야 한다. 물론 메소드 시그니쳐에 명시할 수도 있다. 

# 지연 초기화는 신중히

lazy initialization은 초기화 시점이 해당 값이 필요할 때까지 늦추는 방법이다. 주로 최적화에 사용하지만 클래스, 인스턴스 초기화 때 발생하는 위험한 순환
문제를 해결하는 효과도 있다. 물론 접근시 비용이 늘어난다. 

멀티 쓰레드 환경에서는 지연초기화는 문제가 될 수 있다. 필드를 둘 이상의 쓰레드가 공유하면 동시에 여러 개를 초기화할 수 있다. 지연 초기화가 초기화 순환성(initialization circularity)
를 깨뜨릴거 같으면 synchronized를 사용하면 된다. 

혹은 lazy initialization holder class를 사용할 수도 있다. 클래스는 클래스가 처음 쓰일 때 비로소 초기화 된다는 특성을 이용한 관용구다( 싱글톤에서도 유용하다. )
혹은 이중 검사(double-check) 관용구를 사용할 수도 있다.

```java
import java.util.Objects;

private volatie FieldExample field;

private FieldExample getField() {
    FieldExample result = field;

    if (Objects.nonNull(result)) return result;
    
    synchronized (this) {
        if(Objects.isNull(field)) field = //할당
        
        return result;
    }
}

```