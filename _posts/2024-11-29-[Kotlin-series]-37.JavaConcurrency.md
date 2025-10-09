---
layout: post
categories: [KOTLIN]
---


# 자바 동시성

> 코루틴 이외에도 JVM 플랫폼에서는 JDK가 제공하는 동기화 요소를 활요할 수 있다.

## 쓰레드 시작
- 범용 쓰레드 시작을 위해서는 쓰레드에서 실행하려는 실행 가능 객체에 대응하는 람다와 쓰레드 프로퍼티를 지정해서 thread() 함수를 사용하면 된다.
  1. start : 쓰레드를 생성하자마자 시작할지 여부 (true)
  2. isDaemon : 쓰레드를 데몬 모드로 시작할지 여부 (false)
  3. contextClassLoader : 쓰레드 코드가 클래스와 자원을 적재할 때 사용할 클래스 로더 (null)
  4. name : 커스텀 쓰레드의 이름 (null -> JVM이 자동 지정)
  5. priority : `Thread.MIN_PRIORITY`(1) ~ `Thread.MAX_PRIORITY`(10) 사이의 값 (-1 -> 자동 우선순위)
  6. block : `() -> Unit` 타입의 함숫 값으로 새 쓰레드가 생성되면 실행할 코드

````kotlin
@Test
fun threadTest() {
    println("Starting a thread...")

    thread(name = "Worker", isDaemon = true) {
        for ( i in 1..5) {
            println("${Thread.currentThread().name} : $i" )
            Thread.sleep(150)
        }
    }

    Thread.sleep(500)
    println("Shutting down...")
    
//Starting a thread...
    //Worker : 1
    //Worker : 2
    //Worker : 3
    //Worker : 4
    //Shutting down...
}
````


- 자바 타이머 관련 함수가 있다. `timer()` 함수는 어떤 작업을 이전 작업이 끝난 시점을 기준으로 고정된 간격으로 실행하는 타이머를 설정한다.
- 이 타이머는 `FIXED_RATE`로 작동하는 코틀린 티커에 비유할 수 있다.
  1. name: 타이머 쓰레드의 이름(null)
  2. daemon: 타이머 쓰레드를 데몬 쓰레드로 지정할지 여부(false)
  3. startAt: 최초 타이머 이벤트가 발생하는 시간을 나타내는 Date 객체
  4. period: 연속된 타이머 이벤트 사이의 시간 간격[ms간격]
  5. action: 타이머 이벤트가 발생할 때마다 실행될 `TimeTask(0 -> Unit` 타입의 람다

```kotlin
@Test
fun timerTest() {
    println("Starting a thread...")
    var counter= 0

    timer(period = 150, name = "Worker", daemon = true) {
        println("${Thread.currentThread().name} ${++ counter}")
    }

    Thread.sleep(500)
    println("Shutting down...")
    
    //Starting a thread...
    //Worker 1
    //Worker 2
    //Worker 3
    //Worker 4
    //Shutting down...
}
```


## 동기화, 락

- 특정 코드 조각이 한 쓰레드에서만 실행되도록 보장하기 위한 공통적인 기본 요소다.
- 소위 말하는 사용 중이면 대기하고, 기다렸다 다른 쓰레드의 사용이 끝나면 사용하는 식의 프로세스에 대한 얘기다.
- java에서 동기화를 도입하는 방법은 두 가지가 있다.
  1. 락으로 사용하려는 어떤 객체를 지정하는 특정한 동기화 블록을 사용해서 감쌀 수 있다. 
```kotlin
@Test
fun synchronizedTest() {
    var count = 0
    val lock = Any()

    for( i in 1..5 ) {
        thread(isDaemon = false) {
            synchronized(lock) {
                count += i
                println(count)
            }
        }
    }
    //1
    //3
    //6
    //11
    //15
}
```
- java에서는 `synchronized`를 변경자로 붙인다. 그러면 본문 전체가 현재 클래스 인스턴스나, Class 인스턴스 자체에 의해서 동기화 된다.
```kotlin
class Counter {
    private var value = 0
    @Synchronized fun addAndPrint(value: Int) {
        this.value += value
        println(value)
    }
}

@Test
fun annotationSynchronized () {
    val counter = Counter()
    for (i in 1..5) {
        thread(isDaemon = false) { counter.addAndPrint(i) }
    }
    //1
    //2
    //3
    //4
    //5
}
```

> - ReentrantReadWriteLock의 읽기와 쓰기 락을 사용해서 주어진 작업을 수행하는 read, write 함수도 있다. 
> - write는 기존 읽기 락을 쓰기 락으로 자동 승격시켜줌으로써 재진입한(reentrant) 락의 의미를 유지한다.


> vs. java
> - kotlind에서는 `wait()`, `notify()`, `notifyAll()`이 kotlin$Any에는 없다.
> - `java.lang.Object`으로 적당히 캐스팅하면 사용할 수는 있다.