---
layout: post
categories: [KOTLIN]
---


# 코루틴 흐름 제어와 잡 생명 주기

````mermaid
flowchart TD
NEW-- 시작 -->ACTIVE

ACTIVE -- 완료 --> COMPLETING
ACTIVE -- 취소/실패 --> CANCELLING
CANCELLING -- 취소/실패 --> COMPLETING
CANCELLING -- 끝 --> COMPLETED
COMPLETING -- 끝 --> COMPLETED
````

- 활성화는 작업이 시작됐다는 의미다. 잡이 생성되자 마자 이 상태가 된다. `launch()`, `async()`는 CoroutineStart 타입의 인자를 지정해서 초기 상태를 정할 수 있다.
  - `CoroutineStart.DEFAULT`는 기본 동작이며 잡을 즉시 시작
  - `CoroutineStart.LAZY`는 기본 동작이며 잡을 즉시 시작하지 않는다. 잡이 신규 상태가 되고 시작을 기다린다.
- 신규 상태의 잡에 `start()`, `join()`을 호출하면 활성화가 된다.
```kotlin
@Test
fun coroutineFlow() {
    runBlocking {
        val job =launch(start=CoroutineStart.LAZY) {
            println("JobStarted")
        }
        
        delay(100)


        println("Preparing to start...")
        job.start();
    }
    /**
     * Preparing to start...
     * JobStarted
     *
     */
}
```
- 활성화 상태에서는 코루틴 장치가 잡을 반복적으로 일시 중단하고 재개시킨다. 잡이 다른 잡을 시작할 수도 있다. 이 경우 새 잡은 기존 잡의 자식이 된다.
- Children 프로퍼티로 완료되지 않은 자식 잡들을 얻을 수 있다.
```kotlin
@Test
fun coroutineContext() {
    runBlocking {
        val job = coroutineContext[Job.Key]!!

        launch { println("This is task A") }
        launch { println("This is task B") }

        println("${job.children.count()} children running")
    }
    //2 children running
    //This is task A
    //This is task B
}
```

- 현재 잡 상태를 `isActive`, `isCancelled`, `isComplete` 프로퍼티로부터 추적할 수 있다.

> #### Job states
> 
> [A job has the following states:](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/)
> 
> |             State	             | isActive	 | isCompleted	 | isCancelled |
> |:------------------------------:|:---------:|:------------:|:-----------:|
> |  New (optional initial state)  |  	false   |    	false    |   	false    |
> | Active (default initial state) |   	true   |    	false    |   	false    |
> |  Completing (transient state)  |   	true   |    	false    |   	false    |
> |  Cancelling (transient state)  |  	false   |    	false    |    	true    |
> |    Cancelled (final state)	    |   false   |    	true     |    	true    |
> |    Completed (final state)	    |   false   |    	true     |   	false    |


## 취소
- 잡의 `cancel()`을 호출해서 잡을 취소할 수 있다.
- 더 이상 필요 없는 게산을 중단시킬 표준적인 방법을 제공한다.
- 취소 가능한 코루틴이 스스로 취소가 됐는지 검사해서 적절히 반응해야 한다.

```kotlin
@Test
fun coroutineCancel() {
    runBlocking {
        val squarePrinter = GlobalScope.launch(Dispatchers.Default){
            var i = 1
            while ( true ) {
                println(i++)
            }
        }

        delay(100)
        squarePrinter.cancel()
    }
}
```
- isActive 확장 프로퍼티는 현재 잡이 활성 상태인지 검사한다.
- `cancel()`을 하면 `cancelling`으로 바뀌고 결국 종료로 귀결된다.
- 다른 방법은 상태를 검사하는 대신에 `CancellationException`을 발생시키면서 취소에 반응할 수 있게 실시 중단 함수를 호출하는 것이다. 이는 취소 중이라는 사실을 전달하기 위한 예외다.
- delay(), join()등 모든 일시 중단 함수가 이 예외를 발생시킨다.
- 한 가지 더 보면 `yield()`는 실행 중인 잡을 일시 중단시켜서 자신을 실행 중인 쓰레드를 다른 코루틴에게 양보한다.

```kotlin
@Test
fun coroutineParent () {
    runBlocking {
        val parentJob = launch {
            println("Parent started")

            launch {
                println("Child 1 started")
                delay(500)
                println("Child 1 completed")
            }

            launch {
                println("Child 2 started")
                delay(500)
                println("Child 2 completed")
            }

            delay(500)
            println("Parent completed")
        }

        delay(100)
        parentJob.cancel()
    }

    //Parent started
    //Child 1 started
    //Child 2 started
}
```

## 타임아웃
- 타임아웃을 주고 일정 시간이 지나면 강제로 끝내야 할 때가 있다.
- `withTimeout()`은 일정 시간이 지나면 `TimeoutCancellationException`을 낸다.
```kotlin
 @Test
fun coroutineTimeout () {
  runBlocking {
    val asyncData = async { File("./README.md").readText() }
    try {

      val text = withTimeout(1) { asyncData.await() }
      println("Data loaded : $text")
    }
    catch (e: Exception) {
      println("Timeout exceeded")
    }
  }
}
```
- `withTimeoutOrNull()`도 있다.

## 코루틴 디스패치
- 코루틴은 쓰레드와 무관하게 일시 중단 가능한 계산을 구현할 수 있게 해주지만, 코루틴을 실행하려면 당연히 쓰레드와 연관된다.
- 코루틴 내부에서 사용할 쓰레드를 제어하는 작업을 담당하는 부분을 dispatcher라고 한다.
- launch, runBlocking에서 디스패처를 지정할 수 있다.

```kotlin
@Test
fun passDispatcher() {
    runBlocking { 
        launch(Dispatchers.Default) {
            print(Thread.currentThread().name)
        }
    }
}
```
- 보면 볼수록 swift [`dispatchQueue`](https://developer.apple.com/documentation/dispatch/dispatchqueue)와 비슷해 보인다.
- `asCoroutineDispatcher()` 확장 함수를 사용하면 java의 `ThreadPool`등을 코루틴 디스패처로 바꿔서 쓸 수 있다.
- 코루틴 dispatcher는 세 가지 구현이 있다.
  - Dispatcher.Default: 공유 쓰레드 풀로, 풀 크기는 기본적으로 CPU 코어 수 혹은 2다. CPU 위주 작업에 적합하다.
  - Dispatcher.IO: 쓰레드 풀 기반이다. 파일을 읽고 쓰는 것처럼 잠재적으로 블로킹 될 수 있는 것에 최적화돼 있다.
  - Dispatcher.Main: 사용자 입력이 처리되는 UI 쓰레드에서 배타적으로 작동하는 디스패처다.

- `newFixedThreadPoolContext`, `newSingleThreadThreadPoolContext`도 사용할 수 있다.
- 또한 디스패처를 명시하지 않으면 시작 영역으로부터 디스패처가 자동 상속된다.
```kotlin
@Test
fun fixedThreadPoolToDispatcher () {
    newFixedThreadPoolContext(5, "workThread").use {
        dispatcher -> runBlocking {
            for( i in 1..3) {
                launch(dispatcher){
                    println(Thread.currentThread().name)
                    delay(100)
                }
            }


        //workThread-1 @coroutine#2
        //workThread-2 @coroutine#3
        //workThread-3 @coroutine#4
        }
    }
}
```

## 예외 처리
- 두 가지 기본 전략 중 하나를 따른다.
  1. 부모 코루틴이 자식에서 전파된 오류로 취소된다.
  2. 자식이 모두 취소되고 부모는 예외를 코루틴 트리의 윗부분으로 전달한다.
- CoroutineExceptionHandler는 현재 코루틴 문맥(CoroutineContext)과 던져진 예외를 인자로 받는다.

```kotlin
import kotlin.coroutines.CoroutineContext
import kotlin.jvm.Throws
abstract class CoroutineErrorExample {
    abstract fun handleException(context: CoroutineContext, exception: Throwable)
}
```

- 핸들러를 만드는 가장 쉬운 길은 `CoroutineExcpetionhandler`를 사용하는 것이다.
````kotlin
@Test
fun coroutineExceptionHandler() {
    runBlocking {
        suspend fun main() {
            val handler = CoroutineExceptionHandler{
                _, exception-> println(exception)
            }

            GlobalScope.launch (handler) {

              launch {
                throw Exception("Error task A")
                println("Task A completed")
              }

              launch {
                delay(1000)
                print("Task B completed")
              }

            }.join()
            println("Root")
        }

        main()

        //java.lang.Exception: Error task A
        //Root
    }
}
````
- 혹은 `async()` 빌더에서 던져진 예외를 저장했다가 예외가 발생한 계산에 대한 `await`을 호출했을 때 다시 던지는 것이다.
```kotlin
@Test
fun coroutineAwaitHandling() {
    runBlocking {
        val deferredA = async {
            throw Exception("Error in task A")
            println("Task A completed")
        }
        val deferredB = async {
            println("Task B completed")
        }

        try {
            deferredA.await()
            deferredB.await()
        } catch (e: Exception) {
            println("Caught $e")
        }

        print("Root")
    }
    // Caught java.lang.Exception: Error in task A
    // Root
    // java.lang.Exception: Error in task A
}
```
- 부모를 취소시키기 위해서 위로 전파되는데 이 동작을 변경하려면 `supervisor` 잡을 사용해야 한다.
- supervisor job이 있으면 취소가 아래 방향으로만 전달된다.
- 아래와 같이 coroutineScope 대신 supervisorScope를 사용할 수 있다.
```kotlin
@Test
fun coroutineAwaitHandlingWithSupervisor() {
    runBlocking {
        supervisorScope {
            val deferredA = async {
                throw Exception("Error in task A")
                println("Task A completed")
            }
            val deferredB = async {
                println("Task B completed")
            }

            try {
                deferredA.await()
                deferredB.await()
            } catch (e: Exception) {
                println("Caught $e")
            }

            print("Root")
        }
    }
    // Task B completed
    // Caught java.lang.Exception: Error in task A
    // Root
}
```