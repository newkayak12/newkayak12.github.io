---
layout: post
categories: [MYSQL]
---
from [Dictionary - Join](https://github.com/newkayak12/Dictionary/blob/master/sql/06.Join.md)



# Join
## 종류
- 조인 연산자에 따른 분류 : 동등 조인, 안티 조인
- 조인 대상에 따른 구분 : 셀프 조인
- 조인 조건에 따른 분류 : 내부 조인, 외부 조인, 세미 조인, 카타시안 조인
- 기타 : ANSI 조인

## 외부 조인 / 내부 조인
1. 동등 조인 
```sql
SELECT a.* FROM A_TABLE a, B_TABLE b WHERE a.id = b.id;
```
2. 세미 조인 : 서브 쿼리를 사용해서 서브 쿼리에 존재하는 데이터만 메인쿼리에서 추출하는 조인 (Join 없이 서브쿼리 + 조건으로 )
```sql
-- EXISTS 사용
SELECT a.* FROM A_TABLE a WHERE EXISTS (
    SELECT * 
    FROM B_TABLE b
    WHERE a.id = b.id
    AND [condition]
);
-- IN 사용
SELECT a.* FROM A_TABLE a WHERE a.id IN (
    SELECT b.id
    FROM B_TABLE b
    WHERE [condition]
);
```
3. 안티 조인 : A에서 B에 없는 요소만 추출
4. 셀프 조인 : 동일한 테이블끼리 조인하는 방법
5. 외부 조인 : 한 테이블을 기준으로 다른 테이블 값이 NULL이라도 추출하는 것 
6. 카티시안 조인 WHERE에 조건이 없는 조인 (모든 경우의 수, 카티시안 곱)
7. ANSI : join ... on