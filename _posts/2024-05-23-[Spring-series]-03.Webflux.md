---
layout: post
categories: [SPRING]
---



from [Dictionary - Webflux](https://github.com/newkayak12/Dictionary/blob/master/spring/03.Webflux.md)





# Webflux
SpringBoot Webflux는 서블릿을 버리고, 비동기로 진행하여 동시성을 최대화하여 가용성을 높히는 데 중점을 둔 프레임워크이다.
기본적으로 Java는 blocking code를 사용한다. Java는 `Flow.Publisher`을 이용해서 ReactiveStreams를 구현해서 사용할 수 있다.
이에 대한 실제 구현체는 `RxJava`, `Reactor`가 있다.

추가로 Tomcat을 버리고 Netty를 채택해서 EventLoop 기반으로 처리하여 가용성을 더 높혔다.

이를 사용하면
1. 메모리 가용성이 높아진다.
2. 파이프 라인으로 pub/sub 프로세스를 연결하여 처리한다.

__________
# [Reactive](https://newkayak12.github.io/java/2024/05/18/java-series-28-Reactive.html)


## Java에서 비동기 처리?
1. Callback -> Callback Hell에 빠질 수 있음
2. Future -> CompletableFuture를 지원하긴 하지만 까다로움

## 백프레셔
Pub/Sub의 균형이 무너질 때 생기는 형상이다. 소비보다 생성이 많을 때 발생한다. 이는 결국 메모리가 overflow 되고 `OutOfMemory`로 이어진다.

### push
Publisher가 이벤트를 밀어 넣는 형식 -> backpressure 발생할 수 있다.

### pull
Subscribe가 요청한 만큼만 전달

### Cold vs. Hot
1. Cold -> `Subscribe`로 이벤트 발현
2. Hot -> `Subscriber`로 부터 시작하지 않는다. `Publisher`가 `Emit`하는 것을 기본으로 한다.

----------

## RxJava
ReactiveX(Netflix)에서 만들었다.

### Publisher
1. 한 건의 경우 `Single`
2. 데이터가 없거나 한 건이면 `Maybe`
3. 한 건 이상일 경우 `Observalbe`, `Flow`

### RxJava에서 백프레셔 처리 방법
1. `Observable` 대신 `Flowable`사용
```
| Observable
- 1000개 미만 데이터 발행시
- 적은 소스로 OOM 발생이 가능성이 낮을 경우
- GUI 이벤트 처리

| Flowable
- 1000개 이상 데이터 발행 시
- 디스크 I/O
- JDBC
- 네트워크 I/O

> Backpressure 제어 전략
1. MISSING(BackpressureStrategy.MISSING) -> x
2. ERROR(BackpressureStrategy.ERROR) -> 발생시 `MissingBackpressureException`
3. BUFFER(BackpressureStrategy.BUFFER) -> 소비할 때까지 Queue, OOM 가능성 이씀
4. DROP(BackpressureStrategy.DROP) -> 소비하지 못한 데이터 버림
5. LATEST(BackpressureStrategy.LATEST) -> 받을 준비가 될 때까지 최신만 유지하고 버림


```

## Reactor
Pivotal에서 만들었다. 

### Publisher
1. 한 건은 `Mono`
2. 없거나 여러 건은 `Flux`

### Reactor에서 백프레셔 처리 방법
1. 버퍼링 -> OOM 가능성 있음
2. DROP -> `onBackpressureDrop()`으로 그냥 버려서 최악의 상황을 모면함
3. Latest -> `onBackpressureLatest()`으로 최근 이벤트만 유지
4. `flatMap()` -> 내부 Publisher로 변환하고 Merge하여 소비 속도 조절, 동시성 수준을 조절할 수 있어서 백프레셔 관리 가능(2번 째 파라미터로 동시성 제어)


### Operator

#### Create
1. just()
4. create()
2. fromStream()
3. fromIterable()

#### Sequence Control
1. flatMap() -> `map()` + 새로운 Sequence를 생성해서 내보 냄
2. concat() -> Publisher의 Sequence를 연결해서 emit
3. merge() -> Mono를 합침
4. zip() -> 여러 개의 Sequnce에서 emit 된 데이터를 결합

#### peeking
1. doOnNext() -> 처리되기 전 흐름에 영향 없이 무언가 하기 위해서 
2. doOnSuccess/doOnComplete -> 성공/완료 시
3. doOnError -> 에러 종료 시
4. doOnCancel -> 취소 시
5. doFirst -> 시작 시 
6. doOnSubscribe -> 구독 시
7. doOnRequest/doOnTerminate -> 요청/ 종료 시
8. log() -> Singal 이벤트 로깅

#### Filter
1. filter -> Filtering
2. take -> 통과 개수 지정

#### error
1. timeout -> timeOut 이내 emit 없으면 에러
2. retry -> 주어진 숫자만큼 재구독하도록

#### ignoreElement
1. then -> 작업 완료를 기다림
2. thenReturn -> then + return some Mono
3. thenMany -> then return + some Flux
4. distinct -> 중복 제거

#### split (Flux -> Flux<Flux<T>>)
1. window(int)
2. window(Duration)
3. buffer


#### toSynchronous
1. blockFirst/blockLast (flux)
2. toIterable/toStream (flux)
3. block (mono)
4. toFuture (mono)


### delay
1. delay/delayUntil -> 완료 연기

[참고 자료](https://colevelup.tistory.com/40)


-----------
# R2DBC ( Reactive Relational DataBase Connectivity )

JDBC 논 블로킹 버전이라고 이해하면 그나마 낫다.
## 장점
1. JDBC에서는 불가능한 논 블로킹 API를 제공한다.

## 단점
1. JDBC와 다르다. (JDBC에서 당연하게 사용하던 것들을 사용할 수 없다.)(caching, lazyLoading, write-behind 등)
2. 아직 성숙하지 않아서 공식적인 driver implementation이 없다.
3. R2DBC가 JDBC의 next가 되지 않을 가능성이 있다. (ProjectLoom은 JVM base DB Driver를 만들고 있다.)
[Java19, Loom](https://nipafx.dev/inside-java-newscast-27/)
[blogSpot](http://gunsdevlog.blogspot.com/2020/09/java-project-loom-reactive-streams.html)
4. JPA와 같은 관계성 매핑이 불가능하며, 캐싱, 영속성 컨텍스트 등을 제공하지 않는다.

## [QueryDsl](https://github.com/infobip/infobip-spring-data-querydsl)
JPA 처럼 queryDsl을 Third party로 지원하지만(QueryDsl도 thirdParty지만) 완벽하지 않다.


### 에러 사항

1. 네이밍 규칙
infobip Querydsl의 기본 네이밍 규칙이 Pascal이다. 이를 덮어 쓰기 위해서 Bean을 지정한다.
```java
@Configuration
public class QuerydslConfig {

    @Bean
    public NamingStrategy namingStrategy() {
        return new NamingStrategy(){
            @Override
            public String getTableName(Class<?> type) {
                return type.getSimpleName();
            }

            @Override
            public String getColumnName(RelationalPersistentProperty property) {
                return property.getName().substring(0, 1).toUpperCase() + property.getName().substring(1);
            }
        };
    }
}
```

[infobip querydsl README](https://github.com/infobip/infobip-spring-data-querydsl?tab=readme-ov-file#R2DBCRequirements)에서도
Flyway를 쓰던 SqlTemplate을 `@Bean`으로 두던 하라고 한다.


2. 템플릿 설정
```java
@Configuration
public class SqlTemplatesConfig {
    private final List<String> driver = Arrays.asList("mysql", "maria");
    @Bean
    public SQLTemplates sqlTemplates (R2dbcProperties properties) throws SQLException {
        Boolean isStorageDB = driver.stream().map(driver -> properties.getUrl().contains(driver)).reduce(false, (p, n) -> p || n);


        return isStorageDB ?
                MySQLTemplates.builder().escape('\\').quote().newLineToSingleSpace().build() :
                H2Templates.builder().quote().escape('\\').newLineToSingleSpace().build();
    }
}


```
이 Template에 따라 Querydsl이 쿼리를 파싱하는 결과가 바뀐다. 뭐 예를 들어
```java

interface BoardQueryDslRepository extends QuerydslR2dbcRepository<Board, String> {
    
}

@Repository
@RequiredArgsConstructor
@Slf4j
class BoardRepository {
    private final BoardQueryDslRepository boardQuery;


    private BooleanBuilder condition(BoardType type, Language locale) {
        BooleanBuilder builder = new BooleanBuilder();
        if(Objects.nonNull(type)) board.type.eq(type);
        if(Objects.nonNull(locale)) builder.and(board.locale.eq(locale));

        return builder;
    }


    public Mono<Template> template(BoardType type, Language locale) {

        return boardQuery.query(query -> {
            return query.select(
                                new QBoardeDto(
                                        board.boardNo,
                                        board.boardType,
                                        board.locale,
                                        board.contents,
                                        board.lastModifiedDate
                                )
                        )
                        .from(template)
                        .where(this.condition(templateType, locale));
        }).one();
    }

}
```
이렇게 있다면 where 절의 파라미터에 값을 바인딩할 때 `'?'`으로 네이밍을 잡아서 바인딩하려다 실패를 한다던가 하는 문제가 발생할 수 있다.
내부적으로 `MySQLSQLTemplates`인지 `instanceOf`를 해서 파라미터 바인딩하는 것으로 보인다(Maria_r2dbc-connector). 따라서 기존에는 크게 신경 쓰지 않던 것에도
주의를 기울여야 한다.


3. MariaConnector에서 지원하지 않아서 Enum을 parameter로 던지면 codec 문제를 일으킨다(QueryDSL 기준) -> 해결 하지 못했다.