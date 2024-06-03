---
layout: post
categories: [SPRING]
---



from [Dictionary - Spring Yaml settings](https://github.com/newkayak12/Dictionary/blob/master/spring/01.Configuration.md)

# Spring Configuration

## 1. Shutdown Gracefully
```yaml
server:
  shutdown: graceful ##[default immediate]
spring:
  lifecycle:
    timeout-per-shutdown-phase: 2m
```

이러면 -9로 끝내는게 아니라 할 일을 다 마치고 종료된다.


## 2. server port

```yaml
server:
  port: 8080
  error:
    whitelabel:
      enabled: true
    ## 에러 페이지 활성화 여부
    include-exception: false
    ## 에러에 Exception 포함 여부
    include-message: never
    ## 에러에 메시지 포함 여부
    include-stacktrace: never
    ## 에러에 stacktrace 포함 여부



```

## [3. eureka ](04.Eureka.md)

## 4. antPatternMatch

```yaml
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
    ## 2.6 이상에서 path_pattern_parser로 변경됨
    ## legacy matching-strategy가 ant_path_matcher다.
```

## 5. applicationType

```yaml
application:
  main:
    web-application-type: reactive
## 웹 어플리케이션을 어떤 모드로 실행시킬지에 대한 설정
## MVC, Webflux 둘 다 있을 경우 유효하다.
```


## 6. Spring cloud gateway

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: service-id
          ## route의 고유 식별자
          uri: lb://eureka-id
          ## 보낼 원격지
          predicates:
            - Path=/v1/**, /v2/**, /v3/api-docs
          ## pattern Predicate
          filters:
            #필터
            - RewritePath=/(?<segment>.*), /v1/$\{segment}
            - LoggingFilter
            - name: Retry
              args:
                retries: 2
                statuses: INTERNAL_SERVER_ERROR,SERVICE_UNAVAILABLE
                methods: GET,POST,PUT,PATCH,DELETE
                backoff:
                  firstBackoff: 100ms
                  maxBackoff: 100ms
                  factor: 2

```

## 7. eureka client
```yaml
eureka:
  instance:
    instance-id: ${spring.cloud.client.hostname}:${spring.application.instance_id:${random.value}}
    app-group-name: application-server
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 30
    metadata-map:
      prometheus:
        scrape: true
      metrics:
        path: /actuator/prometheus

  client:
    service-url:
      defaultZone: http://localhost:8761/eureka
    eureka-service-url-poll-interval-seconds: 5

```

## 8. elastic search

```yaml
spring:
  elasticsearch:
    connection-timeout: 5s
    socket-timeout: 30s
    #uri
    uris: http://localhost:9200
    username: elastic
    password: elastic

logging:
  level:
    org:
      springframework:
        data:
          elasticsearch:
            core: DEBUG
            client: TRACE
```

### 9. hibernate

```yaml
spring:
  jpa:
    ## oiv 활성화 여부 true -> controller까지 entityManager가 살아있다.
    open-in-view: false
    hibernate:
      naming:
        ## naming 전략
        physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
      ## hibernate ddl 전략
      ddl-auto: update
    ## DDL을 할지 여부  
    generate-ddl: true
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        javax:
          persistence:
            sharedCache:
              mode: ENABLE_SELECTIVE
          cache:
            provider: org.ehcache.jsr107.EhcacheCachingProvider
        cache:
          use_query_cache: true
          use_second_level_cache: true
          region:
            factory_class: org.hibernate.cache.jcache.internal.JCacheRegionFactory
        generate_statistics: true
logging:
  level:
    org:
      hibernate:
#        SQL: debug
        #        type: trace
        orm:
          jdbc:
            bind: trace
#            extract: trace


```

## 10. mongodb

```yaml
spring:
  data:
    mongodb:
      host: 192.168.0.42
      authentication-database: admin
      port: 27017
      username: root
      password: root
      database: board

logging:
  level:
    org:
      springframework:
        data:
          mongodb:
            core:
              ReactiveMongoTemplate: DEBUG
              MongoTemplate: DEBUG
          document:
            mongodb: DEBUG
```

## 11. r2dbc

```yaml
spring:
  data:
    r2dbc:
      repositories:
        enabled: true
  r2dbc:
    pool:
      enabled: true
    username: root
    password: root
    url: r2dbc:mariadb://localhost:3307/application
```


## 12. spring config import

```yaml
path:
  common: config/services/common
  local:  config/services/local
  test:  config/services/test
  prod:  config/services/prod

spring:
  config:
    activate:
      on-profile: local
    import:
      - classpath:${path.common}/actuator.yaml
      - classpath:${path.common}/constant.yaml
      - classpath:${path.common}/hibernate.yaml
      - classpath:${path.common}/pathMatcher.yaml
      - classpath:${path.common}/server.yaml
      - classpath:${path.local}/r2dbc.yaml
      - classpath:${path.local}/eureka.yaml


```