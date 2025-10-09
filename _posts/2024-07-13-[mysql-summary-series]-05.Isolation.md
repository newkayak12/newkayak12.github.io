---
layout: post
categories: [MYSQL, SUMMARY]
---


# Isolation

MySQL 트랜잭션 격리 수준은

- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE


로 나뉜다. 격리 수준이 높아질 수록 비례해서 꼭 동시성이 낮아지는 건 아니다. 다만 `SERIALIZABLE`이 아니라면 말이다.

|                  | DIRTY READ | NON-REPEATABLE READ |      PHANTOM READ      |
|:----------------:|:----------:|:-------------------:|:----------------------:|
| READ UNCOMMITTED |     O      |          O          |           O            |
|  READ COMMITTED  |     X      |          O          |           O            |
| REPEATABLE READ  |     X      |          X          | O (innoDB Partially X) |
|   SERIALIZABLE   |     X      |          X          |           X            |


## 1. READ UNCOMMITTED(커밋 안된 것도 읽음)
SELECT 시에 DIRTY CHECK를 한다. InnoDB는 MVCC를 지원한다. 버퍼풀에 변경된 내용을 먼저 쓰고, 커밋이 되기 전까지는 UNDO에서 읽어서
원자성을 보장하는 식으로 동작한다.

그런데 이 단계에서는 UNDO를 읽는게 아니라 바로 버퍼풀을 읽는 식으로 동작한다. (이를 `DirtyRead` 라고 한다.)

## 2. READ COMMITTED(커밋 된 것만 읽음)

대부분 DBMS의 기본 격리 수준이다. `DirtyRead`는 없다. 대신 `NON-REPEATABLE READ`는 어쩔 수 없다.
다른 트랜잭션에서 update 등을 실행 앞 뒤로 Select 하는 경우 값이 변경되어 있을 수가 있다. `항상 같은 값을 가져와야 한다`는 부분에 위배된다.

예를 들어 계속 변경되는 테이블이 있고 이 정보로 통계를 내야 한다면 문제가 될 수 있다. 

### 3. REPEATABLE READ(반복 읽기) 
`REPEATABLE READ`는 SELECT 등을 트랜잭션 범위 내로 가둬서 실행한다. InnoDB의 기본 격리 수준이다. `READ COMMITTED`와 같은 원리를 사용해서
이를 보장한다. (MVCC) 차이가 있다면 언두 영역에 있는 백업본을 얼만큼 깊게 들어가냐의 차이가 있다. InnoDB 트랜잭션은 고유 값이 있다.
언두 영역에 백업된 모든 레코드에는 변경을 발생시킨 트랜잭션 번호를 포함한다. 

REPEATABLE READ는 현재 러닝 중인 가장 오래된 트랜잭션 번호보다 트랜잭션 번호가 앞선 언두 영역의 데이터는 삭제할 수 없다. 이래야 가장 오래된
트랜잭션 번호가 변경하고 있는 내역을 다른 트랜잭션이 보지 못하게 할 수 있기 때문이다. 물론 아예 안 지우는 건 아니다.

결론적으로 이 단계를 채택하면 언두에 같은 레코드라고 해도 여러 백업 본 중 오래된 것을 더 깊숙히 찾아서 조회한다는 것이 된다. 이러면 트랜잭션을 
열고 닫지 않으면 무제한적으로 언두가 늘어날 수 있음을 의미하기도 한다.

물론 여기서도 문제가 생길 수 있다. (PHANTOM READ)

### 4. SERIALIZABLE
REPEATABLE READ에서는 [TRXID-1] SELECT -> [TRXID-2] INSERT...,  COMMIT-> [TRXID-1] SELECT 
의 경우에 PHANTOMREAD가 생한다. 이는 SELECT 레코드에 잠금을 걸고 언두는 걸지 못하기 때문에 발생하는 문제다.

예를 들어서 `SELECT * FROM A WHERE ID > 100 FOR UPDATE;`를 실행하면 ID가 100이상인 레코드에 잠금을 건다. 만약 101이 없고 102만 있다고 하면
100, 102가 잠금 대상이다. 이 때 101에 잠금이 없기에 101로 INSERT하면 막을 수 없다.
InnoDB는 `Next-Key-Lock ( GapLock + RecordLock)`으로 `REPEATABLE READ`에서도 이를 방지할 수 있다. 

SERIALIZABLE에서는 읽기 도 공유 잠금을 걸어야 하고 동시에 다른 트랜잭션이 레코드를 변경하지 못하게 된다. 즉, 한 트랜잭션에서 레코드를 읽고 쓰는 동안
 다른 트랜잭션에서는 해당 레코드에 접근하지 못하게 된다.

그런데 유일하게 `SELECT ...  FOR UPDATE`, `SELECT ... FOR SHARE` 경우에는 MySQL도 Phantom read가 발생한다.

> setup
> ```sql
> create table user (
>     id bigint primary key auto_increment,
>     name varchar(32)
> );
> insert into user (name) values ('lambert');
> ```
> 
> trx1
> ```sql
> set transaction isolation level repeatable read;
> start transaction ;
> 
> update user set name = 'glen' where id = 1;#2
> commit;#3
> 
> ```
> 
> trx2
> ```sql
> set transaction isolation level repeatable read ;
> start transaction ;
> select * from user;#1 // lambert
> select * from user;#4 // lambert
> commit;
> ``` 
> 
> 이래도 #1, #4에서는 일관적으로 lambert가 출력된다.

그런데?
> setup
> ```sql
> create table user (
>     id bigint primary key auto_increment,
>     name varchar(32)
> );
> insert into user (name) values ('lambert');
> ```
> trx1
> ```sql
> set transaction isolation level repeatable read;
> start transaction ;
> insert into user (name) values ('jonhs'); #2
> commit;#3
> 
> ```
> 
> trx2
> 
> ```sql
> set transaction isolation level repeatable read ;
> start transaction ;
> select * from user;#1 // lambert
> update user set name = 'geralt' where name = 'jonhs';#4
> select * from user;#5 // lambert/geralt
> commit;
> 
> ```
> 
> 이러면 업데이트도 되고 select도 된다.


Update할 때가 문제다. 
1. `Update`를 하면 락이 걸린다.
2. 언두 로그는 락을 걸 수 없기에 테이블에 쓰기락을 걸고 바꾼다.
3. Update가 반영되어 언두 로그에 자신의 트랜잭션 번호로 Update로그가 남는다.
4. SELECT하면 자신의 트랜잭션 번호이므로 읽어 온다.
5. PhantomRead!
