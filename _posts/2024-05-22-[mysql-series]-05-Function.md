---
layout: post
categories: [MYSQL]
---
from [Dictionary - Function](https://github.com/newkayak12/Dictionary/blob/master/sql/05.Function.md)


# 함수

## 숫자 관련 함수
1. ABS
2. CEIL / FLOOR
3. ROUND(n, i) / TRUNC(n1, n2) : 반올림 / 잘라냄
4. POWER / SQRT : 제곱 / 제곱근
5. MOD(n2, n1) / REMAINDER(n2, n1) : n2를 n1으로 나눈 값 / n2를 n1으로 나눈 나머지
6. EXP(n) / LN(n) / LOG(n2, n1) : e의 n제곱 / 자연 로그 함수로 밑수가 e인 로그 함수 / n2를 밑수로 하는 n1의 로그

## 문자 함수
1. INITCAP(char), LOWER(char), UPPER(char) : 첫 글자 대문자 / lowerCase / upperCase
2. CONCAT(char1, char2), SUBSTR(char, pos, len), SUBSTRB(char, pos, len) : 문자 결합 / char의 pos부터 len 길이만큼 잘라냄 / len이 길이가 아닌 문자열 바이트
3. LTRIM(char, set), RTRIM(char set) : char 문자열에서 set으로 지정된 문자열을 왼쪽 끝에서 제거한 후 반환 / ~ 오른쪽 끝에서
4. LPAD(expr1, n, expr2), RPAD(expr1, n, expr2) : exp2을 왼/오른쪽부터 n자리만큼 채워 expr1을 반환
5. REPLACE(char, search_str, replace_str), TRANSLATE(expr, from_str, to_str) : char에서 search_str문자열을 찾아 replace_str로 대체 / REPLACE와 유사하지만 문자열 자체가 아닌 한 글자씩 매핑해 바꾼 결과를 반환 
6. INSTR(str, substr, pos, occur), LENGTH(chr), LENGTHB(chr) : str에서 substr과 일치하는 위치를 반환하는데 pos는 시작 위치로 기본 값은 1, occur은 몇 번째 일치하는지 / LENGTH는 길이 / LENGTHB는 바이트 수 

## 날짜 함수 
1. SYSDATE, SYSTIMESTAMP : DATE, TIMESTAMP 형으로 반환
2. ADD_MONTHS(date, integer)
3. MONTHS_BETWEEN(date1, date2) : 두 날짜 사이 개월 수
4. LAST_DAY(date) : date날짜를 기준으로 해당 월의 마지막 일자를 반환
5. ROUND(date, format), TRUNC(date, format) : format에 반올림한 날짜 / 잘라낸 날짜
```sql
SELECT SYSDATE, ROUND(SYSDATE, 'month'), TRUNC(SYSDATE, 'month') FROM DUAL;

2023-10-01 22:09:24 | 2023-11-01 00:00:00 | 2023-09-01 00:00:00 |  
```
6. NEXT_DAY( date, char ) : date를 char에 명시한 날짜로 다음 주 주중 날짜를 반환(char => 요일)

## 변환 함수
1. TO_CHAR(숫자 혹은 날짜, format) : 형식에 맞게 출력
2. TO_NUMBER(expr, format) : 문자나 다른 유형의 숫자를 NUMBER형으로 변환
3. TO_DATE(char, format), TO_TIMESTAMP(char, format)

## NULL 관련 함수
1. NVL(expr1, expr2), NVL2(expr1, expr2, expr3) : ifnull
2. COALESCE
3. NULLIF

## 집계함수
1. COUNT
2. SUM
3. AVG
4. MIN, MAX, 
5. VARIANCE, STDDEV : 분산/ 표준편차

### ROLLUP / CUBE
1. ROLLUP : 집계 정보를 보여준다.
2. CUBE : ROLLUP과 유사하지만 가능한 모든 조합으로 집계한 결과를 반환
```sql
 PERIOD GUBUN TOTAL_JAN
------------------------
201310  기타대출  676078
201310  주택담보  1234
201311  기타대출  4423
201311  주택담보  1412

SELECT period, gubun, SUM(loan_jan_amt) total_jan FROM ~
WHERE period LIKE ~
GROUP BY ROLLUP(period, gubun);

## ROLLUP
PERIOD GUBUN TOTAL_JAN
------------------------
201310  기타대출  1423
201310  주택담보  1234
201310          2657
201311  기타대출  4423
201311  주택담보  1412
201311          5835


SELECT period, gubun, SUM(loan_jan_amt) total_jan FROM ~
WHERE period LIKE ~
GROUP BY CUBE(period, gubun);

## CUBE
PERIOD GUBUN TOTAL_JAN
------------------------
                (전체 합)
        기타대출  (기타대출 전체 합)
        주택담보  (주택담보 전체 합)
201310          2657
201310  기타대출  1423
201310  주택담보  1234
201311          5835
201311  기타대출  4423
201311  주택담보  1412
```
## 집합 연산자
1. UNION : 합집합
2. UNION_ALL : 중복된 항목도 모두 조회 (합집합 + 교집합)
3. INTERSECT : 교집합
4. MINUS : 차집합

* 제약 사항
```sql
1. 집한 연산자 컬럼 개수, 데이터 타입이 일치해야 한다.
2. ORDER BY는 맨 마지막 문장에서만 사용 가능
3. BLOB, CLOB, BFILE은 집한 연산자 사용이 불가
4. UNION, INTERSECT, MINUS는 LONG 형 컬럼에 사용할 수 없다. 
```

## GROUPING SET 
GROUPING SET ( expr1, expr2, expr3 ) ==
(
GROUP BY expr1 
   UNION ALL
GROUP BY expr2
   UNION ALL
GROUP BY expr3
)