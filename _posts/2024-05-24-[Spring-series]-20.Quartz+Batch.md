---
layout: post

categories: [SPRING]
---



from [Dictionary - Quartz+Batch](https://github.com/newkayak12/Dictionary/blob/master/spring/20.Quartz%2BBatch.md)



# 구현


## Quartz -> JobBean
QuartzJobBean을 상속 받도록 해서 QuartzJob을 등록할 수 있는 추상 클래스 + 템플릿 메소드로 구성
```java
package com.appg.batchService.config.scheduling.config;

import com.appg.batchService.constant.Const;
import com.fasterxml.uuid.Generators;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerException;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.quartz.QuartzJobBean;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Slf4j
public abstract class QuartzSchedulingFormat extends QuartzJobBean {
    protected String BATCH_JOB_NAME;
    private Boolean logging = Boolean.FALSE;

    public QuartzSchedulingFormat(String BATCH_JOB_NAME) {
        this.BATCH_JOB_NAME = BATCH_JOB_NAME;
    }

    protected void enableLog(boolean enable) {
        this.logging = enable;
    }

    protected abstract void beforeExecute();
    protected abstract void afterExecute();
    protected abstract void whenThrowException(Exception e);

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        
        this.beforeExecute();
        try {
            ApplicationContext applicationContext = (ApplicationContext) context.getScheduler().getContext().get(Const.APPLICATION_CONTEXT);
            Job job = applicationContext.getBean(BATCH_JOB_NAME, Job.class);
            JobLauncher jobLauncher = applicationContext.getBean(JobLauncher.class);


            LocalDateTime now = LocalDateTime.now();
            if( this.logging ) {
                log.info("Task : {}", job);
                log.info("Acting time at : {}", now.format(DateTimeFormatter.ISO_DATE_TIME));
            }

            jobLauncher.run(job, new JobParametersBuilder()
                                                           .addString(Const.KEY, Generators.timeBasedGenerator().generate().toString())
                                                           .addString(Const.JOB_NAME, BATCH_JOB_NAME)
                                                           .addLocalDateTime(Const.DATE, now)
                                                           .toJobParameters());
        } catch (SchedulerException | JobExecutionAlreadyRunningException | JobRestartException | JobInstanceAlreadyCompleteException | JobParametersInvalidException e) {
            this.whenThrowException(e);
        }
        this.afterExecute();
    }
}

```


## Quartz 등록
```java
package com.appg.batchService.config.scheduling.timetable.quatz;

import com.appg.batchService.config.scheduling.config.quartz.QuartzSchedulingFormat;
import lombok.extern.slf4j.Slf4j;
@Slf4j
public class QuartzExample extends QuartzSchedulingFormat {
    public static String CRON_EXPRESSION = "*/5 * * * * ?";

    public QuartzExample() {
        super("exampleJob"); // JobBean 이름 넘긴다. (Spring-batch의 Job bean)
    }

    @Override
    protected void beforeExecute() {

    }

    @Override
    protected void afterExecute() {

    }

    @Override
    protected void whenThrowException(Exception e) {
        e.printStackTrace();
    }
}

```


## Spring batch Job 등록
```java

@Configuration
@Slf4j
@RequiredArgsConstructor
public class BatchExample {

    @Bean(name = "exampleJob")
    public Job exampleJob(@Qualifier(value = "exampleStep") Step step, JobRepository jobRepository) {
        return new JobBuilder("exampleJob", jobRepository)
                .preventRestart()
                .incrementer(parameters -> parameters)
                .start(step).build();
    }


    @JobScope
    @Bean(name = "exampleStep")
    public Step exampleStep(@Qualifier(value = "exampleTasklet") Tasklet tasklet, JobRepository jobRepository, PlatformTransactionManager txManager) {
        return new StepBuilder("exampleStep", jobRepository).tasklet(tasklet, txManager).build();
    }


    @StepScope
    @Bean(name = "exampleTasklet")
    public Tasklet exampleTasklet (){
        return (contribution, chunkContext) -> {
            JobParameters parameters = chunkContext.getStepContext().getStepExecution().getJobParameters();
            log.info("ExampleTasklet {}", parameters.getString("key"));
            return RepeatStatus.FINISHED;
        };
    }
}

```



## 이슈 사항
- dataSource를 여러 개 사용하는 (JPA에서 스키마를 특정하지 않고 멀티로 접근할 수 있어야 하는데, Spring batch의 JobRepository가 스키마 커스텀이 불가) 것처럼 되어 버림
> 그리하여 DataSource를 정의하고(Bean으로 등록하면 @Primary가 되어 JPA에 영향을 미친다. -> 그러면 JPA의 AutoConfigure을 포기해야한다.)
```java
@Configuration(value = "spring-batch-config")
@RequiredArgsConstructor
public class SpringBatchConfig extends DefaultBatchConfiguration {
    private final Environment environment;
    private final PlatformTransactionManager manager;

    //

    private DataSource dataSource() {
        HikariDataSource hikariDataSource = new HikariDataSource();
        String driver =  environment.getProperty("quartz.datasource.driver", String.class);
        String url =  environment.getProperty("quartz.datasource.url", String.class);
        String user =  environment.getProperty("quartz.datasource.user", String.class);
        String password =  environment.getProperty("quartz.datasource.password", String.class);


        hikariDataSource.setDriverClassName(driver);
        hikariDataSource.setJdbcUrl(url);
        hikariDataSource.setUsername(user);
        hikariDataSource.setPassword(password);
        return hikariDataSource;
    }

    @Override
    public JobRepository jobRepository() throws BatchConfigurationException {
        JobRepositoryFactoryBean factoryBean = new JobRepositoryFactoryBean();

        factoryBean.setDataSource(dataSource());
        factoryBean.setTransactionManager(manager);



        try {
            factoryBean.afterPropertiesSet();
            JobRepository jobRepository = factoryBean.getObject();



            return jobRepository;
        } catch (Exception e) {
            return super.jobRepository();
        }
    }


    @Bean
    @Primary
    public JobLauncher jobLauncher(JobRepository jobRepository) {
        TaskExecutorJobLauncher jobLauncher = new TaskExecutorJobLauncher();
        jobLauncher.setJobRepository(jobRepository);
        jobLauncher.setTaskExecutor(new SimpleAsyncTaskExecutor()); // or use ThreadPoolTaskExecutor
        return jobLauncher;
    }
}

```
- Quartz에서도 비슷한 양상의 이슈 발생
```java
@Configuration(value = "spring-quartz-config")
@RequiredArgsConstructor
public class SpringQuartzConfig {

    private final Environment environment;

    private DataSource dataSource() {
        HikariDataSource hikariDataSource = new HikariDataSource();

        String driver = environment.getProperty("quartz.datasource.driver", String.class);
        String url = environment.getProperty("quartz.datasource.url", String.class);
        String user = environment.getProperty("quartz.datasource.user", String.class);
        String password = environment.getProperty("quartz.datasource.password", String.class);

        hikariDataSource.setDriverClassName(driver);
        hikariDataSource.setJdbcUrl(url);
        hikariDataSource.setUsername(user);
        hikariDataSource.setPassword(password);
        return hikariDataSource;
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean() {
        SchedulerFactoryBean schedulerFactoryBean = new SchedulerFactoryBean();

        schedulerFactoryBean.setSchedulerName("Quartz");
        schedulerFactoryBean.setApplicationContextSchedulerContextKey(Const.APPLICATION_CONTEXT);
        schedulerFactoryBean.setGlobalTriggerListeners(new QuartzTriggerListener());
        schedulerFactoryBean.setGlobalJobListeners(new QuartzJobListener());
        schedulerFactoryBean.setDataSource(dataSource());
        schedulerFactoryBean.setWaitForJobsToCompleteOnShutdown(true);
        return schedulerFactoryBean;
    }
}
```


## 등록

`initializeTimeTable`에 `addJob` 함수로 등록하면 된다.

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class QuartzScheduler {
    private final Scheduler scheduler;


    @PostConstruct
    public void initializeTimeTable () {

        try {
            scheduler.standby();

            this.addJob(QuartzExample.class, QuartzExample.CRON_EXPRESSION);

//            scheduler.startDelayed(5000);
            scheduler.start();

        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }

    }




    private <T extends QuartzSchedulingFormat> void addJob(Class<T> jobClass, String cronExpression ) {

        String name = jobClass.getName();
        String group = jobClass.getName();

        JobKey jobKey = new JobKey(name, group);
        TriggerKey triggerKey = new TriggerKey(name, group);

        try {
            log.info("{} job already exists {}", name, scheduler.checkExists(triggerKey));
            log.info("{} trigger already exists {}", name, scheduler.checkExists(jobKey));
            if(scheduler.checkExists(jobKey) && scheduler.checkExists(triggerKey)){
                    scheduler.resumeAll();
            }
            else {
                if(scheduler.checkExists(jobKey)) scheduler.deleteJob(jobKey);
                if(scheduler.checkExists(triggerKey)) scheduler.unscheduleJob(triggerKey);
                scheduler.scheduleJob(this.jobDetailBuilder(jobClass, jobKey), this.jobTriggerBuilder(triggerKey, cronExpression));
            }
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    private Trigger jobTriggerBuilder(TriggerKey triggerKey, String cronExpression) {
        return TriggerBuilder.newTrigger()
                                      .withIdentity(triggerKey)
                                      .withSchedule(CronScheduleBuilder.cronSchedule(cronExpression))
                                      .build();
    }

    private JobDetail jobDetailBuilder(Class jobClass, JobKey jobKey) {
        JobDataMap jobDataMap = new JobDataMap();
        return JobBuilder.newJob(jobClass).withIdentity(jobKey)
                         .storeDurably(true)
                         .requestRecovery(true)
                         .usingJobData(jobDataMap).build();
    }

}

```
