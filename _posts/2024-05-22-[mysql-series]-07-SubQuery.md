---
layout: post
categories: [MYSQL]
---
from [Dictionary - Subquery](https://github.com/newkayak12/Dictionary/blob/master/sql/07.SubQuery.md)


# SubQuery
SQL 문장 안에서 보조로 사용되는 또 다른 SELECT문을 의미한다.
1. 메인 쿼리와의 연관성에 따라
   1. 연관성 없는 (Noncorrelated) 서브쿼리 : 메인 테이블과 조인 조건이 걸리지 않는 경우
   2. 연관성이 있는 서브 쿼리  : 메인 테이블과 연관성이 있는 서브 쿼리 ( 세미 조인 )
2. 형태에 따라
   1. 일반 서브 쿼리( SELECT )
   2. 인라인뷰 ( FROM )
   3. 중첩 쿼리 ( WHERE )

서브쿼리가 너무 복잡해진다면 WITH 절로 가상테이블을 만들어서 처리할 수도 있다. 
```sql

SELECT b.*
FROM (
        SELECT * FROM kor_loan_status
     ) b;

-- WITH 사용
WITH b AS (   SELECT * FROM kor_loan_status  );
SELECT b.* 
FROM b;
     
     
     
```
