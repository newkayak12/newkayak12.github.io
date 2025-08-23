---
layout: post

categories: [SPRING, BATCH]
---

# 작업 실행
## JobLauncher
- 특정 매개변수 집합으로 작업을 실행하도록 설계됐다.
- JobParameter를 사용하여 작업 실행을 구분한다.
- 동일한 매개변수로 동일한 작업을 실행하더라도 매개변수가 다르지 않는 한 새로운 실행이 시작되지 않는다.

# 작업 모니터링
## JobExecution
- 배치 작업을 모니터링하는 것은 작업이 원활하게 실행되고 발생할 수 있는 오류를 포착하는 데 중요하다.
- JobExecution은 작업 실행 상태에 대한 정보를 제공한다.
## JobInstance
- 작업의 다양한 실행을 나타낸다.
- 시간에 따라 동일한 작업의 여러 실행을 추적할 수 있게 한다.
- 고유한 JobParameter로 실행할 때마다 새로운 JobInstance가 생긴다.
