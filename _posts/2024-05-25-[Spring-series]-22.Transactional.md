---
layout: post

categories: [SPRING]
---



from [Dictionary - Transactional](https://github.com/newkayak12/Dictionary/blob/master/spring/22.Transactional.md)


# ## 코드
```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {
    Propagation propagation() default Propagation.REQUIRED;
    Isolation isolation() default Isolation.DEFAULT;
    int timeout() default -1;
    boolean readOnly() default false;
    Class<? extends Throwable>[] rollbackFor() default {};
    String value() default "";
}
```

## 정의
1. `@Transactional`은 선언적으로 트랜잭션 관리를 가능하게 해주는 annotation 기반 메타데이터다.
2. 트랜잭션 경계(begin/ commit/ rollback)을 자동으로 설정하는 **AOP annotation**이다. 
3. 메소드, 클래스 선두에 붙일 수 있다. `@Target({ElementType.METHOD, ElementType.TYPE})`
4. 정상 종료 시 commit, 비정상 종료 시 rollback을 자동으로 수행한다.
5. 트랜잭션 제어 코드를 매 번 작성하지 않더라도 **일관적인 트랜잭션 처리**를 보장받을 수 있게 해준다.
6. DB의 트랜잭션이 아닌 트랜잭션 관리 추상화 계층에서 동작하는 **논리적 트랜잭션**이다.

## 선언적?
- spring은 transaction 관리에 대해서 두 가지 방법을 제시한다.
	1. 프로그래밍 방식: 코드 내 직접 트랜잭션 경계를 설정
	2. 선언적 방식 : `@Transactional`로 Spring이 AOP를 통해서 자동 적용

## 동작
1. client 호출
2. AOP Proxy 객체가 가로챈다.
	1. JDK Dynamic Proxy(Interface 기반)
	2. CGLIB (bytecode 조작)
3. TransactionInterceptor advisor 등록
	1. invoke로 처리한다.
```java
package org.springframework.transaction.interceptor;  
    
import org.aopalliance.intercept.MethodInterceptor;  
import org.aopalliance.intercept.MethodInvocation;  
  
import org.springframework.aop.support.AopUtils;  
import org.springframework.beans.factory.BeanFactory;  
import org.springframework.lang.Nullable;  
import org.springframework.transaction.PlatformTransactionManager;  
import org.springframework.transaction.TransactionManager;  

@SuppressWarnings("serial")  
public class TransactionInterceptor extends TransactionAspectSupport implements MethodInterceptor, Serializable {  

 
    @Override  
    @Nullable
	public Object invoke(MethodInvocation invocation) throws Throwable {  
    
       return invokeWithinTransaction(invocation.getMethod(), targetClass, invocation::proceed);  
    }  
  
  //후략
}
```
```java
public abstract class TransactionAspectSupport implements BeanFactoryAware, InitializingBean {

	@Nullable  
	protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass,  
	       final InvocationCallback invocation) throws Throwable {  
	  
	    // If the transaction attribute is null, the method is non-transactional.  
	    TransactionAttributeSource tas = getTransactionAttributeSource();  
	    final TransactionAttribute txAttr = (tas != null ? tas.getTransactionAttribute(method, targetClass) : null);  
	    final TransactionManager tm = determineTransactionManager(txAttr);  
	
	
	// Reactive 관련
	    if (this.reactiveAdapterRegistry != null && tm instanceof ReactiveTransactionManager rtm) {  
	       boolean isSuspendingFunction = KotlinDetector.isSuspendingFunction(method);  
	       boolean hasSuspendingFlowReturnType = isSuspendingFunction &&  
	             COROUTINES_FLOW_CLASS_NAME.equals(new MethodParameter(method, -1).getParameterType().getName());  
	  
	       ReactiveTransactionSupport txSupport = this.transactionSupportCache.computeIfAbsent(method, key -> {  
	          Class<?> reactiveType =  
	                (isSuspendingFunction ? (hasSuspendingFlowReturnType ? Flux.class : Mono.class) : method.getReturnType());  
	          ReactiveAdapter adapter = this.reactiveAdapterRegistry.getAdapter(reactiveType);  
	          if (adapter == null) {  
	             throw new IllegalStateException("Cannot apply reactive transaction to non-reactive return type [" +  
	                   method.getReturnType() + "] with specified transaction manager: " + tm);  
	          }  
	          return new ReactiveTransactionSupport(adapter);  
	       });  
	  
	       return txSupport.invokeWithinTransaction(method, targetClass, invocation, txAttr, rtm);  
	    }  


//PlatformTransactionManager를 설정한다.
	  
	    PlatformTransactionManager ptm = asPlatformTransactionManager(tm);  
	    final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);  

// 동기식 트랜잭션 처리 (get/commit/rollback)
	    if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager cpptm)) {  
	       // Standard transaction demarcation with getTransaction and commit/rollback calls.  
	       TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, joinpointIdentification);  
	  
	       Object retVal;  
	       try {  
	          // This is an around advice: Invoke the next interceptor in the chain.  
	          // This will normally result in a target object being invoked.          retVal = invocation.proceedWithInvocation();  
	       }  
	       catch (Throwable ex) {  
	          // target invocation exception  
	          completeTransactionAfterThrowing(txInfo, ex);  
	          throw ex;  
	       }  
	       finally {  
	          cleanupTransactionInfo(txInfo);  
	       }  
	  
	       if (retVal != null && txAttr != null) {  
	          TransactionStatus status = txInfo.getTransactionStatus();  
	          if (status != null) {  

// Future, Vavr 타입 처리 (비동기 완료 검사)
	             if (retVal instanceof Future<?> future && future.isDone()) {  
	                try {  
	                   future.get();  
	                }  
	                catch (ExecutionException ex) {  
	                   if (txAttr.rollbackOn(ex.getCause())) {  
	                      status.setRollbackOnly();  
	                   }  
	                }  
	                catch (InterruptedException ex) {  
	                   Thread.currentThread().interrupt();  
	                }  
	             }  
	             else if (vavrPresent && VavrDelegate.isVavrTry(retVal)) {  
	                // Set rollback-only in case of Vavr failure matching our rollback rules...  
	                retVal = VavrDelegate.evaluateTryFailure(retVal, txAttr, status);  
	             }  
	          }  
	       }  
	  
	       commitTransactionAfterReturning(txInfo);  
	       return retVal;  
	    }  
	//
	    else {  
	       Object result;  
	       final ThrowableHolder throwableHolder = new ThrowableHolder();  
	  
	       // It's a CallbackPreferringPlatformTransactionManager: pass a TransactionCallback in.  
	       try {  
	          result = cpptm.execute(txAttr, status -> {  
	             TransactionInfo txInfo = prepareTransactionInfo(ptm, txAttr, joinpointIdentification, status);  
	             try {  
	                Object retVal = invocation.proceedWithInvocation();  
	                if (retVal != null && vavrPresent && VavrDelegate.isVavrTry(retVal)) {  
	                   // Set rollback-only in case of Vavr failure matching our rollback rules...  
	                   retVal = VavrDelegate.evaluateTryFailure(retVal, txAttr, status);  
	                }  
	                return retVal;  
	             }  
	             catch (Throwable ex) {  
	                if (txAttr.rollbackOn(ex)) {  
	                   // A RuntimeException: will lead to a rollback.  
	                   if (ex instanceof RuntimeException runtimeException) {  
	                      throw runtimeException;  
	                   }  
	                   else {  
	                      throw new ThrowableHolderException(ex);  
	                   }  
	                }  
	                else {  
	                   // A normal return value: will lead to a commit.  
	                   throwableHolder.throwable = ex;  
	                   return null;  
	                }  
	             }  
	             finally {  
	                cleanupTransactionInfo(txInfo);  
	             }  
	          });  
	       }  
	       catch (ThrowableHolderException ex) {  
	          throw ex.getCause();  
	       }  
	       catch (TransactionSystemException ex2) {  
	          if (throwableHolder.throwable != null) {  
	             logger.error("Application exception overridden by commit exception", throwableHolder.throwable);  
	             ex2.initApplicationException(throwableHolder.throwable);  
	          }  
	          throw ex2;  
	       }  
	       catch (Throwable ex2) {  
	          if (throwableHolder.throwable != null) {  
	             logger.error("Application exception overridden by commit exception", throwableHolder.throwable);  
	          }  
	          throw ex2;  
	       }  
	  
	       // Check result state: It might indicate a Throwable to rethrow.  
	       if (throwableHolder.throwable != null) {  
	          throw throwableHolder.throwable;  
	       }  
	       return result;  
	    }  
	}

}
```
- **PlatformTransactionManager**가 직접 트랜잭션을 열고/ 닫고/ 롤백


## PlatformTransactionManager?
- Spring의 tx 처리 전략을 추상화한 인터페이스 

| **구현체 이름**                   | **대상 기술 스택**      | **주요 특징**                                | **비고**                                 |
| ---------------------------- | ----------------- | ---------------------------------------- | -------------------------------------- |
| DataSourceTransactionManager | JDBC              | 순수 JDBC용 트랜잭션 매니저, Connection 직접 제어      | 가장 단순, autoCommit=false 직접             |
| JpaTransactionManager        | JPA (Hibernate 등) | EntityManager 기반 트랜잭션, JPA flush 연동      | JPA 전용, 스프링 부트에서 기본 선택                 |
| HibernateTransactionManager  | Hibernate Native  | Hibernate Session 기반 직접 제어               | JPA 미사용 시 사용, Spring 6에서 deprecated 예정 |
| JtaTransactionManager        | JTA (분산 트랜잭션)     | XA 트랜잭션, 2PC 지원, Atomikos/Narayana 연동 가능 | Java EE, 대규모 분산 시스템용                   |
| ChainedTransactionManager    | 다중 데이터소스          | 여러 TransactionManager 묶어서 순차 처리          | best-effort 1PC, 완전한 원자성 없음            |
| ReactiveTransactionManager   | WebFlux + R2DBC   | 논블로킹 트랜잭션, Mono/Flux 전파                  | JDBC와 완전 별개                            |

## 모드 proxy vs. aspjectj

```java
@Configuration
@EnableTransactionManagement(mode = AdviceMode.PROXY) // 기본값
public class TransactionConfig { }

```

### Proxy
- 런타임 프록시 생성(JDK DynamicProxy/ CGLIB)
- 기본 값
- 프록시 기반 AOP
- Spring이 대상 bean을 proxy 객체로 감싼다.
- `@Transactional`이 붙은 메소드를 호출하면 -> 프록시가 가로채서 트랜잭션 처리
- 실제 클래스는 따로 수정하지 않는다. 단지, 호출 경로를 조작한다.
 > 1. 프록시 객체가 중간에 interceptor를 삽입
 > 2. AOP 적용 시점 : RUNTIME
 > 3. 내부 포출(`this.method()`)은 프록시를 거치지 않기에 트랜잭션 적용이 안딘다.
### ASPECTJ
- 위빙 기반 AOP
- 대상 클래스의 byteCode에 AOP로직을 직접 삽입
- 프록시 없이도 동작하며, `this.method()`같은 내부 호출조 적용된다.
- 위빙 시점
	- Compile-Time Weaving : .class 파일에 삽입
	- Load-Time weaving : JVM 시작 시 
	- Post-compile weaving : .class 빌드 후 aspect 적용
	- 

#### Proxy 기반 내부 호출 
- 프록시는 클라이언트가 호출할 때 프록시에 트랜잭션을 덮어 씌우는 개념이다.
- 따라서 프록시 내부에서 메소드 호출은 프록시의  advice(TransactionInterceptor)를 거치지 않는다.
- 따라서 내부 호출은 `@Transactional`이 적용되지 않는다.
#### 내부 호출 해결
1. aspectj 모드로 변경
2. 서비스 분리
3. AOP 강제 적용 
	1. 내부에서 현재 프록시를 얻어서 호출
 

## Annotation의 속성 값들

| 속성명           | 타입          | 기본값      | 설명                       |
| ------------- | ----------- | -------- | ------------------------ |
| propagation   | Propagation | REQUIRED | 트랜잭션 전파 방식               |
| isolation     | Isolation   | DEFAULT  | DB 격리 수준                 |
| timeout       | int         | -1       | 트랜잭션 제한 시간 (초), -1이면 무제한 |
| readOnly      | boolean     | false    | 읽기 전용 힌트                 |
| rollbackFor   | Class＜?＞［］  | 없음       | 롤백할 예외 타입 지정             |
| noRollbackFor | Class＜?＞［］  | 없음       | 롤백하지 않을 예외 타입 지정         |
| value         | String      | ""       | 트랜잭션 이름 (로깅 또는 관리용 태그 등) |

### Propagation
| **값**         | **설명**                                  |
| ------------- | --------------------------------------- |
| REQUIRED      | 트랜잭션이 존재하면 참여, 없으면 새로 시작 (**기본값**)      |
| REQUIRES_NEW  | 기존 트랜잭션 **무조건 중단하고** 새 트랜잭션 시작          |
| NESTED        | 부모 트랜잭션 안에서 **savepoint** 기반 하위 트랜잭션 시작 |
| SUPPORTS      | 트랜잭션 있으면 참여, 없으면 그냥 트랜잭션 없이 실행          |
| NOT_SUPPORTED | 기존 트랜잭션 **일시 중단**, 트랜잭션 없이 실행           |
| NEVER         | 트랜잭션이 있으면 예외 발생                         |
| MANDATORY     | 트랜잭션이 **없으면 예외 발생**, 무조건 있어야 함          |
### Isolation
**(org.springframework.transaction.annotation.Isolation)**

| **값**            | **DB 명칭** | **설명**                                |
| ---------------- | --------- | ------------------------------------- |
| DEFAULT          | DB 기본값 따름 | RDBMS마다 다름 (MySQL은 REPEATABLE READ)   |
| READ_UNCOMMITTED | 읽기 허용     | **커밋되지 않은 데이터**도 읽을 수 있음 (가장 낮은 수준)   |
| READ_COMMITTED   | 커밋된 데이터만  | **다른 트랜잭션이 커밋한 데이터만** 읽음 (Oracle 기본값) |
| REPEATABLE_READ  | 반복 읽기 보장  | **같은 쿼리 결과가 항상 동일함** (MySQL 기본값)      |
| SERIALIZABLE     | 완전 직렬화 수준 | 동시성 거의 없음, 가장 엄격 (성능 저하 큼)            |

#### 트랜잭션에 따른 허용 정도 

| **격리 수준**        | **Dirty Read** | **Non-Repeatable Read** | **Phantom Read** |
| ---------------- | -------------- | ----------------------- | ---------------- |
| READ_UNCOMMITTED | ✅              | ✅                       | ✅                |
| READ_COMMITTED   | ❌              | ✅                       | ✅                |
| REPEATABLE_READ  | ❌              | ❌                       | ✅                |
| SERIALIZABLE     | ❌              | ❌                       | ❌                |

#### readOnly
- DB 또는 ORM에게 쓰기 없이 읽기만 할 예정이라는 힌트를 준다.
- JPA에서는 flush를 안하게 최적화 한다.
- MySQL의 경우 SELECT에 `(SET TRANSACTION READ ONLY)` 힌트를 준다.



## 그 외

### Q1. @Transactional(readOnly = true)인데도 update 쿼리가 나가는 이유

1. readOnly=true가 SQL 실행을 제한하는 목적은 아니다.
2. flush를 내부적으로 처리하지 않는다.
3. 그러나 entityManager로 flush(), save() 등을 명시하면 에러 없이 Update 등이 나간다.

#### ->  A1. Hibernate flush 모드를 FlushMode.MANUAL로 설정

### Q2. 예외를 던졌는데 rollback이 안되는 경우
1. @Transactional 내에서 예외가 발생했지만 DB에 commit

#### -> A2. 예외에 따라 다르다.
| **예외 타입**                                     | **기본 롤백 여부** |
| --------------------------------------------- | ------------ |
| RuntimeException (e.g., NullPointerException) | ✅ 롤백         |
| Error (e.g., OutOfMemoryError)                | ✅ 롤백         |
| Checked Exception (e.g., IOException)         | ❌ 커밋됨        |
| 예외를 try-catch로 잡고 처리                          | ❌ 커밋됨        |

### Q3. private 메소드는 왜 @Transactional을 못 붙이는가?
#### -> A3. AOP 기반 프록시 구조 문제
| **개념**                       | **설명**                                 |
| ---------------------------- | -------------------------------------- |
| **프록시 기반 AOP**               | Spring은 @Transactional을 **프록시 객체**로 감쌈 |
| **자기 자신 호출 (this.method())** | 프록시를 **거치지 않음** → 트랜잭션 로직 실행 안 됨       |
| **private 메서드**              | 프록시에서 호출 불가 → 애초에 인터셉트 대상이 아님          |


### Q4. `@TransactionalEventListner` ?
- Spring에서 제공하는 트랜잭션 후 처리용 이벤트 리스너 어노테이션
- DB 트랜잭션이 성공적으로 커밋된 후 특정 작업을 하고 싶을 때 사용

#### 동작 방식 
1. 이벤트 발생 : ApplicationEventPublisher.publishEvent() 호출
2. 트랜잭션 감지 : Spring이 현재 트랜잭션에 이벤트 등록
3. commit : TransactionSynchronizationManager를 통해서 리스너 실행
4. listener 실행: @TransactionalEventListener 메소드 실행

#### 동작 제어 시점
| **값**              | **의미**                  |
| ------------------ | ----------------------- |
| AFTER_COMMIT (기본값) | 트랜잭션 커밋 후 실행            |
| BEFORE_COMMIT      | 커밋 직전 실행                |
| AFTER_ROLLBACK     | 롤백 시 실행                 |
| AFTER_COMPLETION   | 트랜잭션 종료 시 (커밋/롤백 무관) 실행 |