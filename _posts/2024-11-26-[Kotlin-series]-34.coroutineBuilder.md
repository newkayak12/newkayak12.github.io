---
layout: post
categories: [KOTLIN]
---


# 코루틴


> ## todo
> - 코틀린 코루틴의 일시 중단 가능한 함수를 바탕으로  동시성 흐름 제어, 코루틴의 생명 주기에 따른 상태 변화
> - 코루틴 취소, 코루틴 예외 처리 동시상 작업이 쓰레드를 할당 받는 것

- kotlin에서 java의 동시성 연산을 사용 하더라도 대부분의 동시성 연산이 blocking이다. 
- `Thread.sleep`, `Thread.join`, `Object.wait`가 그 예시다. 
- contextSwitch가 수반된다. 이는 성능에 부정적 영향을 미친다. 더 큰 문제는 리소스가 막대하게 든다는 것이다.
- asyncrhonous가 더 효율적인 대안이 될 수 있다. 그러나 명령형 제어 흐름을 사용할 수 없어서 코드 복잡도가 급격하게 높아진다는 것이 문제가 될 수 있다.


## 일시 중단 함수
- 가장 기본 요소는 `일시 중단 함수`다. 
- 함수 본문이 원하는 지점에서 함수에 필요한 모든 런타임 문맥을 저장하고 함수 실행을 중단한 다음 나중에 필요할 때 꺼내서 다시 진행하는 식으로 작동한다.
```kotlin
suspend fun speak() {
    print("WAIT 100")
    delay(100) //Thread.wait과 달리 블럭시키지 않고 일시 중단시킨다.
    print("FINISH")
}
```
- 일시 중단 함수는 일시 중단 함수와 일반 함수를 원하는 대로 호출할 수 있다. 중단 함수를 호출하면 호출 지점이 일시 중단 지점이 된다.
- 일시 중단 지점은 임시로 실행을 중단했다가 나중에 재개할 수 있는 지점을 의미한다. 
- 일시 중단 함수를 호출할 수 있는 건 일시 중단 함수다. 상위 함수가 일반 함수인 경우, 일시 중단 함수를 내부에서 호출할 수 없다. 그래서 main에 suspend를 붙이기도 한다.
- 현실적으로 동시성 코드의 동작을 제어하기 위해서 공통적인 생명 주기와 문맥이 정해진 몇몇 작업이 정해진 구체적인 영역 안에서만 동시성 함수를 호출한다.
- 이런 영역 제공을 위해서 coroutine builder를 사용해서 만든다.
- 빌더는 `CouroutineScope` 인스턴스의 확장 함수로 쓰인다. 

## 코루틴 빌더

> - launch()
> - async()
> - runBlocking()

- lauch로 시작하고 코루틴을 실행 중인 작업의 상태를 추적하고 변경할 수 있는 Job을 리턴한다.
- Job은 `Coroutine -> Unit`의 일시 중단 람다를 받는다.

```kotlin
class CoroutineBuilderExample {
    @Test
    fun coroutine(): Unit {
        val time = currentTimeMillis()

        GlobalScope.launch {
            delay(100)
            println("Task 1 finished in ${currentTimeMillis() - time}ms")
        }

        GlobalScope.launch {
            delay(100)
            println("Task 2 finished in ${currentTimeMillis() - time}ms")
        }

        Thread.sleep(200)
        /**
         * Task 2 finished in 128ms
         * Task 1 finished in 128ms
         */
    }
}
```
- 두 작업이 병렬로 실행한다.
- 순서 보장은 되지 않는다.
- `Thread.sleep`으로 메인 쓰레드를 블로킹하며 중단한다.
- 코루틴은 daemon mode로 실행 되기에 main보다 먼저 끝나면 실행이 안 될 수도 있다.
- 코루틴은 유지해야 하는 상태가 간단하며, 일시 중단 된고 재개될 때 완전한 문맥 전환을 사용하지 않으므로 더 가볍고 더 많은 수를 동시에 사용할 수 있다.
- **`launch()`는 동시성 작업이 결과를 만들어내지 않는 경우 적합하다.**
- 결과가 필요하면  `async()`를 쓰면 된다. 
```kotlin
class CoroutineBuilderExample {
    @Test
    suspend fun coroutineAsync() {
        val message = GlobalScope.async {
            delay(100)
            "abc"
        }

        val count = GlobalScope.async {
            delay(100)
            1 + 2
        }

        delay(200)

        val result = message.await().repeat(count.await())
        println(result)
    }
}
```
- Deferred의 인스턴스를 돌려주고, 이 인스턴스는 Job의 하위 타입으로 await() 메소드로 계산 결과에 접근할 수 있다.
- java의 future와 유사하다.
- launch, async는 쓰레드 호출을 블럭시키지는 않지만 백그라운드 쓰레드를 공유하는 풀을 통해서 작업을 실행한다.
- 그래서 launch, async는 따로 메인쓰레드를 sleep으로 기다려야 했다.
- 반대로 `runBlocking()`는 디폴트로 현재 쓰레드에서 실행되는 코루틴을 만들고 코루틴이 완료될 때까지 현재 쓰레드의 실행을 블럭시킨다.
- 코루틴이 끝나면 일시 중단 람다의 결과가 `runBlocking()`의 결과가 된다. 
- 만약 block 된 쓰레드가 interrupt되면 해당 코루틴도 취소 된다.

```kotlin
class CoroutineTest {
    @Test
    fun coroutineRunBlocking() {
        GlobalScope.launch {
            delay(100)
            println("Background task: ${Thread.currentThread().name}")
        }

        runBlocking {
            println("Primary task: ${Thread.currentThread().name}")
            delay(200)
        }
        //Primary task: main @coroutine#2
        //Background task: DefaultDispatcher-worker-1 @coroutine#1
    }
}
```
- 이래서 `runBlocking`은 다른 코루틴 안에서 실행하면 안된다.


## 코루틴의 영역, 구조적 동시성
- 전역 영역이란 코루틴 생명 주기가 전체 애플리케이션 생명 주기를 따르는 영역이다.
- 만일 어떤 연산 도중에만 실행하길 바란다면 부모-자식 관계를 맺고 실행 시간 제한이 가능하다.
- 어떤 코루틴을 다른 코루틴의 문맥에서 실행하면 전자가 자식, 후자가 부모가 된다. 자식이 종료되어야 부모가 종료될 수 있다.
- 이런 기능을 `structured concurrency`, 구조적 동시성이라고 부른다. 비교 대상은 지역 변수 영역 안에서 블럭이나 서브 루틴을 사용하는 경우가 있겠다.

```kotlin
@Test
fun scope () {
    runBlocking {
        println("Parent task started")

        launch {
            println("Task A started")
            delay(200)
            println("Task A finished")
        }

        launch {
            println("Task B started")
            delay(200)
            println("Task B finished")
        }

        delay(100)
        println("Parent task finished")
    }

    println("Shutting down")
    //Parent task started
    //Task A started
    //Task B started
    //Parent task finished
    //Task A finished
    //Task B finished
    //Shutting down
}
```

> - runBlocking은 블로킹 동작이고 따라서 자식으로 사용하는 것보다는 부모로 사용하는 것에 적합하다.
- 살펴보면 100밀리초만 기다리게 시켰기에 부모가 더 빨리 끝나지만 일시 중단 상태로 두 자식을 기다린다. `runBlocking`이 메인 쓰레드를 블럭하기 때문이다.
- `coroutineScope` 호출로 블럭을 감싸면 커스텀 영역을 도입할 수도 있다. 
  - runBlocking 같이 람다 결과를 반환한다.
  - 자식들이 완료될 때까지 기다린다.
  - 그러나 `runBlocking`과 달리 현재 쓰레드를 블럭시키지 않는다. 
```kotlin
 @Test
    fun scopeCoroutineScope () {
        runBlocking {
            println("Parent task started")

            coroutineScope {
                launch {
                    println("Task A started")
                    delay(200)
                    println("Task A finished")
                }

                launch {
                    println("Task B started")
                    delay(200)
                    println("Task B finished")
                }
            }

            println("Parent task finished")
        }

        println("Shutting down")
        //Parent task started
        //Task A started
        //Task B started
        //Task A finished
        //Task B finished
        //Parent task finished
        //Shutting down
    }
```
- coroutineScope의 호출이 일시 중단 되므로 순서대로 실행된다.

## 코루틴 문맥 
- 코루틴 마다 CoroutineContext 인터페이스로 표현되는 문맥에 연관되어 있다.
- 코루틴을 감싸는 영역의 coroutineContext 프로퍼티로 이 문맥에 접근할 수 있다.
- 문맥에는 코루틴에서 사용할 수 있는 여러 데이터가 들어있다.
  - 코루틴이 실행 중인 취소 가능한 작업을 표현하는 Job
  - 코루틴의 쓰레드의 연관을 제어하는 dispatcher
```kotlin
@Test
fun coroutineContext() {
    GlobalScope.launch {
        println("Task is active: ${coroutineContext[Job.Key]!!.isActive}")
    }
    Thread.sleep(100)
    
    //Task is active: true
}
```
- 코루틴 실행 중간에 `withContext()`로 일시 중단 람다를 넘겨서 문맥을 전환시킬 수도 있다.