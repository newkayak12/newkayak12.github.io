---
layout: page
categories:
  - SPRING
---
## 1. **정의:**

- **빈의 생명주기와 존재 범위**를 정의하는 개념
- **언제 생성되고, 언제까지 살아있고, 몇 개나 만들어지는지** 결정
- Spring이 빈을 어떻게 관리할지에 대한 규칙

## 2. **왜 필요한가?**

- **메모리 효율성**: 필요 이상으로 객체 생성 방지
- **상태 관리**: 각 상황에 맞는 상태 유지
- **성능 최적화**: 적절한 시점에 생성/소멸

## 3. 언제 사용할까?
#### 1. 객체의 성격과 사용 목적
- 상태가 없는 서비스
- 설정 정보
-> Singleton
#### 2. 공유하면 안되는 객체
- 개인별 다른 상태
- 일회성 작업
-> Prototype, WebScope
#### 3. 웹 환경 특별한 경우 
- 요청별로 다른 정보
- 사용자별로 다른 정보
-> Request/Session Scope

# 4. 각 스코프 상세 특성
## 1. Singleton
### 언제 생성되는가?
- Eager(기본값)
	- 시점: ApplicationContext 시작 시
	- 순서: 의존성 순서에 따라서 
- Lazy (@Lazy)
	- 시점 `getBean()` 또는 의존성 주입
	- 장점: 애플리케이션 시작 단축
	- 단점: runtime 생성 오류 가능성 
### Thread
- Safe하지 않음
	- 하나의 인스턴스를 여러 쓰레드에서 공유
	- 상태를 가지면 치명적 문제 가능성
		- Stateless하게 설계
		- Immutable한 설계

## 2. Prototype
### 소멸 관리 책임
- Spring 관리 아래 있지 않음
- `@PreDestroy` 호출되지 않음
- 개발자가 핸들링
- GC에 의존
### 메모리 누수 위험
- Prototype이 외부 리소스를 물고 있다면
- Singleton이 Prototype 참조를 물고 있는 경우
- 대량의 Prototype이 있는 경우 
## 해결
- try-with-resource
- 명시적 cleanup
- `WeakReference` 사용

## 3. Request
### ThreadLocal
- RequestContextHolder
	- ThreadLocal 기반으로 요청별 정보 저장
	- 각 쓰레드마다 독립적인 RequestAttribute 보관
	- 요청 종료 시 자동으로 정리
### 비동기
- 문제
	- `@Async`시 Request Scope bean 접근 시 오류
	- 새로운 Thread는 `RequestContext` 없음
- 해결
	- `@Async` 전 확보
	- CompletableFuture로 전달
	- 비동기 작업용 별도 스코프 설계

## 4. Session
### HttpSession
- HttpSession의 attribute로 저장
- 세션 ID를 키로 사용
- 세션 무효화 시 함께 제거
### Cluster 환경
- 문제
	- 세션 스코프 Bean이 다른 서버로 복제 X
	- 서버 이동 시 상태 손실
- 해결
	- 세션 클러스터링
	- Redis 등 외부 세션 저장소
	- 
