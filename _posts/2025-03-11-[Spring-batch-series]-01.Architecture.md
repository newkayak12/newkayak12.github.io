---
layout: post

categories: [SPRING, BATCH]
---

## 1. 아키텍쳐
1. Job:
    1. 배치 애플리케이션의 최상위 구성 요소
    2. 작업은 순차적으로 실행되는 하나 이상의 단계로 구성
2. Step:
    1. 스텝은 작업의 단일 단계를 나타낸다.
    2. 데이터를 처리하기 위해서 함께 동작하는 Reader, Processor, Writer가 존재한다.
3. ItemReader
    1. 파일이나 DB같은 소스에서 데이터를 읽는 방법 제공
    2. JdbcCursorItemReader 및 FlatFileItemReader 같은 내장 ItemReader가 있다.
4. ItemProcessor
    1. 처리 중인 데이터에 비즈니스 로직을 적용하는 방법을 제공한다.
    2. 입력을 받아서 출력 항목을 반환
    3. ItemProcessorAdapter, CompsiteItemProcessor 같은 내장 ItemProcessor가 있다.
5. ItemWriter
    1. 데이터를 파일이나 DB에 저장하는 방법을 제공한다.
    2. JdbcBatchITemWriter, FlatFileItemWriter 등 내장 ItemWriter를 제공
6. JobRepository
    1. 작업 단계 및 실행 데이터를 저장하는 방법을 제공
    2. MapJobRepository, JobRepositoryFactoryBean와 같은 구현 제공
7. JobLauncher
    1. 시작과 중지를 담당

## 1.2. 정리하면
1. 배치 :
    1. 대량의 배치 작업을 안정적으로 처리하기 위한 도구를 제공
    2. 작업 스케쥴링, 병렬처리, 모니터링 및 오류 처리를 위한 기능도 포함
2. 핵심 개념
    1. Job, Step, ItemReader, ItemProcessor, ItemWriter가 있다.
    2. Job은 실행할 수 있는 논리적 작업 단위, 하나 이상의 스템으로 구성
    3. Step은 Job내에서 특정 작업을 수행 ItemReader, ItemProcessor, ItemWriter로 구성
    4. ItemReader 입력 데이터를 읽고 다른 컴포넌트에서 처리할 수 있는 객체 생성
    5. ItemProcessor 입력 데이터를 수정하거나 변환
    6. ItemWriter데이터 저장소에 기록하는 데 사용
    7. JobRepository는 실행된 작업 및 단계에 대한 메타데이터를 저장하는데 사용. 이 저장소는 모든 Job실행을 추적하고 실행 내역을 쿼리하고 관리하기 위한 메소드를 제공
    8. JobLauncher는 Job을 시작, 중지하고 진행 상황을 모니터링하는 메소드를 제공 또한 별도의 쓰레드나 프로세스에서 Job을 비동기적으로 실행하는데 사용할 수 있다.
    9. JobParameter는 Job이 시작될 떄 Job에 전달되는 매개변수
    10. BatchStatus는 배치 작업 실행의 현재 상태를 나타내는 데 사용
    11. JobExecution이라나 Job단일 실행을 나타낸다. 시작, 종료 시간, 상태, 오류 등을 포함한다.
3. 추가로
    1. 배치 구성은 `@JobScope`, `@StepScope`등으로 구성 요소의 구조 동작 및 종속성 정의
    2. JobRepository는 실행 상태, 종료 상태, 재시작 가능성 같은 작업 단계와 관련된 메타데이터를 저장하는 데이터 베이스 in-memory, jdbc, jpa를 비롯한 여러가지 구현 제공
    3. JobListener: 작업 실행 전후, 스텝 실행 전후, 청크 처리 전후 등 배치 작업 실행의 다양한 단계에서 알림을 받는 컴포넌트
    4. StepListener: 스텝 실행 전후, 청크 처리 전후, 아이템 처리 전후 등 스텝 실행에서 알림을 받는 컴포넌트

## 2. 아키텍쳐
- 일반적으로 아래 계층으로 구성된 계층화된 아키텍쳐 방식을 따른다.
### 1. 핵심 배치 계층
  - Job, Step, ItemReader 등과 같은 대부분의 배치 처리 구성 요소가 포함
  - 배치 작업을 정의하고 작업 실행을 관리하는 기능을 제공
### 2. 작업 실행 계층
  - 작업을 호출하고 작업 실행을 처리하는 역할을 한다.
  - 작업을 시작하고 인스턴스와 작업 실행을 관리하는 JobLaunch를 관리
### 3. 작업 레포지토리 계층
  - JobRepository는 작업 및 단계 실행 메타데이터의 지속성을 처리한다.
  - 작업 상태를 추적하는 데 사용되어 작업 재시작 및 보고를 허용
### 4. 데이터베이스 계층
  - JobRepository가 DB와 상호작용하여 작업 메타데이터를 읽고 쓰는 곳
### 5. 통합 계층
  - 스프링 Integration, Quartz, JMS 또는 RabbitMQ 등과 같은 메시직 시스템과 같은 다른 프레임워크 및 시스템과 통합할 수 있다.

## 설계
### 아키텍쳐
1. Job: 일련의 단계를 위한 컨테이너
2. Step : 특정 작업을 수행하기 위해 필요한 로직을 캡슐화한 Job의 한 단계
3. ExecutionContext : Job의 Step간의 보존할 수 있는 일시 데이터를 저장
### 병렬처리
1. 파티셔닝 : 데이터를 여러 파티션으로 나눠서 별도의 단계에서 병렬로 처리할 수 있게 한다.
	-  작동 방식은 PartitionHandler라는 인터페이스를 제공한다.
	-  일반적으로 StepExecutionPartitionHandler, TaskExecutionPartitionHandler가 있다.
	- PartitionStep을 사용해서 파티션 실행을 위한 단계를 구성한다.
	- PartitionHandler를 만들고 PartitionStep으로 어떻게 실행되어야 하는지 정의한다.
2. 주/종 구성 : master는 slave 혹은 쓰레드에 작업을 분배하는 역할을 한다.
3.  멀티쓰레딩 : TaskExecutor를 사용하여 단계를 여러 쓰레드에서 실행하도록 구성할 수 있다.

