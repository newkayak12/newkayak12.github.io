---
layout: post
categories: [MYSQL, SUMMARY]
---


# Lock

동시성을 제어하기 위한 기능이다. 여러 커넥션에서 동시에 동일한 자원을 요청하면 한 시점에 하나의 커넥션만 변경할 수 있게 해주는 역할을 한다.

## MySQL 엔진 잠금

스토리지 엔진/ MySQL 엔진 레벨로 나뉜다. MySQL 엔진 레벨 잠금은 모든 스토리지 엔진에 영향을 미친다. 그러나 스토리지 엔진 레벨의 잠금은
스토리지 엔진 간 상호 영향을 미치지는 않는다. 

이외에도 테이블 데이터 동기화를 위한 테이블 락, 테이블 구조를 잠그는 `MetaDataLock`, 사용자의 필요에 맞춰서 잠글 수 있는 `NamedLock`이 제공된다.


### 글로벌 락
GlobalLock은 `FLUSH TABLES WITH READ LOCK`으로 획득할 수 있다. MySQL 락 범위 중 가장 크다. 한 세션에서 획득하면
DDL, DML 모두 락이 해제될 때까지 대기 상태가 된다. 

### 테이블 락
개별 테이블 단위로 설정되는 잠금이며, 명시/ 묵시로 테이블 락을 획득할 수 있다. `LOCK TABLES table_name [READ | WRITE]`로 획득할 수 있다.
`UNLOCK TABLES`로 반납할 수 있다. InnoDB는 스토리지 엔진 차원에서 레코드 기반 잠금을 제공하기에 단순 변경으로 락이 묵시적으로 설정되지는 않는다.

### 네임드 락
`GET_LOCK()`으로 획득하며 문자열에 대한 잠금을 설정할 수 있다. 대상이 테이블, 레코드, AUTO_INCREMENT가 아닌 문자열에 건다. 상호 동기화에 사용한다.

````sql
SELECT GET_LOCK('LOCK', 2);
SELECT IS_FREE_LOCK('LOCK')
````

### 메타 데이터 락
MetaDataLock은 데이터 베이스 객체(Table, view)의 이름이나 구조를 변경하는 경우에 획득하는 잠금이다. 명시적으로 획득할 수 는 없고
`Rename Table a to b;`와 같이 이름을 변경하는 경우 자동 획득된다. 


## InnoDB 스토리지 엔진 잠금
스토리지 내부 레코드 기반 잠금을 채택하고 있다. MySQL `information_schema`의 `INNODB_TRX`, `INNODB_LOCKS`, `INNODB_LOCKS_WAITS`라는
테이블을 조인해서 조회하면 언제 어떤 트랜잭션이 잠금을 대기하고 있고 해당 잠금을 어느 트랜잭션이 가지고 있는지 확인할 수 있으며, 장시간 잠금을
획득하고 있는 경우 종료시킬 수도 있다. 

레코드 기반 잠금을 제공하므로 레코드 락이 페이지 락으로, 또는 테이블 락으로 `락 에스컬레이션`하는 경우는 없다. 또한 특이하게 레코드 락 뿐만 아니라
레코드-레코드 사이인 `gap`을 잠구는 `갭 락`이 존재한다.

### 레코드 락
record 자체만 잠그는 것을 레코드 락(record lock, Record only lock)이라고 한다. 특이한 점은 InnoDB는 레코드가 아닌 레코드 인덱스의 레코드르 잠근다.

### 갭 락
MySQL은 또 특이하게 레코드와 인접한 레코드 사이의 간격을 잠근다. 이 사이에 무엇인가 생성되는 것을 제어하는 것이다.

### 넥스트 키 락
레코드락 + 갭 락을 합쳐 놓은 형태의 잠금을 넥스트 키 락이라고 한다. 목적은 레플리케이션을 위한 것이다. 쿼리가 레플리카에서 실행될 때 소스에서 
만든 결과와 동일한 결과를 보장하는 것이 주 목적이다. 그러나 넥스트 키 락과 갭 락으로 인해 데드락이 발생하거나 다른 트랜잭션을 기다리게 하는 일이
자주 발생한다. 

### AUTO_INCREMENT 락
인조 키를 채번하기 위해서 거는 락이다. UPDATE, DELETE가 아닌  INSERT, REPLACE에 걸린다. AUTO_INCREMENT를 가져오는 순간 락이 걸렸다 풀린다.

- innodb_autoinc_lock_mode=0 : Insert문장에 autoinc_lock을 건다.
- innodb_autoinc_lock_mode=1 : Insert되는 레코드 건 수를 예측할 수 있다면 latch를 이용해서 처리한다. 
- innodb_autoinc_lock_mode=2 : 절대 autoinc_lock을 걸지 않는다. 래치만을 사용한다. 

### 인덱스와 잠금

InnoDB는 레코드를 잠그지 않는다. 인덱스를 잠그는 방식으로 사용한다. 즉, 변경할 레코드를 찾기 위해서 검색한 인덱스의 레코드를 모두 락을 걸어야 한다.

>
> index는 name에만 걸려있다고 하면
> 
> select count(*) from tblEmployee where name = "KIM" ==> 200 rows
> select count(*) from tblEmployee where name = "KIM" and age = 10 ==> 1 rows
> 
> update tblEmployee
> set gender = "M"
> where name = "KIM" and age = 10
> 
> 이러면 age에 인덱스가 없어서 200개가 락이 걸린다.


[//]: # (https://velog.io/@soyeon207/DB-Lock-%EC%B4%9D%EC%A0%95%EB%A6%AC-1-InnoDB-%EC%9D%98-Lock)
