---
layout: post
categories: [MYSQL]
---
from [Dictionary - About SQL](https://github.com/newkayak12/Dictionary/blob/master/sql/01.AboutSql.md)


# SQL? PL/SQL?

SQL (structured Query Language)는 DBMS 상에서 데이터를 읽고 쓰고 삭제하는 등 데이터를 관리하기 위한 프로그램 언어
Java, C 등은 절차적 언어, SQL은 집합적 언어라고 할 수 있다.


# DML / DDL
```
DDL : 데이터 정의어 (데이터베이스 객체를 생성, 삭제, 변경하는 언어)
    {
        CREATE / DROP / ALTER / TRUNCATE(테이블, 클러스터의 데어틀 통쨰로 삭제)
    }
DML : 데이터 조작어
    {
        SELECT / INSERT / UPDATE / DELETE / COMMIT / ROLLBACK
    }

DCL : 데이터 제어 언어
    {
        GRANT / REVOKE
    }
```
# PL/SQL

PL/SQL 은 절차적 언어이다. 변수에 값을 할당하고 예외처리도 할 수 있으며, 특정 기능을 처리하는 함수나 프로시저를 생성할 수도 있다. 또한 DB 서버에 코드가 올라가
컴파일되어 수행된다는 점이 특징이다.