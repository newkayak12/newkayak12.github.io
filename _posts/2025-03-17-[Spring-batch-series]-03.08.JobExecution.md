---
layout: post

categories: [SPRING, BATCH]
---

## JobExecution
- 실행 중인 Job의 특정 인스턴스
- 이벤트에 반응하여 트리거되거나 일정에 따라 실행될 떄마다 Job이 생성
- 실행에 대한 모든 정보를 포함하여, 매개변수, 실행 컨텍스트 및 상태가 포함된다.
- 시작부터 끝까지 전체 프로세스를 캡슐화하여 모니터링 및 관리를 가능하게 한다.
- JobRepository에 저장되어 Job실행의 상태와 컨텍스트를 지속적으로 유지한다.
	- STARTED
	- STOPPING
	- STOPPED
	- COMPLETED
	- FAILED
	- UNKNOWN
- JobParameter와 함께 사용하여
	- 고유성 부여 : 매개변수에 의해 고유하게 식별될 수 있다.
	- 조건부 로직: 실행 흐름을 결정할 수 있다.
	- 재사용성과 유연서어 : 재사용이 가능하고 하드 코딩된 값을 외부에서 매개변수로 받아서 처리할 수 있다.
- ExecutionContext:
	- SharingData : 서로 다른 단계 간 데이터와 상태를 공유할 수 있게 해준다.
	- Checkpoint Management : 긴 실행 프로세스에서 체크 포인트 관리에 중요하다. Job실패 후 재시작시 ExecutionContext에서 상태를 복원해서 중단지점부터 처리한다.
	- Flexibility : 공유 컨텍스트에 데이터를 저장하고 꺼내올 수 있다.
	- Customization : 저장해야할 데이터를 정의하고 Job의 요구 사항에 대해서 매우 유연하고 적응 가능하게 만든다.
- 재시작 과정
	- SetUpJobRestartability
	- HandlingExecutionContext
	- JobParameter
	- TriggeringRestasrt
	- MonitoringAndLogging
