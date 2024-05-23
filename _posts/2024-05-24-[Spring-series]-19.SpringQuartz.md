---
layout: post
categories: [SPRING]
---



from [Dictionary - Quartz](https://github.com/newkayak12/Dictionary/blob/master/spring/19.SpringQuartz.md)




# Quartz
스케쥴링 라이브러리



|용어|	분류|                 	설명                  |
|:---:|:---:|:------------------------------------:|
|Job|	인터페이스|         	실행할 작업을 정의하는 인터페이스          |
|JobDetail|	인터페이스|       	실행될 작업을 정의하고 구성하는 인터페이스       |
|JobBuilder|	클래스| 	JobDetail 인스턴스를 생성하는데 사용되는 유틸리티 클래스 |
|JobListener|	인터페이스|  	작업의 생명 주기 동안 발생하는 이벤트를 처리하는 인터페이스  |
|JobDataMap|	클래스|    	작업 실행시 필요한 데이터를 저장하는 맵(자료구조)     |
|||
|Trigger|	인터페이스|        	작업의 실행 시간을 결정하는 인터페이스        |
|CronTrigger|	인터페이스| 	복잡한 실행 스케줄을 정의할 수 있는 Trigger 인터페이스  |
|TriggerBuilder|	클래스|  	Trigger 인스턴스를 생성하는데 사용되는 유틸리티 클래스  |
|SimpleScheduleBuilder|	클래스|      	간단한 실행 스케줄을 정의할 수 있는 클래스       |
|CronScheduleBuilder|	클래스| 	복잡한 실행 스케줄을 cron 표현식으로 정의할 수 있는 클래스 |
|||
|Scheduler|	인터페이스|      	작업과 트리거를 관리하고 실행하는 인터페이스       |
|SchedulerFactory|	클래스|      	Scheduler 인스턴스를 생성하는 클래스       |


## Listener

### Trigger

```java
    private static class QuartzTriggerListener implements TriggerListener {

        @Override
        public String getName() {
            return "QuartzTriggerListener";
        }

        @Override
        public void triggerFired(Trigger trigger, JobExecutionContext jobExecutionContext) {
            log.info(" triggerFired [{}] {}", jobExecutionContext.getJobDetail().getKey().getGroup(), jobExecutionContext.getJobDetail().getKey().getName()  );
        }

        @Override
        public boolean vetoJobExecution(Trigger trigger, JobExecutionContext jobExecutionContext) {
            log.info(" vetoJobExecution [{}] {}", jobExecutionContext.getJobDetail().getKey().getGroup(), jobExecutionContext.getJobDetail().getKey().getName()  );
            return false;
        }

        @Override
        public void triggerMisfired(Trigger trigger) {
            log.info(" triggerMisfired [{}] {}", trigger.getJobKey().getGroup(), trigger.getJobKey().getName());

        }

        @Override
        public void triggerComplete(Trigger trigger, JobExecutionContext jobExecutionContext, Trigger.CompletedExecutionInstruction completedExecutionInstruction) {
            log.info(" triggerComplete [{}] {}", jobExecutionContext.getJobDetail().getKey().getGroup(), jobExecutionContext.getJobDetail().getKey().getName()  );

        }
    }

```
### Job
```java
    private static class QuartzJobListener implements JobListener {

        @Override
        public String getName() {
            return "QuartzJobListener";
        }

        @Override
        public void jobToBeExecuted(JobExecutionContext jobExecutionContext) {
            log.info(" jobToBeExecuted [{}] {}", jobExecutionContext.getJobDetail().getKey().getGroup(), jobExecutionContext.getJobDetail().getKey().getName()  );
        }

        @Override
        public void jobExecutionVetoed(JobExecutionContext jobExecutionContext) {
            log.info(" jobExecutionVetoed [{}] {}", jobExecutionContext.getJobDetail().getKey().getGroup(), jobExecutionContext.getJobDetail().getKey().getName()  );
        }

        @Override
        public void jobWasExecuted(JobExecutionContext jobExecutionContext, JobExecutionException e) {
            log.info(" jobWasExecuted [{}] {}", jobExecutionContext.getJobDetail().getKey().getGroup(), jobExecutionContext.getJobDetail().getKey().getName()  );
        }
    }
```


## CronExpression
>  `＊ ＊ ＊ ＊ ＊ ?`

- 가장 앞에 오는 단위는 초 (Seconds) 이다.
- 두번 째는 분 (Minutes) 을 나타낸다.
- 세번 째는 시 (Hours) 를 나타낸다.
- 네번 째는 일 (Day-of-Month, DOM) 을 나타낸다.
- 다섯번 째로 월 (Month) 에 대한 정보를 기술한다.
- 여섯번 째는 요일 (Day of Week) 을 나타낸다. 요일은 0~6 의 숫자로 쓸 수도 있지만 "MON", "SUN" 과 같이 요일의 약자로 사용할 수도 있다.
- 마지막은 연도 (Year) 가 온다. 연도는 optional 이다.


- 와일드카드 (*) 문자는 "매 번" 을 의미한다
- 물음표 (?) 는 '설정값 없음' 을 나타낸다. 이는 일 (DOM) 과 요일 (DOW) 에만 사용할 수 있다.
- 슬래쉬 (/) 는 값 증가 표현에 사용된다. 분 (Minutes) 항목에 "10/15" 라고 쓴다면, "10분 부터 시작해서 매 15분 마다" 를 의미한다.
- 샾 (#) 은 k#N 으로 사용되며, 이 달의 N번째 K요일을 의미한다. 요일 (DOW) 항목에 "5#2" 라고 적는다면, "이 달의 두번째 목요일" 을 뜻한다.
- 문자 "L" 은 마지막 (Last) 를 의미한다. L 은 일 (DOM) 과 요일 (DOW) 에만 사용할 수 있다. 예를 들어 일 (DOM) 항목에 L 이 사용된다면 단순하게 해당 월의 마지막 날을 의미한다. 조금 다른 방법으로도 사용되는데, 특정 값 뒤에 사용된다면 "이 달의 마지막 날"을 의미하게 된다. 예를 들어 요일에 "6L" 을 준다면, "이 달의 마지막 금요일" 을 의미하게 된다.
- 문자 "W" 는 해당 날로부터 가장 가까운 평일 (Weekday) 을 의미한다. 예를 들어 일 (DOM) 항목에 "10W" 라고 준다면, "이 달의 10째 날로부터 가장 가까운 평일" 을 의미한다.
- 각각의 단위는 범위나 목록으로 나타낼 수도 있다. 일 (DOM) 에 "1-15" 라고 적는다면 1일부터 15일까지를 뜻한다.
- 각각의 항목은 항목에 유효한 값만이 들어올 수 있다. 예를 들어 일은 1 ~ 31 사이의 숫자만 허용되고, 시간은 0 ~ 23 사이의 시간만 허용한다.

### ex
- "0 0/5 * * * ?" : 매 시 5분마다 수행
- "10 0/5 * * * ?" : 10초 뒤 5분마다 수행
- "0 30 10-13 ? * WED,FRI" : 매 주 수요일과 금요일 10시 ~ 13시 30분에 수행
- "0 0/30 8-9 5,20 * ?" : 매 월 5일과 20일에 8시 ~ 9시대에 30분 간격으로 수행 (ex. 8:00, 8:30, 9:00, 9:30 에 수행)
