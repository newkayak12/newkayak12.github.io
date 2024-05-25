---
layout: post

categories: [SPRING]
---



from [Dictionary - Transactional](https://github.com/newkayak12/Dictionary/blob/master/spring/22.Transactional.md)


# @Transactional
 
AOP 기반으로 동작한다. 내부적으로 `connection`을 가져와서 `auto-commit`을 비활성하고 트랜잭션을 `begin`하다.
그리고 커넥션을 한 쓰레드에서 공유할 수 있도록 `ThreadLocal`에 저장하는 트랜잭션 동기화`Transaction Synchrinization`를 진행한다. 
이러한 이유로 `parallelStream`을 사용하면 문제가 생길 수 있다.

parallelStream을 사용하면 `ForJoinPool`을 이용하기 떄문에 서로 다른 독립적인 작업이된다. 
그래서 예외가 발생해도 전체 데이터가 롤백이 되지 않는다. 

더 심각한 부분은 각 쓰레드에서 DB 커넥션을 획득하려고 시도한다는 점이다. 이는 커넥션 풀을 빠르게 갉아 먹는다.


## 우선순위
1. 클래스 메소드
2. 클래스 선언부
3. 인터페이스 메소드 
4. 인터페이스 선언부 

## 모드
1. ProxyMode
    - 반드시 public
    - `protected`, `private`에 선언된다고 하면 에러도 없고 실행도 없다.
2. AspectJMode