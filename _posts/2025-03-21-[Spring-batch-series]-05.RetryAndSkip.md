---
layout: post

categories: [SPRING, BATCH]
---

# 재시도 및 건너뛰기
- 작업 실행 중에 오류를 우아하게 처리하기 위한 중요한 메커니즘

## 이해하기
- 일시적 실패, DB사용 불가, 무결성 문제 등 다양한 이유로 발생할 수 있다.

### 재시도
- 일시적인 오류가 발생할 경우 특정 항목의 처리를 지정한 횟수만큼 재시도할 수 있도록 한다.
- 재시도 간 대기 시간을 제어하기 위한 백오프 정책을 포함하는 RetryTemplate을 사용하여 구현한다.
> - `RetryTemplate`을 지정하여 사용한다.
> - Retry할 에러를 지정할 수 있다.
>

### 구현
1. 정책 정의
    - SimpleRetryTemplate : 고정된 지연 시간을 두고 주어진 횟수만큼 재시도
    - ExponentialBackOffPolicy : 시도 간 지연을 증가시키면서 재시도
    - FixedBackOffPolicy : 작업이 성공하거나 시간 초과가 발생할 때까지 실패한 작업을 재시도
    - CircuitBreakerRetryTemplate : 서킷브레이커 패턴을 사용해서 실패 작업을 재시도
2. 템플릿 정의
    1. SimpleRetryTemplate : 시도 사이에 고정된 시간을 두고 주어진 횟수만큼 재시도
    2. ExponentialBackOffPolilcy : 시도 간 지연을 증가시키면서 재시도
    3. FixedBackOffPolicy: 시도 간 고정된 지연을 두고 재시도
    4. TimeoutRetryTemplate: 성공하거나 시간 초과가 발생할 떄까지 실패한 작업을 재시도
    5. CircuitBreakerRetryTemplate : 서킷브레이커 패턴을 사용해서 실패한 작업을 재시도
3. 단계에 재시도 추가
    1. Tasklet, Chunk 단위로 재시도 템플릿 추가


### 건너뛰기
- 무결성 문제나 잘못된 데이터 형식과 같이 영구적인 오류로 인해 특정 항목을 처리할 수 없는 경우에 적용된다.
- 종료 대신, 스프링 배치는 문제의 항목을 건너뛰고 나머지 작업을 계속 진행할 수 있도록 허용한다.
>- Skip할 에러를 지정할 수 있다.
>- Skip할 사이즈를 정할 수 있는데 실제로 건너뛴 항목 수가 이 한도를 초과하면 작업을 실패처리한다.
>- SkipListener가 있으며

#### SkipPolicy

- AlwaysSkipItemSkipPolicy : 결함이 있는 레코드 또는 항목을 항상 건너뛴다.
- CompositeSkipPolicy : 여러 건너뛰기 정책 결합
- ExceptionClassifierSkipPolicy : 예외를 분류하고 각 예외 유형에 대한 건너뛰기 동작을 정의할 수 있다.


### 둘 간의 차이
- 재시도는 오류가 발생했을 때 동일한 항목을 여러 번 처리하려고 시도하며, 오류가 이후 시도에서 해결될 것이라는 기대를 가짐
- 건너뛰기는 항목의 처리가 실패한 후 해당 처리를 포기하고 나머지 작업을 중단 없이 계속 진행하도록 한다.