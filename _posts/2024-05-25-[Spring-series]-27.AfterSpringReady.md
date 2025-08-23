---
layout: post

categories: [SPRING]
---



from [Dictionary - WhenAfterSpringReady](https://github.com/newkayak12/Dictionary/blob/master/spring/27.AfterSpringReady.md)


# 스프링 초기화 후 작업

## CommandLineRunner
`CommandLineRunner`는 함수형 인터페이스로 애플리케이션 구동 후 실행되어야 하는 빈을 정의하기 위해서 사용한다. 

```java
@Component
class CmdRunner implements CommandLineRunner {
    @Override
    public void run ( String... args ) {
        
    }
}

//or

@SpringApplication
public class TestServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestServiceApplication.class, args);
    }
    
    @Bean
    public CommandLineRunner cmdRunner() {
        return args -> {};
    }
}
```

## ApplicationRunner
스프링 애플리케이션이 구동된 후에 실행되어야 하는 빈을 정의하기 위한 인터페이스다.
```java
@SpringApplication
public class TestServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestServiceApplication.class, args);
    }

    @Bean
    public ApplicationRunner cmdRunner() {
        return args -> {};
    }
}
```

## [EventListener](24.SpringEvent.md)

- `ApplicationStartingEvent`
  - 애플리케이션 실행되고 가장 빠른 타이밍에 실행
  - `Environmen`, `ApplicationContext`는 준비가 되어 있지 않음. 
  - source로 `ApplicationContext`가 넘어오는데 계속 바뀔거라는 걸 인지해야함 
- `ApplicationContextInitializedEvent`
  - initializer가 호출됨
  - `ApplicationContext`는 준비되어 있음    
  - BeanDefinition 등록 전
- `ApplicationEnvironmentPreparedEvent`
  - `Environment` 준비됨
- `ApplicationPreparedEvent`
  - `ApplicationContext` 완전히 준비됐지만 refresh 전에 실행됨 
  - `BootstrapRegistryInitializer`를 가지고 있고 곧 destroy 예정
- `ApplicationStartedEvent`
  - `BootstrapRegistryInitializer` destroyed
  - `ApplicationRunner`, `CommandLineRunner`가 실행되기 전
- `ApplicationReadyEvent`
  - 애플리케이션이 요청을 받아서 처리할 준비가 됐을 떄 발행
- `ApplicationFailedEvent`
  - 애플리케이션 실패   