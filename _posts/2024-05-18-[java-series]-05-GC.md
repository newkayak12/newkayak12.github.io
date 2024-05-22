---
layout: post
categories: [JAVA]
---

from [Dictionary - GC](https://github.com/newkayak12/Dictionary/blob/master/java/05.GC.md)

# GC
자바의 메모리 관리 방법 중 하나로 JVM의 HEAP 영역에서 동적으로 할당했던 메모리 중 필요 없게 된 메모리 객체(garbage)를 모아 주기적으로 제거하는 프로세스
(C/C++ 은 수동으로 메모리 할당, 해제를 해야했다.)

## 1. 대상
판단 근거로 도달성, 도달능력(Reachability)라는 개념을 적용한다. 객체에 레퍼런스가 있다면 Reachable<sup>[[1]](#reachable)</sup>, 객체에 유효한 레퍼런스가 없으면 UnReachable<sup>[[2]](#unreachable)</sup>로 구분한다.
주로 Heap Area에서 참조하고 있지 않은 객체가 GC 대상이 된다.


# 청소 방식
## Mark And Sweep
GC가 동작하는 가장 기초적인 청소 과정.

GC 대상이 될 객체를 식별(Mark), 제거(Sweep)하며 객체가 제거되며 파편화된 메모리를 영역 앞에서부터 채워나가는 작업을 수행한다.
1. Mark : Root Space부터 그래프 순회를 통해서 연결되나 객체를 찾아서 각각 어떤 객체를 참조하고 있는지 마킹
2. Sweep : Unreachable를 Heap에서 제거한다.
3. Compact : Heap의 시작 주소를 모아 메모리가 할당된 부분과 아닌 부분으로 압축한다. (GC 종류에 따라 하지 않는 경우도 있음 )


![](/assets/imgrootSpace.png)


## GC 동작 과정
![](/assets/imggc.png)

Heap은 동적으로 레퍼런스 데이터가 저장되는 공간으로 GC 대상이 되는 공간이다. Heap은 아래 2가지를 전제(Weak Generational Hypothesis)로 설계됐다.
1. 대부분 객체는 금방 접근 불가능한 상태(Unreachable)가 된다.
2. 오래된 객체에서 새로운 객체로의 참조는 아주 적게 존재한다.

즉, 객체는 대부분 일회성, 메모리에 오랫동안 남을 경우는 드물다는 것이다. 
![](/assets/imgbasicHeap.png)

1. Young
   - 새롭게 객체가 할당되는 영역
   - 대부분 객체가 금방 Unreachalbe이 되므로 Young에 생성됐다 사라짐
   - Young에 대한 GC를 Minor GC라고 부름
2. Old
   - Young에서 Reachable을 유지하면 복사되는 영역
   - Young보다 크게 할당됨. 크기가 큰 만큼 가비지는 적게 발생
   - Old에 대한 GC를 Full GC라고 부름

 ![](/assets/imgdetailHeap.png)

1. Eden
   - new를 통해 생성된 위치
   - 정기적 쓰레기 수집 후 살아남으면 Survivor로 보냄
2. Survivor 0/ 1
   - 최소 1 번 이상의 GC에서 살아남은 객체가 존재하는 영역
   - Survivor 0, 1 중 하나는 꼭 비어 있다.

![](/assets/imgpermanent.png)


## MinorGC
Young은 Old에 비해서 상대적으로 작기 때문에 메모리 상의 객체를 찾아 제거하는데 적은 시간이 걸린다.

1. 처음 생성된 객체는 Young 영역의 Eden에 위치
2. Eden이 꽉차면 MinorGC 발생
   1. Obj MarK로 Reachable 탐색
   2. 살아 남은 Obj Survivor로 이동
   3. Eden의 unreachable gowp
   4. 살아남은 모든 객체 `age`<sup>[[3]](#age)</sup> += 1
   5. Eden이 가득 차면 비어있는 Survivor로 Eden, 기존 Survivor 내용들 이동 
   6. 옮긴 Survivor 내역들 `age` += 1

## MajorGC
Old는 길게 살아남은 메모리들이 존재하는 공간. age 임계 값을 초과해서 이동되는 녀석 가끔 Young에 담을 수 없을 정도로 크면 Old로 보내기도 함
그리고 <strong>MajorGC</strong>는 객체들이 계속 Promotion되어 Old가 부족해지면 발생


#### MinorGC vs. MajorGC

| GC Type |  MinorGC   | MajorGC  |
|:-------:|:----------:|:--------:|
|   대상    |   Young    |   Old    |
|  실행 시점  | Eden이 꽉 차면 | Old가 꽉차면 |
|  실행 속도  |    빠르다     |   느리다    |



MajorGC는 old가 꽉 차면 Unreachable을 한꺼번에 삭제하는 MajorGC가 실행된다. Young은 크기가 작기에 빠르지만 Old는 크기에 보통 10배 이상의 시간을 사용한다.
또한 <strong> STOP-THE-WORLD </strong>가 발생한다. 이 때 Thread가 멈추고 Mark and Sweep을 하므로 일시적으로 멈추기 때문


------
<a href="reachable">[1]</a> : 객체가 참조되고 있는 상태

<a href="unreachable">[2]</a> : 객체가 참조되고 있지 않은 상태 (GC 대상)

<a href="age">[3]</a> : Survivor 영역에서 객체가 살아남은 횟수. Object Header에 기록 age가 임계 값에 다다르면 Promotion( Old로 이동 여부를 결정. 기본 임계값은 31)