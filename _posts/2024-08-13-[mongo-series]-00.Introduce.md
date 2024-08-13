---
layout: post

categories: [MONGO]
---

# MongoDB

MonoDB은 <strong>문서 지향 데이터 모델( Document DB )</strong>을 사용하는 DB다. 구조가 비교적 자유롭다.

|   \   |                              MONGO                              |                                         RDB                                          |
|:-----:|:---------------------------------------------------------------:|:------------------------------------------------------------------------------------:|
|  용도   | - 정형, 비정형 데이터 저장<br/> - 초당 동시 처리가 중요한 경우 <br/> - 로그, 이력 등 단순 기록 |                 - 무결성, 일관성이 중요한 트랜잭션 베이스 작업 <br/> - 데이터 정합성이 요구되는 경우                 |
|  모델링  |      - 반정규화를 기본으로한다. <br/> - 비정형 구조라 미리 스키마를 선언하는 구조는 아니다.      | - 엔티티 간의 관계를 정의할 필요가 있음 <br/> - 정규화가 필요한 경우, 지키면서 설계하는 것이 중요할 수 있다. <br/> - 스키마에 엄격함 |
|  성능   |              - 클러스터 크기, 네트워크 및 애플리케이션에 의해서 성능이 결정됨              |                                 - 구조, 질의 튜닝에 의해서 달라짐                                 |
| 인터페이스 |                  - 쿼리 외 다양한 API로 질의를 수행할 수 있음                   |                                      - SQL만 가능함                                      |
|  장점   |                 - 쿼리 프로세싱이 단순화되어 대용량 처리 성능이 향상됨                 |                               데이터 무결성, 정합성 등을 지킬 수 있음                                |
|  단점   |                    정합성, 무결성, 일관성이 떨어지고 용량이 큼                    |                                    쿼리 처리 과정이 복잡함                                     |

## 특징
1. Reliability : ReplicaSet으로 둘 경우 failOver가 가능하고, 고가용성을 지원함
2. Scalability : Sharding을 통한 Scale-out에 용이하다.
3. Flexibility : 스키마 제약이 없이 때문에 유연하기 구조를 변경할 수 있음
4. Index Support : 
   1. 인덱스를 지원하여 다른 NoSQL보다 빠른 검색이 가능함
   2. 다양한 형태의 Index를 제공함 (Hashed, MultiKey, Partial, TTL, Geospatial)

## 구조
DB 아래 Table과 유사한 컬렉션(Collection)으로 이뤄져 있다. Colelction 아래 row와 유사한 Document가 있다. 정리하면 아래와 같다.

- Database : Collection의 물리적 컨테이너
- Collection : RDBMS의 TABLE과 같음 스키마less
- Document : key-value 이뤄진 구조
- Key/Field : 컬럼 정도로 생각하면 낫지 않을까?

## Bson, Json
Json은 JavaScript Object Notation으로 key-value 값으로 채워져 있다.
Bson은 Json을 Binary로 변경한 것이다.

Json에는 아래와 같은 문제점이 있다.
1. 구문 분석이 느리다.
2. 공간 효율성이 떨어진다.

그래서 이를 Binary로 변환하여 저장한다.