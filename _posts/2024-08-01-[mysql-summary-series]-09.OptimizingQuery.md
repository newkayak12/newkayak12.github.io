# 쿼리 작성 및 최적화

## SQL 모드

- STRICT_ALL_TABLES & STRICT_TRANS_TABLES : INSERT, UPDATE 문장으로 데이터를 변경하는 경우 컬럼 타입과 저장되는 타입 다를 때 자동 캐스팅이 수행된다. 
- ANI_QUOTES : 홑따옴표만 문자열 값 표기로 사용할 수 있게 한다. 
- ONLY_FULL_GROUP_BY : GROUP BY 절에 포함되지 않은 컬럼이라도 집합함수 사용 없이 SELECT, HAVING에 사용할 수 없게 한다.
- PIPE_AS_CONCAT : 오라클 같이 `||`를 문자열 연결 연산자로 사용할 수 있다.
- PAD_CHAR_TO_FULL_LENGTH : CHAR 타입을 가져올 때 뒤쪽에 공백이 제거되지 않고 반환돼야 한다면 설정을 하면된다.
- NO_BACKSLASH_ESCAPE : ON으로 두면 `'\'`를 이용해서 이스케이핑 할 수 없어진다.
- IGNORE_SPACE : 프로시저나 함수의 이름 뒤에 공백 구분이 되는데, 이를 무시할지를 조절한다.
- REAL_AS_FLOAT : 부동 소수점으로 `FLOAT`, `DOULBE`이 지원되는데 `REAL`이 `DOUBLE`의 동의어로 간주된다. 만약 설정을 켜놓으면 FLOAT의 동의어가 된다.
- NO_ZERO_IN_DATE&NO_ZERO_DATE : '2020-00-00' 같은 비정상적 날짜 저장이 불가능해진다.
- ANSI : `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `ONLY_FULL_GROUP_BY` 조합
- TRADITIONAL : `STRICT_TRANS_TABLE`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ENGINE_SUBTITUTION` 조합 


## 연산자, 내장함수

### 1. 연산자
1. REGEXP : 정규표현식 연산자다. `RLIKE`, `REGEXP`로 사용한다. 인덱스 사용 불가하다.

```mysql
SELECT 'abc' REGEXP '^[x-z]';
```
2. LIKE : 문자열 패턴 비교 연산자이다. 인덱스를 이용해서 처리할 수 있다.`WHERE a LIKE '%~'` 같은 좌측에 와일드카드를 사용하지 않는다면 말이다.
   - `%` : 0 또는 1개 이상 모든 문자
   - `_` : 정확히 1개 문자

3. BETWEEN : `loe` + `lte`이다. `IN`과 다르다.

4. IN : 여러 개의 값에 동등 비교 연산을 모아 놓은 것으로 생각하면 된다. ( `NOT IN`은 전체를 긁고 IN에 걸리는 걸 빼내야 하기에 인덱스 풀 스캔으로 표시된다. 가끔 PK와 비교될 때는 레인지 스캔이 되는 경우도 있다.)


### 2. 내장함수
1.  `IS NULL`/ `IF NULL`
2.  `NOW`/ `SYSDATE` : NOW는 항상 같은 값을 가지지만 SYSDATE는 호출 시점에 따라 결과 값이 달라진다.
3.  `DATE_FORMAT`/ `STR_TO_DATE`
4.  `DATE_ADD`/ `DATE_SUB`
5.  `UNIX_TIMESTAMP`, `FROM_UNIXTIME`
6.  `RPAD`, `LPAD`/ `RTRIM`, `LTRIM`, `TRIM`
7.  `CONCAT` 
8.  `GROUP_CONCAT` : 컬럼 연결을 위해서 메모리 버퍼 공간을 사용한다. 버퍼 크기는 `group_concat_max_len`으로 조정할 수 있다.
9.  `CASE WHEN ... THEN ...END` : switch_case와 같다.
10. `CAST`, `CONVERT` : 보통 알아서 변환해주지만 명시적으로 변환할 때 사용한다. 
11. `SLEEP` : 디버깅 용도로 잠시 대기하거나 쿼리 실행 시간을 오래 유지하고자 할 때 유용한 함수다.
12. `JSON_PRETTY` : JSON을 읽기 쉽게 출력해준다.
13. `JSON_STORAGE_SIZE`
14. `JSON_EXTRACT` : JSON의 특정 필드의 값을 가져올 수 있다. ex) `JSON_EXTRACT(doc, "$.first_name")`
15. `JSON_CONTAINS`: JSON에서 특정 필드 포함 여부를 확인할 수 있다. ex) `JSON_CONTAINS(doc, '{"first_name":"name"}')`
16. `JSON_OBJECTAGG`/ `JSON_ARRAYAGG` : JSON Obj, Array로 집계
17. `JSON_TABLE` : JSON 데이터 값을 모아서 Table로 반환

## 조회문 

### 3. SELECT
SELECT의 처리 순서는 `FROM`, `JOIN` -> `WHERE` -> `GROUP BY` -> `SELECT` -> `HAVING` -> `ORDER BY` -> `LIMIT` 순으로 처리된다.

### 4. `WHERE`, `GROUP BY`, `ORDER BY`

#### 1. 인덱스를 사용하기 위한 규칙
기본적으로 인덱스된 컬럼 값 자체를 변환하지 않고 그래도 사용한다는 조건을 충족해야만 한다.

#### 2. WHERE 인덱스 사용
WHERE 에서 나열된 조건 순서는 실제 인덱스 사용 여부와 무관하다. 옵티마이저가 사용할 수 있는 조건들을 뽑아서 최적화를 수행한다. 8.0 이전까지는 하나의 인덱스를
구성하는 각 컬럼의 순서가 혼합되어 있으면 사용할 수 없었다. 이후부터는 가능해졌다. 또한 일부 조건에서 인덱스 레인지 스캔을 사용할 수 있더라도 다른 조건에서 풀스캔이 필요하면
결국 그냥 풀스캔 한 번으로 처리하는 식으로 실행 계획을 정리하기도 한다.

#### 3. GROUP BY 인덱스 사용
GROUP BY에 명시된 컬럼의 순서가 인덱스를 구성하는 컬럼의 순서와 같으면 `GROUP BY`에서 인덱스를 사용할 수 있다. 풀어서 기술하면
- GROUP BY에 명시된 인덱스 컬럼 순서와 위치가 같아야 한다.
- 인덱스를 구성하는 컬럼 중에서 앞 쪽에 있는 값이 GROUP BY에 명시되지 않으면 인덱스를 사용할 수 없다.
- WHERE 와 달리, GROUP BY에 명시될 컬럼이 하나라도 인덱스에 없으면 인덱스를 사용할 수 없다.

#### 4. ORDER BY 인덱스 사용
GROUP BY 요건과 흡사하다.

#### 5. WHERE 조건과 ORDER BY(혹은 GROUP BY) 에서 인덱스 사용
WHERE, ORDER BY(GROUP BY)이 같이 사용된 경우는 아래 세 가지 방법 중 한 방법으로만 인덱스를 사용한다.

1. WHERE, ORDER BY 절이 동시에 같은 인덱스를 사용
2. WHERE에만 인덱스 사용 : 인덱스로 레코드를 뽑고 `Using Filesort`한다.
3. ORDER BY에만 인덱스 사용 : `ORDER BY` 절 순서대로 읽고 필터링한다.

#### 6. GROUP BY, ORDER BY 인덱스 사용
둘 다 하나의 인덱스를 사용해서 처리되려면 ORDER BY, GROUP BY에 명시된 컬럼의 순서와 내용이 모두 같아야 한다. 그렇지 않으면 둘 중 하나는 동시에 인덱스를 사용하지 못한다.

### 5. WHERE 비교 조건 사용 시 주의사항

1. NULL 비교 : NULL도 인덱스로 관리된다.
2. 문자열 숫자 비교 : 컬럼 타입에 맞지 않은 값으로 비교 연산을 하면 인덱스를 사용하지 못한다.
3. 날짜 비교 : 
    -  문자열을 비교하면 자동으로 DATETIME 값으로 변환해서 비교한다.
    -  DATE, DATETIME 끼리 비교하면 DATETIME으로 맞춘다.
    -  DATETIME, TIMESTAMP의 경우(내부적으로 숫자 값이다.) DATETIME을 `UNIX_TIMESTAMP()`로 변환해서 비교해야 한다. 
4. Short-Circuit Evaluation : WHERE 도 단축평가를 한다. 물론 인덱스를 사용할 수 있는 조건이 있다면 단축 평가 전에 인덱스를 우선적으로 사용한다.

### 6. LIMIT
지정된 순서에 위치한 레코드만 가져오고자 할 때 사용한다. LIMIT은 필요한 레코드 건수만 준비되면 즉시 쿼리를 종료한다.  LIMIT 0의 경우 결과값의 메타 정보만 반환한다

### 7. COUNT
COUNT(*)의  `*`는 레코드 전체가 아니라 PK를 사용한다. WHERE 조건이 없다면 레코드를 하나씩 셀 필요가 없어서 바로 반환한다. 
그러나 WHERE이 있다면 레코드를 읽어야 한다. COUNT는 테이블이 커질수록 리소스가 큰 작업이 된다.

### 8. JOIN
Join 순서는 인덱스 여부와 테이블 크기에 영향을 받는다. 인덱스 레인지 스캔은 인덱스 탐색, 인덱스 스캔으로 구분해 볼 수 있다. 인덱스 스캔은 비교적 부하가 적지만
인덱스 탐색은 부하가 높다. JOIN은 driven에서는 인덱스 탐색, 스캔 작업을 driving의 레코드 건수만큼 반복한다. 이런 배경 지식을 바탕으로 케이스를 정리해보자.

1. 둘 다 인덱스가 있다면 : 인덱스가 있기 때문에 인덱스를 태워스 탐색, 스캔이 가능하다. 통계 정보를 이용해서 레코드 건 수가 적은 테이블을 driving으로 둔다.
2. 한 쪽만 있는 경우 : 인덱스를 태우지 못하면 굉장히 느려진다. 그래서 인덱스가 없는 테이블을 driving으로 둔다.
3. 둘 다 없는 경우 : 어차피 full scan이 발생한다. 레코드 건수가 적은 테이블을 driving으로 두는 것이 그나마 효율적이다.

#### join, index와 관련된 주의점
1. 컬럼 간에 타입이 일치하지 않으면 인덱스를 효율적으로 이용할 수 없다. 이 경우 최악으로는 두 테이블 모두 풀스캔을 하고 조인버퍼에 두고 하나씩 조립할 수도 있다.
2. collation이 달라도 인덱스를 이용할 수 없다.

#### join, OUTER JOIN에서 주의점
OUTER로 JOIN 되는 테이블을 driving으로 선택하지 못한다. 이러면 쿼리 성능이 떨어지는 실행 계획을 선택할 가능성이 생긴다. 당연히 `OUTER JOIN`이 필요하면
쓰는게 맞지만 `INNER JOIN`을 사용할 수 있는 JOIN을 `OUTER JOIN`으로 사용하면 최적화의 기회를 배제하게 된다.

#### join, FOREIGN KEY
외래키는 JOIN과 연관이 없다. 그저 참조 무결성을 지키기 위함이다.

#### 지연된 JOIN
JOIN에 GROUP BY나 ORDER BY가 있고, 다 인덱스를 태울 수 있다면 그 상태만으로 최적이겠지만 그렇지 않다면 생각해보면 JOIN 후에 GROUP BY, ORDER BY를 처리할 것이다.
이러면 처리할 일이 늘어날 것이다.  JOIN을 했으니 레코드가 늘어났을 수 있기 때문이다. 그래서 옵티마이저는 순서를 바꿔서 GROUP BY, ORDER BY를 먼저 할 수 있다면
처리하고 이후 JOIN을 하는 식으로 최적화를 하기도 한다. 이 판단은 통계와 테이블 상황을 종합해서 내린 결과다.

그러나 항상 이런 최적화가 가능한건 아니다.
1. LEFT JOIN인 경우 driving과 driven이 1:1 혹은 M:1일 때 가능하다.
2. INNER JOIN이라면 driving, driven이 1:1 혹은 M:1이고 driving 테이블에 있는 레코드는 driven에 모두 존재할 때 가능하다. 

#### LATERAL JOIN
8.0부터 래터럴 조인을 이용해서 특정 그룹별로 서브쿼리를 실행해서 그 결과와 조인하는 것이 가능해졌다. 예를 들어 아래 쿼리를 보자.

```mysql
SELECT *
FROM employee e 
LEFT JOIN LATERAL (
        SELECT *
        FROM salaries s 
        WHERE s.emp_no=e.emp_no
        ORDER BY s.from_date DESC LIMIT 2
    ) s2 
ON s2.emp_no=e.emp_no
WHERE e.first_name=`MATT`;
```

이러면 서브쿼리는 JOIN 순서상 후순위로 밀리고, 외부 쿼리의 결과 레코드 단위로 임시 테이블이 생성된다. 그래서 필요한 경우에만 사용해야 한다.

#### join, 정렬 흐트러짐
`Nested-loop JOIN`은 driving 테이블따라서 순서가 유지된다. 만약 `hash JOIN`이 사용되면 이 순서가 틀어질 수 있다. 따라서 이럴 가능성이 있으므로
필요하다면 ORDER BY를 명시하는 것이 좋을 수 있다.



### 9. GROUP BY
특정 컬럼으로 레코드를 그루핑하고, 그룹별로 집계된 결과를 하나의 레코드로 조회할 때 사용한다.

### 10. ORDER BY
어떤 순서로 정렬할지 결정한다.

- 인덱스를 사용한 SELECT라면 인덱스에 정렬된 순서대로 레코드를 가져온다.
- 인덱스를 사용하지 못한다면 PK를 기준으로 정렬해서 가져온다.
- SELECT가 임시 테이블을 거치면 순서 예측이 어렵다.

#### 인덱스 사용이 불가하다면
실행 계획에 Extra에 `Using filesort`가 출력된다. MySQL 서버가 명시적으로 정렬 알고리즘을 수행했다는 의미가 된다. `SHOW STATUS LIKE 'Sort_%'`로 조회해서
`Sort_merge_passes` 상태를 보면 0보다 크면 `sort_buffer_size`보다 정렬할 레코드가 커서 디스크를 거쳤다는 것을 의미한다.

#### 함수, 표현식을 이용한 정렬
8.0 이후에는 함수 기반의 인덱스를 지원하기 시작했다.



### 11. SUBQUERY
서브쿼리는 SELECT, FROM, WHERE에 사용할 수 있다. 사용 위치에 따라 쿼리 수행에 미치는 성능 영향도, 최적화 방향이 달라진다.

#### SELECT 절에서 서브쿼리
SELECT에서 사용한 서브쿼리는 서브쿼리가 인덱스를 적절히 사용한다면 문제는 없다. 굳이 생각할 것은 서브쿼리보다 조인이 더 빠르기 때문에 조인으로 재작성할 수 있다면
하는 것이 좋다.

#### FROM 절에서 서브쿼리
FROM에서 서브쿼리가 사용하면 항상 서브쿼리의 결과를 임시테이블에 저장하고 필요할 때 그 임시 테이블을 읽는 방식으로 처리된다. 이를 튜닝하면 외부로 끌어내는 방식으로 진행할 수 있다.
다행히 5.7이후 부터는 FROM 절 서브쿼리 튜닝을 이렇게 한다. 그러나 아래의 경우는 이런식의 최적화가 불가능하기도 하다.

1. 집합 함수 (SUM, MIN, MAX, COUNT) 사용
2. DISTINCT
3. GROUP BY, HAVING
4. LIMIT
5. UNION
6. SELECT에 SUBQUERY 사용
7. 사용자 변수 사용

#### WHERE 절에서 서브쿼리
WHERE 절의 서브쿼리는 SELECT, FROM 보다는 다양한 형태로 사용될 수 있다. 크게 3가지로 구분할 수 있다.

1. 동등, 대소 (`= (SUBQUERY)`)
5.5 이전에는 풀스캔이 잦았다. 이후로는 서브쿼리 결과를 상수로 변환하고 실행 계획을 수립한다.
   

2. IN (`IN (SUBQUERY)`)
테이블 레코드가 다른 레코드를 이용한 표현식과 일치하는지를 체크하는 세미 조인의 형태다. 이 경우 5개의 최적화 전략을 선택적으로 사용한다.


  1. **table pull-out**
   세미 조인의 서브쿼리에 사용된 테이블을 아우터 쿼리로 빼내고 조인으로 재작성하는 형태의 최적화이다. Table pullout은 Extra에 `Using table pullout`이 출력되지는 않는다.
   대신 `EXPLAIN` 후 `SHOW WARNINGS`로 재작성한 쿼리를 확인하는 것으로 알 수 있다.
     - 세미 조인 서브쿼리에만 사용 가능
     - 서브 쿼리 부분이 UNIQUE 인덱스, PK 룩업으로 결과가 1건인 경우에만 사용 가능
     - 만약 서브쿼리의 모든 테이블을 아우터로 빼낼 수 있다면 서브쿼리는 사라진다.
     - table pullout은 서브쿼리는 조인으로 바꿀 수 있다면 바꾸라는 가이드를 그대로 따르는 최적화 방법이다.

   2. **firstMath**         
      IN 형태의 세미 조인을 EXISTS(subquery) 형태로 튜닝한 것과 비슷한 방법으로 실행된다. `FirstMatch([tableName])`이라는 문구가 출력된다.
      1. 장점
      - 여러 테이블이 조인되는 경우 원래 쿼리에는 없던 동등 조건을 옵티마이저가 자동으로 추가하는 형태의 최적화가 실행되기도 한다. FirstMatch는 조인 형태로 처리되기
      때문에 서브쿼리 뿐만 아니라 아우터 쿼리의 테이블까지 전파될 수 있다.
      - FirstMatch는 서브 쿼리의 모든 테이블에서 FirstMatch를 수행할지 아니면 일부 테이블에 대해서만 수행할지 취사 선택할 수 있다.
      2. 제한 사항 및 특징
      - FirstMatch는 단축실행경로(ShortCutPath)이기 때문에 FirstMatch 최적화에서 서브 쿼리는 그 서브쿼리가 참조하는 모든 아우터 테이블이 먼저 조회된 이후에 실행된다.
      - Extra에 FirstMatch(table-N)이 표시된다.
      - 상관 서브 쿼리(Correlated Subquery)에서도 사용될 수 있다.
      - GroupBY나 집합 함수가 사용된 서브쿼리의 최적화에는 사용될 수 없다.          

   3. **looseScan**
      `Using index for group-by`의 루스 인덱스 스캔과 비슷한 읽기 방식을 사용한다. Extra에 `LooseScan`이라는 문구가 표시된다.
      - LooseScan은 서브쿼리 테이블을 looseScan으로 읽고 아우터 테이블을 드리븐으로 사용해서 조인을 수행한다.

   4. **materialization**
      세미 조인에 사용된 서브쿼리를 통쨰로 구체화해서 쿼리를 최적화한다. 즉, 내부 임시 테이블을 생성한다는 것을 의미한다. `select_type`에 `MATERIALIZED`를 표기한다.
      Materialization에도 몇 가지 제한 사항과 특징이 있다.
      - IN(subquery)에서 서브쿼리는 상관 쿼리가 아니어야 한다. (상관 쿼리란 부모-자신 간의 일정 관계를 맺는 경우를 의미한다.)
      - 서브 쿼리는 GROUP BY, 집합 함수들이 사용되도 구체화가 가능하다.
      - 구체화가 되면 내부 임시 테이블을 사용한다.

   5. **duplicated weed-out**
      세미조인 서브쿼리를 일반적인 INNER JOIN으로 바꾸고 마지막에 중복된 레코드를 제거하는 방법으로 처리하는 최적화 알고리즘이다. 실제로 `Duplicate Weedout`
      은 INNER JOIN + GROUP BY 절로 바꿔서 실행하는 것과 동일한 작업으로 쿼리를 처리한다. `Duplicate Weedout`이라는 문구가 별도 표기되지는 않지만
      `Start temporary`, `End temporary`가 표기된다. JOIN, 저장 하는 과정에서 발생하는 일이다.

      - 상관 서브쿼리라고 해도 할 수 있는 최적화다.
      - GROUP BY나 집합 함수가 사용된 경우 불가능하다.
      - Duplicate Weedout은 서브쿼리의 테이블을 조인으로 처리하기 때문에 최적화할 수 있는 방법이 많다.

3. NOT IN (`NOT IN (SUBQUERY)`)
이 경우를 안티 세미 조인은 최적화할 방법이 그리 많지 않다.

   1. NOT EXISTS

   2. materialization

### 잠금을 하는 SELECT
보통은 SELECT에 락을 걸지 않지만 이는 잠금 없는 읽기(Non Locking Consistent Read)라고 한다. 하지만 SELECT한 결과를 바탕으로 업데이트를 할 수도 있다. 
이 때는 다른 트랜잭션이 이 컬럼을 수정하지 못하게 해야 할 필요가 있다. 

1. SELECT ... FOR SHARE ( 읽기 잠금 ) : 레코드에 공유 잠금을 건다 다른 세션 해당 레코드를 변경하지 못하게 한다.
2. SELECT ... FOR UPDATE ( 쓰기 잠금 ) : 배타 잠금 레코드 변경, 읽기도 수행하지 못하게 한다.

> ShareLock
> - 다른 트랜잭션이 잠긴 객체를 읽고 공유락 생성은 허용, 쓰기 및 배타락은 허용하지 않음
> - 다른 트랜잭션이 읽는 곳은 읽을 수 없다.
> 
> ExclusiveLock
> - 동일 행에 다른 트랜잭션을 생성하지 못하게 한다.
> - 공유, 배타락 모두 생성 불가.

#### NOWAIT & SKIP LOCKED
8.0부터 추가됐다. 누군가 레코드를 잠그면 원래는 기다렸다. 해제될 때까지 말이다. `SELECT FOR UPDATE` 마지막에 `NOWAIT`을 추가하면 잠긴 레코드에 접근하는
쿼리를 즉시 종료시켜버린다. `SKIP LOCKED`는 다른 트랜잭션에 의해서 잠긴 레코드는 에러 없이 무시하고 다음 레코드로 넘어가게 한다.


## 삽입문

### INSERT IGNORE
PK, UQ가 중복되거나 테이블 컬럼과 호환되지 않는 경우 모두 무시하고 다음 레코드를 처리할 수 있게 한다. Bulk로 INSERT 하는 경우 유용하다.

```mysql
INSERT IGNORE INTO [table] ~
```

### INSERT ... ON DUPLICATE KEY UPDATE
PK, UQ 인덱스 중복이 발생하면 UPDATE를 하게 해준다.

```mysql
INSERT INTO ~
ON DUPLICATE KEY UPDATE 
~
```

### LOAD DATA
RDMBS에서 데이터 적재 방법으로 LOAD DATA가 있다. 내부적으로 MySQL 엔진, 스토리지 엔진 호출 횟수를 최소화하고 스토리지 엔진이 직접 적재하는 식으로 작동한다.
그래서 일반 INSERT보다 빠르다. 그러나 아래의 단점이 있다.

- 단일 쓰레드로 실행
- 단일 트랜잭션으로 실행

그래서 처리할 양이 많으면 단일 쓰레드라 느리고, 단일 트랜잭션이라 트랜잭션이 열려있는 동안 쌓이는 언두로그를 감안해야만 한다.


### Bulk Insert 성능
INSERT 될 레코드들을 PK 기준으로 정렬해서 INSERT하면 성능에 도움이 될 수 있다. 정렬이 되어있지 않으면 INSERT 시마다 저장될 위치를 찾아야 한다.
또한 SecondaryIndex를 너무 많이 잡아도 느려진다. 물론 체인지 버퍼로 버퍼링하긴 하지만 당연히 백그라운드 작업도 부하를 유발하므로 성능이 떨어진다.

### PK 선정
INSERT 성능을 결정한다. InnoDB는 클러스터링 키인데 저장 위치가 정해진다. 그래서 INSERT 위주 테이블이라면 단조 증가 패턴 값(AUTO_INCREMENT)을 선택하는게
좋고 SELECT 위주라면 클러스터링을 적극 활용할 수 있게 작성해야 한다.


### AUTO_INC

INSERT 최적화에 적합한 PK 선정 방식이다. 아래는 오로지 INSERT를 생각하면 내릴 수 있는 결정이다.

1. 단조 증감 PK 선정(클러스터링 효과를 받지 않기 위해서)
2. secondaryIndex 최소화

더 나아가 AUTO_INC를 할 때 잠금이 필요한데, 이를 AUTO_INC 잠금이라고 한다.

- innodb_autoinc_lock_mode = 0; : 항상 AUTO_INC 락을 걸고 한 번에 1씩 증가된 값을 가져온다.
- innodb_autoinc_lock_mode = 1; : 단건 INSERT 는 MUTEX를 이용해서 가볍게 처리한다.
- innodb_autoinc_lock_mode = 2; : LODA DATA, BULK INSERT에 AUTO_INC 락 사용하지 않는다. 채번이 증/감한다. 겹치지 않는다 정도만 보장한다.
채번된 번호가 연속될지는 보장하지 않는다.(Interleaved mode) -> replica에 치명적일 수 있다.

## 수정/ 삭제

### UPDATE ... ORDER BY ... LIMIT n
ORDER BY, LIMIT으로 특정 컬럼으로 정렬해서 상위 n 건만 수정, 삭제할 수도 있다. 그러나 바이너리 로그(STATEMENT) 기반의 레플리케이션에서는 주의해야한다.


### JOIN UPDATE
두 개 이상의 테이블을 JOIN해서 해당 레코드를 변경, 삭제할 수 있다. 한 테이블에 의존적으로 삭제, 수정할 때 용이하다. 변경되는 테이블은 쓰기 잠금, 참조되는 테이블은 읽기 잠금이 걸린다.
추가적으로 JOIN UPDATE에는 GROUP BY, ORDER BY가 불가하다. 이런 경우 SUBQUERY, DERIVED TABLE을 사용하는 것이 해법이다.
특히 JOIN 순서는 이 쿼리 속도에 영향을 미치기에 `STRAIGHT_JOIN` 등을 사용할 수도 있다.


### 여러 레코드 UPDATE
한 번에 동일한 값으로 UPDATE 하는 건 쉽다. 그러나 각각 레코드 별로 다른 값으로 업데이트하는 건 8.0부터 가능하다. 레코드 생성(Row Constructor) 문법을 이용하면 된다.

```java
UPDATE old_u
INNER JOIN ( VALUES ROW(1, 1), ROW(2, 4) ) new_u (user_id, user_name)
ON new_u.userId = old_u.userId
set old_u.user_name= concat(concat(new_u.user_id,' '), new_u.user_name); 
```

`INNER JOIN ( VALUES ROW(1, 1), ROW(2, 4) ) new_u (user_id, user_name)` 이러면 임시테이블을 생성하는 효과를 낼 수 있다.


### JOIN DELETE
단일 DELETE와는 다른 형식의 쿼리를 작성해야 한다.
```java
DELETE e
FROM employee e, dept_emp de, departpents d
WHERE e.emp_no=de.emp_no AND de.dept_no=d.dept_no AND d.dept_no='d001';
```
 
마찬가지로 STRAIGHT_JOIN, JOIN_ORDER 힌트로 조인 순서를 옵티마이저에 일러줄 수 있다.