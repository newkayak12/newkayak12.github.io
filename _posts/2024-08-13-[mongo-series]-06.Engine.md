---
layout: post

categories: [MONGO]
---


# Engine

mongo의 스토리지 엔진은 MySQL과 같이 플러그인형이다. 3.0 이전에는 `MMAPv1`을 3.0 이후로는 `WireTiger`를 사용한다.
`MMAPv1`는 메모리 매핑을 기반으로 한다. 또한 데이터 셋 마다 2GB 씩 예비로 블록을 할당하는 특징을 가지고 있다.

이 두 가지 엔진은 '특별히 어떤 것이 좋다'라는 개념보다는 용도에 따라 다르게 세팅한다로 접근하는 것이 맞을 것으로 보인다.


## WireTiger
멀티코어 확장성과 램 사용량 최적화에 초점을 둔 확장 가능한 오픈 소스 데이터 엔진이다. 

```yaml
storage:
  dbPath: "/data/db"  #저장 경로
  journal:
    enabled: true #저널링 여부 bin로그랑 비슷한 느낌으로 보인다.
  engine: "wireTiger" 
  wireTiger:
    engineConfig:
      cacheSizeGB: 8 #인메모리 데이터용으로 비축해야하는 메모리 양이다. bufferPool과 비슷한 느낌으로 보인다.
      journalCompressor: none  #journal의 압축기 종류다. 
    collectionConfig:
      blockCompressor: none  # 수집 데이터에 사용할 압축기 종류다. none|snappy|zlib이 있다.
    indexConfig:
      prefixCompressor: false # 인덱스에 압축 사용여부다.
```

## 데이터 구조
key-value 형태를 위한 기본 클래스가 있다. 컬렉션 키로 레코드에 대한 빠른 액세스를 보장하는 식이다. 키를 인덱싱하여 저장 공간을 희생하여 속도를 끌어올릴 수도 있다.
보통 B-Tree로 구성되어 있다. B-Tree는 블록 단위로 구분된다. 루트노드에서 아래로 내려가면서 데이터를 가리키는 pointer를 저장한다. 또한 B-Tree는 정렬되어 있다.


## 잠금
Mongo 는 Mutex(상호 배제)를 사용해서 서버 수준의 락킹을 제공했다. 여러 클라이언트, 쓰레드가 같은 리소스로 접근하면 이를 비동시적으로 액세스할 수 있도록 보장한다.
이후 서버에서 컬렉션 수준 잠금이 도입되면서 컬렉션이 다르면 쓰기 작업에 락이 영향을 미치지 않는 식으로 변경되었다.  이후 3.0 WireTiger부터는 도큐먼트 수준까지 지원한다.(MySQL record기반 잠금과 같이)