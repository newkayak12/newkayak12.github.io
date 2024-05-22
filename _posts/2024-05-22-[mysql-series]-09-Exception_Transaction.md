
---
layout: post
categories: [APACHE]
---
from [Dictionary - Exception and Transaction](https://github.com/newkayak12/Dictionary/blob/master/sql/09.Exception_Transaction.md)


# Exception/ Transaction

## 예외처리
```sql
EXCEPTION WHEN exception1 THEN handling1
          WHEN expeption2 THEN handling2
          WHEN   OTHERS   THEN handling
```

## 트랜잭션
특정 테이블에서 데이터를 읽어 조작 후 다른 테이블에 입력하거나 갱신, 삭제하는데 처리 도중 오류가 발생하면 모든 작업을 원상태로 되돌리고, 처리 과정이 모두 성공했을 때만 최종적으로 
데이터베이스에 반영하는 것이 트랜잭션 처리이다. 
```sql
COMMIT; -- (INSERT, UPDATE, DELETE, MERGE한 결과가 commit 하지 않으면 반영되지 않는다.)
ROLLBACK; -- [WORK] [TO [SAVEPOINT] savepointName];
SAVEPOINT name; -- 트랜잭션 취소 지점을 지정할 수 있다.
```