
---
layout: post
categories: [OTHERS]
---
from [Dictionary - Transaction](https://github.com/newkayak12/Dictionary/blob/master/cs/Transaction.md)




# 트랜잭션

격리 수준은 `SERIALIZABLE`, `REPEATABLE_READ`, `READ_COMMITTED`, `READ_UNCOMMITTED`가 있으며, 왼쪽으로 가면 갈수록 격리성이 강해지며, 
오른쪽으로 가면 갈수록 동시성이 강해진다.

`REPEATABLE_READ`는 팬텀리드, `READ_COMMITTED`는 팬텀리드, 반복 가능하지 않은 조회가 발생하며, `READ_UNCOMMITTED`는 팬텀 리드, 반복 가능하지 않은
조회, 더티 리드가 발생할 수도 있다. 

## 격리 수준에 따라 발생하는 현상
1. 팬텀 리드 (Phantom read) : 한 트랜잭션 내에서 동일한 쿼리를 보냈을 때 해당 조회 결과가 다른 경우를 말한다. 
2. 반복 가능하지 않은 조회 (Non-repeatable read) : 한 트랜잭션 내의 같은 행이 두 번 이상 조회가 발생했는데, 그 값이 다른 경우를 가리킨다. 
3. 더티 리드 (dirty read) : 반복 가능하지 않은 조회와 유사하며, 한 트랜잭션이 실행 중일 때 다른 트랜잭션에 의해 수정되었지만 `아직 커밋되지 않은` 행의 데이터를 읽을 수 있을 때 발생

## 격리 수준
1. Serializable : 트랜잭션을 순차적으로 진행시키는 것을 의미한다. 여러 트랜잭션이 동시에 같은 행에 접근할 수 없다. 
2. Repeatable_read : 하나의 트랜잭션이 수정한 행을 다른 트랜잭션이 수정할 수 없도록 막아주지만, 새로운 행을 추가하는 것을 막아주지는 않는다. 
3. Read_committed : 기본 값이다. read_uncommitted와 다르게 다른 트랜잭션이 커밋하지 않은 정보는 읽을 수 없다. 즉, 커밋 완료된 데이터에 대해서만 조회를 허용한다. 하지만 어떤 트랜잭션이 접근한 행을 다른 트랜잭션이 수정할 수는 있다.
4. read_uncommitted : 가장 낮은 격리 수준으로 하나의 트랜잭션이 커밋되기 이전에 다른 트랜잭션에 노출되는 문제가 있지만 가장 빠르다. 