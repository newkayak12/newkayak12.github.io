from [Dictionary - GC Algorithm](https://github.com/newkayak12/Dictionary/blob/master/java/06.GC_Algorithm.md)

# 가비지 컬렉션 알고리즘

## 1. Serial GC
1. 서버의 CPU 코어가 1개일 때 사용하기 위해서 개발된 GC
2. GC 처리하는 쓰레드가 1개라서 `STW`가 길다.
3. MinorGC에서는 `Mark-Sweep`, MajorGC에서는 `Mark-Sweep-Compact`

```shell 
java -XX:+UseSerialGC -jar Application.java
```

## 2. Parallel GC
1. Java 8의 Default
2. Serial GC와 기본 알고리즈은 같지만 Young 영역의 Minor GC를 멀티 쓰레드로 수행 (Old는 Single)
3. Serial GC에 비해서 STW가 줄어

```shell
java -XX:+UseParallelGC -jar Application.java 
# -XX:ParallelGCThreads=N : 사용할 쓰레드의 갯수
```

## 3. Parallel Old GC(Parallel Compacting Collector)
1. Parallel GC를 개선한 버전
2. Young, Old도 멀티 GC
3. 새로운 GC 청소 방식인 `Mark-Summary-Compact` 방식을 이용 (Old도 Multi)

```shell
java -XX:+UseParallelOldGC -jar Application.java
# -XX:ParallelGCThreads=N : 사용할 쓰레드의 갯수
```

## 4. CMS GC (Concurrent Mark Sweep)
1. 어플리케이션 쓰레드와 GC 쓰레드가 동시에 실행되어 STW를 최대한 줄이기 위래서 고안된 GC
2. GC 과정이 매우 복잡
3. GC 대상을 파악하는 과정이 복잡한 여러 단계로 수행되기 때문에 다른 GC 대비 CPU 사용량이 높다.
4. 메모리 파편화 문제
5. CMS GC는 Java9부터 `deprecated`, Java14에는 중지됨

```shell
# deprecated in java9 and finally dropped in java14
java -XX:+UseConcMarkSweepGC -jar Application.java
```

## 5. G1 GC (Garbage First)
1. GMC GC를 대체하기 위해서 Java 7에서 최초로 release
2. Java 9+의 디폴트 GC
3. 4GB 이상의 Heap, STW이 0.5 이상이될 때 사용 (Heap이 너무 작으면 미사용 권장)
4. 기존의 GC에서는 HEAP 영역을 물리적으로 고정된 Young/ Old로 나눴지만 G1은 `Region`을 도입. Eden, Survivor, Old를 고정이 아닌 동적으로 부여 
5. Garbage로 가득찬 영역을 빠르게 회수하여 빈 공간을 확보하므로, 결국 GC 빈도가 줄어드는 효과를 얻게 되는 식

![](/assets/imgg1Detail.png)

```shell
java -XX:+UseG1GC -jar Application.java
```

## 6. Shenandoah GC
1. Java 12에 release
2. RedHat에서 개발
3. 기존 GMS가 가진 단편과, G1이 가진 pause 이슈를 해결
4. 강력한 Concurrency와 가벼운 GC 로직으로 Heap 사이즈에 영향을 받지 않고 일정한 Pause 시간 소요가 특징

```shell
java -XX:+UseShenandoahGC -jar Application.java
```

## 7. ZGC( Z Garbage Collector )
1. Java 15에 release
2. 대량의 메모리(8MB ~ 16TB)를 low-latency로 잘 처리하기 위해서 디자인된 GC
3. G1의 Region처럼 ZGC는 `ZPage`라는 영역을 사용하며, G1의 Region은 크기가 고정이지만 ZPage는 2mb 배수로 운영됨
4. ZGC가 내세우는 최대 장점은 힙 크기가 증가해도 STW가 절대로 10ms를 넘지 않는다.

```shell
java -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -jar Application.java
```