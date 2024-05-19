from [Dictionary - 자바 버전별 정보](https://github.com/newkayak12/Dictionary/blob/master/java/01.version_info.md) 

# JDK 1.0 
- 안정화 작업

# JDK 1.1
- 이너 클래스, JavaBeans, RMI, Reflection, Calendar 유니코드 지원

```
Javabeans : 자바로 작성된 소프트웨어 컴포넌트
	> 1. 기본 생성자가 반드시 존재해야한다.
 	> 2. 모든 속성은 비공개
	> 3. 속성에 접근하고 꺼내올 수 있는 getter, setter 구성
	> 4. Serializable 구현

RMI : Remote Method Invocation의 약자로 분산 애플리케이션을 구축하는 데 사용, 한 시스템(JVM)에 상주하는 객체가 다른 JVM에서 실행 중인 객체에 액세스, 호출할 수 있도록 도와주는 메커니즘


```
# JDK 1.2

- JIT(HotSpot), Collection Framework 등 추가

# J2SE 1.3

- HotSpot JVM, JNDI, JPDA, JavaSound 등이 추가


# J2SE 1.4

```
assert, 정규표현식, IPv6, XML API, JCE, JSSE, JAAS, Java Web Start 등이 추가

```


# J2SE 5

- Generics 추가
- Annotation 추가
- 동시성 제어 API (Concurrency API) 추가
- Enumeration 추가
- Auto Boxing/ Unboxing 추가


# Java SE 7

- Diamond Operator ( '<>' ) 추가


# Java SE 8 (오라클 인수 이후)

- Lambda Expression 지원
- Method Reference 지원
- 인터페이스에 default method가 추가
- Optional 추가
- 날짜와 시간 API 추가
```java
     //javax.time.Clock
     Clock.systemUTC();                    //current time of your system in UTC. 
     Clock.millis();                        //time in milliseconds from 1/1/1970.
     
     //javax.tme.ZoneId
     ZoneId zone = ZoneId.of(“Europe/London”);        //zoneId from a timezone. 
     Clock clock = Clock.system(zone);            //set the zone of a Clock.
     
     //javax.time.LocalDate
     LocalDate date = LocalDate.now();            //current date 
     String day = date.getDayOfMonth();            //day of the month 
     String month = date.getMonthValue();            //month 
     String year = date.getYear();                //year
```   

- Stream API 추가
- PermGenArea 제거 : java8이전에는 초기 설정시 PermSize, MaxPerSize를 성정해야 했는데 이후 MetaSpace로 변경됐다. MetaSpace는 런타임 시 메모리 요규 사항에 따라 자체 크기를 조정하며, 필요하다면 MaxMetaspaceSize 매개변수를 조정하여 양을 조정할 수 있다.
<img src="./images/pergen_area.png">
```
## Permanent Generation
- Permanent Generation은 Class 혹은 Method Code가 저장되는 영역
- PermGen은 Heap에 속함
- Default로 제한된 크기를 가짐

## Metaspace
- Metaspace는 Java 클래스 로더가 현재까지 로드한 class들의 메타 데이터가 저장되는 공간
- JVM에 의해 관리되는 Heap이 아닌 OS 레벨에서 관리되는 Native 메모리 영역에 위치
- Default로 제한된 크기를 가지고 있지 않고, 필요한 만큼 늘어남

```


# Java SE 9


- 모듈 시스템 jigsaw 등장 (https://www.baeldung.com/project-jigsaw-java-modularity)
- A New HTTP Client : 8까지 사용하던 HttpURLConnection을 대체할 새로운 java.net.http 패키지 추가
- JsShell : main 메소드 없이 코드를 테스트할 수 있는 대화식 REPL(Read-Eval-Print-Loop) 도구를 제공
- Process API 개선 : OS 프로세스 관리 및 컨트롤을 위해 (java.lang.ProcessHandle, java.lang.ProcessHandle.Info)가 추가 됐다.
- Try-With-Resource 개선
- 다이아몬트 연산자를 익명클래스에서도 사용할 수 있도록 개선됨
- Interface Private Method 인터페이스 내에서 private 메소드 사용이 가능해짐
- Optional To Stream :  Optional로 Stream을 생성할 수 있게 됐다. 
        > Stream<Integer> steram = Optional.of(1).stream();


# Java SE 10

- Local-Variable Type Interface : 로컬 변수 타입 추론 기능이다. 로컬 변수 타입을 var로 선언할 수 있다.
```java
var list - new ArrayList<String>();	//ArrayList<String> 으로 추론
var stream = list.stream();		//Stream<String> 으로 추론

var numbers = List.of(1, 2, 3, 4, 5);	//List<Integer> 으로 추론

for (var number : numbers){		//Integer 추론
	System.out.println(number);
}
```
- Garbage Collector Interface : 다양한 GC의 코드 고립도를 향상하는 인터페이스 도입
- Thread-Local Handshakes : VM safepoint를 수행할 필요 없이 개별 쓰레드를 stop하고 콜백을 수행할 수 있도록 추가
```
VM safePoint :: "Stop The World"로 모든 쓰레드를 일시 정지시키는 작업
    safepoint를 발생시키는 경우
    - Garbage collection pauses
    - Code deoptimization
    - Flusing code cache
    - Class redefinition
    - Biased lock revocation
    - Various debug operation 

```
- Root Certificates : HTTPS 통신에 쓰이는 root CA 목록을 OracleJdk에서도 가지게 됐다.

# Java SE 11
- HTTP 클라이언트(JEP 321) : java 9에 포함됐던 HTTP 클라이언트 API를 정식 채택, URLConnection 기반의 HTTP 개발보다 개선된 기능, 명명 규칙을 제공한다. 특히 HTTP 2.0을 지원하여 웹소켓도 포함되어있다.
- 새로운 String 메소드 추가

|     Method      |                          Description                           |
|:---------------:|:--------------------------------------------------------------:|
|     strip()     |                         문자열 앞, 뒤 공백 제거                         |
| stripLeading()  |                          문자열 앞의 공백 제거                          |
| stripTrailing() |                          문자열 뒤의 공백 제거                          |
|    isBlank()    | 문자열이 비어있거나 공백만 포함되어있을 경우 true (String.trim().isEmpty()와 결과 같음) |
|     lines()     |                     문자열을 라인 단위로 쪼개는 스트림 반환                     |
|    repeat(n)    |                   지정된 수 만큼 문자열을 반복하여 붙여서 반환                    |

```java
 trim()은 U+0020이하의 값만 공백으로 인식(tab, CR, LF, 공백) 하지만 유니코드에는 외에 다른 공백을 제공하는데 이를 제거하려면 Character.isWhitespace(int)를 사용해야만 했다.
Java SE 11 부터는 strip()을 사용하면 된다.
``` 

- Lambda 파라미터로 var 사용
```java
(var x, var y) -> x.process(y) => (x, y) -> x.process(y)
```

# Java SE 12
- 문법적으로 Switch 문을 확장
```java
//기존 방식

switch (day) {
    case MONDAY:
    case FRIDAY:
    case SUNDAY:
        System.out.println(6);
        break;
    case TUESDAY:
        System.out.println(7);
        break;
    case THURSDAY:
    case SATURDAY:
        System.out.println(8);
        break;
    case WEDNESDAY:
        System.out.println(9);
        break;
}


//Java SE 12 부터의 방식

switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> System.out.println(6);
    case TUESDAY                -> System.out.println(7);
    case THURSDAY, SATURDAY     -> System.out.println(8);
    case WEDNESDAY              -> System.out.println(9);
}
```
- 가비지 컬렉터 개선, 마이크로 벤치마크 툴 추가, 성능 개선

# Java SE 13
- Switch 문 개선을 위한 'yield' 예약어 추가
```java
var a = switch (day) {
    case MONDAY, FRIDAY, SUNDAY:
        yield 6;
    case TUESDAY:
        yield 7;
    case THURSDAY, SATURDAY:
        yield 8;
    case WEDNESDAY:
        yield 9;
};
```
- textBlock 추가
```java
String str = """
   This
   is
   text block
""";
```

# Java SE 14

- 12, 13에서의 Switch 문이 표준화되었다.
- record( preview ) : java로 많은 상용구를 작성하는 수고를 덜어주는 record 클래스 도입
```java
final class Point {
    public final int x;
    public final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
*// state-based implementations of equals, hashCode, toString// nothing else*

//레코드 사용
record Point(int x, int y) { }
```
- NullPointerException track: 어떤 부분에서 NPE가 발생헀는지 설명해준다.

# Java SE 15
- textBlock / Multiline Strings가 공식 채택 준비됐습니다.
- Sealed Classes ( preview ) 상속 가능한 클래스를 지정할 수 있는 봉인 클래스가 추가된다. 상속 가능한 대상은 상위 클래스 또는 인터페이스 패키지 내에 속해있어야 한다.
- EdDSA 암호화 알고리즘 추가
- 스케일링 가능한 낮은 지연의 가비지 컬렉터 추가(ZGC)<sup>[[1]](#zgc)</sup>

# Java SE 16
- jdk1.8부터 시작된 PermGen 대신 Metaspace를 지원하기 시작
- OpenJdk의 버전관리가 [git](https://github.com/openjdk/)으로 변경되었습니다. 
- Unix-Domain Socket Channels : Unix 도메인 소켓에 연결할 수 있다.

# Java SE 17
- RandomGenerator : 의사 난수 생성기를 통해서 예측하기 어려운 난수를 생성하는 API가 출시됐다.
- M1 정식 지원

# Java SE 18
- UTF-8이 기본 인코딩셋이 되었다.
- Simple Web Server: 간편설정, 최소한의 기능으로 바로 사용 가능한 HTTP 파일 서버를 제공한다.
- Relection 기능 리팩토링( [메소드 핸들](#method-handle)을 이용해서 다시 구현 )
- switch-case 패턴 매칭 preview
- try-catch-finally deprecated  ( try-with-resources 권장)

# Java SE 19
- VirtualThread, Foreign Function & Memory API, Structured Concurrency, Vector API 등이 preview로 추가

# Java SE 20
- VirtualThread(second preview), ScopedValue(incubated), StructuredConcurrency(SecondIncubate)

# Java SE 21
- StringTemplate(preview)
- [Sequenced Collections](https://openjdk.org/jeps/431)
- [Generational ZGC](https://openjdk.org/jeps/439)
- Switch Pattern Matching 정식 출시
- [Unnamed Patterns and Variables (Preview)](https://openjdk.org/jeps/443)
- [Virtual Thread 정식 출시](https://openjdk.org/jeps/444)
- Windows 32-bit x86 제거 예정

# Java SE 22
- [G1 GC에 Region Pinning 기술을 구현해 지연 시간(latency) 단축](https://openjdk.org/jeps/423)
- [super() 호출 전에 다른 statement 실행을 가능하게함 (프리뷰 기능).](https://openjdk.org/jeps/447)
- [이름없는 변수 및 패턴. 안쓰는 변수 이름을 언더스코어(_)로 표기하는 것을 허용](https://openjdk.org/jeps/456)
- StructuredConcurrency(secondPreview) : 쓰레드 캔슬, 셧다운에 의한 리스크를 줄이고 Observability 향상, 여러 쓰레드에서 실행되는 관련있는 작업들을 그룹핑하는 기능
- [ScopedValues(secondPreview)](https://openjdk.org/jeps/464) : 같은 쓰레드 내에서의 공유 데이터를 관리하기 위한 컨테이너 오브젝트. ThreadLocal과 비슷하지만 ThreadLocal의 단점을 보완해 더 적은 리소스를 사용하고 더 안전하다고 한다. (특히 VirtualThreads, StructuredConcurrency랑 같이 활용될 때)

# Java SE 23
- 2024/06/08 Preview
- 2024/09 GA


-------
<a name="#zgc" href="https://d2.naver.com/helloworld/0128759">[1] ZGC<a/>
<a name="#method-handle" href="https://wiki.yowu.dev/ko/Knowledge-base/Java/leveraging-java-s-method-handles-for-dynamic-method-invocation"> 메소드 핸들 </a>