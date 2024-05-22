---
layout: post
categories: [MYSQL]
---
from [Dictionary - PL/SQL](https://github.com/newkayak12/Dictionary/blob/master/sql/08.PL_SQL.md)



# PL/SQL

## 블록 
PL/SQL 소스 프로그램의 기본 단위, 선언부, 실행부, 예외처리부로 구성된다. 이 블록은 다시 이름이 없는 블록, 이름이 있는 블록으로 구분할 수 있는데 전자는 익명 블록이고 함수, 프로시저, 패키지 등이 후자에 속한다.

```sql
    NAMEING : 생략하면 익명 블록
IS (AS)
    DECLARATION : 각종 변수, 상수, 커서 등을 선언한다. 반드시 ;로 끝나야한다. 
    ex) 변수명 데이터 타입 := 초깃값;
    ex) 상수명 CONSTANT 데이터타입 := 상수값;
BEGIN
    EXECUTION : 실제 로직 처리부 DML만 사용 가능
EXCEPTION
    EXCEPTIONS : 로직 처리 중 문제가 발생하면 처리할 내용을 기술하는 부분이다.
END;
```

## 제어문
### IF
```sql
IF 조건 THEN
   처리 ;
END IF;
 
    --
IF 조건 THEN
   처리 1;
ELSE
   처리 2; 
END IF;

    --
IF 조건 1 THEN
   처리 1;
ELSIF 조건 2 THEN
   처리 2;
ELSE 
   처리 3; 
END IF;
```

### CASE
```sql
CASE 표현식
    WHEN 결과 1 THEN
         처리 1;
    WHEN 결과2 THEN
         처리 2; 
    ...
    ELSE 
        기타 처리; 
END CASE;
```

### LOOP
```sql
LOOP
    처리 ;
    EXIT [WHEN 종료 조건];
END LOOP;
```

### WHILE
```sql
WHILE 조건
LOOP
    처리문;
END LOOP;
```

### FOR
```sql
FOR 인덱스( 카운트 변수 ) IN [REVERSE] 초기..최종
LOOP
    처리문;
END LOOP;
```

### CONTINUE, GOTO
CONTINUE WHEN 조건으로 로직을 건너뛸 수 있다.
GOTO로 흐름을 변경할 수 있다. 
ex) <<third>>
     ....로직
    GOTO third;

### NULL문
ELSE NULL로 아무것도 하지 않고 넘어가도록 할 수도 있다. (if-else/ case-when-then 모두)
```sql
IF condition1
    LOGIC1;
ELSIF condition2
    LOGIC2;
ELSE NULL;
END IF;
```

## 함수

사용자가 직접 로직을 구현하는 사용자 정의 함수(내장 함수와 비교해서)
```sql
CREATE OR REPLACE FUNCTION functionName (parameter)
RETURN returnType;
IS[AS]
    variables, constants
BEGIN 
    executions
    RETURN returnValue;
    EXCEPTION
        failOverLogics
END;
        
functionName(val1...)
```
## 프로시저
함수는 특정 연산을 수행한 뒤 결과 값을 반환하지만, 프로시저는 특정한 로직을 처리하기만 하고 결과 값을 반환하지 않는 서브 프로그램이다. 
```sql
CREATE OR REPLACE PROCEDURE procedureName ( parameter IN | OUT | INOUT datatype [:= defaultValue], ...)
IS[AS]
    variables, constans..
BEGIN
    executions
    RETURN returnValue;
EXCEPTION
        failOverLogics
END;
    
EXECUTE procedureName(param..)
```
