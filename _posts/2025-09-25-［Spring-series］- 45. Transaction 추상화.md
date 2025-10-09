---
layout: page
categories:
  - SPRING
---
## 1. 트랜잭션?
- 과거 JavaEE, JDBC 등
	- 트랜잭션 API가 DB, 기술별로 다르다.
	- 코드에 명시적으로 커밋/ 롤백/ 예외 처리를 해야 해서 복잡하고 중복되는 코드가 늘었다.
	- JTA, JDBC, Hibernate 등 트랜잭션 관리 API가 다 다르다.
- 문제점
	- "트랜잭션 처리"가 비즈니스 로직과 뒤섞인다.(관심사 분리)
	- 여러 기술을 혼합 사용 시 트랜잭션 처리가 불일치한다. 
- **Spring에서는?**
	- 트랜잭션 관리를 interface ``PlatformTransactionManager``로 추상화 한다.
	- 구체 구현에 대한 종속성이 떨어진다.
	- 실제 비즈니스 코드는 `@Transactional`이라는 선언적 처리만 남는다.


## 2. PlatformTransactionManager
- 모든 트랜잭션 구현체의 통합 추상화

```java
public interface PlatformTransactionManager extends TransactionManager {

	TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;
	
	void commit(TransactionStatus status) throws TransactionException;
	
	void rollback(TransactionStatus status) throws TransactionException;

}

```

- 구현체
	- DataSourceTransactionManager (JDBC)
	- JpaTransactionManager (JPA)
	- HibernateTransactionManager (Hibernate)
	- JtaTransactionManager (distributed transaction)

- 구성 요소
	- TransactionStatus
		- 트랜잭션 실행 컨텍스트/상태
		- `isNewTransaction()`, `setRollbackOnly()`, `isCompleted()`, `savePoint` 관리 등
		- 내부적으로 트랜잭션 객체도 보유
	  ```java
	public interface TransactionStatus extends TransactionExecution, SavepointManager, Flushable {

	default boolean hasSavepoint() {  
	    return false;  
	}  
	  
	@Override  
	default void flush() {  
	}
	
}
	
```
	- TransactionDefinition
		- 트랜잭션 시작 정책 정의(전파, 격리, readOnly, timeout 등)
	  ```java
public interface TransactionDefinition {

	int PROPAGATION_REQUIRED = 0;
	int PROPAGATION_SUPPORTS = 1;  
    int PROPAGATION_MANDATORY = 2;  
    int PROPAGATION_REQUIRES_NEW = 3;  
    int PROPAGATION_NESTED = 6;  
    int ISOLATION_DEFAULT = -1;  
    int ISOLATION_READ_UNCOMMITTED = 1;  
    int TIMEOUT_DEFAULT = -1;  
  
	default int getPropagationBehavior() {  
       return PROPAGATION_REQUIRED;  
    }  
  
    default int getIsolationLevel() {  
       return ISOLATION_DEFAULT;  
    }  
  
    default int getTimeout() {  
       return TIMEOUT_DEFAULT;  
    }  
  
    default boolean isReadOnly() {  
       return false;  
    }  
  
    @Nullable  
    default String getName() {  
       return null;  
    }  
  
    static TransactionDefinition withDefaults() {  
       return StaticTransactionDefinition.INSTANCE;  
    }  
  
}

```
	- TransactionSynchronization(트랜잭션 라이프 사이클 콜백)
		- 트랜잭션 경계(커밋/ 롤백/ 종료 등)에서 실행되는 콜백
		- 트랜잭션 실행 중 `TransactionSynchronizationManager`를 통해서 `registerSynchronization(..)`로 콜백 등록
		- `PlatforTransactionManager`가 `TransactionSynchronizationManager.getSynchronizations()`를 순회하며 콜백 메소드 호출
		  ```java
public interface TransactionSynchronization extends Ordered, Flushable {  
  
    int STATUS_COMMITTED = 0;  
    int STATUS_ROLLED_BACK = 1;  
    int STATUS_UNKNOWN = 2;  
  
  
    @Override  
    default int getOrder() {  
       return Ordered.LOWEST_PRECEDENCE;  
    }  
  
    default void suspend() {  
    }  
    
    default void resume() {  
    }  
    
    @Override  
    default void flush() {  
    }  
    
    default void beforeCommit(boolean readOnly) {  
    }  
    
    default void beforeCompletion() {  
    }  
    
	default void afterCommit() {  
    }  
    
    default void afterCompletion(int status) {  
    }  
}
```
	- TransactionSynchronizationManager(현재 쓰레드의 트랜잭션 리소스/ 콜백 관리자)
		- 현재 쓰레드에 바인딩된 트랜잭션 리소스(커넥션, 세션), Synchronization(콜백) 등 관리
		- 트랜잭션 시작/종료 시점에 리소스 바인딩/해제
		- registerSynchronization(...) 콜백 등록/ 관리
		- getResource(), bindResource(), unbindResource()등 제공
```java
public abstract class TransactionSynchronizationManager {  


/**
 * PlatformTransactionManager의 구현체에서 트랜잭션 시작 이후
 * TransactionSynchronizationManager.isSynchronizationActive()로 활성화 되어 있다면
 * 트랜잭션 경계에 각종 콜백(JPA flush)등을 registerSynchronization으로 등록
 *
 */
	public static void registerSynchronization(TransactionSynchronization synchronization)  
	       throws IllegalStateException {  
	  
	    Assert.notNull(synchronization, "TransactionSynchronization must not be null");  
	    Set<TransactionSynchronization> synchs = synchronizations.get();  
	    if (synchs == null) {  
	       throw new IllegalStateException("Transaction synchronization is not active");  
	    }  
	    synchs.add(synchronization);  
	}  

//현재 트랜잭션에 등록된 모든 콜백을 정렬된 리스트로 반환
//PlatformTransactionManager의  commit, rollback 내부에서 호출

	public static List<TransactionSynchronization> getSynchronizations() throws IllegalStateException {  
	    Set<TransactionSynchronization> synchs = synchronizations.get();  
	    if (synchs == null) {  
	       throw new IllegalStateException("Transaction synchronization is not active");  
	    }  
	     if (synchs.isEmpty()) {  
	       return Collections.emptyList();  
	    }  
	    else if (synchs.size() == 1) {  
	       return Collections.singletonList(synchs.iterator().next());  
	    }  
	    else {  
	       
	       List<TransactionSynchronization> sortedSynchs = new ArrayList<>(synchs);  
	       OrderComparator.sort(sortedSynchs);  
	       return Collections.unmodifiableList(sortedSynchs);  
	    }  
	}  

//특정 리소스(DB 커넥션, 세션 등) 현재 트랜잭션 쓰레드에 바인딩
//트랜잭션 시작 (DB 커넥션, EntityManager) 등 리소스 생성 후

	public static void bindResource(Object key, Object value) throws IllegalStateException {  
	    Object actualKey = TransactionSynchronizationUtils.unwrapResourceIfNecessary(key);  
	    Assert.notNull(value, "Value must not be null");  
	    Map<Object, Object> map = resources.get();  
	    // set ThreadLocal Map if none found  
	    if (map == null) {  
	       map = new HashMap<>();  
	       resources.set(map);  
	    }  
	    Object oldValue = map.put(actualKey, value);  
	    // Transparently suppress a ResourceHolder that was marked as void...  
	    if (oldValue instanceof ResourceHolder resourceHolder && resourceHolder.isVoid()) {  
	       oldValue = null;  
	    }  
	    if (oldValue != null) {  
	       throw new IllegalStateException(  
	             "Already value [" + oldValue + "] for key [" + actualKey + "] bound to thread");  
	    }  
	}
//특정 리소스(DB 커넥션, 세션 등) 현재 트랜잭션 쓰레드에 해제
//트랜잭션 종료 시 ThreadLocal에 반환
	public static Object unbindResource(Object key) throws IllegalStateException {  
	    Object actualKey = TransactionSynchronizationUtils.unwrapResourceIfNecessary(key);  
	    Object value = doUnbindResource(actualKey);  
	    if (value == null) {  
	       throw new IllegalStateException("No value for key [" + actualKey + "] bound to thread");  
	    }  
	    return value;  
	}

//현재 쓰레드에 바인딩된 모든 트랜잭션 리소스 맵을 반환
	public static Map<Object, Object> getResourceMap() {  
	    Map<Object, Object> map = resources.get();  
	    return (map != null ? Collections.unmodifiableMap(map) : Collections.emptyMap());  
	}
	
//현재 쓰레드에 트랜잭션이 실제로 활성 상태인지 플래그 관리	
	public static boolean isActualTransactionActive() {  
	    return (actualTransactionActive.get() != null);  
	}
	
	public static void setActualTransactionActive(boolean active) {  
	    actualTransactionActive.set(active ? Boolean.TRUE : null);  
	}

}
```



### Synchronization?
#### 1. 사전적 의미
- 동기화, 정렬, 일치
- multi-thread에서 synchronization과 같은 뉘앙스
#### 2. Spring(TransactionSynchronization)
- 트랜잭션 라이프사이클의 동기화 대상 콜백이라는 의미
	- 콜백들이 **트랜잭션 경계와 정확히 동기화되어 실행**되어야 한다는 의미
	- 트랜잭션이라는 비동기/ 여러 리소스가 얽히는 영역에서 "커밋/롤백/종료 등과 맞물려서 호출되는 동기화된 작업"을 정형화된 구조로 제공하기 위해서 


## 3. AbstractPlatformTransactionManager

### 1. tx 시작

```java
public abstract class AbstractPlatformTransactionManager  
       implements PlatformTransactionManager, ConfigurableTransactionManager, Serializable {


	protected abstract Object doGetTransaction() throws TransactionException;

	protected abstract void doBegin(Object transaction, TransactionDefinition definition)  
	       throws TransactionException;

//트랜잭션 시작 진입점
	@Override  
	public final TransactionStatus getTransaction(@Nullable TransactionDefinition definition)  
	       throws TransactionException {  
	  
	    // Use defaults if no transaction definition given.  
	    TransactionDefinition def = (definition != null ? definition : TransactionDefinition.withDefaults());  
	
		// 구체 구현체에서 리소스 조회/ 생성
	    Object transaction = doGetTransaction();  
	    boolean debugEnabled = logger.isDebugEnabled();  

		//트랜잭션 필요한지 결정
	    if (isExistingTransaction(transaction)) {  
	       // Existing transaction found -> check propagation behavior to find out how to behave.  
	       //전파 정책따라서 처리
	       return handleExistingTransaction(def, transaction, debugEnabled);  
	    }  






		//신규 트랜잭션에 따른 분기


	  
	    // Check definition settings for new transaction.  
	    if (def.getTimeout() < TransactionDefinition.TIMEOUT_DEFAULT) {  
	       throw new InvalidTimeoutException("Invalid transaction timeout", def.getTimeout());  
	    }  
	  
	    // No existing transaction found -> check propagation behavior to find out how to proceed.  
	    if (def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_MANDATORY) {  
	    //반드시 기존 트랜잭션이 있어야 하므로 없으면 예외
	       throw new IllegalTransactionStateException(  
	             "No existing transaction found for transaction marked with propagation 'mandatory'");  
	    }  
	
	    else if (def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRED ||  
	          def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW ||  
	          def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {  
	       SuspendedResourcesHolder suspendedResources = suspend(null);  
	   //무조건 신규 트랜잭션이 있어야 함
	       if (debugEnabled) {  
	          logger.debug("Creating new transaction with name [" + def.getName() + "]: " + def);  
	       }  
	       try {  
				
	          return startTransaction(def, transaction, false, debugEnabled, suspendedResources);  
	          //신규 트랜잭션 시작
	       }  
	       catch (RuntimeException | Error ex) {  
	          resume(null, suspendedResources);  
	          throw ex;  
	       }  
	    }

		  
	    else {  
	    //실제 트랜잭션은 없지만 콜백만 관리할 수 있도록 prepareTransactionStatus()로 상태 객체 반환
	       // Create "empty" transaction: no actual transaction, but potentially synchronization.  
	       if (def.getIsolationLevel() != TransactionDefinition.ISOLATION_DEFAULT && logger.isWarnEnabled()) {  
	          logger.warn("Custom isolation level specified but no actual transaction initiated; " +  
	                "isolation level will effectively be ignored: " + def);  
	       }  
	       boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);  
	       return prepareTransactionStatus(def, null, true, newSynchronization, debugEnabled, null);  
	    }  
	}



	
	private TransactionStatus handleExistingTransaction(  
	       TransactionDefinition definition, Object transaction, boolean debugEnabled)  
	       throws TransactionException {  
	//NEVER일 경우 있으면 에러
	    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NEVER) {  
	       throw new IllegalTransactionStateException(  
	             "Existing transaction found for transaction marked with propagation 'never'");  
	    }  
	//NOT_SUPPORTED -> 트랜잭션이 있으면 일시정지 ==> 실제 트랜잭션이 없는 상태로 실행
	    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NOT_SUPPORTED) {  
	       if (debugEnabled) {  
	          logger.debug("Suspending current transaction");  
	       }  
	       //트랜잭션 일시 정지
	       Object suspendedResources = suspend(transaction);  
	       boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);  
	       return prepareTransactionStatus(  
	             definition, null, false, newSynchronization, debugEnabled, suspendedResources);  
	    }  
	  //새로운 트랜잭션 필요하므로 시작, 기존은 suspend
	    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW) {  
	       if (debugEnabled) {  
	          logger.debug("Suspending current transaction, creating new transaction with name [" +  
	                definition.getName() + "]");  
	       }  
	       SuspendedResourcesHolder suspendedResources = suspend(transaction);  
	       try {  
	          return startTransaction(definition, transaction, false, debugEnabled, suspendedResources);  
	       }  
	       catch (RuntimeException | Error beginEx) {  
	          resumeAfterBeginException(transaction, suspendedResources, beginEx);  
	          throw beginEx;  
	       }  
	    }  

//Savepoint지정(지원하면)
	    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {  
	       if (!isNestedTransactionAllowed()) {  
	          throw new NestedTransactionNotSupportedException(  
	                "Transaction manager does not allow nested transactions by default - " +  
	                "specify 'nestedTransactionAllowed' property with value 'true'");  
	       }  
	       if (debugEnabled) {  
	          logger.debug("Creating nested transaction with name [" + definition.getName() + "]");  
	       }  
	       if (useSavepointForNestedTransaction()) {  
	          // Create savepoint within existing Spring-managed transaction,  
	          // through the SavepointManager API implemented by TransactionStatus.          // Usually uses JDBC savepoints. Never activates Spring synchronization.          DefaultTransactionStatus status = newTransactionStatus(  
	                definition, transaction, false, false, true, debugEnabled, null);  
	          this.transactionExecutionListeners.forEach(listener -> listener.beforeBegin(status));  
	          try {  
	             status.createAndHoldSavepoint();  
	          }  
	          catch (RuntimeException | Error ex) {  
	             this.transactionExecutionListeners.forEach(listener -> listener.afterBegin(status, ex));  
	             throw ex;  
	          }  
	          this.transactionExecutionListeners.forEach(listener -> listener.afterBegin(status, null));  
	          return status;  
	       }  
	       else {  
	          // Nested transaction through nested begin and commit/rollback calls.  
	          // Usually only for JTA: Spring synchronization might get activated here          // in case of a pre-existing JTA transaction.          return startTransaction(definition, transaction, true, debugEnabled, null);  
	       }  
	    }  
	  
	    // PROPAGATION_REQUIRED, PROPAGATION_SUPPORTS, PROPAGATION_MANDATORY:  
	    // regular participation in existing transaction.    if (debugEnabled) {  
	       logger.debug("Participating in existing transaction");  
	    }  
	    if (isValidateExistingTransaction()) {  
	       if (definition.getIsolationLevel() != TransactionDefinition.ISOLATION_DEFAULT) {  
	          Integer currentIsolationLevel = TransactionSynchronizationManager.getCurrentTransactionIsolationLevel();  
	          if (currentIsolationLevel == null || currentIsolationLevel != definition.getIsolationLevel()) {  
	             throw new IllegalTransactionStateException("Participating transaction with definition [" +  
	                   definition + "] specifies isolation level which is incompatible with existing transaction: " +  
	                   (currentIsolationLevel != null ?  
	                         DefaultTransactionDefinition.getIsolationLevelName(currentIsolationLevel) :  
	                         "(unknown)"));  
	          }  
	       }  
	       if (!definition.isReadOnly()) {  
	          if (TransactionSynchronizationManager.isCurrentTransactionReadOnly()) {  
	             throw new IllegalTransactionStateException("Participating transaction with definition [" +  
	                   definition + "] is not marked as read-only but existing transaction is");  
	          }  
	       }  
	    }  
	    boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);  
	    return prepareTransactionStatus(definition, transaction, false, newSynchronization, debugEnabled, null);  
	}


	private TransactionStatus startTransaction(TransactionDefinition definition, Object transaction,  
	       boolean nested, boolean debugEnabled, @Nullable SuspendedResourcesHolder suspendedResources) {  
	  
	    boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);  
	    DefaultTransactionStatus status = newTransactionStatus(  
	          definition, transaction, true, newSynchronization, nested, debugEnabled, suspendedResources);  
	    this.transactionExecutionListeners.forEach(listener -> listener.beforeBegin(status));  
	    try {  
	    //실제 트랜잭션 시작
	    //각 구현체에서 오버라이드
	       doBegin(transaction, definition);  
	    }  
	    catch (RuntimeException | Error ex) {  
	       this.transactionExecutionListeners.forEach(listener -> listener.afterBegin(status, ex));  
	       throw ex;  
	    }  
	//콜백 등 추가 처리
	    prepareSynchronization(status, definition);  
	    this.transactionExecutionListeners.forEach(listener -> listener.afterBegin(status, null));  
	    return status;  
	}




}
```

### 2.commit/rollback
```java
public abstract class AbstractPlatformTransactionManager implements PlatformTransactionManager, ConfigurableTransactionManager, Serializable {
	
	@Override  
	public final void commit(TransactionStatus status) throws TransactionException {  
	    if (status.isCompleted()) {  
	    //종료된 트랜잭션이면 예외
	       throw new IllegalTransactionStateException(  
	             "Transaction is already completed - do not call commit or rollback more than once per transaction");  
	    }  
	  
	    DefaultTransactionStatus defStatus = (DefaultTransactionStatus) status;  
	    if (defStatus.isLocalRollbackOnly()) {  
	    //현재 트랜잭션이 "로컬 롤백 전용"이라면 
	       if (defStatus.isDebug()) {  
	          logger.debug("Transactional code has requested rollback");  
	       }  
	       processRollback(defStatus, false);  
	       //롤백처리
	       return;  
	    }  
	  
	    if (!shouldCommitOnGlobalRollbackOnly() && defStatus.isGlobalRollbackOnly()) {  
	//현재 트랜잭션이 글로벌 롤백 전용이라면 (참여자/ 부모 트랜잭션 등에서 롤백), 커밋대신 롤백
	       if (defStatus.isDebug()) {  
	          logger.debug("Global transaction is marked as rollback-only but transactional code requested commit");  
	       }  
	       processRollback(defStatus, true);  
	       return;  
	    }  
// 위 롤백 전용은 정말로 롤백을 반드시 해야하는 상태임



	    processCommit(defStatus);  
	    //커밋
	}  
	  
	private void processCommit(DefaultTransactionStatus status) throws TransactionException {  
	    try {  
	       boolean beforeCompletionInvoked = false;  
	       boolean commitListenerInvoked = false;  
	  
	       try {  
	          boolean unexpectedRollback = false;  
	          prepareForCommit(status);  
	          //커밋 준비
	          
	          triggerBeforeCommit(status);  
	          //TrasnactionSynchronization에 beforeCommit() 콜백 호출
	          triggerBeforeCompletion(status);  
	          //beforeCompletion 콜백 실행(flush 등)
	          beforeCompletionInvoked = true;  
	  
	          if (status.hasSavepoint()) {  
	          //savePoint 있으면
	             if (status.isDebug()) {  
	                logger.debug("Releasing transaction savepoint");  
	             }  
	             unexpectedRollback = status.isGlobalRollbackOnly();  
	             this.transactionExecutionListeners.forEach(listener -> listener.beforeCommit(status));  
	             commitListenerInvoked = true;  
	             
	             status.releaseHeldSavepoint();  
	             //쥐고 있는 savePoint release
	          }  
	      
	          else if (status.isNewTransaction()) {  
			  //신규 트랜잭션이면 
	             if (status.isDebug()) {  
	                logger.debug("Initiating transaction commit");  
	             }  
	             unexpectedRollback = status.isGlobalRollbackOnly();  
	             this.transactionExecutionListeners.forEach(listener -> listener.beforeCommit(status));  
	             commitListenerInvoked = true;  
	             doCommit(status);  
	          }  
	      
	          else if (isFailEarlyOnGlobalRollbackOnly()) {  
	      //예기치 않은 롤백
	             unexpectedRollback = status.isGlobalRollbackOnly();  
	          }  
	  
	          // Throw UnexpectedRollbackException if we have a global rollback-only  
	          // marker but still didn't get a corresponding exception from commit.          if (unexpectedRollback) {  
	             throw new UnexpectedRollbackException(  
	                   "Transaction silently rolled back because it has been marked as rollback-only");  
	          }  
	       }  
	       catch (UnexpectedRollbackException ex) {  
	          triggerAfterCompletion(status, TransactionSynchronization.STATUS_ROLLED_BACK);  
	          this.transactionExecutionListeners.forEach(listener -> listener.afterRollback(status, null));  
	          //롤백된 경우 afterCompletion 콜백 실행
	          throw ex;  
	       }  
	       catch (TransactionException ex) {  
	       //커밋 실패 -> 롤백 
	          if (isRollbackOnCommitFailure()) {  
	             doRollbackOnCommitException(status, ex);  
	          }  
	          else {  
	             triggerAfterCompletion(status, TransactionSynchronization.STATUS_UNKNOWN);  
	             if (commitListenerInvoked) {  
	                this.transactionExecutionListeners.forEach(listener -> listener.afterCommit(status, ex));  
	             }  
	          }  
	          throw ex;  
	       }  
	       catch (RuntimeException | Error ex) {  
	          if (!beforeCompletionInvoked) {  
	          //commit중 예외 발생시
	             triggerBeforeCompletion(status);  
	          }  
	          doRollbackOnCommitException(status, ex);  
	          throw ex;  
	       }  
	  
	       // Trigger afterCommit callbacks, with an exception thrown there  
	       // propagated to callers but the transaction still considered as committed.       try {  
	          triggerAfterCommit(status);  
	          //커밋 이후 afterCommit 콜백 
	       }  
	       finally {  
	          triggerAfterCompletion(status, TransactionSynchronization.STATUS_COMMITTED);  
	          if (commitListenerInvoked) {  
	             this.transactionExecutionListeners.forEach(listener -> listener.afterCommit(status, null));  
	          }  
	       }  
	  
	    }  
	    finally {  
	    //트랜잭션 ThreadLocal 리소스 해제
	       cleanupAfterCompletion(status);  
	    }  
	}  








	@Override  
	public final void rollback(TransactionStatus status) throws TransactionException {  
	//이미 완료됐다면 예외
	    if (status.isCompleted()) {  
	       throw new IllegalTransactionStateException(  
	             "Transaction is already completed - do not call commit or rollback more than once per transaction");  
	    }  
	  
	    DefaultTransactionStatus defStatus = (DefaultTransactionStatus) status;  
	    롤백 진입
	        processRollback(defStatus, false);  
	}  
	  
	  
	  
	  private void processRollback(DefaultTransactionStatus status, boolean unexpected) {  
	    try {  
	       boolean unexpectedRollback = unexpected;  
	       boolean rollbackListenerInvoked = false;  
	  
	       try {  
	       //beforeCompletion 콜백
	          triggerBeforeCompletion(status);  
	          if (status.hasSavepoint()) {  
				//savePoint 있다면(중첩트랜잭션)
	             if (status.isDebug()) {  
	                logger.debug("Rolling back transaction to savepoint");  
	             }  
	             this.transactionExecutionListeners.forEach(listener -> listener.beforeRollback(status));  
	             rollbackListenerInvoked = true;  
	             status.rollbackToHeldSavepoint();  
	          }  
	      
	          else if (status.isNewTransaction()) {
	          //신규 트랜잭션이라면  
	             if (status.isDebug()) {  
	                logger.debug("Initiating transaction rollback");  
	             }  
	             this.transactionExecutionListeners.forEach(listener -> listener.beforeRollback(status));  
	             rollbackListenerInvoked = true;  
	             doRollback(status); 
	             //doRollback (DB, JPA) 
	          }  
	      
	          else {  
		      //외부에서 참여한 트랜잭션이면 
	             // Participating in larger transaction  
	             if (status.hasTransaction()) {  
	                if (status.isLocalRollbackOnly() || isGlobalRollbackOnParticipationFailure()) {  
	                   if (status.isDebug()) {  
	                      logger.debug("Participating transaction failed - marking existing transaction as rollback-only");  
	                   }  
	               //rolebackOnly 마킹
	                   doSetRollbackOnly(status);  
	                }  
	                
	                else {  
	                //아니면 그냥 둠
	                   if (status.isDebug()) {  
	                      logger.debug("Participating transaction failed - letting transaction originator decide on rollback");  
	                   }  
	                }  
	             }  
	             else {  
	                logger.debug("Should roll back transaction but cannot - no transaction available");  
	             }  
	             // Unexpected rollback only matters here if we're asked to fail early  
	             if (!isFailEarlyOnGlobalRollbackOnly()) {  
	             //예기치 않은 롤맥은 earlyException
	                unexpectedRollback = false;  
	             }  
	          }  
	       }  
	       catch (RuntimeException | Error ex) {  
	          triggerAfterCompletion(status, TransactionSynchronization.STATUS_UNKNOWN);  
	          if (rollbackListenerInvoked) {  
	             this.transactionExecutionListeners.forEach(listener -> listener.afterRollback(status, ex));  
	          }  
	          throw ex;  
	       }  
	  
	       triggerAfterCompletion(status, TransactionSynchronization.STATUS_ROLLED_BACK);  
	       //롤백 이후 afterCompletion 콜백, afterRollback 콜백
	       if (rollbackListenerInvoked) {  
	          this.transactionExecutionListeners.forEach(listener -> listener.afterRollback(status, null));  
	       }  
	  
	       // Raise UnexpectedRollbackException if we had a global rollback-only marker  
	       if (unexpectedRollback) {  
	       //예기치 않은 롤백이면 예외
	          throw new UnexpectedRollbackException(  
	                "Transaction rolled back because it has been marked as rollback-only");  
	       }  
	    }  
	    finally {  
	       cleanupAfterCompletion(status);  
	       //ThreadLocal 등 트랜잭션 자원 정리
	    }  
	}
	


	private void cleanupAfterCompletion(DefaultTransactionStatus status) {  
	//상태 객체 완료로 변경
	    status.setCompleted();  
	    
	    if (status.isNewSynchronization()) {  
	    //새롭게 synchronization을 활성화 했다면
	       TransactionSynchronizationManager.clear();  
	       //콜백, ThreadLocal, 플래그 등 정리
	    }  
	    if (status.isNewTransaction()) {  
	    //새로운 트랜잭션이면
	       doCleanupAfterCompletion(status.getTransaction());  
	       //JDBC 커넥션, EntityManager 정리 등
	       
	    }  
	    
	    if (status.getSuspendedResources() != null) {  
	    //멈추고 있는 상위 리소스가 있으면
	       if (status.isDebug()) {  
	          logger.debug("Resuming suspended transaction after completion of inner transaction");  
	       }  
	       Object transaction = (status.hasTransaction() ? status.getTransaction() : null);  
	       resume(transaction, (SuspendedResourcesHolder) status.getSuspendedResources());  
	       //복구
	    }  
	}

	protected void doCleanupAfterCompletion(Object transaction) {  
	}


}
```
- 둘 다 유사한 흐름으로 관리
- `doCommit()`, `doRollback()`에서 진짜 자원 조정
- 자원/ThreadLocal 확실하게 해제

### 3. 정리하면
1. 트랜잭션 시작(getTransaction)
	1.  전파정책에 따라 분리(handleExistingTransaction or NEW)
2. 트랜잭션 종료(commit/ rollback)
	1. 콜백 트리거
	2. 실제 커밋, 롤백
	3. 예외/ rollbackOnly 분기
3. 자원 정리, ThreadLocal 정리

## 4. 비즈니스 로직 실행 구간
### 1. @Transactional 동작
1. @Transactional -> Proxy 객체 생성(JDKDynamicProxy or CGLIB)
2. 실제 비즈니스 메소드 호출
	1. 프록시가 가로챔
		1. 트랜잭션 시작
		2. 비즈니스 로직
		3. 트랜잭션 종료
3. 실제로는
	1. Proxy
		1. `TransactionInterceptor.invoke()`
		2. `PlatformTransactionManager.getTransaction()`
		3. /// Business Method invoke
		4. `commit/ rollback`
		   
   
```java
public class TransactionInterceptor extends TransactionAspectSupport implements MethodInterceptor, Serializable {

	@Override  
	@Nullable  
	public Object invoke(MethodInvocation invocation) throws Throwable {  
	    // Work out the target class: may be {@code null}.  
	    // The TransactionAttributeSource should be passed the target class    // as well as the method, which may be from an interface.    Class<?> targetClass = (invocation.getThis() != null ? AopUtils.getTargetClass(invocation.getThis()) : null);  
	  
	    // Adapt to TransactionAspectSupport's invokeWithinTransaction...  

		/**
		 * 1. 트랜잭션 시작
		 * 2. try {
		 *   비즈니스 로직 실행
		 *   commit();
		 * }
		 * catch(Exception e) {
		 *   rollback();
		 * }
		 */

	    return invokeWithinTransaction(invocation.getMethod(), targetClass, invocation::proceed);  
	}

	@Nullable  
	protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass,  
	       final InvocationCallback invocation) throws Throwable {  
	  
	    // If the transaction attribute is null, the method is non-transactional.  
	
	    TransactionAttributeSource tas = getTransactionAttributeSource();  
	    //TransactionAttribute 조회
	    final TransactionAttribute txAttr = (tas != null ? tas.getTransactionAttribute(method, targetClass) : null);  
	    final TransactionManager tm = determineTransactionManager(txAttr);  
	    //TransactionManager 결정
	  
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
	    //Reactive
	  
	    PlatformTransactionManager ptm = asPlatformTransactionManager(tm);  
		//PlatformTransactionManger로 형 변환 (JDBC/ JPA/ JTA)

	    final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);  
	  
	    if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager cpptm)) {  
	       // Standard transaction demarcation with getTransaction and commit/rollback calls.  
	       TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, joinpointIdentification);  
	   //시작
	  
	       Object retVal;  
	       try {  
	          // This is an around advice: Invoke the next interceptor in the chain.  
	          // This will normally result in a target object being invoked.          
	          retVal = invocation.proceedWithInvocation();  
	          //비즈니스 로직 실행
	       }  
	       catch (Throwable ex) {  
	          // target invocation exception  
	          completeTransactionAfterThrowing(txInfo, ex);
	          //예외 발생시 롤백 트리거  
	          throw ex;  
	       }  
	       finally {  
	          cleanupTransactionInfo(txInfo);  
	          //트랜잭션 정보 정리
	       }  
	  
	       if (retVal != null && txAttr != null) {  
	   //비동기 반환 값 예외도 롤백 전파 처리
	          TransactionStatus status = txInfo.getTransactionStatus();  
	          if (status != null) {  
	             if (retVal instanceof Future<?> future && future.isDone()) {  
	             //Future 예외 발생
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
	             //Vavr 라이브러리 등에서 예외 전파 대응
	                // Set rollback-only in case of Vavr failure matching our rollback rules...  
	                retVal = VavrDelegate.evaluateTryFailure(retVal, txAttr, status);  
	             }  
	          }  
	       }  
	  
	       commitTransactionAfterReturning(txInfo);
	       //트랜잭션 정상 종료 -> 커밋  
	       return retVal;  
	    }  
	  
	    else {  
	//CallbackPreferringPlatformTransactionManager
	//트랜잭션 경계를 콜백 형태로 실행할 수 있도록 설계됨
	//트랜잭션 시작/종료는 매니저가 알아서 하고
	//중간 실제 로직은 콜백으로 실행하라는 패턴
	
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