---
layout: post
categories: [MYSQL]
---
from [Dictionary - Cursor/ Record/ Collection](https://github.com/newkayak12/Dictionary/blob/master/sql/10.Cursor_Record_Collection.md)


# Cursor/ Record/ Collection

## 커서

### 1. 커서란
특정 SQL 문장을 처리하 결과를 담고 있는 영역(PRIVATE SQL이라는 메모리)을 가리키고 일종의 포인터
종류는 묵시/ 명시적 커서가 있다. 묵시적 커서는 오라클 내부에서 자동으로 생성되어 사용하는 커서이다. 반대로 사용자가 직접 정의해서 사용하는 커서를 명시적 커서라고 한다.

a. 명시적 커서 
```sql
DECLARE
 vn_department_id emplyees.departmnet_id%TYPE := 80;
BEGIN 
 UPDATE emplyess
 SET emp_name = emp_name
 where department_id = vn_department_id;

 DBMS_OUTPUT.PUT_LINE(SQL%ROWCOUNT); -- oracle
 COMMIT;
END
```
묵시적 커서 속성

|    속성명     |                          설명                           |
|:----------:|:-----------------------------------------------------:|
| SQL%FOUND  |              결과 집합의 패치 로우 수가 1 이상이면 TRUE              |
| SQL%NOTFOUND |               결과 집합의 패치 로우 수가 0이면 TRUE                |
| SQL%ROWCOUNT |              영향 받은 결과 집합의 로우 수 반환, 없으면 0              |
|  SQL%ISOPEN  | 묵시적 커서는 항상 FALSE 반환( 이 속성으로 참조할 때는 이미 묵시적 커서는 닫힌 상태 ) |

b.명시적 커서
커서 선언 - 커서 열기 - 패치 단게에서 커서 사용 - 커서 닫기

1. 커서 선언

    묵시적 커서와 달리 명시적 커서는 선언해야 한다. 명시적 커서는 결과 데이터 집합을 로우별로 참조하는 용도이므로 SELECT 문을 사용할 것이다.
    ```sql
    CURSOR 커서명 [(매개변수1, ...2)] 
        IS
    SELECT ...;
    ```

2. 커서 열기
    ```sql
    OPEN 커서명 [(매개변수1, ...2)];
    ```

3. 패치에서 커서 사용
    ```sql
    LOOP
     FETCH 커서명 INTO 변수 1, ...;
     EXIT WEHN 커서명%NOTFOUND;
    END LOOP;
    ```

4. 커서 닫기
    ```sql
    CLOSE 커서명;
    ```

    ex)
    ```sql
    FOR record IN cursorName (매개변수)
        LOOP
            executtion;
        END LOOP;
    ```
   

### 2. 커서 변수
명시적 커서의 이름은 상수이다. 한 번 할당하면 다른 값으로 바꿀 수 없다. 대신 커서 변수라는 것이 있다. 
- 한 개 이상의 쿼리를 연결해서 사용할 수 있다.
- 변수처럼 커서 변수를 함수나 프로시저의 매개변수로 전달할 수 있다. 
- 커서 속성을 사용할 수 있다. 

1. 커셔 변수 선언 
   1. 참조용 커서 타입을 생성하고 선언
   ```sql
      TYPE 커서 타입명 IS REF CUSOR [RETURN 반환타입];
      커서 변수명 커서 타입명;
   ```
   * RETURN을 생략하면 약한 커서 타입/ 반대는 강한 커서 타입이라고 한다.
   ```sql
      TYPE dep_curtype IS REF CURSOR RETURN departments%ROWTYPE;
      TYPE dep_curtype IS REF CURSOR;
   ```
   2. 커서 변수 사용 (커서 변수와 쿼리문 연결)
   ```sql
      OPEN 커서변수명 FOR select 문; (강한 타입은 RETURN 타입과 맞춰야한다. )
   ```
   3. 커서 변수에서 결과 집합 가져오기
   ```sql
      FETCH 커서 변수명 INTO 변수1, 변수2...;
      FETCH 커서 변수명 INTO 레코드명; (한 row만)
   ```
   4. 커서 변수를 매개변수로 전달 : 커서도 변수이므로 함수/ 프로시저의 매개변수로 전달할 수 있다. 


### 커서 표현식
SELECT 문에 컬럼 형태로 커서를 사용하는 것이다. 
```sql
SELECT (
        SELECT department_name 
        FROM departments d 
        WHERE e.department_id = d.department_id 
       ) AS dep_name,
        e.emp_name
FROM employees e
WHERE e.department_id = 90;
```

## 레코드
PL/SQL에서 제공하는 데이터 타입 중 하나로, 문자형, 숫자형 같은 기본 빌트인 타입과 달리 복합형 구조이다. 일반 빌트인 타입으로 변수를 선언하면
해당 변수는 한 번에 하나의 값만 가질 수 있지만, 레코드는 여러 개의 값을 가질 수 있다. 

레코드는 선언 방식에 따라 커서형, 사용자 정의형, 테이블형 레코드로 나눌 수 있다. 
1. 사용자 정의형 : 테이블과 비슷한 구조인데 테이블의 컬럼에 해당하는 것을 필드라고 한다.

```sql
 TYPE 레코드명 IS RECORD (
     field1_Name field1_Type [[NOT NULL] := defaultValue],
     field2_Name field2_Type [[NOT NULL] := defaultValue],
 );
     
  recordVariable recordName;
      
   DECLARE
   
      TYPE depart_rect IS RECORD (
          department_id NUMBER(6),
          department_name VARCHAR2(80)
      )
       
      vr_dep departRect;
   BEGIN 
   ...
   END;
```

2. 테이블형 레코드 : 특정 테이블의 컬럼 값을 받아오는 변수를 선언할 때 사용할 수 있다.

```sql
-- 컬럼 값을 받아오는 변수 선언
    변수명 테이블명.컬럼명%TYPE;
        
-- 테이블의 모든 컬럼을 받아 사용하는 레코드
    레코드 변수명 테이블명.%ROWTYPE;
        
  DECLARE
    vr_dep departments%ROWTYPE;
  BEGIN 
    SELECT * INTO vr_dep 
    FROM departments
    WHERE department_id = 20;

    INSERT INTO ch11_dep2 values v_dep;

    COMMIT;
  END;
```

3. 커서형 레코드 : 커서를 레코드 변수르 받는 것을 커서형 레코드라고 한다. 

```sql
   DECLARE
   CURSOR c1 IS
   SELECT department_id, department_name, parent_id, manager_id
   FROM departments;

   vr_dep c1%ROWTYPE;
       
   BEGIN 
        DELETE ch11_dep;
        
        OPEN c1;
        
        LOOP
            FETCH c1 INTO vr_dep;
            EXIT WHEN c1%NOTFOUND;
            INSERT INTO ch11_dep VALUES vr_dep;
        END LOOP;
            
        COMMIT;
   END;
```