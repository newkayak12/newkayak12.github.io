---
layout: post
categories: [JAVA]
---

from [Dictionary - JVM](https://github.com/newkayak12/Dictionary/blob/master/java/02.jvm.md)
# JVM

<strong>J</strong>ava <strong>V</strong>irtual <strong>M</strong>achine의 줄임말이다.
Java는 JVM이라는 가상머신을 거쳐서 OS에 도달한다. 이때 인식하는 것이 자바 바이트코드(Java Bytecode)이다. Java Compiler는 `.java`를 `.class`로 변환해준다. 
여기서 자바 바이트 코드는 명령어의 크기가 1바이트이다.

바이트 코드는 다시 실시간 번역기 또는 JIT(Just-In-Time)<sup>[[1]](#jit)</sup> 컴파일러에 의해서 바이너리 코드로 변환된다. 이때 변환은 모든 바이트 코드를 변환하는 것이 아니라 실행하기 전에 필요한 부분을 즉석으로 컴파일 하는 방식을 말한다.
또한, 자주 쓰이는 코드는 캐싱해서 같은 부분을 반복적으로 번역(interpret)하지 않도록 한다. 


JVM은 크게 아래와 같이 이뤄져 있다.
![](/assets/imgjvm.png)

- 클래스 로더(Class Loader)
- 실행 엔진(Execution Engine)
  - 인터프리터(Interpreter)
  - JIT 컴파일러(Just-In-Time)
  - 가비지 콜렉터(Garbage collector)
- 런타임 데이터 영역(Runtime Data Area)


### 1. 클래스 로더
JVM 내로 클래스 파일(*.class)를 로드하고, 링크를 통해 배치하는 작업을 수행하는 모듈, 런타임 시 동적으로 클래스를 로드하고 jar 파일 내 저장된 클래스들을 JVM 위에 탑재한다.

### 2. 실행 엔진
클래스를 실행시키는 엔진, 클래스로더가 JVM 내 런타임 데이터 영역에 바이트 코드를 배치시키고 이것은 실행 엔진에 의해서 실행된다. 
바이트 코드는 바이너리 코드가 아니다. 그래서 실행 엔진은 바이트 코드를 JVM 내부에서 바이너리 코드로 변환한다.

#### 2.1.1. 인터프리터
바이트 코드를 명령 단위로 읽어서 실행한다. 

#### 2.1.2. JIT(HotSpot)
인터프리터 방식으로 사용하기 직전 기계어로 변역하고 캐싱하여 이후에는 번역하지 않는 방식으로 동작한다.

#### 2.2 가비지 콜렉터<sup>[[2]](2024-05-18-[java_series]-05-GC)</sup>
더 이상 사용하지 않는 인스턴스를 찾아 메모리에서 삭제한다.

#### 2.3 [Runtime Data Area](./2024-05-18-[java_series]-03-Memory)

### 3. JDK? JRE?

- JDK : Java Development Kit ( JRE + (javac, jdb, javadoc...))
- JRE : Java Runtime Environment ( JVM + 자바 클래스 라이브러리)


-----------------
<a name="jit">[1]</a> : 크게 나눠서 HotSpot Vm과 같이 메소드(함수) 단위로 JIT하는 방식과 더 작은 단위에서 프로그램 실행 흐름을 실시간으로 추적하여 컴파일할 코드를 탐색하는 Tracing JIT 방식으로 분류할 수 있다. 추가적으로, 미리 컴파일된 코드를 실행하는게 아니라 런타임에 동적으로 코드를 생성하여 실행하므로 잠재적 보안 문제가 있다. 예를 들어 인텔 스펙터가 JIT에 의존하는 JS 엔진을 가진 브라우저에서만 발생했다.
