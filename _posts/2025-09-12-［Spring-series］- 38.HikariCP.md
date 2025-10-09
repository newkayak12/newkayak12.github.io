---
layout: page
categories:
  - SPRING
---


정의
1. HikariCP는 Java application의 JDBC Connection의 객체를 **Pooling** 방식으로 관리하며 성능, 자원 효율성을 극대화하는 고성능 경량 커넥션 풀 라이브러리


### 왜 필요한가?
1. Connection 생성 비용이 크다.
	1. DB 연결은 TCP 연결 -> 인증 -> 세션 수립 과정을 거친다.
	2. 이 과정에서 드는 리소스가 크다.
2. 요청마다 Connection을 닫는다면?
	1. 커넥션 누수가 발생할 수 있다.
	2. TPS가 늘면 늘수록 비효율적이다.

### 어떻게 동작하는가?
1. 애플리케이션이 기동되면서 **HikariCP**가 커넥션 n개를 생성한다.
2. 사용할 때마다 `getConnection()`으로 Pool에 있는 커넥션을 빌린다.
3. 반환할 때 `Close()` 없이 Pool로 반환한다.
4. 일정 유휴 시간이 지나면 Connection을 정리한다.

#### HikariDataSource에서 벌어지는 일들

```java
public class HikariDataSource extends HikariConfig implements DataSource, Closeable {

//SpringInitialize 할 떄 getConnection을 실행시켜서 Pool을 만들어 놓는다.
//@Bean으로 등록된 DataSource가 주입될 떄 
//JPA/Hibernate가 bootstrapping할 때
	public Connection getConnection() throws SQLException {  
	    if (this.isClosed()) {  
	        throw new SQLException("HikariDataSource " + this + " has been closed.");  
	    } else if (this.fastPathPool != null) {  
	        return this.fastPathPool.getConnection();  
	    } else {  
	        HikariPool result = this.pool;  


	        if (result == null) {  
	            synchronized(this) {  
	                result = this.pool;  
	                if (result == null) {  
	                    this.validate();  
	                    LOGGER.info("{} - Starting...", this.getPoolName());  
	  
	                    try {  
	                        this.pool = result = new HikariPool(this);  
	                        this.seal();  
	                    } catch (HikariPool.PoolInitializationException pie) {  
	                        if (pie.getCause() instanceof SQLException) {  
	                            throw (SQLException)pie.getCause();  
	                        }  
	  
	                        throw pie;  
	                    }  
	  
	                    LOGGER.info("{} - Start completed.", this.getPoolName());  
	                }  
	            }  
	        }  
	  
	        return result.getConnection();  
	    }  
	}  
}
```
HikariDataSource

#### HikariPool에서 벌어지는 일들

```java
public final class HikariPool extends PoolBase implements HikariPoolMXBean, ConcurrentBag.IBagStateListener {

	public static final int POOL_NORMAL = 0;  
	public static final int POOL_SUSPENDED = 1;  
	public static final int POOL_SHUTDOWN = 2;  
	public volatile int poolState;  
	private final long aliveBypassWindowMs;  
	private final long housekeepingPeriodMs;  
	private static final String EVICTED_CONNECTION_MESSAGE = "(connection was evicted)";  
	private static final String DEAD_CONNECTION_MESSAGE = "(connection is dead)";  
	private final PoolEntryCreator poolEntryCreator;  
	private final PoolEntryCreator postFillPoolEntryCreator;  
	private final ThreadPoolExecutor addConnectionExecutor;  
	private final ThreadPoolExecutor closeConnectionExecutor;  
	private final ConcurrentBag<PoolEntry> connectionBag; //커넥션 저장소
	private final ProxyLeakTaskFactory leakTaskFactory;  
	private final SuspendResumeLock suspendResumeLock;  
	private final ScheduledExecutorService houseKeepingExecutorService; //백그라운드 하우스키퍼 실행 서비스 
	private ScheduledFuture<?> houseKeeperTask; // 유휴 커넥션 정리 및 풀 유지


	public HikariPool(HikariConfig config) {  
	    super(config);  
	    this.aliveBypassWindowMs = Long.getLong("com.zaxxer.hikari.aliveBypassWindowMs", TimeUnit.MILLISECONDS.toMillis(500L));  
	    this.housekeepingPeriodMs = Long.getLong("com.zaxxer.hikari.housekeeping.periodMs", TimeUnit.SECONDS.toMillis(30L));  
	    this.poolEntryCreator = new PoolEntryCreator();  
	    this.postFillPoolEntryCreator = new PoolEntryCreator("After adding ");  
	    this.connectionBag = new ConcurrentBag(this); 
	    this.suspendResumeLock = config.isAllowPoolSuspension() ? new SuspendResumeLock() : SuspendResumeLock.FAUX_LOCK;  
	    this.houseKeepingExecutorService = this.initializeHouseKeepingExecutorService();  
	    this.checkFailFast();  
	    if (config.getMetricsTrackerFactory() != null) {  
	        this.setMetricsTrackerFactory(config.getMetricsTrackerFactory());  
	    } else {  
	        this.setMetricRegistry(config.getMetricRegistry());  
	    }  
	  
	    this.setHealthCheckRegistry(config.getHealthCheckRegistry());  
	    this.handleMBeans(this, true);  
	    ThreadFactory threadFactory = config.getThreadFactory();  
	    int maxPoolSize = config.getMaximumPoolSize();  
	    LinkedBlockingQueue<Runnable> addConnectionQueue = new LinkedBlockingQueue(maxPoolSize);  
	    this.addConnectionExecutor = UtilityElf.createThreadPoolExecutor(addConnectionQueue, this.poolName + " connection adder", threadFactory, new UtilityElf.CustomDiscardPolicy());  
	    this.closeConnectionExecutor = UtilityElf.createThreadPoolExecutor(maxPoolSize, this.poolName + " connection closer", threadFactory, new ThreadPoolExecutor.CallerRunsPolicy());  
	    this.leakTaskFactory = new ProxyLeakTaskFactory(config.getLeakDetectionThreshold(), this.houseKeepingExecutorService);  
	    this.houseKeeperTask = this.houseKeepingExecutorService.scheduleWithFixedDelay(new HouseKeeper(), 100L, this.housekeepingPeriodMs, TimeUnit.MILLISECONDS);  
	    if (Boolean.getBoolean("com.zaxxer.hikari.blockUntilFilled") && config.getInitializationFailTimeout() > 1L) {  
	        this.addConnectionExecutor.setMaximumPoolSize(Math.min(16, Runtime.getRuntime().availableProcessors()));  
	        this.addConnectionExecutor.setCorePoolSize(Math.min(16, Runtime.getRuntime().availableProcessors()));  
	        long startTime = ClockSource.currentTime();  
	  
	        while(ClockSource.elapsedMillis(startTime) < config.getInitializationFailTimeout() && this.getTotalConnections() < config.getMinimumIdle()) {  
	            UtilityElf.quietlySleep(TimeUnit.MILLISECONDS.toMillis(100L));  
	        }  
	  
	        this.addConnectionExecutor.setCorePoolSize(1);  
	        this.addConnectionExecutor.setMaximumPoolSize(1);  
	    }  
	  
	}

	
	public Connection getConnection(long hardTimeout) throws SQLException {  
	    this.suspendResumeLock.acquire();  
	    long startTime = ClockSource.currentTime();  
	  
	    try {  
	        long timeout = hardTimeout;  
	  
	        do {   //커넥션이 죽었다면 다시 빌려줘야 하기 때문에 do-while
	            PoolEntry poolEntry = (PoolEntry)this.connectionBag.borrow(timeout, TimeUnit.MILLISECONDS);  
	            //풀에서 커넥션을 빌려온다.
	            if (poolEntry == null) {  
	                break;  
	            }  
	  
	            long now = ClockSource.currentTime();  
	            // 살아 있는지 확인
	            if (!poolEntry.isMarkedEvicted() && (ClockSource.elapsedMillis(poolEntry.lastAccessed, now) <= this.aliveBypassWindowMs || !this.isConnectionDead(poolEntry.connection))) {  
	                this.metricsTracker.recordBorrowStats(poolEntry, startTime);  
	                Connection var10 = poolEntry.createProxyConnection(this.leakTaskFactory.schedule(poolEntry));  
	                return var10;  
		            //ProxyConnection으로 감싸서 사용자에게 던진다.
	            }  
	//커넥션 실패하면 정리
	            this.closeConnection(poolEntry, poolEntry.isMarkedEvicted() ? "(connection was evicted)" : "(connection is dead)");  
	            timeout = hardTimeout - ClockSource.elapsedMillis(startTime);  
	        } while(timeout > 0L);  
	  
	        this.metricsTracker.recordBorrowTimeoutStats(startTime);  
	        throw this.createTimeoutException(startTime);  
	    } catch (InterruptedException e) {  
	        Thread.currentThread().interrupt();  
	        throw new SQLException(this.poolName + " - Interrupted during connection acquisition", e);  
	    } finally {  
	        this.suspendResumeLock.release();  
	    }  
	}

}
```
HikariPool

- `ConcurrentBag<PoolEntry> connectionBag` : 사용 가능/ 사용 중 커넥션 목록을 관리하는 핵심 데이터 구조(lock-free)
- `ThreadPoolExecutor addConnectionExecutor` : 커넥션을 비동기적으로 생성하는 Executor (커넥션이 부족할 때)
- `ScheduledExecutorService houseKeepingExecutorService` : HouseKeeper 백그라운드 정리 작업 스케쥴러
- 사용자의 요구에 따라 `getConnection()`으로 `ConcurrenctBag<PoolEntry>`에 방문에 커넥션을 빌려준다. 이 때 `ProxyConnection`으로 래핑하여 전달한다.
  > `PoolEntry.createProxyConnection(...)`
  
  
##### -> ProxyConnection
```java 
public final class HikariProxyConnection extends ProxyConnection implements Wrapper, AutoCloseable, Connection {

//		.. 중략
/**
 * ProxyConnection을 반환하는 이유는 
 * 사용자가 close()를 호출 했을 떄,
 * 실제로 커넥션을 닫지 않고 풀로 반납하기 위해서다.
 */

}


public abstract class ProxyConnection implements Connection {

	public final void close() throws SQLException {  
	    this.closeStatements();  
	// 열려있는 PreparedStatement 또는 Statement를 정리
	// ResultSet도 정리
	// -> 커넥션 누수 방지를 위한 방어적


	    if (this.delegate != ProxyConnection.ClosedConnection.CLOSED_CONNECTION) {  
	    //커넥션이 살아 있는지 확인한다. `this.delegate`는 JDBC Connection 객체이다.
	        this.leakTask.cancel(); 
	        //백그라운드에서 커넥션 누수 감지를 종료시킵니다.
	        //여기서 임의로 종료시키지 않고 풀로 반환하는데 굳이 이 뒤까지 이를 감지할 필요는 없습니다. 
	  
	        try {  
	            if (this.isCommitStateDirty && !this.isAutoCommit) {  
	                this.delegate.rollback();  
	                LOGGER.debug("{} - Executed rollback on connection {} due to dirty commit state on close().", this.poolEntry.getPoolName(), this.delegate);  
	            }  
	        //만약 autoCommit이 꺼져 있고, 트랜잭션이 dirty 하다면 rollback 처리
	  
	            if (this.dirtyBits != 0) {  
	                this.poolEntry.resetConnectionState(this, this.dirtyBits);  
	            }  
	            //connection 상태를 reset 합니다.
	  
	            this.delegate.clearWarnings();  
	        } catch (SQLException e) {  
	            if (!this.poolEntry.isMarkedEvicted()) {  
	                throw this.checkException(e);  
	            }  
	        } finally {  
	            this.delegate = ProxyConnection.ClosedConnection.CLOSED_CONNECTION;  
	            this.poolEntry.recycle();  
	        //현재 pool을 recycle 합니다.
	        }  
	    }  
	  
	}

}


final class PoolEntry implements ConcurrentBag.IConcurrentBagEntry {

	void recycle() {  
	    if (this.connection != null) {  
	    //누수 초기화하고
	    //ConcurrentBag에 다시 등록시킨다.
	        this.lastAccessed = ClockSource.currentTime();  
	        this.hikariPool.recycle(this);  
	    }  
	  
	}

}


```
- 위와 같이 `ProxyConnection`으로 래핑된 커넥션은 사용 종료 후 완전 닫히는 것이 아니라 재활용에 돌입합니다.

##### -> ConcurrentBag
```java
public class ConcurrentBag<T extends IConcurrentBagEntry> implements AutoCloseable {

	private final CopyOnWriteArrayList<T> sharedList;   //풀내 모든 커넥션 목록
	private final boolean weakThreadLocals; 
	private final ThreadLocal<List<Object>> threadList;  //쓰레드별 최근 사용 커넥션 캐시
	private final IBagStateListener listener;  
	private final AtomicInteger waiters;  //대기 상태에 진입한 쓰레드 수
	private volatile boolean closed;  
	private final SynchronousQueue<T> handoffQueue;//대기 중인 borrow 쓰레드에 넘기는 큐
	


	public ConcurrentBag(IBagStateListener listener) {  
	    this.listener = listener;  
	    this.weakThreadLocals = this.useWeakThreadLocals();  
	    this.handoffQueue = new SynchronousQueue(true);  
	    this.waiters = new AtomicInteger();  
	    this.sharedList = new CopyOnWriteArrayList();  
	    if (this.weakThreadLocals) {  
	        this.threadList = ThreadLocal.withInitial(() -> {  
	            return new ArrayList(16);  
	        });  
	    } else {  
	        this.threadList = ThreadLocal.withInitial(() -> {  
	            return new FastList(IConcurrentBagEntry.class, 16);  
	        });  
	    }  
	  
	}


// 커넥션 요청시
// 사용 가능한 커넥션을 풀에서 꺼낸다.
// NOT_IN_USE(0) -> IN_USE(1)
	public T borrow(long timeout, TimeUnit timeUnit) throws InterruptedException {  
	    //ThreadLocal<WeakReference<T>> 최근 반납 캐시
	    //생성자에서 할당
	    List<Object> list = (List)this.threadList.get();  
	  
	    int waiting;  
	    Object entry;  
	    //AtomicInteger로 커넥션의 상태 관리
	    IConcurrentBagEntry bagEntry;  
	// threadLocal 캐시에서 꺼낼 수 있니?
	    for(waiting = list.size() - 1; waiting >= 0; --waiting) {  
	        entry = list.remove(waiting);  
	        bagEntry = this.weakThreadLocals ? (IConcurrentBagEntry)((WeakReference)entry).get() : (IConcurrentBagEntry)entry;  
	        //NOT_IN_USE, IN_USE
	        if (bagEntry != null && bagEntry.compareAndSet(0, 1)) {  
	            return bagEntry;  
	        }  
	    }  
	  
	    waiting = this.waiters.incrementAndGet();  
	  
	    try {  
	    // 전체 커넥션을 보관하는 CopyOnWriteArrayList<T>
	        Iterator var13 = this.sharedList.iterator();  
	  
	        IConcurrentBagEntry bagEntry;  
		// SharedList에서 꺼낼 수 있니?
	        while(var13.hasNext()) {  
	            bagEntry = (IConcurrentBagEntry)var13.next();  
	            //NOT_IN_USE, IN_USE
	            if (bagEntry.compareAndSet(0, 1)) {  
	                if (waiting > 1) {  
	                    this.listener.addBagItem(waiting - 1);  
	                }  
	  
	                bagEntry = bagEntry;  
	                return bagEntry;  
	            }  
	        }  
	  
	        this.listener.addBagItem(waiting);  
	        timeout = timeUnit.toNanos(timeout);  
	  
	        do {  
	            long start = ClockSource.currentTime();  
	            //커넥션이 없을 때 대기자에게 즉시 전달하기 위한 blockingQueue
	            bagEntry = (IConcurrentBagEntry)this.handoffQueue.poll(timeout, TimeUnit.NANOSECONDS);  
	            //NOT_IN_USE, IN_USE
	            if (bagEntry == null || bagEntry.compareAndSet(0, 1)) {  
	                IConcurrentBagEntry var9 = bagEntry;  
	                return var9;  
	            }  
	  
	            timeout -= ClockSource.elapsedNanos(start);  
	        } while(timeout > 10000L);  
	        //혹시 누가 반납하니?
	  
	        entry = null;  
	        return (IConcurrentBagEntry)entry;  
	    } finally {  
	        this.waiters.decrementAndGet();  
	    }  
	}  


// 커넥션을 close 하면
	public void requite(T bagEntry) {  
	//NOT_IN_USE
	    bagEntry.setState(0);  
	//누군가 기다리고 있니?
	    for(int i = 0; this.waiters.get() > 0; ++i) {  
	    //handoffQueue로 전달
	        if (bagEntry.getState() != 0 || this.handoffQueue.offer(bagEntry)) {  
	            return;  
	        }  
		// 커넥션 없으면 쉬자 
		// spinlock
	        if ((i & 255) == 255) {  //i % 256 == 255
	            LockSupport.parkNanos(TimeUnit.MICROSECONDS.toNanos(10L));  
	        } else {  
	            Thread.yield();  
	        }  
	    }  
		
		
		// threadLocal 캐시로 등록 (기다리는 사람이 없으면?)
	    List<Object> threadLocalList = (List)this.threadList.get();  
	    if (threadLocalList.size() < 50) {  
	        threadLocalList.add(this.weakThreadLocals ? new WeakReference(bagEntry) : bagEntry);  
	    }  
	  
	}  

// 커넥션을 생성 할 때
	public void add(T bagEntry) {  
	    if (this.closed) {  
	        LOGGER.info("ConcurrentBag has been closed, ignoring add()");  
	        throw new IllegalStateException("ConcurrentBag has been closed, ignoring add()");  
	    } else {  
	    //닫힌 커넥션이 아니면 sharedList에 추가
	        this.sharedList.add(bagEntry);  
		//기다리면 queue로 넘긴다.
	        while(this.waiters.get() > 0 && bagEntry.getState() == 0 && !this.handoffQueue.offer(bagEntry)) {  
	            Thread.yield();  
	        }  
	  
	    }  
	}  

// 커넥션이 만료될 때
	public boolean remove(T bagEntry) {  
	//IN_USE, REMOVED      // RESERVED, REMOVED
	    if (!bagEntry.compareAndSet(1, -1) && !bagEntry.compareAndSet(-2, -1) && !this.closed) {  
	        LOGGER.warn("Attempt to remove an object from the bag that was not borrowed or reserved: {}", bagEntry);  
	        return false;    } else {  
	        boolean removed = this.sharedList.remove(bagEntry);  
	        if (!removed && !this.closed) {  
	            LOGGER.warn("Attempt to remove an object from the bag that does not exist: {}", bagEntry);  
	        }  
	//커넥션 풀에서 완전 히 제거
	        ((List)this.threadList.get()).remove(bagEntry);  
	        return removed;  
	    }  
	} 


// 풀을 종료할 때
	public void close() {  
	    this.closed = true;  
	}

	public interface IConcurrentBagEntry {  
	    int STATE_NOT_IN_USE = 0;  
	    int STATE_IN_USE = 1;  
	    int STATE_REMOVED = -1;  
	    int STATE_RESERVED = -2;
	}
}


```
##### -> HouseKeeper
```java


public final class HikariPool extends PoolBase implements HikariPoolMXBean, ConcurrentBag.IBagStateListener {
	private final class HouseKeeper implements Runnable {  
		private volatile long previous;  
		private final AtomicReferenceFieldUpdater<PoolBase, String> catalogUpdater;  
	  
		private HouseKeeper() {  
			this.previous = ClockSource.plusMillis(ClockSource.currentTime(), -HikariPool.this.housekeepingPeriodMs);  
			this.catalogUpdater = AtomicReferenceFieldUpdater.newUpdater(PoolBase.class, String.class, "catalog");  
		}  
	  
		public void run() {  
			try {  
				HikariPool.this.connectionTimeout = HikariPool.this.config.getConnectionTimeout();  
				HikariPool.this.validationTimeout = HikariPool.this.config.getValidationTimeout();  
				HikariPool.this.leakTaskFactory.updateLeakDetectionThreshold(HikariPool.this.config.getLeakDetectionThreshold());  
				if (HikariPool.this.config.getCatalog() != null && !HikariPool.this.config.getCatalog().equals(HikariPool.this.catalog)) {  
					this.catalogUpdater.set(HikariPool.this, HikariPool.this.config.getCatalog());  
				}  
	  
				long idleTimeout = HikariPool.this.config.getIdleTimeout();  
				long now = ClockSource.currentTime();  
				if (ClockSource.plusMillis(now, 128L) < ClockSource.plusMillis(this.previous, HikariPool.this.housekeepingPeriodMs)) {  
					HikariPool.this.logger.warn("{} - Retrograde clock change detected (housekeeper delta={}), soft-evicting connections from pool.", HikariPool.this.poolName, ClockSource.elapsedDisplayString(this.previous, now));  
					this.previous = now;  
					HikariPool.this.softEvictConnections();  
					return;            }  
	  
				if (now > ClockSource.plusMillis(this.previous, 3L * HikariPool.this.housekeepingPeriodMs / 2L)) {  
					HikariPool.this.logger.warn("{} - Thread starvation or clock leap detected (housekeeper delta={}).", HikariPool.this.poolName, ClockSource.elapsedDisplayString(this.previous, now));  
				}  
	  
				this.previous = now;  
				if (idleTimeout > 0L && HikariPool.this.config.getMinimumIdle() < HikariPool.this.config.getMaximumPoolSize()) {  
					HikariPool.this.logPoolState("Before cleanup ");  
					List<PoolEntry> notInUse = HikariPool.this.connectionBag.values(0);  
					int maxToRemove = notInUse.size() - HikariPool.this.config.getMinimumIdle();  
					Iterator var7 = notInUse.iterator();  
	  
					while(var7.hasNext()) {  
						PoolEntry entry = (PoolEntry)var7.next();  
						if (maxToRemove > 0 && ClockSource.elapsedMillis(entry.lastAccessed, now) > idleTimeout && HikariPool.this.connectionBag.reserve(entry)) {  
							HikariPool.this.closeConnection(entry, "(connection has passed idleTimeout)");  
							--maxToRemove;  
						}  
					}  
	  
					HikariPool.this.logPoolState("After cleanup  ");  
				} else {  
					HikariPool.this.logPoolState("Pool ");  
				}  
	  
				HikariPool.this.fillPool(true);  
			} catch (Exception var9) {  
				Exception e = var9;  
				HikariPool.this.logger.error("Unexpected exception in housekeeping task", e);  
			}  
	  
		}  
	}
}
```

## HikariCP vs. Others

![[assets/img/HikariCP-bench-2.6.0.png]]
[출처: brettwooldridge/HikariCP-benchmark](https://github.com/brettwooldridge/HikariCP-benchmark)

### 동시성
- HikariCP: Lock-Free(ConcurrentBag)
  -> ThreaLocal 캐시, lock-free 리스트, handoffQueue로 충돌 없이 공유
- Others: synchronized 중심/ 기반 혹은 최소 lock 있음
  -> synchronized 또는 ReentarantLock
### 커넥션 래핑
- HikariCP: ProxyConnection으로 필수 작업만 덮어씀
  -> 실제로 close를 하지는 않음
- Others: 모든 기능을 감싸거나 복잡한 wrapper
  -> 아예 닫히거나 복잡한 단계를 가짐
### Thread 구조
- HikariCP: 최소화된 pool + HouseKeeper 유지
- Others: 여러 유틸 쓰레드 혹은 다수
### Lock
- HikariCP: 거의 없음(sprin lock + yield)
- Others : 다수 존재
### Leak 감지
- HikariCP: 있음(millisecond 기반)
- Others: 제한적이거나 없음
### 설정 난이도
- HikariCP: 매우 단순하며 커뮤니티가 큼
- Others: 중간이거나 매우 복잡, 커뮤니티 없거나 작음
### 커넥션 부족시
- HikariCP: HouseKeeper + `fillPool()` -> 비동기 커넥션 보충
- Others: 요청이 들어와야 커넥션을 생성 혹은 비동기 풀링이 있지만 불안정