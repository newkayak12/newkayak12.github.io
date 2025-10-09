# ONLINE_DDL

온라인에서 스키마 변경은 주저할만한 일이 맞지만, 일단 ALGORITHM, LOCK 옵션으로 어떤 모드로 스키마 변경을 진행할지 결정할 수 있다.

- ALGORITH=INSTANT : 테이블 데이터 변경 없이 메타데이터만 변경하고 작업을 완료한다. 테이블 읽고 쓰기는 대기하지만 스키마 변경 시간이 매우 짧이서 문제가 되지 않을 수준이다.
- ALGORITH=INPLACE : 임시테이블로 데이터로 복사하고 스키마를 변경한다. 필요에 따라 테이블 리빌드가 필요할 수도 있다.
- ALGORITH=COPY : 변경된 스키마를 적용한 임시 테이블을 생성하고, 레코드를 모두 복사하고 임시테이블을 RENAME 해서 스키마 변경을 완료한다.

- LOCK=NONE   : 아무런 잠금을 걸지 않음
- LOCK=SHARED : 읽기 잠금을 건다. (읽기는 가능, 쓰기는 불가)
- EXCLUSIVE   : 쓰기 잠금을 건다. (읽기, 쓰기 불가)

## INPLACE
임시테이블로 레코드를 복사하지 않더라도 내부적으로 테이블의 모든 레코드를 리빌드해야 하는 경우가 많다.

1. INPLACE로 변경 지원되는 엔진인지 확인
2. 스키마 변경 준비 (변경 동안 데이터 추적 준비)
3. 변경 및 새로운 DML 로깅
4. 로그 적용
5. INPLACE 종료

## 모니터링
ONLINE DDL을 포함한 ALTER TABLE 명령은 모두 performance_schema를 통해서 진행 상황을 모니터링할 수 있다.

## 데이터베이스 관련 명령어
1. SHOW DATABASES;
2. USE [dbName]
3. ALTER DATABASE [dbName] CHARACTER SET='utf8mb4';
4. DROP DATABASE [IF EXISTS] [dbName]

### 테이블 스페이스 변경
MySQL은 전통적으로 테이블별 전용 테이블 스페이스를 사용했다. InnoDB 테이블 스페이스(ibdata1)만 제너럴 테이블스페이스(여러 테이블 데이터를 한꺼번에 저장하는 테이블스페이스)를 사용했다.
8.0부터는 제네럴테이블 스페이스로 사용자 테이블을 저장하는 기능이 추가됐다. 그러나 몇 가지 제약을 가지게 된다.

1. 파티션 테이블은 GeneralTableSpace를 사용하지 못한다.
2. 복제소스, 레플리카 서버가 동일 호스트에서 실행되는 경우 `ADD DATAFILE` 사용 불가
3. 테이블 암호화는 테이블 스페이스 단위로 설정
4. 테이블 압축 가능 여부는 테이블스페이스의 블록 사이즈, InnoDB 페이지 사이즈에 의해서 결정됨
5. 특정 테이블을 삭제해도 디스크 공간이 반납되지 않음

그럼에도

1. 제네럴 테이블스페이스를 사용하면 파일 핸들러(Open file descriptor)를 최소화
2. 테이블스페이스 관리에 필요한 메모리 공간을 최소화

### 테이블 구조 조회
테이블 구조 조회는

1. `SHOW CREATE TABLE`
2. `DESC`
로 두 가지가 있다. `SHOW CREATE TABLE`는 최초 테이블 생성 때 사용한 내용을 그대로 보여주는 것은 아니다. `SHOW CREATE TABLE`는 컬럼명, 인덱스, FK 등을 동시에 보여준다.
`DESC`는 `DESCRIBE`의 약어 형태의 명령으로 둘 모두 같은 결과를 보여준다.

### 테이블 구조 변경
`ALTER TABLE`은 테이블 자체의 속성을 변경할 수 있을뿐만 아니라 인덱스의 추가/삭제 컬럼 추가/삭제 용도로 사용된다.

### 테이블명 변경
`RENAME TABLE [A] TO [B]`로 변경할 수 있다. 다른 DB로 테이블을 이동할 때도 사용할 수 있다. 스키마를 변경하지 않는다면 메타 정보만 변경하지만
스키마 이동을 하면 메타정보와 테이블이 저장된 파일까지 다른 디렉토리로 이동해야 한다.

### 테이블 상태 조회
MySQL의 테이블은 만들어진 시간, 대략의 레코드 건수, 데이터 파일의 크기 등의 정보를 가지고 있다. 파일의 버전, 레코드 포맷 등과 같은 정보도 가지고 있다.
`SHOW TABEL STATUS LIKE [tableName];`로 조회할 수 있다. 혹은
```mysql
SELECT * FROM information_schema.TABLES
WHERE TABLE_SCHEMA='tableName' 
AND TABLE_NAME='tableName';
```

로 조회할 수 있다. `information_schema`에 스키마들에 대한 메타 정보를 가진 딕셔너리 테이블이 관리된다. `information_schema`는 실제 존재하는 테이블이 아니라.
메모리에 모아두고 참조할 수 있는 테이블이다.

1. DB 객체에 대한 메타 정보
2. 테이블과 컬럼에 대한 간략한 통계정보
3. 전문 검색 디버깅을 위한 뷰
4. 압축 실행과 실패 횟수에 대한 집계 정보

### 테이블 구조 복사
테이블 구조는 같지만 이름만 다른 테이블을 생성할 때는 `SHOW CREATE TABLE`로 DDL을 조회하고 만들거나 `CREATE TABLE ... AS SELECT ... LIMIT 0`으로 메타데이터만 긁어서 만들 수도 있다.
`CREATE TABLE ... AS SELECT ... LIMIT 0` 는 인덱스가 생성되지 않는다는 장점이 있다. 추가로 `CREATE TABLE ... LIKE ~`를 사용하면 구조만 복사할 수도 있다.
데이터도 복사하려면 `INSERT ... SELECT` 도 실행하면 된다.


### 테이블 삭제
테이블 삭제는 파일 삭제를 수반한다. 만약 클러스터링 되어 있다면 읽고 쓰기 작업이 필요하다. ONLINE DDL 로 DELETE를 했는데 만약 용량이 큰 테이블이라면
쿼리 성능에 영향을 미칠 가능성이 높다. 추가로 `AdaptiveHashIndex`를 사용했다면 이 인덱스도 모두 삭제해야 한다. 그러면 이 또한 서버에 부하를 주기 때문에
쿼리에 영향을 미친다.

### 컬럼 변경
1. 추가 : 대부분 INPLACE 알고리즘을 사용한다. 맨 끝에 추가하면 INSTANT 알고리즘으로 추가된다.
2. 삭제 : 항상 테이블 리빌드가 필요하다. INPLACE로만 가능하다.
3. 변경 : 
   1. 이름 : INPLACE를 사용하지만 리빌드는 필요 없다. 
   2. 타입 :  
      1. 타입만 변경 : COPY 알고리즘으로 진행한다.
      2. 길이만 변경 : 
        1. 증가 : 확장하는 길이에 따라 리빌드가 필요할 수도 아닐 수도 있다.
        2. 축소 : COPY를 사용한다. 또한 스키마 변경 중 테이블 데이터 변경은 허용되지 않으므로 LOCK은 SHARED를 사용해야 한다.

### 인덱스 변경
```mysql
ALTER TABLE [tableName] ADD 
[PRIAMRY KEY|UNIQUE INDEX|INDEX|FULLTEXT|SPATIAL]
( columnName ) ALGORITHM=INPLACE, LOCK=NONE;

```

### 인덱스 조회
`SHOW INDEXES`, `SHOW CREATE TABLE`로 확인하면 된다.

```mysql
show index from order;

| Table | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| order | 0 | PRIMARY | 1 | orderNo | A | 51152 | null | null |  | BTREE |  |  |
| order | 1 | order_tblStore_storeNo_fk | 1 | storeNo | A | 512 | null | null | YES | BTREE |  |  |
| order | 1 | order_orderManageNumber | 1 | orderManageNo | A | 51194 | null | null | YES | BTREE |  |  |
| order | 1 | order_userNo | 1 | userNo | A | 6071 | null | null | YES | BTREE |  |  |
| order | 1 | order_orderState_payState_userNo | 1 | payStatus | A | 1 | null | null | YES | BTREE |  |  |
| order | 1 | order_orderState_payState_userNo | 2 | orderState | A | 7 | null | null | YES | BTREE |  |  |
| order | 1 | order_orderState_payState_userNo | 3 | userNo | A | 6767 | null | null | YES | BTREE |  |  |
| order | 1 | orderState_index | 1 | orderState | A | 6 | null | null | YES | BTREE |  |  |
| order | 1 | date_index | 1 | orderDate | A | 51194 | null | null | YES | BTREE |  |  |

```

Cardinality는 인덱스에서 유니크한 개수를 보여준다.


### 인덱스 이름 변경
MySQL5.7부터 변경할 수 있다.

```mysql

ALTER TABLE A salaries RENAME INDEX ix_salary TO ix_salary2,
ALGORITHM=INPLACE, LOCK=NONE;
```

INPLACE를 사용하지만 리빌드는 필요하지 않다.


### 인덱스 가시성 변경
인덱스 삭제는 `ALTER TABLE DROP INDEX`으로 완료된다. 그러나 인덱스 삭제, 생성은 리소스가 많이 든다.
그래서 단순히 옵티마이저가 사용하냐 안하냐 정도의 가시성 개념이 도입되었다.


```mysql
ALTER TABLE A ALTER INDEX a INVISIBLE;
ALTER TABLE A ALTER INDEX a VISIBLE;

```
### 인덱스 삭제
`ALTER TABLE DROP INDEX`로 해결된다. SecondaryIndex의 삭제는 이 인덱스 들의 PK 값을 삭제해야 하기 때문에 임시테이블로 레코드를 복사해서 
테이블을 재구축해야 한다.







### 프로세스 조회 및 강제 종료

```mysql
SHOW PROCESSLIST;

| Id | User | Host | db | Command | Time | State | Info |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 80548 | rdsadmin | localhost | mysql | Sleep | 13 |  | null |
| 80550 | rdsadmin | localhost | null | Sleep | 1 |  | null |

```

1. Id      : MySQL 서버 쓰레드
2. User    : MySQL에 접속할 때 인증한 사용자 계정
3. Host    : 호스명이나 IP
4. db      : 클라이언트가 기본으로 사용하는 데이터베이스 이름이 표시된다.
5. Command : 처리하고 있는 작업
6. Time    : 실행 시간
7. State   : Command에 표시되는 내용의 큰 분류
8. Info    : 쓰레드가 실행 중인 쿼리 문장르 보여준다.


### 활성 트랜잭션 조회
`information_schema.innodb_trx` 테이블을 통해 확인할 수 있다. 
```mysql
SELECT trx_id,
       (SELECT CONCAT(user, '@', host) FROM information_schema.processlist WHERE id = trx_mysql_thread_id) AS source_info,
       trx_state,
       ....,
FROM information_schema.innodb_trx
WHERE (unix_timestamp(now() - unix_timestamp(trx_started))) > 5

```

락은 `performance_schema.data._locks` 테이블을 참조하면 된다.


### 쿼리 성능 테스트 - 쿼리 성능에 영향을 미치는 요소

1. OS 캐시 : MySQL도 OS Call로 파일을 읽어온다. 그리고는 캐싱해 놓는데 만약 MySQL이 필요한 부분이 캐싱되어 있다면 여기에서 읽어온다.
2. BufferPool : MySQL도 Page 단위로 캐싱한다. 버퍼풀은 인덱스 페이지, 데이터 페이지 가릴거 없이 캐시하며, 쓰기 버퍼링도 겸한다. 한 번 시작하면 삭제 명령어가 없고, 설정에 따라 재시작하면 워밍업으로 이전의 데이터를 올리기도 한다.
