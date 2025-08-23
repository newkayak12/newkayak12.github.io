---
layout: post
categories: [MYSQL, SUMMARY]
---


# 실행 계획

옵티마이저는 사용자의 쿼리를 최적화해야 한다. 이를 위해서 MySQL은 통계 정보를 수집하여 튜닝을 진행한다.

## 통계 정보

### 테이블, 인덱스 통계 정보
비용 기반 최적화에서 가장 중요한 것이 통계 정보다. 통계 정보가 부정확하면 쿼리가 산으로 갈 수도 있다. 5.6부터 통계정보가 메모리에서만 관리되는게 아니라 영구적으로
저장하여 관리할 수 있게 됐다. `innodb_index_stats`, `innodb_table_stats`로 확인할 수 있다. 또한 영구적으로 보관할지도 `STATS_PERSISTENT`로
설정할 수 있다.


```mysql
CREATE TABLE tableTest ( test1 INT PRIMARY KEY , test2 VARCHAR(30))
ENGINE = InnoDB
STATS_PERSISTENT = [DEFAULT | 0 | 1]

-- 0 저장 안 함
-- 1 저장 함
-- DEFAULT 시스템 변수에 따름

```

기본은 ON(1)이다. 물론 테이블 생성 후에도

```mysql
ALTER TABLE ~ STATS_PERSISTENT=1;
```

와 같이 변경할 수도 있다. 이 통계 정보는
1. 테이블이 새로 오픈되는 경우
2. 테이블 레코드가 대량으로 변경되는 경우
3. ANALYZE TABLE 명령이 실행되는 경우
4. `SHOW TABLE STATUS`, `SHOW INDEX FROM ~`이 실행되는 경우
5. InnoDB 모니터가 활성화 되는 경우
6. innodb_stats_on_metadata 시스템 설정이 ON이고 `SHOW TABLE STATUS` 가 실행되는 경우

통계 정보가 갱신되면 쿼리 최적화가 한순간에 달라질 수도 있다. `innodb_stats_auto_recalc`을 꺼서 위 경우 통계 갱신을 막을 수 있다.
`STATS_AUTO_RECALC`을 통해서 설정할 수도 있다. (1은 자동, 0은 `ANALYZE TABLE`에만 반응하도록, DEFAULT는 시스템 변수를 따라간다. )

또한 `innodb_stats_transient_sample_pages`로 샘플링 페이지를 정해서 일부를 가지고 통계를 낼 수도 있으며, `innodb_stats_persistent_sample_pages`로
샘플링해서 저장하는 페이지 수를 정할 수도 있다.

### 히스토그램

8.0부터 컬럼 데이터 분포도를 참조할 수 있는 히스토그램도 수집한다. 히스토그램은 `ANALYZE TABLE ... UPDATE HISTOGRAM` 명령으로 수동으로 수집, 관리된다.
종류는 두 가지다.

1. Singleton : 컬럼 값 개별로 레코드 건수를 관리하는 히스토그램 (도수 분포라고도 불린다.)
2. Equi-Height : 컬럼 값의 범위를 균등한 개수로 구분해서 관리하는 히스토그램 (Height-Balanced라고도 불린다.)

싱글톤 히스토그램은 컬럼이 가지는 값 별로 버킷이 할당되며, 높이-균형 히스토그램은 개수가 균등한 컬럼 값의 범위별로 하나의 버킷이 할당된다.
싱글톤 히스토그램이는 컬럼 값별로 누적된 건수의 비율을 가지고 있다. 높이-균형 히스토그램은 컬럼 값의 각 범위에 대해 레코드 건수 비율이 누적으로 표시된다. (그래프의 기울기가 의미가 있다.)

- sampling-rate :  히스토그램 정보를 수집하기 위해 스캔한 페이지의 비율을 저장한다. 샘플링 비율이 높아질수록 정확한 히스토그램이 되지만 테이블 스캔으로 부하가 늘어난다.
- histogram-type : 히스토그램 종류를 저장한다.
- number-of-buckets-specified : 버킷의 개수를 저장한다. 기본으로 100개 최대 1024개이다.

생성된 히스토그램은 아래와 같이 지울 수 있다.

```mysql
ANALYZE TABLE ~
DROP HISTOGRAM ON ~;
```
단 지우면 쿼리 실행 계획이 달라질 수 있다.


#### 용도
히스토그램으로 특정 범위의 데이터가 많고 적음을 식별할 수 있다. 이건 꽤 의미가 큰데, 예를 들어 조인의 경우는 이 데이터로 드라이빙, 드리븐이 바뀔 수 있다.

#### 히스토그램과 인덱스
MySQL에서는 쿼리의 실행 계획을 수립할 때 사용 가능한 인덱스들로부터 조건절에 일치하는 레코드 건수를 대략 파악하고 최종적으로 가장 괜ㅊ낳은 계획을 선택한다.
이때 조건절이 일치하는 레코드 건수를 예측하기 위해서 B-Tree를 샘플링해서 살펴본다. 인덱스 다이브(Index Dive)라고 한다.

인덱스된 컬럼을 검색 조건으로 사용한다면 그 컬럼의 히스토그램은 사용하지 않고 실제 인덱스 다이브를 통해서 수집한 정보를 활용한다. 그러나 역시 비용이 필요하다.
실행 계획 수립만으로도 상당한 인덱스 다이브를 실행하고 비용도 커진다.

### 코스트 모델

쿼리를 처리하려면 아래와 같은 작업을 해야 한다.

- 디스크로부터 데이터 페이지 읽기
- 메모리로부터 데이터 페이지 읽기
- 인덱스 키 비교
- 레코드 평가
- 메모리 임시 테이블 작업
- 디스크 임시 테이블 작업

이런 과정으로 코스트가 얼마나 되는지 예측하고 이를 바탕으로 최적의 실행 계획을 찾는다. 5.7 이전에는 서버 소스 코드에 상수화해서 사용했다.

```mysql
EXPLAIN FORMAT = TREE
    SELECT * 
    FROM ~ WHERE ~ \G;

-- key_compare_cost
-- row_evaluate_cost
-- disk_temptable_create_cost
-- memory_temptable_create_cost
-- io_block_read_cost
-- memory_block_read_cost
```

그러나 이런 상수는 실제와 간극이 생긴다. 그래서 히스토그램, 메모리에 적재된 페이지의 비율이 관리되고 이들이 실행 계획 수립에 사용되기 시작됐다.


## 실행 계획 확인
`DESC`, `EXPLAIN`으로 확인할 수 있다. 8.0부터는 `FORMAT` 옵션으로 json, tree를 선택할 수 있다.

### 쿼리 실행 시간
8.0.18부터 실행 계획과 단계별 소요된 시간을 확인할 수 있는 `EXPLAIN ANALYZE`가 추가됐다. 들여쓰기는 호출 순서를 의미하며, 같은 레벨이면 상단이 먼저 실행된 거다.
정리하면

- 들여쓰기가 같은 레벨이면 상단에 위치한 라인이 먼저
- 들여쓰기가 다른 레벨이면 가장 안쪽에 위치한 라인이 먼저 실행

`EXPLAIN ANALYZE`는 `EXPLAIN`과 다르게 실행 계획만 추출하는 것이 아닌 실제 쿼리를 사용하고 사용된 실행 계획과 소요 시간을 보여주는 것이다. 정말 쿼리의 질이 나쁘다면
EXPLAIN -> EXPLAIN ANALYZE 순으로 확인하는 것이 좋다.

### 실행 계획 분석

````mysql
EXPLAIN
SELECT *
FROM employees e 
INNER JOIN salaries s on s.emp_no=e.emp_no
WHERE first_name='ABC';
````


| id | select\_type | table | type | possible\_keys | key | key\_len | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | account | ALL | null | null | null | null | 2 |  |


#### id 컬럼
하나 이상의 하위 SELECT 문장을 포함할 수 있는데 SELECT 쿼리별로 부여되는 식별자 값이다. JOIN 되면 테이블 개수만큼 출력되지만 id 값은 늘지 않는다.
또한 id는 접근 순서를 의미하지는 않는다.

#### select_type
SELECT 쿼리가 어떤 타입의 쿼리인지 표시되는 컬럼이다.

1. SIMPLE  : UNION이나 SUBQUERY를 사용하지 않은 단순 쿼리인 경우
2. PRIMARY : UNION, SUBQUERY를 가지는 실행 계획에서 바깥쪽에 있는 단위 쿼리이다. 하나만 존재한다.
3. UNION   : UNION으로 결합하는 SELECT 쿼리 가운데 첫번쨰가 아닌 쿼리를 UNION으로 표시한다. 첫번째는 DERIVED가 된다.
4. DEPENDENT UNION : UNION, UNION ALL으로 집합을 겹합하는 쿼리에 표시된다. DEPENDENT는 UNION, UNION ALL로 결합된 단위 쿼리가 외부 쿼리에 의해 영향을 받는 것을 의미한다.
5. UNION RESULT : UNION ALL, UNION 쿼리는 UNION의 결과를 임시 테이블로 생성했는데 8.0에도 여전히 임시 테이블에 결과를 버퍼링한다.UNION RESULT에는 id가 부합되지 않는다.
6. SUBQUERY : SUBQUERY는 FROM 절 외에 사용되는 서브쿼리만을 의미한다. FROM 절에 사용된 서브쿼리는 select_type은 DERIVED로 표시된다. 그 밖은 SUBQUERY로 표기된다.
7. DEPENDENT SUBQUERY : 서브쿼리가 바깥쪽 쿼리에서 정의된 컬럼을 사용하면 DEPENDENT SUBQUERY라고 표시된다. 외부 쿼리가 실행되고 내부를 실행하므로 일반 서브쿼리보다 처리 속도가 느리다.
8. DERIVED : 단위 SELECT 쿼리의 실행 결과로 메모리나 디스크에 임시 테이블을 생성하는 것을 의미한다.
9. DEPENDENT DERIVED : 8.0 이전에는 FROM  절의 서브쿼리는 외부 컬럼을 사용할 수가 없었는데 8.0부터 `LATERAL JOIN`이 추가되면서 서브쿼리에서도 외부 컬럼을 참조할 수 있게 됐다.
10. UNCACHEABLE SUBQUERY : 하나의 쿼리 문장에 서브쿼리가 하나만 있다고 한 번만 실행되는 건 아니다. 그런데 조건이 같은 쿼리가 실행되면, 즉 이전의 결과를 재활용할 수 있다면 캐싱한다.
    - SUBQUERY : 처음 한 번만 실행하고 캐싱해서 재활용
    - DEPENDENT SUBQUERY : 컬럼 값 단위로 캐시해두고 사용
      이 경우는 캐시를 사용하지 못하는 요소가 있기 때문에 위와 같은 결과를 출력한다. 이유는 아래와 같다.
    1. 사용자 변수가 서브쿼리에 사용된 경우
    2. NOT-DETERMINISTIC 속성의 스토어드 루틴이 서브쿼리 내에 사용된 경우
    3. UUID(), RAND()와 같이 결과 값이 호출될 때마다 달라지는 함수가 사용된 경우
11. UNCACHEABLE UNION : 캐싱이 불가능한 UNION의 케이스다.
12. MATERIALIZED : FROM, IN에 사용된 서브쿼리의 최적화를 위해서 사용된다. 5.7부터 서브쿼리 내용을 임시 테이블로 구체화한 후, 임시 테이블과 조인하는 형태로 최적화되어 처리된다.

#### table 컬럼
SELECT 쿼리 기준이 아니라 테이블 기준으로 표시된다. `<derived N >`, `<union M, N>`과 같이 `<>`으로 둘러싸인 이름이 명시되는 경우 `임시 테이블`을 의미한다.
N, M은 id 값을 지칭한다.

#### partitions 컬럼
옵티마이저가 사용하는 파티션은 `EXPLAIN PARTITION`을 사용해서 확인할 수 있었지만 8.0부터는 EXPLAIN으로 파티션 관련 실행 계획까지 모두 확인할 수 있게 됐다.
그래서 실행 계획에 어떤 파티션에 접근했는가를 확인할 수 있다. 이렇게 일부 사용하는 파티션만 접근하는 것을 파티션 프루닝(`PARTITION PRUNING`)이라고 한다.

파티션 일부만 전체 접근해도 type에 `ALL`이라고 출력된다. 즉 일부 파티션만 풀스캔으로 처리됨을 의미한다. 이는 물리적으로 개별 테이블처럼 별도의 저장 공간을
가지기 때문이다.

#### type 컬럼
서버가 각 테이블의 레코드를 어떤 방식으로 읽었는지를 나타낸다.

1.  system : 레코드가 1건만 존재하는 테이블 또는 한 건도 존재하지 않는 테이블을 참조하는 형태의 접근 (MyISAM, MEMORY에서)
2.  const  : 반드시 1건을 반환하는 처리방식을 의미한다. 다중 인덱스에서는 인덱스 일부 컬럼만 조건으로 던져서는 `const`로 접근할 수 없다. 옵티마이저가 쿼리를 최적화하는 단계에서 쿼리를 먼저 실행해서 통째로 상수화한다.
3.  eq_ref : 여러 테이블이 조인되는 쿼리에서 표시된다. 조인에서 처음 읽은 컬럼 값을 그다음 읽을 때 검색조건에 사용할 때 `eq_ref`라고 한다. 그래서 두 번째
    이후 읽는 테이블의 type에 `eq_ref`가 표시된다.
4.  ref    : 조인 순서와 상관없다. PK, UQ도 상관 없다. 동등 검색 조건으로 접근할 때 사용된다. 레코드가 1건이라는 보장이 없으므로 const, eq_ref보다는 느리다. 동등 조건만으로 비교되므로 그래도 빠른 편이다.
5.  fulltext : 전문 검색 인덱스를 사용해서 레코드를 읽는 접근 방법을 의미한다. 전문 검색은 통계 정보가 관리되지 않는다.
6.  ref_or_null : ref와 접근 방식은 같은데 NULL 비교가 추가된 형태다. (ref 또는 IS NULL)
7.  unique_subquery : IN(subquery) 형태의 쿼리를 위한 접근 방식이다. 서브쿼리에서 중복되지 않은 유니크한 값만 반환될 때 이 접근 방법을 사용한다. (이런 세미 조인의 경우를 최적화하는 여러 가지 방법이 있다. table_pullout 같은)
8.  index_subquery : IN 연산자 특성상 조건은 괄호 안에 있는 값의 목록에서 중복된 값이 먼저 제거돼야 한다. 서브 쿼리 중 중복이 될 수도 있는데, 인덱스를 이용해서 제거할 수 있을 때 `index_subquery`가 사용된다.
9.  range   : 인덱스 레인지 스캔 형태의 접근 방법이다. `<`, `>`, `IS NULL`, `BETWEEN`, `IN`, `LIKE` 등의 연산자로 검색할 때 사용된다. 얼마나 많은 레코드를 필요로 하느냐에 따라서긴 하지만 웬만 하면 빠르다.
10. index_merge : 2개 이상의 인덱스를 이용해서 각가의 검색 결과를 만든 후, 그 결과를 병합해서 처리하는 방식이다. 사실 그렇게 효율적인건 아니다.
    1. 여러 인덱스를 읽어야 하므로 range보다 느리다.
    2. 전문 인덱스를 사용하면 index_merge가 적용되지 않는다.
    3. 항상 2개 이상의 집합이 되므로, 교집합, 합집합, 중복 제거 같은 작업이 수반된다.
11. index : 인덱스 풀 스캔을 의미한다. 테이블 풀 스캔이랑 거의 다를 바가 없지만 레코드 통쨰로 움직이는 것보다 나으므로 빠르게 처리된다. 또한 쿼리에 따라서 정렬된 인덱스의 장점을 이용할 수도 있다.
    1. range나 const, ref로 접근을 못 할 경우
    2. 인덱스에 포함된 컬럼만으로 처리할 수 있는 경우 = 커버링 인덱스
    3. 인덱스를 이용해서 정렬, 그루핑이 가능할 경우
       1 + 3 이거나 1 + 2인 경우 사용된다.
12.  ALL : 테이블 풀 스캔이다. 대량의 I/O를 유발한다. 리드 어헤드로 미리 읽어서 처리할 수 있다.

#### possible_keys 컬럼
비용이 가장 낮을 것 같은 실행 계획을 옵티아미저는 선택한다. 여기 들어간 인덱스는 그 선택지 중 고려됐던 내용들이다.

#### key
최종 선택된 실행 계획에서 사용하는 인덱스를 의미한다.

#### key_len
쿼리를 처리하기 위해서 다중 컬럼으로 구성된 인덱스에서 몇 개의 컬럼까지 사용했는지를 알려준다.

#### ref
접근 방법이 ref면 참조 조건으로 어떤 값이 제공됐는지를 보여준다. 상숫 값이라면 const, 다른 컬럼 값이면 테이블명, 컬럼 명이 표시된다. 참조용 값을 변환하는 과정을 거쳤다면 func으로 표시된다.

#### rows
rows는 실행 계획 효율성 판단을 위해서 예측했던 레코드 건수를 보여준다. rows는 반환하는 레코드 개수가 아니라 처리하기 위해서 얼마나 많은 레코드를 읽고 체크하는지를 의미한다.

#### filtered
rows 컬럼의 값은 인덱스를 사용하는 조건에만 일치하는 레코드 건수를 예측한 것이다(스토리지). WHERE 조건에 모두 인덱스를 태울 수는 없으므로 필터링을 하는데 여기서 일치한 정도를 의미한다. 100에 가까울수록 그대로 썼다는 의미가 된다.

#### Extra
성능에 관련된 주요 내용이 Extra에 자주 표시되다. 또한 내부적인 처리 알고리즘에 대해서 중요한 정보를 보여주는 경우가 많다.

- const row not found : const 접근 방법으로 찾았는데 결과가 없는 경우
- distinct : distinct 처리를 위해서 필요 없는(조인하지 않아도 되는) 경우는 무시하고 읽었을 경우
- firstMatch : 세미 조인으로 첫 번째 일치하는 한 건만 검색하는 최적화를 사용했을 경우
- full scan on NULL key : `NULL in (SELECT ~ FROM )`식의 쿼리가 되는 경우 (서브 쿼리가 1건이라도 있으면 결과는 NULL 아니면 FALSE)
- impossible HAVING : HAVING에 만족하는 레코드가 없을 경우
- impossible WHERE : WHERE이 항상 FALSE가 될 수 밖에 없는 경우
- looseScan : LooseScan 최적화가 사용되는 경우
- No matching min/max row : `MIN()`, `MAX()`에 일치하는 레코드가 한 건도 없을 경우 (이 경우 결과로 NULL이 반환된다.)
- no matching row in const table : 실행 계획을 만들기 위한 기초 자료가 없음
- no matching rows after partition pruning : 파티션된 테이블에서 UPDATE, DELETE를 했을 때 대상 레코드가 없을 경우 표시 혹은 대상 파티션이 없는 경우
- no table used : `FROM DUAL` 형태의 실행 계획
- not exists : Anti-JOIN 형태는 left join에 null이 아닌 걸로 튜닝할 수 있다. OUTER JOIN으로 Anti-JOIN을 수행하는 쿼리에서 보인다.
- plan isn't ready yet : 다른 커넥션 쿼리 실행 계획이 준비되지 않았을 경우
- recursive : CTE(Common Table Expression)으로 재귀 쿼리를 사용할 때

```mysql
WITH RECURSIVE cte ( n ) AS 
(
    SELECT 
    ~
)
SELECT * FROM cte;
```

- rematerialize : LATERAL JOIN의 경우 레코드 별로 서브쿼리를 실행해서 그 결과를 임시 테이블에 저장한다. 이 과정을 의미한다.
- select tables optimized away : MIN, MAX만 사용되거나 GROUP BY로 MIN, MAX를 조회하는 쿼리가 인덱스를 오름, 내림차순으로 1건만 읽는 경우
- start temporary, end temporary : duplicate weed-out이 사용되면 내부 불필요한 중복건 제거를 위해서 내부 임시 테이블을 사용하는데 이때 표시된다.
- unique row not found : 두 개의 테이블이 각각 UQ 컬럼으로 outer 조인할 때 아우터 테이블에 일치하는 레코드가 존재하지 않을 때
- using filesort : ORDER BY를 처리하기 위해서 인덱스를 사용하지 못 할 경우 정렬용 메모리 버퍼에 복사해서 퀵소트 혹은 힙소트를 사용해서 정렬할 때 표시된다.
- using index :  인덱스만으로 질의를 처리할 수 있을 때 표시된다. (커버링 인덱스)
- using index condition : ICP(인덱스 컨디션 푸시다운) 최적화를 하면 표시된다.
- using index for group-by : group by가 인덱스를 이용하면 정렬된 인덱스 컬럼을 순서대로 읽으면서 그루핑만 수행한다. 이 경우 표시된다.
    - 타이트 인덱스 스캔을 통한 GROUP BY 처리 : 인덱스로 group by를 할 수 있어도 AVG(), SUM(), COUNT() 같이 모든 인덱스를 다 읽어야 하는 경우 `using index fro group-by`가 표시되지 않는다.
    - 루스 인덱스 스캔을 통한 GROUP BY 처리 : 그루핑 컬럼 말고 아무것도 조회하지 않는 쿼리에서 루스 인덱스 스캔을 사용할 수 있다. MIN(), MAX()이 조회하는 값이 인덱스 처음 혹은 마지막이여도 가능하다.

- using index for skip scan : 인덱스 스킵 스캔 최적화를 사용하면 `using index for skip scan` 메시지를 표시한다.
- using join buffer(Block Nested Loop, Batched Key Access, hash join)
- using MRR : Multi Range Read, 여러 개의 키를 한 번에 스토리지 엔진에 전달하고, 스토리지 엔진은 넘겨 받은 키 값을 정렬해서 페이지 접근을 줄일 수 있게 최적화한다.
- using sort_union, using union, using, intersect : index_merge으로 실행되는 경우 2개 이상 인덱스가 동시 사용되는 경우
    - using intersect : AND로 연결된 경우 각 처리 결과에서 교집합을 추출한 경우
    - using union : OR로 연결된 경우 합집을 추출해내는 경우
    - using sort_union : sort해서 중복을 제거한 경우
- using temporary : 쿼리를 처리하는 동안 중간 결과를 담아 두기 위해서 임시 테이블을 사용하는 경우
- using where     : MySQL 엔진 레이어에서 별도의 가공을 해서 필터링을 처리할 경우 표시된다.
- zero limit      : 쿼리 결괏 값의 메타데이터만 필요한 경우 ( 테이블의 레코드를 읽지 않고 결과 값의 메타 정보만 반환한다. )