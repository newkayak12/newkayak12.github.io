---
layout: post
categories: [SPRING]
---



from [Dictionary - Actuator](https://github.com/newkayak12/Dictionary/blob/master/spring/02.Actuator.md)


# Actuator

실행 중인 애플리케이션에 대한 정보를 제공한다.
1. 애플리케이션 환경에서 사용할 수 있는 구성 속성
2. 애플리케이션에 포함된 다양한 패키지의 로깅 레벨
3. 애플리케이션이 사용 중인 메모리
4. 지정된 엔드 포인트가 받은 요청 횟수
5. 애플리케이션의 건강 상태 정보

|      Method       |    Endpoint     |            Description             | Default |
|:-----------------:|:---------------:|:----------------------------------:|:-------:|
|        GET        |  /aduitevents   |        audit 이벤트 리포트를 생성한다.        |    X    |
|        GET        |     /beans      |         컨텍스트의 모든 빈을 리스트 업          |    X    |
|        GET        |   /conditions   |     성공 또는 실패한 자동 구성 조건의 내역을 생성     |    X    |
|        GET        |   /configprop   |     모든 구성 속성들을 현재 값과 같이 알려준다.      |    X    |
| GET, POST, DELETE |      /env       |    스프링에서 사용할 수 있는 모든 env를 보여준다.    |    X    |
|        GET        | /env/{toMatch}  |         특정 황경 속성 값을 보여준다.          |    X    |
|        GET        |     /health     |            건강상태를 보여준다.             |    O    |
|        GET        |    /heapdump    |           힙 덤프를 다운로드 한다.           |    X    |
|        GET        |   /httptrace    |      최근의 100개 요청을 tracing한다.       |    X    |
|        GET        |      /info      |         개발자가 정의한 info를 반환          |    O    |
|        GET        |    /loggers     |          패키지 - 로깅 레벨을 반환           |    X    |
|     GET, POST     | /loggers/{name} |          지정한 로거의 로깅레벨을 반환          |    X    |
|        GET        |    /mappings    | HTTP 매핑과 매핑을 처리하는 핸들러의 메소드들 내역을 제공 |    X    |
|        GET        |    /metrics     |           모든 메트릭 리스트 반환            |    X    |
|        GET        | /metrics/{name} |           지정한 메트릭 값을 반환            |    X    |
|        GET        | /scheduledtasks |        스케쥴링된 모든 태스크의 내역을 제공        |    X    |
|        GET        |   /threaddump   |       모든 애플리케이션 쓰레드의 내역을 반환        |    X    |
|       POST        |    /shutdown    |           애플리케이션을 종료한다.            |         |
|       POST        |    /refresh     |          애플리케이션 정보를 갱신한다.          |         |

>
> ### Refresh => Yaml은 다시 불러온다. 그러나 이미 주입된 Bean은 다시 주입되지 않는다. -> 아직까지 큰 실효성을 모르겠다.