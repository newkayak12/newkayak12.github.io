---
layout: post
title: "[미니 프로젝트] 11 동시성 이슈"
tags:
  - MINI_PROJECT
  - BOOK
categories:
  - MINI_PROJECT
  - BOOK
---
> - [일전의 공부한 내용](./rollup-2025-01.firstHalf.html)을 실제로 구현해보면서 공부해보고자 시작한 프로젝트다.
> - [이전 글](https://newkayak12.github.io/mini_project/book/2026/01/04/mini-project-11-Batch.html)
> - 아직 공부 중인 개념입니다. 조금 틀려도 너른 이해 부탁드립니다!
> - 이 글은 개인적인 의견을 다룹니다.

# 다루는 내용
- 동시성 이슈에 분산락을 적용하면서

---
# 동시성 이슈에 분산락을 적용하면서

## 목차
### 1. 동시성 이슈?
### 2. 그냥 진행하면?
### 3. SELECT FOR UPDATE? IsolationLevel=Serializable?
### 4.  단순 Redis 사용
### 5. Redisson을 사용한 분산락

### 6. 결과적으로?


---
## 1. 동시성 이슈?
- 예약을 다루는 서비스를 개발하면서 피할 수 없는 것이 바로 동시성 이슈일 것이다.
- 한정된 리소스에 동시에 접근하는 경우 overbooking이 벌어질 수도 있다. 이는 예상컨데 도메인 특성상 꽤나 큰 문제가 될 것으로 보인다.
	- 정확성: 한정된 슬롯에 overbooking이 벌어지면 안된다.
	- 공정성: 선입선출, 먼저 요청한 사용자의 요청이 먼저 처리되어야 공정하다.
	- 안정성: 순간적으로 몰리는 대량의 요청에도 시스템이 안정적으로 버틸 수 있어야 한다.

## 2. 그냥 진행하면?
- 만약 그냥 진행한다면 **Race Condition**에 놓이며 한정된 리소스에 대한 점유가 중복으로 벌어질 것이 뻔하다.

## 3. SELECT FOR UPDATE? IsolationLevel=Serializable?

**SELECT FOR UPDATE를 사용하면?** 
#### 1. SELECT FOR UPDATE
- SELECT FOR UPDATE는 **비관적 잠금(Pessimistic Lock) 메커니즘**이다.
	- 조회한 row에 XLock(Exclusive Lock)을 설정한다.
	- 트랜잭션 롤백/ 커밋 시까지 다른 트랜잭션의 읽기/ 쓰기 차단
	- WHERE 조건의 인덱스 범위 만큼 잠근다.
	- 인덱스가 없다면 전체를 잠글 수도 있다.
	- 범위 조회시 Gap Lock으로 간격도 잠글 수 있다.
	- 락 대기 시간이 응답 시간에 누적된다.
-  응답 시간이 느려지며, 이 때문에 Connection Pool 고갈이 심해질 수도 있다.
- 심각하면 DeadLock이 발생할 수도 있다.


**Isolation Level을 Serializable로 높이면?**

#### 2. IsolationLevel=Serializable
- 가장 높은 격리 수준이다.
	- 트랜잭션들이 완전히 순차 실행되는 것처럼 동작한다.
	- DIrty Read, Non-Repeatable Read, Phantom Read 등 방지할 수 있다.
	- 모든 SELECT가 자동으로 SharedLock을 획득
	- 읽는 범위에 GapLock  설정
- 처리량이 급감하고 대기 시간이 증가한다.
- 전체 테이블을 잠그며 다른 시간대 처리도 블록된다.
- 데드락 위험이 높아진다.


## 4.  단순 Redis 사용
- Redis의 원자성을 사용한 방법이다.
	- SETNX, `setIfAbsent`로 처리하여 키가 없는 경우에만 작업을 처리하게 한다.
	- 성능적으로 이득을 볼 수 있으며, Redis가 단일 장애점이 되지 않는 이상 분산 환경에서도 율히하게 작동한다.
- 단, 요청 순서에 대한 보장이 어렵다. 이 부분은 도메인적으로 굉장히 치명적이다.

## 5. Redisson을 사용한 분산락
- Redisson은 단순히 RedisClient를 넘어 고수준 분산 객체 등의 유틸리티를 제공한다.
	- Redis를 유틸리티라는 의도에 맞게 락, 컬렉션, 동기화 도구로 편리하게 사용할 수 있게 해준다.
	- 고수준 분산 객체 : `RLock`, `RReadWriteLock`, `RSemaphore`, `RateLimiter` 등이 있다.
	- Jedis,Lettuce와 다른 시스템 유틸리티를 포함한 라이브러리다.
- 위의 여러 가지 한계를 감안하여 Redisson을 이용하여 해결하기로 결정했다.

```kotlin
@RateLimiter(  
    key = RATE_LIMITER_SP_EL_KEY,  
    type = RateLimitType.WHOLE,  
    rate = RATE_LIMITER_CAPACITY,  
    maximumWaitTime = RATE_LIMIT_MAXIMUM_WAIT_TIME,  
    rateIntervalTime = RATE_LIMITER_RATE_INTERVAL,  
    bucketLiveTime = RATE_LIMITER_DURATION,  
)  
@DistributedLock(  
    key = DISTRIBUTED_LOCK_SP_EL_KEY,  
    lockType = LockType.FAIR_LOCK,  
    waitTime = FAIR_LOCK_MAXIMUM_WAIT_TIME,  
    waitTimeUnit = TimeUnit.MINUTES,  
)  
@Transactional  
override fun execute(command: CreateTimeTableOccupancyCommand): Boolean {  
    val key = key(command.restaurantId, command.date, command.startTime)  
  
    try {  
        val list = loadBookableTimeTables(command)  
        acquireSemaphore(key, list.size)  
        val domainEvent = saveOccupancy(command.userId, list)  
  
        return saveToOutBoxAndPublish(domainEvent)  
    } catch (e: ClientException) {  
        when (e) {  
            is AllTheThingsAreAlreadyOccupiedException -> throw e  
            is AllTheSeatsAreAlreadyOccupiedException -> throw e  
            else -> {  
                releaseSemaphore(key)  
                throw e  
            }  
        }  
    } catch (e: DataIntegrityViolationException) {  
        releaseSemaphore(key)  
        throw e  
    }  
}
```
1. 분산락을 Annotation을 기반으로 적용하며 `Transactional` 보다 앞서 실행할 수 있게 구성한다. 내부적으로 `FairLock`을 구현하여 진입 자체를 공정하게 진행할 수 있게 한다.
2. 내부적으로 예약 가능한 수량을 확인하고 `Semaphore`로 한정된 수만 진입할 수 있게 하여 예약 프로세스를 진행한다. 혹여 Exception이 발생하면 Semaphore를 반환하고 다음 사용자가 점유할 수 있게 한다.
3. RateLimiter를 Annotation을 기반으로 적용하며, 절대적인 방어책은 아니지만 (물론 인프라 레벨에서 일차적으로 처리해야 한다.) `traffic spike`로부터 시스템을 보호할 수 있도록 장치를 마련한다.


## 6. 결과적으로?
1. 하나의 솔루션으로 완벽하게 모든 문제를 해결할 수 없다. 여러 가지 적절한 메커니즘을 통해서 문제를 점진적으로 해결해야 한다
2. 분명 분산락 처리를 진행하면서 성능적 손실이 있었다. 다만, 성능과 목표하는 바 간의 trade-off를 잘 계산해서 최적의 접근법에 도달해야 한다.