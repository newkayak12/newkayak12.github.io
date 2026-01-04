---
layout: post
title: "[미니 프로젝트] 11 Batch"
tags:
  - MINI_PROJECT
  - BOOK
categories:
  - MINI_PROJECT
  - BOOK
---
> - [일전의 공부한 내용](./rollup-2025-01.firstHalf.html)을 실제로 구현해보면서 공부해보고자 시작한 프로젝트다.
> - [이전 글](https://newkayak12.github.io/mini_project/book/2025/08/22/mini-project-10-featureFlag.html)
> - 아직 공부 중인 개념입니다. 조금 틀려도 너른 이해 부탁드립니다!
> - 이 글은 개인적인 의견을 다룹니다.

# 다루는 내용
- feature flag 적용

---
# Spring batch를 적용하면서 
  
## 목차  
### 1. 왜 feature flag를 고민했는가?
### 2. 어떻게 동작하게 할 것인가?
### 3. 반복 호출에 따른 캐싱과 실패 시 전략
### 4. Spring-Retry
### 5.  Resilience4J 
### 6. 한가지 더!



---


## 1. 왜 feature flag를 고민했는가?

1. `if-else
   코드 내 `if-else`로 기능을 분기하는 식으로 진행하면 코드의 가독성, 복잡성이 떨어질 뿐만 아니라 유지보수성에 막대한 손해가 된다. 코드 내 `if-else`....로 하는 것 자체가 코드를 파악하기 어렵게 한다. 혹은 `strategy` 패턴으로 runtime에 선택할 수 있게 구성한다고 해도 feature의 실행 여부를 조정한다는 목적에는 부합하지 않는 것으로 보였다.
   
2. 횡단 관심사  
   '기능을 실행하는가 아닌가?'라는 횡단 관심사로 나누면 비즈니스 로직은 로직대로 횡단 관심사는 관심사대로 진행할 수 있다. 이렇게 "관심사를 분리하고 각 영역에 충실하게 하면 확실하게 area가 나뉘어 좋지 않을까?" 하는 생각이 들었다.

## 2. 어떻게 동작하게 할 것인가?

1. 기능의 on-off
   일단, feature flag 라는 이름에 충실하게 기능을 켜고 끄는 것에 초점을 둘 것이다.
```kotlin
@Target(FUNCTION)  
@Retention(RUNTIME)  
annotation class FeatureFlag(  
    val featureFlagType: FeatureFlagType = BACKEND,  
    val featureFlagKey: String,  
)
```
기능의 대상, 기능 키를 두어 `Backend`, `Frontend`   를 구분하도록 했으며, 선언한 Key를 바탕으로 feature를 식별하여 켜고 끌 수 있게 고안하였다.

2. Aspect 구현
```kotlin
@Around("@annotation(featureFlag)")  
fun executeFeatureFlagAction(  
    proceedingJoinPoint: ProceedingJoinPoint,  
    featureFlag: FeatureFlag,  
): Any? {  
	val result = verifyFeatureFlag(featureFlag)  
	return if (result) {  
		proceedingJoinPoint.proceed()  
	} else {  
		// throw!
	}  
}
```
`@Around`로 두고 기능 실행 여부를 확인하여 실행할 필요가 있다면 진행하고 그렇지 않다면 `throw` 하게 한다.
   
3. runtime 비활성화를 위한 Database 사용
```kotlin
private fun fetchFromDatabase(request: FindFeatureFlagQuery): FindFeatureFlagQueryResult {  
    val inquiry = request.toInquiry()  
    val failOver = request.failOver()  
  
    return findFeatureFlagRepository.query(inquiry)?.toQuery()  
        
}
```
저장한 데이터를 바탕으로 리턴한다.

4. Database 부하를 감소시키기 위한 Redis Cache
```kotlin
private fun fetchFromRedis(request: FindFeatureFlagQuery): FindFeatureFlagQueryResult {  
    val inquiry = request.toInquiry()  
  
    return fetchFeatureFlagTemplate.query(inquiry)  
        ?.toQuery()  
        ?: fetchFromDatabaseAndSaveAtRedis(request)  
}
```
Redis에 최초에 방문하여 확인한 후 없으면 데이터베이스에서 조회하여 저장하도록 한다. 물론 `Spring-Cache`에서 제공하는 `@Cacheable` 이 있지만 문제는 Redis에 장애가 발생했을 때 문제가 된다. 또한 `Cache Stampede`에 대한 대응이 따로 없다. 이러한 이유로 직접 구현하는 것이 좋다고 판단하였다.

> **Cache Stampede**
> - 캐시가 만료되는 순간 동시 다발적으로 DB를 조회하고 캐시를 업데이트하는 현상이다.
> - 해결 전략으로 최초 갱신 요청만 진행하는 방법
> - 확률적으로 조기 갱신하는 방법
> - 캐시 자체를 영구적으로 두거나 일정 텀을 두고 백그라운드로 갱신하는 방법이 있다.

## 3. 반복 호출에 따른 캐싱과 실패 시 전략

1. Redis의 장애를 대비한 Database failover 전략
```kotlin
@Retryable(  
    retryFor = [InvalidRedisStatusException::class],  
    maxAttempts = 5,  
    backoff = Backoff(delay = 100, multiplier = 2.0, maxDelay = 2000),  
    listeners = ["listenRetryReason"],  
    stateful = false,  
)  
override fun execute(request: FindFeatureFlagQuery): FindFeatureFlagQueryResult =  
    fetchFromRedis(request)
```
위와 같이 `Spring-retry`를 구현하여 반복하여 실행할 수 있도록 한다. 최대 5회 재시도하며 재시도 간격을 지수적으로 증가시키며 진행한다.

> `stateful`에 대해서 언급하자면 stateful를 `false`로 두면 상태를 메모리에 보관하여 한 번의 메소드 호출 내에서 모든 재시도를 완료하도록 구성되어 있다. 
> 그러나 `true`로 두면 상태를 외부에 보관하게 하며, 여러 번의 메소드 호출에 걸쳐서 재시도를 진행해야 한다. 

```kotlin
@Recover  
@Transactional(readOnly = true)  
fun executeWithDatabase(  
    @Suppress("UNUSED_PARAMETER") exception: InvalidRedisStatusException,  
    request: FindFeatureFlagQuery,  
): FindFeatureFlagQueryResult = fetchFromDatabase(request)
```
결과적으로는 `Spring-retry`의 `@Recover`를 두고 간단하게  Redis ➡️ DB 로 failover를 하도록 진행했다.  Redis가 모종의 이유(간헐적 통신 문제, Redis 장애)로 발생한 장애에 대한 대응이므로 'Slack' 등으로 알람이가게 하여 개발자가 빠르게 반응하게 하면 좋을 것으로 보였다.

2.  Database 장애 시 대응 전략
```kotlin
private fun FindFeatureFlagQuery.disabled() =  
    FindFeatureFlagQueryResult(  
        id = FAIL_OVER_ID,  
        featureFlagType = this.featureFlagType,  
        featureFlagKey = this.featureFlagKey,  
        isEnabled = DISABLED,  
    )
```
데이터베이스 장애시 feature flag에 Null일 경우 값을 생성하고 `isEnabled` 항목을 `false`를 둬서 보수적으로 기능을 실행하지 못하게 막았다. 물론 무조건 `false`로 두는 것이 정상이 아닐 수도 있지만 비정상 상황에서 기능을 멈추고 운영적으로 확인하여 대응하는 것이 우선이라는 생각이 들었다.


3. Cache Stamped
```kotlin
// FindFeatureFlagService
private fun fetchFromDatabaseAndSaveAtRedis(  
    request: FindFeatureFlagQuery,  
): FindFeatureFlagQueryResult {  
    val fetchFromDB = fetchFromDatabase(request)  
  
    saveFeatureFlagTemplate.command(  
        SaveFeatureFlagInquiry(  
            id = fetchFromDB.id,  
            featureFlagType = fetchFromDB.featureFlagType,  
            featureFlagKey = fetchFromDB.featureFlagKey,  
            isEnabled = fetchFromDB.isEnabled,  
        ),  
    )  
  
    return fetchFromDB  
}

// SaveFeatureFlagTemplate
override fun command(inquiry: SaveFeatureFlagInquiry): Boolean {  
    try {  
        val opsForValue = featureFlagRedisTemplate.opsForValue()  
        val key = inquiry.toKey()  
        val value = inquiry.toValue()  
        return opsForValue.setIfAbsent(key, value, DURATION_MINUTES, MINUTES)  
            ?: throw RedisCommandExecutionException("$REDIS_COMMAND_EXCEPTION_MESSAGE: $key")  
    } catch (_: RedisException) {  
        throw InvalidRedisStatusException()  
    }  
}
```

## 4.  Spring-Retry

Spring retry의 [document](https://docs.spring.io/spring-batch/docs/4.2.x/reference/html/retry.html#statefulRetry)를 일부 발췌하여 작성하면 아래와 같다.

#### Stateless
- 간단하게, looping을 통해서 retry를 진행한다. 
- 실행되거나 결과적으로 실패하는데 `RetryTemplate`을 통해서 진행한다.
- 실패 상태는 stack에 쌓이며 다른 영역에 전역적으로 쌓여 관리되지는 않는다.
- stateless는 항상 같은 thread에서 재시도를 진행한다.
#### Stateful
- `Transactional`  리소스가 invalid  될 때 사용한다 transaction rollback이 필요한 상황에서 사용한다.
- Stack에서 Heap으로 context가 이동한다.
- cluster cache를 구현할 수 있다.


## 5.  Resilience4J 

- 초기에는 Resilience4J를 고려했었다. Circuit Breaker 패턴으로 `OPEN`, `HALF_OPEN`, `CLOSED`를 가지도록 하여 feature 장애 시 빠르게 전파하여 `off`로 둘 수 있을 것으로 보였다.
- 그러나 In-memory로 상태를 관리하여 State를 연동하기 위한 별도 로직을 구현해야 한다는 점이 문제점이 됐다.
- 또한 feature flag를 단순 기능 제어 용도가 아닌 용도로 사용해야 할 때 문제가 될 것으로 보였다.
### 6. 한가지 더!
- 추가적으로 구상한 내용은 A/B 테스트 용도로 feature flag를 사용하는 것이다.
  ![](/assets/img/ab.png)
- 사용자, 사용자 그룹 등을 추가하고 복잡하게는 A/B를 위한 Strategy를 구성하여 "단순 기능적인 목표가 아닌 **비즈니스적인 목표**를 달성하기 위한 수단으로 사용할 수 있지 않을까?" 하는 생각이 들었다.

