---
layout: post
categories: [SPRING]
---



from [Dictionary - SpringBatch](https://github.com/newkayak12/Dictionary/blob/master/spring/18.SpringBatch.md)




# SpringBatch

![](/assets/img/스크린샷%202024-05-24%2007.14.00.png)


- JobLauncher : Job을 실행 시키는 컴포넌트
- JobRepository: Job실행, Job, Step을 저장
- Job : 하나의 배치 실행 단위, 1개 이상의 Step으로 구성됨
- JobInstance :논리적인 Job 실행을 의미합니다. 주로 Job 에 파라미터를 부여하여 다른 JobInstance 구분할수 있습니다.
- Step : 일련의 작업들
- ItemReader : Step에서 데이터를 읽는 Tasklet
- ItemProcessor: ItemReader에서 읽은 데이터를 처리하는 Tasklet
- ItemWriter : ItemProcessor로 처리된 데이터를 쓰는 Tasklet

![](/assets/img/스크린샷%202024-05-24%2007.14.17.png)
## @JobScope와 @StepScope

> ### Scope란?
> - 스프링 컨테이너에서 빈이 관리되는 범위
> - singleton, prototype, request, session, application이 있으며 기본은 singleton으로 생성된다.

- Job과 Step의 빈 생성과 실행에 관여하는 스코프
- 프록시 모드를 기본 값으로 하는 스코프: `@Scope(value = "job", proxyMode = ScopedProxyMode.TARGET_CLASS)`
- `@JobScope`나 `@StepScope`가 선언되면 빈의 생성이 애플리케이션 구동 시점이 아닌 빈의 실행 시점에 이루어진다.
- `@Values`를 주입해서 빈의 실행 시점에 값을 참조할 수 있으며 일종의 Lazy Binding이 가능해진다.
- `@Value(”#{jobParameters[파라미터명]}”)`, `@Value(”#{jobExecutionContext[파라미터명]”})`, `@Value(”#{stepExecutionContext[파라미터명]”})`
- `@Value`를 사용할 경우 빈 선언문에 `@JobScope`, `@StepScope`를 정의하지 않으면 오류를 발생한다. 때문에 반드시 선언해야 한다.
- 프록시 모드로 빈이 선언되기 때문에 애플리케이션 구동 시점에는 빈의 프록시 객체가 생성되어 실행 시점에 실제 빈을 호출 해준다.
- 병렬 처리 시 각 쓰레드마다 생성된 스코프 빈이 할당 되기 때문에 쓰레드에 안전하게 실행이 가능하다.


```java

@Configuration
@Slf4j
@RequiredArgsConstructor
public class BatchExample {
    private final PlatformTransactionManager txManager;


    @Bean(name = "exampleJob")
    public Job exampleJob(@Qualifier(value = "exampleStep") Step step, JobRepository jobRepository) {
        return new JobBuilder("exampleJob", jobRepository).start(step).build();
    }


    @JobScope
    @Bean(name = "exampleStep") //작업으로 STep 명시
    public Step exampleStep(@Qualifier(value = "exampleTasklet") Tasklet tasklet, JobRepository jobRepository) {
        return new StepBuilder("exampleStep", jobRepository).tasklet(tasklet, txManager).build();
    }


    @StepScope
    @Bean(name = "exampleTasklet")
    public Tasklet exampleTasklet (){  // 간단한 작업 명세
        return (contribution, chunkContext) -> {
            log.info("ExampleTasklet");
            return RepeatStatus.CONTINUABLE;
        };
    }
}
```

## Spring Batch 5
1. `@EnableBatchProcessing`로 Batch를 initialize 할 수 없어졌음 -> 5부터 `autoConfigure` 날아감
2. `JobBuilderFactory` / `StepBuilderFactory` -> `JobBuilder`/ `StepBuilder`로 변경됨

[참고](https://tonylim.tistory.com/431) 

