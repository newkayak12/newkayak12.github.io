---
layout: post
categories: [MYSQL]
---
from [Dictionary - SQL](https://github.com/newkayak12/Dictionary/blob/master/sql/03.SQL.md)


# SQL

1. SELECT
2. INSERT
3. UPDATE
4. MERGE : 조건을 비교해서 테이블에 해당 조건에 맞는 데이터가 없으면 INSERT / 있으면 UPDATE
```sql
MERGE INTO [SCHEMA.]tableName
    USING (update or insert target)
    ON (update condition)
WHEN MATCHED THEN
    SET (col1 = val1, col2 = val2, ...)
WHERE (update condition)
    DELETE WHERE (update_delete condition)
WHEN NOT MATCHED THEN
    INSERT ( col1, col2 ... ) VALUES ( val1, val2, ... )
    WHERE ( insert conditoin );
```
5. DELETE
6. COMMIT / ROLLBACK : COMMIT은 변경한 데이터를 데이터베이스에 마지막으로 반영하는 역할을, ROLLBACK은 그 반대로 변경한 데이터를 변경하기 이전 상태로 되돌리는 역할
```sql
COMMIT [WORK] [TO SAVEPOINT savePointName];
ROLLBACK [WORK] [TO SAVEPOINT savePointName];
```
7. TRUNCATE : DELETE와 같은 기능을 수행하지만 삭제한 후 COMMIT을 해야 데이터가 완전히 삭제되고, 반대로 ROLLBACK을 실행하면 데이터가 삭제되기 전으로 복귀한다.
단, DDL에 속하는 TRUNCATE는 실행하면 데이터가 바로 삭제되고, ROLLBACK을 실행하더라도 삭제 전 상태로 복귀되지 않는다.
```sql
TRUNCATE TABLE [SCHEMA.]tableName;
```