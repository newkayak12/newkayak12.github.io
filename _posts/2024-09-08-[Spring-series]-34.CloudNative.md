---
layout: post

categories: [SPRING]
---


# CloudNative

클라우드 환경에 최적화된 방식으로 설계, 배포 된 애플리케이션을 의미한다.


## 특징
1. MSA : 애플리케이션을 도메인 등의 작은 단위로 개발하고 각각 서비스를 독립적으로 배포 및 확장이 가능하다.

2. Container : 애플리케이션을 컨테이너에 담아 동일한 동작을 보장하게 할 수 있다. 
3. 자동화 : 배포, 확장, 관리 과정을 자동화해서 비용과 에러를 최소화할 수 있다.
4. 가상화 : 가상화로 Host와 애플리케이션을 분리하고 자원을 동적으로 할당하거나 회수할 수 있다.
// Docker, Kubernetes


## 12 Factors
방대한 앱의 개발, 운영, 확장 등에서 얻은 바를 정리한 SaaS 개발 방법론이다. Cloud 환경에서 올바르게 동작하기 위해서
지켜야 하는 12가지 규칙을 의미한다.

> SaaS
> 1. 설정 자동화를 위한 절차를 체계화 하여 새로운 개발자 적응에 드는 시간과 비용을 최소화
> 2. OS에 따라 달라지는 부분을 명확히 하고, 실행 환경 사이의 이식성을 극대화
> 3. 클라우드 플랫폼 배포에 적합하고, 서버와 시스템의 관리가 필요 없게된다.
> 4. 개발 환경, 운영 환경의 차이를 최소화하고 지속적인 배포로 민첩성을 극대화한다.
> 5. 툴, 아키텍쳐, 개발 방식을 크게 바꾸지 않고 확장할 수 있다.


1. CodeBase : 애플리케이션의 코드는 코드베이스(git, svn)을 통해서 관리되어야 하며, 동일한 코드로 운영/개발에 배포되어야 한다.
2. Dependencies : 애플리케이션의 종속성을 명시적으로 선언하여 사용한다. 
3. Config : 모든 설정 정보는 코드로부터 분리된 공간에 저장되어야 하고, 런타임에서 코드에 의해 읽혀야 한다.
4. Backing services : 백엔드 서비스를 분리된 리소스로 취급한다. 
5. Build,Release,Run : build -> release -> run 단계를 거처 배포되며, 각 단계는 엄격히 분리되어야만 한다.
6. Process :  실행 환경에서 앱은 하나 이상의 프로세스로 실행되며, 각 프로세스는 stateless로 아무 것도 공유하지 않아야 한다.
7. Port Binding : 배포된 애플리케이션을 타 애플리케이션이 접근할 수 있도록 포트 바인딩을 통해서 공개한다. 
8. Concurrency : 병령로 실행하여 확장성을 보자하며, 프로세스 간의 공유 데이터는 분리된 자원으로 관리된다.
9. Disposability : shutdown 신호를 받았을 때 Graceful shutdown 해야 한다.
10. Dev/prod parity : dev, staging, prod 환경을 최대한 비슷하게 유지한다. 개발환경과 prod 환경 차이를 작게 유지해서 지속적인 배포가 가능하도록 디자인 되어야만 한다.
11. Logs : 로그를 이벤트 스트림으로 취급하여 로그를 로컬에 저장하지 않는다. 로그는 별도의 스트림으로 취급하여 별도의 저장소에 보관해야 한다.
12. Admin Process : admin/ maintenance 작업을 일회성 프로세스로 실행해야 한다.



## Spring Cloud

스프링 클라우드는 

- Distributed/versioned configuration : 분산/버전 구성
- Service registration and discovery : 서비스 등록 및 검색
- Routing : 라우팅
- Service-to-service calls : 서비스 간 호출
- Load balancing : 로드 밸런싱
- Circuit Breakers : 서킷 브레이커
- Distributed messaging : 분산 메시징
- Short lived microservices (tasks) : 작은 단위 마이크로 서비스
- Consumer-driven and producer-driven contract testing

와 같은 기능을 제공하는 프레임워크다.


### MA vs. MSA

1. MA : 애플리케이션을 하나의 서비스 혹은 애플리케이션이 하나의 통합된 구조를 갖는 것을 의미한다.
2. MSA : 독립적으로 배포 가능한 서비스 단위로 분할하여 서로 간의 변경, 조합이 가능하도록 이루는 구조



|분류	|모놀리식 아키텍처 (Monolithic Architecture: MA)|	마이크로 서비스 아키텍처(Micro Service Architecture: MSA)|
|:----:|:----:|:----:|
|설명	|모든 서비스를 단일 어플리케이션에 통합한다.	|서비스를 작은 단위로 분리하여 독립적으로 배포하고 운영한다.|
|배포	|‘전체’ 어플리케이션 배포 필요	|‘필요한 부분’만 배포 가능|
|확장성|	‘수직 확장’만 가능: Scale-In	|‘수평 확장’ 가능 : Scale Out|
|개발 방식	|단일 코드 베이스|	독립적인 코드 베이스|
|유지보수	|전체 어플리케이션을 수정해야 함	|각 서비스를 독립적으로 수정 가능|
|복잡성	|쉽게 이해할 수 있음|	분산 시스템으로 인한 복잡성|
|테스트	|전체 어플리케이션 테스트 필요	|각 서비스를 독립적으로 테스트 가능|
|데이터 관리|	중앙 집중식 데이터 관리	|서비스 간 데이터 공유 어려움|
|장애 처리 	|전체 시스템 다운	|일부 서비스만 다운되므로 장애 발생 시 영향 최소화 가능|


> Scale-In/ Out
> In : 서버 성능을 향상시키는 것. 주로 하드웨어 자원을 증설하는 방식이다.
> Out : 서버 인스턴스를 추가하여 부하를 분산시키는 것


### Netflix OSS(Open Source Software)
|이름	|분류	|설명|
|:---:|:---:|:---:|
|Eureka|	서비스 디스커버리 도구	|각각의 서비스 인스턴스들을 등록하고 관리하는 역할을 합니다.|
|Hystrix|	서킷 브레이커 패턴 라이브러리	|서비스 간의 의존성을 관리하고 서비스 장애 시에도 전체 시스템의 안정성을 유지할 수 있습니다.|
|Ribbon|	클라이언트 측 로드 밸런싱 라이브러리	|여러 개의 인스턴스 중에서 가장 적은 부하를 가진 인스턴스를 선택하여 요청을 보내는 역할을 합니다.|
|Zuul	|API 게이트웨이	|클라이언트와 서비스 사이에서 라우팅, 필터링, 보안 등의 역할을 수행합니다.|


### Cloud
|         이름          |                                                                                               설명                                                                                                | 
|:-------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       Config        |Centralized external configuration management backed by a git repository. The configuration resources map directly to Spring Environment but could be used by non-Spring applications if desired.|
|       Gateway       |                                            Spring Cloud Gateway is an intelligent and programmable router based on Spring Framework and Spring Boot.                                            |
|       Netflix       |                                                                  Integration with Eureka Services Discovery from Netflix OSS.                                                                   |
|       Consul        |                                                              Service discovery and configuration management with Hashicorp Consul.                                                              |
|      Data Flow      |              A cloud-native orchestration service for composable microservice applications on modern runtimes. Easy-to-use DSL, drag-and-drop GUI, and REST-APIs together simplifies the overall orchestration of microservice based data pipelines.                                                                                                                                                                                   |
|      Funciton       |                                                                                                                                                 Spring Cloud Function promotes the implementation of business logic via functions. It supports a uniform programming model across serverless providers, as well as the ability to run standalone (locally or in a PaaS).                                                |
|       Stream        |     A lightweight event-driven microservices framework to quickly build applications that can connect to external systems. Simple declarative model to send and receive messages using Apache Kafka or RabbitMQ between Spring Boot apps.                                                                                                                                                                                            |
| Stream Applications |                                                                           Spring Cloud Stream Applications are out of the box Spring Boot applications providing integration with external middleware systems such as Apache Kafka, RabbitMQ etc. using the binder abstraction in Spring Cloud Stream.                                                                                                                      |
|        Task         |         A short-lived microservices framework to quickly build applications that perform finite amounts of data processing. Simple declarative for adding both functional and non-functional features to Spring Boot apps.                                                                                                                                                                                        |
|  Task App Starter   |         Spring Cloud Task App Starters are Spring Boot applications that may be any process including Spring Batch jobs that do not run forever, and they end/stop after a finite period of data processing.                                                                                                                                                                                        |
|      Zookeeper      |                                                              Service discovery and configuration management with Apache Zookeeper.                                                                                                                                   |
|      Contract       |           Spring Cloud Contract is an umbrella project holding solutions that help users in successfully implementing the Consumer Driven Contracts approach.                                                                                                                                                                                      |
|      OpenFeign      |  Spring Cloud OpenFeign provides integrations for Spring Boot apps through autoconfiguration and binding to the Spring Environment and other Spring programming model idioms.                                                                                                                                                                                               |
|         Bus         |                                        An event bus for linking services and service instances together with distributed messaging. Useful for propagating state changes across a cluster (e.g. config change events).                                                                                                                                                         |
| Open Service Broker |         Provides a starting point for building a service broker that implements the Open Service Broker API.                                                                                                                                                                                        |


### 로드밸런싱
1. 클라이언트 사이드 로드 밸런싱
- 클라이언트가 직접 여러 서버 중 하나를 선택해서 보내는 방식
- 클라이언트는 서버의 목록을 가지고 있으며, 이를 바탕으로 로드 밸런싱을 수행

ex) FeignClient
ex) Ribbon ( netflix에서 개발한 '적재 분산 기술'을 제공하는 라이브러리 - 주요 기능으로 로드밸런싱, 장애조치, 지연시간 및 재시도 같은 기능 제공)

> 클라이언트가 직접 로드밸런싱을 하기에 1) 제어 분산, 2) (서비스 목록을 미리 갖고 있기에 ) 서비스 발견 통합, 3) (중간 라우팅 서버를 거치지 않아서) 망 효율성이 좋다.
> 그러나 직접 구현해야 한다는 단점이 있다.

2. 서버 사이드 로드 밸런싱
- 모든 트래픽을 로드 밸런서 하나에서 받고 분배
- 클라이언트에서 로드밸런싱을 구현하지 않아도 된다.
- 고갸용성과 장애 조치 메커니즘을 갖고 구현되기도 한다.


> 서버에서 로드 밸런싱을 하기에 1) 클라이언트는 구현할 필요가 없다. 2) 로드밸런싱이 중앙관리가 된다는 장점이 있다.
> 그러나 1) 단일 실패 지점이 생긴다. 2) 네트워크 홉이 하나 생긴다는 단점이 있다.


### 서킷 브레이커
분산 시스템에서 장애 발생시 `전체 장애로 전파되는 것`을 방지하기 위해서 사용되는 기술을 의미한다. 
장애 회복, 서킷브레이커 패턴 구현, 요청 실패 처리, 장애 상황 모니터링 및 알람 기능을 제공한다.

전체적으로 전자 회로도록 생각하면 된다. Closed는 전구가 켜진 경우, Open은 꺼진경우  HalfOpen은 이 둘을 섞은 경우다.

> 서킷 브레이커 패턴
> 
> 다른 서비스에 대한 호출에 대해서 모니터링해서 '요청 실패율'이 임계치를 넘어가면 장애가 발생한 서비스로의 요청을 차단하여 FailFast하는 방법

#### 패턴

|    속성     |                                                     설명                                                      |
|:---------:|:-----------------------------------------------------------------------------------------------------------:|
| fail fast |           - 호출한 서비스가 응답하지 않으면 호출을 빠르게 실패시킨다. <br/>-장애 서비스에 대한 요청이 많아져서 전체 시스템이 같이 죽는 것을 방지할 수 있다.           |
| fallback  | - 호출한 서비스가 실패하면 미리 정의된 대체 메소드를 호출한다. <br/> - 동일하게 장애 서비스에 대한 요청이 너무 많아져서 전체 시스템이 더이상 사용 불가능 해지는 것을 막을 수 있다. |


#### 상태

|  분류   |                   Closed                  |                           Open                           |                             Half-Open                             |
|:-----:|:-----------------------------------------:|:--------------------------------------------------------:|:-----------------------------------------------------------------:|
|  상태   |              서킷브레이커가 동작하지 않음              |                       서킷브레이커 동작 중                        |                         서킷 브레이커가 부분적으로 열림                         |
|  동작   | 모든 요청이 성공하거나 실패할 때마다 수를 세고 일정 비율을 넘기면 열린다. | 일정시간 동안 요청을 차단하고 실패한 요청은 바로 반환된다. 시간이 지나면 Half-Open이 된다. | 서킷 브레이커는 일부 요청을 처리하면서 성공한 요청 만큼 상태를 복구한다. 이후 모든 요청은 Closed로 수렴된다. |
|  요청   |           Open이 되고 일정 시간이 지났을 경우          |                  외부 요청을 차단하고 바로 에러를 뱉음                   |                       외부 요청을 차단하고 바로 에러를 뱉음                       |
| 상태 전이 | 외부 요청을 차단하고 바로 에러를 뱉음                     |                 특정 시간이 되면 HalfOpen이 된다.                  |             일부 혀용된 요청이 성공하면 Closed가 된다. 실패면 Open이 된다.             |


eg) Hystrix
eg) Resilience4J


### Global lock, Leadership election and cluster state

클라우드 네이티브 환경에서 특정 리소스에 하나의 모듈만 접근해야하는 경우가 종종 발생할 수 있다. 이때 필요한 것이 글로벌락이다.

1. 해당 리소스에 접근한 모듈이 잠금을 생성하고, 이후 접근한 모듈이 잠금 상태라면 대기, 잠금이 없다면 자신이 잠금을 잡는 방식
2. 분산시스템에서 하나의 서버가 리더 역할을 해야할 때 해당 서비스를 제공하도록 하는 기능이다. 이와 같이 특정 서비스 사이에서 리더를 선출하고 관리하는 것도 있다.
3. 서버들의 상태와 위치를 파악하고 이를 관리하는 기능이다. (Consul)


#### Consul
Consul은 디스커버리와 구성 관리 기능 및 기타 기능을 제공하는 서비스 매시다. Consul을 통해서 분산 시스템에서 서비스 검색, 설정 및 분배, HealthCheck, 글로벌락
등을 사용할 수 있다.

> 서비스 매시
> 
> 분산 시스템에서 서비스 간 통신을 관리하는 패턴이다. 이 패턴은 서비스 간 직접 통신 대신 간접적인 통신을 통해 통신을 관리한다.
> 수명 주기 전반에 걸쳐 데이터와 일관성을 공유하며 서로 통신할 수 있도록 사전 구성된 애플리케이션을 제공한다.

### 분산 메시징

여러 서비스 간의 통신을 위해서 사용되는 시스템이다. 이는 여러 서버에 걸쳐 있는 애플리케이션들이 서로 데이터나 메시지를 주고받을 수 있게 해준다. 

eg) KafKa, RabbitMQ, AWS Kinesis


> 분산 메시징
> 
> 메시지 큐를 이용해서 pub/sub 모델을 통해서 분산 메시징을 지원한다. 세부적으로 보면 컨슈머 그룹을 활용해서 중복처리를 방지하거나
> 파티셔닝을 활용할 수 있다.

[참고문헌](https://adjh54.tistory.com/207#1.%20클라우드%20네이티브%20애플리케이션%20특징-1)
[참고문헌](https://spring.io/projects/spring-cloud)