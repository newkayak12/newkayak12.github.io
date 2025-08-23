---
layout: post
categories: [KOTLIN]
---


# 동시성 채널

- 채널은 데이터 스트림을 코루틴 사이에 공유할 수 있는 편리한 방법이다.
- channel 인터페이스가 제공하는 채널에 대한 기본 연산은 데이터를 보내는 `send()` 받는 `receive()`가 있다.
- 이벤트를 조절하는 백프레셔 전략이 있다.

```kotlin
@Test
fun backPressure () {
    runBlocking {
        val streamSize = 5
        val channel = Channel<Int>(3)

        launch {
            for ( n in 1..streamSize) {
                delay(Random.nextLong(100))
                val square = n*n
                println("Sending $square")
                channel.send(square)
            }
        }

        launch {
            for ( n in 1..streamSize) {
                delay(Random.nextLong(100))
                val receiving = channel.receive()
                println("Receiving: $receiving")
            }
        }
    }
}
```
- Channel의 동작은 아래와 같다.
    - Channel.UNLIMITED(= Int.MAX_VALUE): 용량 제한 없음
    - Channel.RENDEZVOUS( = 0 ): 아무 내부 버퍼가 없는 랑데부 채널이 된다. send는 receive가 되어야만 할 수 있다. 채널 생성시 용량 지정이 없으면 이렇게 동작한다.
    - Channel.CONFLATED ( = -1): 송신 값이 합쳐지는 채널(conflated channel)이다. 최대 하나만 버퍼에 담고 수신되기 전에 보내면 이전 데이터는 소실된다.
- 추가로 send()를 하면 받기를 대기하고 있으므로 프로그램을 종료하지 않는다. 뭐 생각해 보면 당연하다 기다리고 있을테니 말이다. 이 경우 sender가 `close()`로 종료됨을 보내서 프로그램을 종료시킬 수 있다.
- 혹은 consumer 쪽에서 `consumeEach()` 함수로 모든 채널 콘텐츠를 얻어서 사용할 수 있다.
- 채널이 닫히고 `send()`하면 `ClosedSendChannelException`이 터질 수 있다.
- 생산자-소비자가 1:1일 필요는 없다. 이 경우 `fan-out`이라고 한다. (p:s = 1:n)
- 마찬가지로 여러 생상자와 한 소비자인 `fan-in`도 있다. (p:s = n:1)


## 생산자
- `sequnce()` 유사하게 동시성 데이터 스트림을 생성할 수 있는 `produce()`라는 코루틴 빌더가 있다. 
- 채널과 비슷한 `send()`를 제공하는 `ProducerScope`영역을 제공한다.

```kotlin
@Test
fun ProducerScopeTest() {
    runBlocking {
        val channel = produce {
            for( n in 1..5) {
                val square = n*n
                println("Sending $square")
                send(square)
            }
        }



        launch {
            channel.consumeEach { println("Receiving: $it") }
        }
    }

    // Sending 1
    // Receiving: 1
    // Sending 4
    // Sending 9
    // Receiving: 4
    // Receiving: 9
    // Sending 16
    // Sending 25
    // Receiving: 16
    // Receiving: 25

}
```
- 채널을 명시적으로 닫을 필요가 없다. 코루틴이 종료되면 `producer()` 빌더가 채널을 자동으로 닫는다.
- async()/await()의 정책을 따른다. 예외가 발생하면 receive()를 가장 처음 호출한 코루틴 쪽으로 예외를 떠넘긴다.


## 티커
- coroutines에는 ticker라는 특별한 랑데부 채널이 있다.
- Unit 값을 계속 발생시키되, 한 원소와 다음 원소의 발생 시점이 주어진 지연 시간만큼 떨어져 있는 스트림을 만든다.
- `ticker()`라는 함수를 호출해서 사용할 수 있다. 아래는 지정할 수 있는 옵션이다.
  1. delayMillis: 티커 원소의 발생 시간을 밀리초 단위로 지정
  2. initialDelayMillis: 티커 생성 시점과 원소가 최초로 발생하는 시점 사이의 시간 간격
  3. context: 티커를 실행할 코루틴 문맥(기본은 빈 문맥)
  4. mode: 티커의 행동
     1. TickerMode.FIXED_PERIOD: 생성되는 원소 사이의 시간 간격을 지정된 지연 시간에 최대한 맞추기 위해서 실제 지연 시간을 조정
     2. TickerMode.FIXED_DELAY: 실제 흘러간 시간과 관계 없이 delayMillis로 지정한 시간만큼 지연시킨 후 다음 원소 송신
```kotlin
@Test
fun tickerTest (){
    runBlocking {
        val ticker = ticker(100)
        println(withTimeoutOrNull(50){ ticker.receive() })
        println(withTimeoutOrNull(60){ ticker.receive() })
        delay(250)
        println(withTimeoutOrNull(1){ ticker.receive() })
        println(withTimeoutOrNull(60){ ticker.receive() })
        println(withTimeoutOrNull(60){ ticker.receive() })
    }
    //null
    //kotlin.Unit
    //kotlin.Unit
    //kotlin.Unit
    //null
}
```

## 액터
- 가변 상태를 thread-safe하게 공유하는 일반적인 방법으로 actor 모델이 있다.
- actor는 내부 상태와 다른 액터에게 메시지를 보내서 동시성 통신을 진행할 수 있는 수단을 제공하는 객체
- actor는 들어온 메시지를 listen하고 자신의 상태를 바꾸면서 메시지에 응답할 수 있으며, 다른 메시지를 자신, 다른 액터에 보낼 수 있다.
- actor 상태는 본인만 알 수 있다. 단지 상호 작용으로 알 수 있을 뿐이다.
- 코루틴의 `actor()`는 코루틴 빌더로 만들 수 있고 `ActorScope`를 만들어서 기본 코루틴 영역에 자신에게 오는 메시지에 접근할 수 있는 수신자 채널이 추가된다.
```kotlin
//Example


sealed class AccountMessage
class GetBalance (val amount: CompletableDeferred<Long>): AccountMessage()
class Deposit(val amount: Long): AccountMessage()
class Withdraw(
    val amount: Long,
    val isPermitted: CompletableDeferred<Boolean>
): AccountMessage()

fun CoroutineScope.accountManager (
    initialBalance: Long
) = actor<AccountMessage> {
    var balance = initialBalance

    for (message in channel) {
        when (message) {
            is GetBalance -> message.amount.complete(balance)

            is Deposit -> {
                balance += message.amount
                println("Deposited ${message.amount}")
            }

            is Withdraw -> {
                val canWithdraw = balance >= message.amount
                if( canWithdraw ) {
                    balance -= message.amount
                    println("Withdrawn ${message.amount}")
                }
                message.isPermitted.complete(canWithdraw)
            }
        }
    }
}

private suspend fun SendChannel<AccountMessage>.deposit(
    name: String,
    amount: Long
) {
    send(Deposit(amount))
    println("$name: deposit $amount")
}
private suspend fun SendChannel<AccountMessage>.tryWithdraw(
    name: String,
    amount: Long
){
    val status = CompletableDeferred<Boolean>().let {
        send(Withdraw(amount, it))
        if (it.await()) "OK" else "DENIED"
    }
    println("$name: withdraw $amount ($status)")
}

private suspend fun SendChannel<AccountMessage>.printBalance(
    name: String
) {
    val balance =  CompletableDeferred<Long>().let {
        send(GetBalance(it))
        it.await()
    }
    println("$name: balance is $balance")
}

@Test
fun actorTest() {
    runBlocking {
        val manager = accountManager(100)
        withContext(Dispatchers.Default) {
            launch {
                manager.deposit("Client #1", 50)
                manager.printBalance("Client #1")
            }

            launch {
                manager.tryWithdraw("Client #2", 100)
                manager.printBalance("Client #2")
            }

            manager.tryWithdraw("Client #0", 1000)
            manager.printBalance("Client #0")
            manager.close()
        }
    }
    //Client #1: deposit 50
    //Deposited 50
    //Withdrawn 100
    //Client #0: withdraw 1000 (DENIED)
    //Client #1: balance is 50
    //Client #2: withdraw 100 (OK)
    //Client #2: balance is 50
    //Client #0: balance is 50
}
```