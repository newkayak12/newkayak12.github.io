---
layout: post
categories: [MYSQL]
---
from [Dictionary - Operator and Expressions](https://github.com/newkayak12/Dictionary/blob/master/sql/04.OperatorAndExpression.md)



# 연산자
1. 수식 연산자 : +, -, *, /
2. 문자 연산자 : ||
3. 논리 연산자 : >, <, >=, <=, =, <>, !=, ^=
4. 집한 연산자 : UNION, UNION ALL, INTERSECT, MINUS


# 표현식
한 개 이상의 값과 연산자, SQL 함수 등이 결합된 식
```sql
CASE WHEN condition1 THEN value1
     WHEN condition2 THEN value2
    
    ...
    
    ELSE otherValue
END
```

# 조건식
한 개 이상의 표현식과 논리 연산자가 결합된 식 TRUE/ FALSE/ UNKNOWN 세 가지 타입을 반환한다. 

## 비교 조건식
논리 연산자나 ANY, SOME, ALL 키워드로 비교하는 조건식

## NULL 조건식

## BETWEEN AND 조건식

## IN 조건식

## EXIST 조건식

## LIKE 조건식