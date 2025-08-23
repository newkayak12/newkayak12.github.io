---
layout: post

categories: [MONGO]
---


# 쿼리 최적화

## 프로파일러

```javascript
use [db]
db.setProfilingLevel()
/**
 * 0. 프로파일러를 끈다.
 * 1. slowQuery만 남긴다.
 * 2. 모든 읽기, 쓰기를 로그에 기록한다.
 */
```

## 프로파일링 결과
프로파일링 결과는 `system.profile`이라는 capped Collection에 쌓인다. `db.system.profile.find().sort({$natural:-1}_`으로 확인할 수 있다.
$natural로 최신순부터 확인할 수 있다.


```mongodb-json
[
  {
    "command": {
      "find": "test",
      "filter": {
      },
      "$db": "test"
    },
    "executionStats": {
      "executionSuccess": true,
      "nReturned": 7,
      "executionTimeMillis": 1,
      "totalKeysExamined": 0,
      "totalDocsExamined": 7,
      "executionStages": {
        "stage": "scan",
        "planNodeId": 1,
        "nReturned": 7,
        "executionTimeMillisEstimate": 0,
        "opens": 1,
        "closes": 1,
        "saveState": 0,
        "restoreState": 0,
        "isEOF": 1,
        "numReads": 7,
        "recordSlot": 4,
        "recordIdSlot": 5,
        "fields": [],
        "outputSlots": []
      },
      "allPlansExecution": []
    },
    "explainVersion": "2",
    "ok": 1,
    "queryPlanner": {
      "namespace": "test.test",
      "indexFilterSet": false,
      "parsedQuery": {
      },
      "queryHash": "E475932B",
      "planCacheKey": "B5EF3534",
      "maxIndexedOrSolutionsReached": false,
      "maxIndexedAndSolutionsReached": false,
      "maxScansToExplodeReached": false,
      "winningPlan": {
        "queryPlan": {
          "stage": "COLLSCAN",
          "planNodeId": 1,
          "filter": {
          },
          "direction": "forward"
        },
        "slotBasedPlan": {
          "slots": "$$RESULT=s4 env: { s1 = TimeZoneDatabase(Asia/Kuala_Lumpur...Etc/GMT+4) (timeZoneDB), s2 = Nothing (SEARCH_META), s3 = 1723330456074 (NOW) }",
          "stages": "[1] scan s4 s5 none none none none lowPriority [] @\"fc04cb0f-b6da-46ab-acca-f4ff59ebfbae\" true false "
        }
      },
      "rejectedPlans": []
    },
    "serverInfo": {
      "host": "ae2c49333eb0",
      "port": 27017,
      "version": "7.0.4",
      "gitVersion": "38f3e37057a43d2e9f41a39142681a76062d582e"
    },
    "serverParameters": {
      "internalQueryFacetBufferSizeBytes": 104857600,
      "internalQueryFacetMaxOutputDocSizeBytes": 104857600,
      "internalLookupStageIntermediateDocumentMaxSizeBytes": 104857600,
      "internalDocumentSourceGroupMaxMemoryBytes": 104857600,
      "internalQueryMaxBlockingSortMemoryUsageBytes": 104857600,
      "internalQueryProhibitBlockingMergeOnMongoS": 0,
      "internalQueryMaxAddToSetBytes": 104857600,
      "internalDocumentSourceSetWindowFieldsMaxMemoryBytes": 104857600,
      "internalQueryFrameworkControl": "trySbeEngine"
    }
  }
]
```
`nReturned`, `totalDocsExamined` 필드로 가늠해 볼 수는 있다. 전체, 스캔된 대상이다. 또한 `executionStats`, `queryPlanner`, `allPlansExecution`을 보면
쿼리 옵티마이저가 시도한 플랜 리스트를 포함한다. `executionTimeMillis`는 쿼리 시간이다.
`allPlansExecution`는 시도한 쿼리 플랜이다.

## hint
MySQL와 같이 `hint()`를 줄 수 있다. 이는 마찬가지로 쿼리 옵티마이저에게 실행 계획 작성 시 사용자가 개입할 수 있게 해준다.
`db.test.find().hint(~)`


## 쿼리 플랜 캐시

몽고는 성공적인 쿼리 플랜이 발견되면 쿼리 패턴, `nReturned`, 인덱스 규격이 기록된다. MySQL이 통계 정보를 사용하는 것과 비슷하게 쿼리 결과를 캐싱해서 
이를 통해서 옵티마이저의 최적화를 노리는 것으로 보인다. 옵티마이저는 아래와 같은 이벤트가 발생하면 캐싱된 플랜을 버린다.

- 컬렉션에 대해서 100회 쓰기가 발생
- 컬렉션에 인덱스가 추가되거나 삭제된다.
- 캐시 쿼리 플랜을 사용했을 때 훨씬 많은 작업을 수행했을 때 `nReturned` 값의 최소 10배를 능가하는 `totalDocsExamined`의 값 (다른 인덱스가 더 효율적이라면 옵티마이저는 주저 없이 플랜을 버린다.)

## 쿼리 패턴

1. 단일키 인덱스
   1. 완전 일치 (`$eq`)
   2. 정렬 (`sort()`)
   3. 범위 쿼리 (`$gt`, `$lt`, `$gte`, `$lte`)
2. 복합키 인덱스
   1. 완전일치 (순서까지)
   2. 범위 일치 (왼쪽부터 완전일치/ 범위일치, 뒤쪽은 없거나 범위)
   3. 커버링 인덱스(Query, Projection까지 인덱스만으로 결정되는 경우)