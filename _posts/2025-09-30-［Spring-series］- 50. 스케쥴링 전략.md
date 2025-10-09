---
layout: page
categories:
  - SPRING
---
# 스케줄링 전략

## 개요

Spring Boot 환경에서 주기적인 작업(배치, 정산, 리포트 등)을 실행하기 위한 3가지 주요 전략

---

## 1. @Scheduled (Spring 기본)

### 개념
Spring Framework가 제공하는 가장 간단한 스케줄링 방식
- 애플리케이션 내장
- 어노테이션 기반
- 코드만으로 스케줄 정의

### 구현

```kotlin
@Configuration
@EnableScheduling  // 필수
class SchedulingConfig

@Component
class ScheduledTasks {
    
    // 고정 딜레이: 이전 작업 종료 후 5초 대기
    @Scheduled(fixedDelay = 5000)
    fun fixedDelayTask() {
        println("5초마다 실행 (이전 작업 완료 기준)")
    }
    
    // 고정 간격: 이전 작업 시작 후 5초마다
    @Scheduled(fixedRate = 5000)
    fun fixedRateTask() {
        println("5초마다 실행 (시작 시간 기준)")
    }
    
    // Cron 표현식: 매일 새벽 2시
    @Scheduled(cron = "0 0 2 * * *")
    fun cronTask() {
        println("매일 새벽 2시 실행")
    }
    
    // 초기 지연: 앱 시작 10초 후 첫 실행
    @Scheduled(initialDelay = 10000, fixedRate = 60000)
    fun initialDelayTask() {
        println("앱 시작 10초 후, 이후 1분마다")
    }
}
```

### Cron 표현식

```
 ┌─── 초 (0-59)
 │ ┌─── 분 (0-59)
 │ │ ┌─── 시 (0-23)
 │ │ │ ┌─── 일 (1-31)
 │ │ │ │ ┌─── 월 (1-12)
 │ │ │ │ │ ┌─── 요일 (0-7, 0과 7은 일요일)
 │ │ │ │ │ │
 * * * * * *
```

**예시**
```kotlin
"0 0 2 * * *"        // 매일 새벽 2시
"0 */30 * * * *"     // 30분마다
"0 0 9-18 * * MON-FRI"  // 평일 9시~18시 매 정시
"0 0 0 1 * *"        // 매월 1일 자정
```

### 설정

```yaml
# application.yml
spring:
  task:
    scheduling:
      pool:
        size: 5  # 스레드 풀 크기
      thread-name-prefix: scheduling-
```

### 장점
- 설정 간단 (어노테이션만)
- 별도 인프라 불필요
- 가벼운 작업에 적합

### 단점
- 앱 재시작 필요 (스케줄 변경 시)
- 실행 이력 없음
- 수동 실행 불가 (API 직접 구현 필요)
- 클러스터 환경에서 중복 실행 (별도 처리 필요)
- 동적 스케줄 변경 어려움

### 클러스터 환경 문제

```
App 1 (인스턴스 1)  →  @Scheduled 실행
App 2 (인스턴스 2)  →  @Scheduled 실행
App 3 (인스턴스 3)  →  @Scheduled 실행

→ 3개 모두 실행! (중복)
```

**해결책**
```kotlin
// ShedLock 사용
@Component
class ScheduledTasks {
    
    @Scheduled(cron = "0 0 2 * * *")
    @SchedulerLock(
        name = "settlementTask",
        lockAtMostFor = "30m",
        lockAtLeastFor = "5m"
    )
    fun settlement() {
        // DB 락으로 한 인스턴스만 실행
    }
}
```

### 사용 시나리오
- 단순 스케줄 작업 (캐시 갱신, 헬스체크)
- 단일 서버 환경
- 배치 1-2개 정도

---

## 2. Quartz

### 개념
Java 기반 오픈소스 스케줄링 라이브러리
- 애플리케이션 내장
- 강력한 스케줄링 기능
- DB 기반 클러스터링 지원

### 의존성

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-quartz")
}
```

### 구현

```kotlin
// Job 정의
class SettlementJob : Job {
    override fun execute(context: JobExecutionContext) {
        println("정산 배치 실행: ${context.fireTime}")
        // 배치 로직
    }
}

// 설정
@Configuration
class QuartzConfig {
    
    @Bean
    fun settlementJobDetail(): JobDetail {
        return JobBuilder.newJob(SettlementJob::class.java)
            .withIdentity("settlementJob", "batch")
            .withDescription("일일 정산 Job")
            .storeDurably()
            .build()
    }
    
    @Bean
    fun settlementTrigger(): Trigger {
        return TriggerBuilder.newTrigger()
            .forJob(settlementJobDetail())
            .withIdentity("settlementTrigger", "batch")
            .withSchedule(
                CronScheduleBuilder.cronSchedule("0 0 2 * * ?")
                    .withMisfireHandlingInstructionFireAndProceed()
            )
            .build()
    }
}
```

### 클러스터링 설정

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/app
    username: root
    password: password
  
  quartz:
    job-store-type: jdbc  # DB 기반
    properties:
      org:
        quartz:
          scheduler:
            instanceId: AUTO
            instanceName: MyScheduler
          jobStore:
            class: org.quartz.impl.jdbcjobstore.JobStoreTX
            driverDelegateClass: org.quartz.impl.jdbcjobstore.StdJDBCDelegate
            tablePrefix: QRTZ_
            isClustered: true  # 클러스터 모드
            clusterCheckinInterval: 20000  # 20초마다 체크
          threadPool:
            threadCount: 10
```

### DB 테이블 (11개 필요)

```sql
-- Quartz 전용 테이블
QRTZ_JOB_DETAILS          -- Job 정보
QRTZ_TRIGGERS             -- Trigger 정보
QRTZ_SIMPLE_TRIGGERS      -- Simple Trigger
QRTZ_CRON_TRIGGERS        -- Cron Trigger
QRTZ_BLOB_TRIGGERS        -- Blob Trigger
QRTZ_CALENDARS            -- Calendar 정보
QRTZ_PAUSED_TRIGGER_GRPS  -- 일시정지된 Trigger
QRTZ_FIRED_TRIGGERS       -- 실행 중인 Trigger
QRTZ_SCHEDULER_STATE      -- 스케줄러 상태 (클러스터 동기화)
QRTZ_LOCKS                -- 락 관리
QRTZ_SIMPROP_TRIGGERS     -- Simple Property Trigger
```

### 수동 실행 API

```kotlin
@RestController
@RequestMapping("/api/batch")
class BatchController(private val scheduler: Scheduler) {
    
    @PostMapping("/trigger/{jobName}")
    fun triggerJob(
        @PathVariable jobName: String,
        @RequestParam params: Map<String, String>
    ): ResponseEntity<*> {
        
        val jobKey = JobKey.jobKey(jobName, "batch")
        
        // Job 존재 확인
        if (!scheduler.checkExists(jobKey)) {
            return ResponseEntity.badRequest().body("Job not found")
        }
        
        // 파라미터와 함께 실행
        val jobDataMap = JobDataMap(params)
        scheduler.triggerJob(jobKey, jobDataMap)
        
        return ResponseEntity.ok("Triggered: $jobName")
    }
}
```

### 클러스터 동작 방식

```
새벽 2시 도착

App 1: SELECT * FROM QRTZ_LOCKS FOR UPDATE
       → 락 획득! 배치 실행

App 2: SELECT * FROM QRTZ_LOCKS FOR UPDATE  
       → 대기...

App 3: SELECT * FROM QRTZ_LOCKS FOR UPDATE
       → 대기...

App 1: 배치 완료 → COMMIT (락 해제)
App 2: 이미 실행됐는지 체크 → SKIP
App 3: 이미 실행됐는지 체크 → SKIP
```

### 장점
- 강력한 스케줄링 기능
- DB 기반 클러스터링
- Job 체인, 리스너 등 고급 기능
- 실행 이력 DB 저장 가능

### 단점
- **복잡한 설정** (11개 DB 테이블)
- **DB 락 경합** (성능 이슈)
- **높은 러닝커브**
- **클러스터 환경에서 복잡도 급증**
- 스케줄 변경 시 재배포 필요
- GUI 없음 (별도 Admin 구축 필요)

### 리소스 낭비

```
API 서버 3대 (로드밸런싱)

┌─────────────────┐
│ App 1           │
│ - API (1GB)     │
│ - Quartz (500MB)│ ← 항상 떠있음
└─────────────────┘

┌─────────────────┐
│ App 2           │
│ - API (1GB)     │
│ - Quartz (500MB)│ ← 항상 떠있음 (대기만)
└─────────────────┘

┌─────────────────┐
│ App 3           │
│ - API (1GB)     │
│ - Quartz (500MB)│ ← 항상 떠있음 (대기만)
└─────────────────┘

총 리소스: 4.5GB
실제 작업: 1개만, 나머지는 대기
```

### 사용 시나리오
- 앱 내부 통합 필요 (주문 후 30분 뒤 취소 등)
- 복잡한 Job 체인
- 단순 환경 (서버 1대)

---

## 3. Jenkins

### 개념
외부 독립 스케줄러
- 애플리케이션 **밖**
- 웹 기반 GUI
- 중앙화된 배치 관리

### 구조

```
┌──────────────┐
│  Jenkins     │ (독립 서버, 스케줄러)
└──────┬───────┘
       │
       │ 스케줄 트리거
       │
       └──→ K8s Job / ECS Task 생성
            → 배치 실행 → 완료 후 종료
```

### 실행 방식

#### One-time

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    triggers {
        cron('0 2 * * *')  // 매일 새벽 2시
    }
    
    parameters {
        string(name: 'TARGET_DATE', defaultValue: '2025-10-05')
        choice(name: 'JOB_TYPE', choices: ['settlement', 'report'])
    }
    
    stages {
        stage('배치 실행') {
            steps {
                sh """
                    kubectl create job ${params.JOB_TYPE}-\${BUILD_NUMBER} \\
                    --image=ecr/batch:latest \\
                    -- --job.name=${params.JOB_TYPE} --date=${params.TARGET_DATE}
                """
            }
        }
    }
    
    post {
        failure {
            slackSend(channel: '#batch-alerts', 
                      message: "배치 실패: ${env.JOB_NAME}")
        }
        success {
            slackSend(message: "배치 성공")
        }
    }
}
```

**동작**
```
평소: 아무것도 안 떠있음 (리소스 0)
  ↓
Jenkins 트리거
  ↓
K8s Job/ECS Task 생성
  ↓
배치 실행 (10분)
  ↓
완료 후 자동 삭제
  ↓
다시 리소스 0
```

#### Long-running

```
배치 서버 (항상 실행 중)
    ↑
    | HTTP POST
    |
Jenkins → curl 호출
```

```groovy
pipeline {
    triggers { cron('0 2 * * *') }
    stages {
        stage('트리거') {
            steps {
                sh '''
                    curl -X POST \
                    http://batch-server:8080/api/batch/trigger/settlement
                '''
            }
        }
    }
}
```

### 장점
- **간단한 구조** (스케줄러 1개)
- **웹 GUI** (버튼 클릭으로 실행)
- **자동 이력 관리**
- **자동 알림** (Slack, 이메일)
- **파라미터 입력 UI**
- **클러스터 동기화 불필요**
- **리소스 효율적** (One-time 방식)
- **배치 격리** (장애 영향 최소화)

### 단점
- Jenkins 서버 별도 구축 필요
- 인프라 관리 필요

### 리소스 효율

```
┌─────────────────┐
│ API 서버 3대    │
│ - API (1GB)     │ ← 스케줄러 없음
│ - API (1GB)     │
│ - API (1GB)     │
└─────────────────┘

┌─────────────────┐
│ Jenkins (512MB) │ ← 단일 스케줄러
└─────────────────┘

┌─────────────────┐
│ K8s Job         │ ← 실행 시에만 생성
│ - 배치 (2GB)    │
└─────────────────┘
    ↓ 완료 후
   자동 삭제

평소: 3.5GB
실행 시: 5.5GB
```

### 사용 시나리오
- **여러 배치 중앙 관리** (배치 5개 이상)
- **MSA/클라우드 환경** (K8s, ECS)
- **운영 편의성 중요** (비개발자도 사용)
- **이력/모니터링 필수**

---

## 전략 비교

| 항목 | @Scheduled | Quartz | Jenkins |
|------|-----------|--------|---------|
| **위치** | 앱 내장 | 앱 내장 | 외부 독립 |
| **설정 난이도** | 쉬움 | 어려움 | 중간 |
| **스케줄 변경** | 재배포 | 재배포 | 웹 UI |
| **수동 실행** | API 직접 구현 | API 구현 | 버튼 클릭 |
| **실행 이력** | 없음 | 직접 구현 | 자동 제공 |
| **알림** | 직접 구현 | 직접 구현 | 자동 제공 |
| **GUI** | 없음 | 없음 | 기본 제공 |
| **클러스터** | 중복 실행 | DB 락 (복잡) | 동기화 불필요 |
| **리소스** | 앱과 공유 | 앱과 공유 (낭비) | 독립 (효율적) |
| **DB 테이블** | 불필요 | 11개 필요 | 불필요 |

---

## 선택 가이드

### @Scheduled 사용
```
✅ 배치 1-2개
✅ 단순 스케줄 (캐시 갱신, 헬스체크)
✅ 단일 서버
✅ 별도 인프라 부담
```

### Quartz 사용
```
✅ 앱 내부 통합 필요
   (주문 30분 후 자동 취소 등)
✅ 복잡한 Job 체인
✅ 단순 환경 (서버 1대)
```

### Jenkins 사용
```
✅ 배치 5개 이상
✅ MSA/클라우드 (K8s, ECS)
✅ 운영 편의성 중요
✅ 중앙 관리 필요
✅ 이력/모니터링 필수
```

---

## 실무 혼합 패턴

```kotlin
// @Scheduled: 가벼운 실시간 작업
@Component
class RealtimeScheduler {
    
    @Scheduled(fixedDelay = 300000)
    fun refreshCache() {
        // 5분마다 캐시 갱신
    }
}

// Quartz: 앱 로직과 밀접한 작업
@Service
class OrderService(private val scheduler: Scheduler) {
    
    fun createOrder(order: Order) {
        orderRepository.save(order)
        
        // 30분 후 자동 취소 스케줄
        scheduler.scheduleJob(
            CancelOrderJob(order.id),
            Date(System.currentTimeMillis() + 1800000)
        )
    }
}
```

```groovy
// Jenkins: 무거운 배치
// 매일 새벽 2시 정산
pipeline {
    triggers { cron('0 2 * * *') }
    stages {
        stage('정산') {
            steps {
                sh 'kubectl create job settlement'
            }
        }
    }
}
```

---

## 권장 아키텍처 (Spring Boot + K8s/ECS)

```
┌─────────────────────────────────┐
│  API 서버 (3대)                 │
│  - @Scheduled (캐시 갱신)       │  ← 가벼운 작업만
│  - Quartz (주문 취소 스케줄)    │  ← 앱 로직 통합
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Jenkins                        │
│  - 정산 배치 (매일 2시)         │
│  - 리포트 배치 (매주 월요일)    │  ← 무거운 배치
│  - 데이터 동기화 (매시간)       │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  K8s Job / ECS Task             │
│  - 실행 시에만 생성             │
│  - 완료 후 자동 삭제            │
└─────────────────────────────────┘
```

**장점**
- 역할 분리 명확
- 리소스 효율적
- 운영 편의성
- 확장 용이

---

## 핵심 요약

### @Scheduled
- 가장 간단
- 가벼운 작업
- 단일 서버

### Quartz
- 강력하지만 복잡
- 클러스터링 어려움
- 앱 내부 통합

### Jenkins
- 중앙 관리
- 운영 편의성
- MSA/클라우드 최적

**Spring Boot + K8s/ECS 환경 → Jenkins 권장**

