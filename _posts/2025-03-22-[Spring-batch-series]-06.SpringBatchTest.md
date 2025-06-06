---
layout: post

categories: [SPRING, BATCH]
---

# SpringBatchTest
## 단위 테스트
- `@SpringBatchTest`로 단위 테스트를 진행할 수 있다.
- 배치 구성 요소만 로드할 수 있다.
## 중요성
- 아래의 문제를 검증하기 위해서 테스트를 진행하는 것이 좋다.
	- 대량의 데이터 처리할 때 무결설 문제
	- 작업이 장기간 발생할 경우 성능 문제
	- 오류 처리와 개발자 개입 없이 재시도

## 방법
1. 단위 테스트
	1. Reader, Processor, Writer등과 같은 개별 요소에 중점을 둔다.
	2. 각 구성 요소가 독립적으로 올바르게 작동하는지 확인할 수 있다.
	3. 모킹 프레임워크를 사용해서 의존성을 시뮬레이션한다.
2. 통합 테스트
	1. 서로 다른 구성 요소 간의 상호 작용과 외부 시스템과의 통합을 검증
3. 엔드 투 엔드 :
	1. 전체 스택을 입력해서 출력까지 테스트
	2. 실제 시나리오를 시뮬레이션하고 배치 작업이 예상 결과를 내는지 확인
4. 기능 테스트:
	1. 특정 비즈니스 요구 사항에 중점을 두고 작업이 지정된 기능을 준수하는지 확인

## 도구
1. JobLauncherTestUtils
	1.  배치에서 제공하는 유틸리티 클래스
	2.  배치 잡의 테스트를 간소화
	3. 제어된 환경에서 작업의 실해을 시뮬레이션하고 결과를 확인할 수 있음
2.  JobRepositoryTestUtils
	1. 배치에서 제공하는 유틸 클래스
	2. JobRepository의 테스트를 간소화
	3. 테스트 목적으로 JobRepository를 프로그래밍 방식으로 쿼리하고 수정할 수 있다.
	4. 작업 실행의 상태 수정, 작업 실행 기록 쿼리, 작업 실행 레코드 삭제 등 메소드 제공
	5. 작업 저장소 동작과 애플리케이션의 작업 저장소와의 상호 작용을 확인하는 통합 테스트 가능
3. JUnit
	1. Step, ItemReaders, ItemWriters, ItemProcessor같은 구성 요소를 테스트할 수 있다.

