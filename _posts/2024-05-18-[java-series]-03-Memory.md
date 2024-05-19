from [Dictionary - memory](https://github.com/newkayak12/Dictionary/blob/master/java/03.Memory.md)
# Memory (Runtime Data Area)

- Method(static) 영역
- Stack 영역
- Heap 영역

![](images/jvm2.png)

## 1. 자바 변수 종류

1. 클래스 변수: 클래스 영역에서 `static`이 붙는 변수 - 클래스가 메모리에 올라갈 떄
2. 인스턴스 변수: `static`이 나닌 변수 (참조 없을 경우 gc 대상) - 인스턴스가 생성될 때
3. 지역 변수: 메소드 내에서 선언, 메소드가 끝나면 소멸 - 해당 메소드가 실행될 때
4. 매개 변수: 메소드 호출 시 전달하는 값 - 해당 메소드가 실행될 때

## 2. Method(Static) 영역 ( == Class area, Static area)

1. JVM이 동작해서 클래스가 로딩될 때 생성
2. JVM이 읽어들인 클래스와 인터페이스에 대한 정보(멤버 변수, 런타임 상수 풀, 생성자, 메소드 등)와 함께 클래스 변수(static variable)가 저장되는 영역 

   ↳ Field Information: 멤버 변수의 이름, 데이터 타입, 접근 제어자에 대한 정보
   
   ↳ Method Information: 메소드 이름, 리턴 타입, 매개변수, 접근제어자에 대한 정보

   ↳ Type Information: class인지 interface인지 여부 저장, 전체 이름, super의 이름(interface, object인 경우 Heap에서 관리)


3. Method(Static) 영역에 있는 것은 어느 곳에서나 접근 가능
4. Method(Static) 영역에 있는 데이터는 프로그램 시작 ~ 종료까지 메모리에 남아 있다. 

### 2.1 Runtime Constant Pool
static 영역에 존재하는 별도 관리 영역 상수 자료형을 저장하여 참조하고 중복을 막는다. 

## 3. Stack 영역

1. 메소드 내에서 정의하는 기본 자료형에 해당되는 지역 변수의 데이터 값이 저장되는 공간
2. 메소드가 호출될 때 스택 영역에 스택 프레임<sup>[[1]](#stackframe)</sup>이 생기고 그 안에서 메소드를 호출
3. primitive 타입에 해당되는 지역변수, 매개 변수 데이터 값이 저장됨
4. 메소드가 호출될 때 메모리에 할당되고 종료되면 메모리에서 사라짐
5. Stack은 LIFO이며, 스코프 범위를 벗어나면 스택 메모리에서 사라진다. 

### 4. Heap<sup>[[2]](#heap)</sup>

1. JVM이 관리하는 프로그램 상에서 데이터를 저장하기 위해 런타임 시 동적으로 할당하여 사용하는 여역
2. `new` 연산자로 생성되는 참조형 데이터 타입을 갖는 객체, 배열 등이 저장되는 공간
3. Heap에 있는 오브젝트들을 가리키는 레퍼런스 변수는 stack에 적재
4. Heap는 Stack과 다르게 보관되는 메모리가 호출이 끝나더라도 삭제되지 않고 유지. 그러나 Heap에 인스턴스를 참조하지 않는 상황이 되면 GC 대상이 된다.
5. stack은 쓰레드 개수마다 생성되지만 Heap은 몇 개의 쓰레드가 존재하든 상관 없이 하나의 Heap만 존재한다.


![](images/heap.png)
<cite> https://inpa.tistory.com/entry/JAVA-☕-그림으로-보는-자바-코드의-메모리-영역스택-힙# </cite>
![](images/heap_detail.png)
<cite> https://1-7171771.tistory.com/140 </cite>

<p style="color: palevioletred"> method(static) area? permenent generation?</p>
<strike>1. Permanent Generation : 생성된 객체들의 정보의 주소 값이 저장된 공간이다. 클래스 로더에 의해 load되는 Class, Method 드엥 대한 Meta 정보가 저장되는 영역 (Reflection을 사용하여 동적으로 클래스가 로딩되는 경우에 사용)</strike>

1. MetaSpace<sup>[[3]](#metaspace)</sup>: class의 메타 정보, 메소드의 메타 정보, static object 변수, 상수, JVM, JIT 관련 데이터 등
2. New/Young 
   - 메모리에 객체가 생성되면 Eden에 생성된다.
   - Eden에 메모리가 가득차면 Eden 데이터가 Survivor1 혹은 Survivor2로 옮겨진다. 1,2 우선 순위는 없다. 
   - Survivor에 있으면 어디에서인가 참조되고 있는 객체들이다. 둘 중 하나가 가득차면 공간이 남아 있는 Survivor로 옮겨진다. 
   - 이러한 매커니즘으로 Survivor1 혹은 Survivor2 둘 중 하나는 항상 비워져 있다.

이 과정에서 `Minor GC`가 발생한다. New/Young에서 발생하는 CG로 Eden 또는 Survior1, Survior2에서 사용되지 않는 객체들을 삭제한다.


1. Old
   - Survivor 1, 2를 왔다 갔다하는 동안 살아남은 객체들은 Old로 간다. Old는 Young 보다 크게 할당한다. 이러한 이유로 Old의 GC는 Young보다 드물다.
   - 간혹 Eden -> Old로 넘어가는 경우가 있는데 Survivor에 담을 수 없을 만큼 큰 경우 발생한다. 

![](images/heapGc.png)

### 오랫동안 살아남은 객체?

> Minor GC가 발생하면 ageBit를 1씩 늘린다. ageBit이 MaxTenuringThreshold<sup>[[4]](#maxtenuringthreshold)</sup>를 초과하면
> Old로 이동한다. (너무 커서 Eden에서 Old로 바로 이동하기도 한다.)
> 
> Old에서는 Major GC(Full Gc)가 일어나며, GC를 진행하는 Thread를 제외하고 이외의 모든 Thread를 멈춘 상태로 GC가 진행된다.
> 이 상태를 `stop-the-world`라고 한다.  JVM에서 GC를 튜닝하는 이유가 stop-the-world 시간을 단축시키 위함이다.

### GC 알고리즘 종류
1. Serial GC : JDK 5,6에서 사용 Minor, Major 모두 싱글 스레드로 실행 -> Stop-The-World가 김.
             Mark-Sweep-Compact 알고리즘 사용 (식별하고 지우고 빈공간 정리, 압축)
2. Parallel GC : Young에서 Minor GC 수행 시 멀티쓰레드 사용(SingleCore CPU라면 Serial로 동작)
3. Parallel old GC : Old에서 Full GC도 병렬로 처리. Old에서 GC를 처리할 때 Mark-Summary(살아 있는 객체를 식별)-Compaction 사용
4. CMS(Concurrent Mark & Sweep) GC : Major GC를 최소한으로 하려는데 초점을 둠. MajorGC 수행 시간을 줄기이 위해서 GC의 대상 객체를 최대한 정밀하게 파
  - Initial Mark : 현재 살아남은 객체를 탐색, GC ROOT에서 참조하는 객체들만 우선적으로 탐색(STW 매우 적음)
  - Concurrent Mark : Initial Mark에서 탐색한 객체들이 참조하고 있는 객체를 찾아가면 GC 대상인지 판별 (STW 없음)
  - ReMark : Concurrent Mark 실행 중 새로 생성된 객체나, 참조가 끊어지는 등 변경된 사항이 있는지 다시 한 번 확인 (STW 발생 -> 멀티쓰레딩으로 시간 단축)
  - Concurrent Sweep : ReMark까지 검증 완료된 GC 대상을 삭제 (STW 없이 진행)

> CMS GC는 Compact를 하지 않기 때문에 메모리 단편화를 신경써야 한다. 연속적으로 메모리 할당이 불가능할 정도까지 도달했으면  Compaction을 해야하는데, 이때 다른 GC의 Compaction보다
> Stop-The-World가 길다.

5. G1 GC (Garbage First GC)
기존 CG 알고리즘으로 큰 메모리에서 효율이 좋지 못해서 개선하기 위해서 등장했다. 기존의 Heap과는 다르게 `Region`으로 나눠서 관리한다.

![](images/G1.png)
<cite> https://1-7171771.tistory.com/140 </cite>

Region이라는 논리적인 단위로 메모리를 관히하며, CMS와ㅏ 달리 Compaction을 진행하고 메모리 단편화 문제를 없앰. STW 시간을 예측할 수 있다.

- Humonogous : Region 크기의 50%를 초과하는 객체가 저장되는 공간. 이 공간에서 GC가 효율적으로 일어나지 않는다.
- Available/Unused : 아직 사용하지 않은, 비어있는 공간

Young GC를 수행할 때 STW가 발생, 멀티쓰레드로 극복한다. Young GC는 Regionwnd GC 대상 객체가 가장 많은 Region에서 진행(Eden / Survivor).
이 Region에서 살아남은 객체를 다른 Region(Survivor)로 옮기고 빈 Region을 Available/Unused로 돌린다.

------------------
<a name="stackfram">[1]</a> : 하나의 메소드에 필요한 메모리 덩어리를 묶어서 스택 프레임이라고 한다. 하나의 메소드당 하나의 스택 프레임이 필요하며, 메소드를 호출하기 직전 스택 프레임을 자바 Stack에 생성한 후 메소드를 호출한다.

<a name="heap">[2]</a> : 자바 코드를 실행할때 따로 `-Xms`과 -`Xmx` 옵션을 사용하면 힙 메모리의 초기 사이즈와 최대 사이즈를 조절할 수 있다.

<a name="heap">[3]</a> : 자바 8부터 변경되었다. 이 영역은 Native 메모리 영역으로 JVM이 아닌 OS에서 관리되도록 변경됐다. 

<a name="maxtenuringthreshold">[4]</a> :  기본 값 15

