---
layout: post
categories: [OTHERS]
---
from [Dictionary - MultiProcess vs. MultiThread](https://github.com/newkayak12/Dictionary/blob/master/cs/MultiProcessAndMultiThread.md)


# MultiProcess vs. MultiThread

## MultiProcess
멀티 프로세스는 운영체제에서 하나의 응용 프로그램에 대해 동시에 여러 개의 프로세스를 실행할 수 있게 하는 기술을 말한다. 보통 하나의 프로그램 실행에 대해 하나의 프로세스가 메모리에 생성되지만, 부가적인 기능을 위해 여러개의 프로세스를 생성하는 것이다.

![](/assets/img/multiProcess.png)

멀티 프로세스 내부를 보면, 하나의 부모 프로세스가 여러 개의 자식 프로세스를 생성함으로서 다중 프로세스를 구성하는 구조이다.
한 프로세스는 실행되는 도중 프로세스 생성 시스템 콜을 통해 새로운 프로세스들을 생성할 수 있는데, 다른 프로세스를 생성하는 프로세스를 부모 프로세스(Parent Process)라 하고,
다른 프로세스에 의해 생성된 프로세스를 자식 프로세스(Child Process)라 한다.

부모 프로세스와 자식 프로세스는 각각 고유한 PID(Process ID)를 가지고 있다. 부모 프로세스는 자식 프로세스의 PID를 알고 있으며, 이를 통해 자식 프로세스를 제어할 수 있다. 또한, 자식 프로세스는 부모 프로세스의 PID와 PPID(Parent Process ID)를 알고 있어, 이를 통해 부모 프로세스와의 통신이 가능하다.
ex) 브라우저 탭

### 장점
#### 1. 프로그램 안정성
독립적 메모리 공간을 가져서 한 프로세스가 비정상 종료되도 다른 프로세스에 영향을 주지 않는다.

#### 2. 병렬성
#### 3. 시스템 확장성
멀티 프로세스는 각 프로세스가 독립적이므로, 새로운 기능이나 모듈을 추가하거나 수정할때 다른 프로세스에 영향을 주지 않는다. 그래서 시스템의 규모를 쉽게 확장할 수 있다.

### 단점
#### 1. Context Switching OverHead
멀티태스킹을 구성하는데 핵심 기술인 컨텍스트 스위칭(context switching) 과정에서 성능 저하가 올 수 있다
#### 2. 자원 공유 비효율성
멀티 프로세스는 각 프로세스가 독립적인 메모리 공간을 가지므로, 결과적으로 메모리 사용량이 증가하게 된다.
만일 각 프로세스간에 자원 공유가 필요할 경우 프로세스 사이의 어렵고 복잡한 통신 기법인 IPC(Inter-Process Commnuication)을 사용하여야 한다.

## MultiThread
스레드는 하나의 프로세스 내에 있는 실행 흐름이다. 그리고 멀티 스레드는 하나의 프로세스 안에 여러개의 스레드가 있는 것을 말한다. 따라서 하나의 프로그램에서 두가지 이상의 동작을 동시에 처리하도록 하는 행위가 가능해진다.
멀티 프로세스는 웹 브라우저에서의 여러 탭이나 여러 창이라고 말했었다. 대신 멀티 스레드는 웹 브라우저의 단일 탭 또는 창 내에서 브라우저 이벤트 루프, 네트워크 처리, I/O 및 기타 작업을 관리하고 처리하는데 사용된다고 보면된다.

### 장점
#### 1. 쓰레드가 프로세스보다 저렴함
#### 2. 공유 메모리에 따른 자원 효율성
#### 3. Context Switching 비용 감소 (비용이 상대적으로 낮다.)
#### 4. 응답 시간 단축

### 단점
#### 1. 안정성
#### 2. 공유 메모리 동기화로 인한 성능 저하
#### 3. 데드락
#### 4. Context Switch Overhead <sup>[[1]](#contextSwitchOverhead)</sup>
#### 5. 디버깅이 어려움








-----------------
<a href="contextSwitchOverhead">[1]</a> : 
running상태가 끝난 프로세스는 PC, SP, 레지스터, Base Register, limit Register 등 많은 내용들을 PCB에 저장을 해야하는 것이고, 이후 Dispatcher는 ready queue에서 running상태로 올릴 프로세스의 PCB에서 또다시 많은 내용을 복원해야 하는 것이다. 즉, context switching을 위해 context를 저장하고 context를 restore하는 것인데 이러한 일을 하는 데에는 부담이 발생할 수밖에 없을 것이다.
이렇게 Context Switch(문맥 교환)에 의해 Dispatcher에 발생하게 되는 부담을 "Context Switching Overhead(문맥교환 오버헤드)"라고 한다.
