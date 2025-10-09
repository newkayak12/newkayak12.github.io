---
layout: post

categories: [SPRING]
---


# Slueth, Zipkin

MSA에서는 각각의 도메인이 나눠져 있기에 특정 구간에서 발생한 로그가 어디서부터 시작됐는지
파악하기 어렵다. 이런 이유로 OpenTracing을 이용한다. 애플리케이션 간 분산 추적을 위한 표준 인터페이스고, 그 구현체로 Zipkin, Jaeger가 있다.

## Zipkin
MSA에서는 하나 서비스를 호출해도 여러 개의 서비스가 호출될 수 있다. 그래서 특정 구간에서 확인한다고 해도 어떻게, 왜 찍힌지 알 수 없다.
Zipkin은 이런 상황을 도와준다. Zipkin으로 추적할 수 있는 분산 트랜잭션은 대표적으로 HTTP, gRPC가 있다.

## Zipkin Client Library
서비스에서 trace를 수집해서 Zipkin서버의 Collector로 전송하는 역할을 한다. Collector로 전송할 떄는 HTTP를 이용하지만, 시스템이 비대하다면 Kafka를 이용하기도 한다.

### Collector
Zipkin Client Libaray로부터 데이터를 받아 트레이스 정보와 유효성을 검증하고 검색 가능하게 저장 및 인덱싱한다.

### Storage
Zipkin Collector에서 받은 정보를 Storage에 저장한다. 주로 ElasticSearch나 MySQL을 이용해서 저장한다. 

### API
저장된 로그를 검색하기 위한 JSON 형식의 API다.

### Web UI
시각적인 UI로 대시보드다. ElasticSearch + Kibana도 사용가능하다.


### Sleuth
Spring에서 지원하는 Zipkin Client Libarary이기 떄문에 Spring과의 연동이 매우 쉽다는 장점이 있다. 호출이 시작 ~ 끝날때 까지 동일한 TraceID로 처리되기
떄문에 로그 추적이 가능하다.


### Brave
Brave는 분산 추적 기록 라이브러리다. 일반적으로 Brave는 요청을 가로채서 타이밍 데이터를 수집하고 trace 컨텍스트를 수집하고 전파하는 역할을 수행한다. trace 데이터는
Zipkin 서버로 전송되는 것이 일반적이다.

정리하면 Brave는 로그를 수집하고 추적 데이터를 Zipkin으로 전송하는 라이브러리다. Zipkin 서버는 MSA에서 추적 데이터를 수집, 저장 및 시각화하는 데 사용되며, 
Brave는 이러한 추적 데이터를 생성하여 Zipkin 서버로 전송하는 역할을 한다. 

Brave는 자바 종속적이다. Slueth는 이를 확장하여 트레이스를 수집한다.

### Reporter
Reporter는 추적 데이터를 수집하고 해당 데이터를 처리하는 컴포넌트를 의미한다. 주요 역할은 아래와 같다.

1. 데이터 수집 : 추적 이벤트, 타이밍 정보, 사용자 활동 같은 데이터를 수집한다. 이 데이터는 일반적으로 분산 시스템 내에서 요청의 경로, 서비스 간 통신, 메소드 호출 등과 같은 정보를 포함한다.
2. 데이터 처리 : 수집한 데이터를 필요한 방식으로 처리하고 분석한다. 이 단계에서 데이터를 필터링하거나 집계하고 필요한 형식으로 변환할 수 있다.
3. 데이터 보고 : 처리된 데이터를 외부 시스템 또는 저장소로 전송한다.

## Spring Cloud Sleuth
Brave를 기반으로 만들어진 오픈소스 라이브러리로 Brave 기능을 확장하여 Spring Cloud와 통합한 뒤 분산 시스템에서 로그 데이터를 수집하는 역할을 한다.








> ## MicroMeter
> 
> micrometer는 벤더 중립적인 API를 사용하여 코드를 시간, 계산 및 측정할 수 있도록 하는 것을 목표로 하는 `a dimensional-first metrics collection facade`다.
> 클래스 경루 및 구성을 통해 메트릭 데이터를 내보낼 모니터링 시스템을 하나 이상 선택할 수 있다.
> SLF4J와 유사하지만 매트릭용이다.
> 
> 만약 JMX 모니터링 툴에 보내려면 그 포맷에 맞춰야 하고, 프로메테우스에 보내려면 프로메테우스에 맞춰야 한다.
> 애플리케이션 메트릭을 마이크로 미터가 정한 표준 방법으로 모아서 제공한다. 그러면 개발자는 마이크로미터에만 맞추면 된다.
> 
> 이를 위해서 Spring Boot Actuator는 마이크로미터를 기본으로 내장한다. (/actuator/metric)
> 
> 마이크로미터와 액츄에이터가 기본으로 제공하는 메트릭 목록은 아래와 같다.
> - JVM 메트릭 
>   - 메모리 및 버퍼 풀 세부 정보
>   - 가비지 수집 관련 통계
>   - 쓰레드 활용
>   - 로드 및 언로드된 클래스 수
>   - JVM 버전 정보
>   - JIT 컴파일 시간
> - 시스템 메트릭
>   - CPU 지표
>   - 파일 디스크럽터 메트릭
>   - 가동 시간 메트릭
>   - 사용 가능한 디스크 공간
> - 애플리케이션 시작 메트릭
>   - `application.stared.time` : 애플리케이션을 시작하는데 걸리는 시간
>   - `application.ready.time` : 애플리케이션이 요청을 처리할 준비가 되는데 걸리는 시간
>   - `ApplicationStaredEvent` : 스프링 컨테이너가 완전히 실행된 상태다. 이후 커맨드라인 러너가 호출된다.
>   - `ApplicationReadyEvent` : 커맨드 라인 러너가 실행된 이후에 호출된다.
> - Spring MVC 메트릭
>   - uri : 요청 URI
>   - method : GET, POST 같은 메소드
>   - status : HttpStatus 코드
>   - exception: 예외
>   - outcome : 상태 코드를 그룹으로 망서 확인
> - Tomcat 메트릭
>   - server.tomcat.session : 세션관련 정보
>   - server.tomcat.mbeanregistry.enable : 톰캣의 최대 쓰레드, 사용 쓰레드 수를 포함한 다양한 메트릭을 확일할 수 있다.
> - Datasource 메트릭
>   - Datasource : 커넥션 풀에 관한 메트릭을 확인할 수 있다.
>   - jdbc.connections : 최대 커넥션, 최소 커넥션, 활성 커넥션, 대기 커넥션 수 등을 확인할 수 있다.
> - Log 메트릭
>   - loback.event : logback 로그에 대한 메트릭을 확인할 수 있다.
> - 기타 메트릭
>   - HTTP Client Metric
>   - Cache Metric
>   - 작업 실행과 스케쥴 메트릭
>   - Spring Data Repository 메트릭
>   - MongoDB 메트릭
>   - Redis 메트릭
>
> 
> ## Prometheus and Grafana
> ### Prometheus
> 애플리케이션에서 발생한 메트릭을 과거 이력까지 함께 확인하려면 메트릭을 저장하는 DB가 필요하다.
> 이 역할을 프로메테우스가 한다.
> 
> ### Grafana
> DB에 있는 데이터를 불러 사용자가 보기 편하게 보여주는 대시보드가 필요하다.
> 