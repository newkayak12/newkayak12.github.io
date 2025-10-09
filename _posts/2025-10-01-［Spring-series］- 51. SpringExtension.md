---
layout: page
categories:
  - SPRING
---
## Extension
- JUnit 5에서 단위 테스트 코드를 확장하고 사용자 정의 기능을 추가할 수 있는 메커니즘
	- Test class, method를 확장할 수 있다. 
	- 테스트 이벤트, Life Cycle에 관여하게 된다.
	- 우리가 사용하는 `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest`에도 `@ExtendWith(SpringExtension.clas)`가 포함되어 있다.
- JUnit 4의 Runner는 단일 상속 구조라 여러 기능 조합이 불가능 했음
- Store를 통한 상태 공유


SpringExtension
```java
public class SpringExtension implements BeforeAllCallback,
AfterAllCallback,TestInstancePostProcessor, BeforeEachCallback,
AfterEachCallback,BeforeTestExecutionCallback,
AfterTestExecutionCallback, ParameterResolver {
```

### Extension 실행 순서
1. [BeforeAllCallback]
2. `@BeforeAll`
3. 테스트 인스턴스 생성
4. [TestInstancePostProcessor] -> SpringExtesion이 DI 수행
5. [BeforeEachCallback]
6. `@BeforeEach`
7. [BeforeTestExecutionCallback]
8. `@Test` 실행
9. [AfterTestExecutionCallback]
10. `@AfterEach`
11. [AfterEachCallback]
12. [TestInstancePreDestroyCallback]
13. `@AfterAll`
14. [AfterAllCallback]

### ExtensionContext
```java
// org.junit.jupiter.api.extension.ExtensionContext
public interface ExtensionContext {
    
    // 테스트 메타데이터
    Optional<Class<?>> getTestClass();
    Optional<Object> getTestInstance();
    Optional<Method> getTestMethod();
    
    // 계층 구조
    Optional<ExtensionContext> getParent();
    ExtensionContext getRoot();
    
    // 저장소 (Extension 간 데이터 공유)
    Store getStore(Namespace namespace);
    
    // 설정 파라미터
    Optional<String> getConfigurationParameter(String key);
}
```

### Store 역할
```java
// Extension 간 상태 공유
public class MyExtension implements BeforeEachCallback {
    
    @Override
    public void beforeEach(ExtensionContext context) {
        Store store = context.getStore(
            Namespace.create(MyExtension.class)
        );
        
        // 데이터 저장 (테스트 생명주기 동안 유지)
        store.put("key", new MyResource());
    }
}
```


## SpringExtension
### SpringExtension 기본 구조
```java
public class SpringExtension implements 
BeforeAllCallback, //클래스 레벨 초기화
AfterAllCallback, //클래스 레벨 정리
TestInstancePostProcessor,  //DI 수행
BeforeEachCallback, //메소드 전 준비
AfterEachCallback, //메소드 후 정리
BeforeTestExecutionCallback, //트랜잭션 시작 등
AfterTestExecutionCallback,  //트랜잭션 커밋/롤백
ParameterResolver { //메소드 파라미터 주입


private static final ExtensionContext.Namespace TEST_CONTEXT_MANAGER_NAMESPACE = Namespace.create(new Object[]{SpringExtension.class});  
private static final ExtensionContext.Namespace AUTOWIRED_VALIDATION_NAMESPACE = Namespace.create(new Object[]{SpringExtension.class.getName() + "#autowired.validation"});  
private static final String NO_VIOLATIONS_DETECTED = "";  
private static final ExtensionContext.Namespace RECORD_APPLICATION_EVENTS_VALIDATION_NAMESPACE = Namespace.create(new Object[]{SpringExtension.class.getName() + "#recordApplicationEvents.validation"});  
private static final List<Class<? extends Annotation>> JUPITER_ANNOTATION_TYPES = List.of(BeforeAll.class, AfterAll.class, BeforeEach.class, AfterEach.class, Testable.class);  
private static final ReflectionUtils.MethodFilter autowiredTestOrLifecycleMethodFilter;
```


### 책임
1. JUnit-Spring 브릿지: JUnit 생명주기 
   → Spring TestContext Framework 연결
2. TestContextManager 관리 : Spring 테스트 생명 주기 관리
   → 클래스당 1개 생성 및 캐싱
   → ExtensionContext.Store 활용
3. ApplicationContext 로딩 조율
   → 캐시 확인 -> 재사용 혹은 새로 생성
   → ContextLoader 전략 위임
4. DI 위임
   → TestInstancePostProcessor에서 수행
   → DependencyInjectionTestExecutionListner 활용
5. 트랜잭션 관리
   → BeforeTestExtension에서 시작
   → AfterTestExecution에서 롤백

### TestInstancePostProcessor
```java
public void postProcessTestInstance(Object testInstance, ExtensionContext context) throws Exception {  
    this.validateAutowiredConfig(context);  
    this.validateRecordApplicationEventsConfig(context);  
    TestContextManager testContextManager = getTestContextManager(context);  
    registerMethodInvoker(testContextManager, context);  
    testContextManager.prepareTestInstance(testInstance);   // DI를 처리
}  
  
private void validateAutowiredConfig(ExtensionContext context) {  
    ExtensionContext.Store store = context.getStore(AUTOWIRED_VALIDATION_NAMESPACE);  
    String errorMessage = (String)store.getOrComputeIfAbsent(context.getRequiredTestClass(), (testClass) -> {  
        Method[] methodsWithErrors = ReflectionUtils.getUniqueDeclaredMethods(testClass, autowiredTestOrLifecycleMethodFilter);  
        return methodsWithErrors.length == 0 ? "" : String.format("Test methods and test lifecycle methods must not be annotated with @Autowired. You should instead annotate individual method parameters with @Autowired, @Qualifier, or @Value. Offending methods in test class %s: %s", testClass.getName(), Arrays.toString(methodsWithErrors));  
    }, String.class);  
    if (!errorMessage.isEmpty()) {  
        throw new IllegalStateException(errorMessage);  
    }  
}  
  
private void validateRecordApplicationEventsConfig(ExtensionContext context) {  
    ExtensionContext.Store store = context.getStore(RECORD_APPLICATION_EVENTS_VALIDATION_NAMESPACE);  
    String errorMessage = (String)store.getOrComputeIfAbsent(context.getRequiredTestClass(), (testClass) -> {  
        boolean recording = TestContextAnnotationUtils.hasAnnotation(testClass, RecordApplicationEvents.class);  
        if (!recording) {  
            return "";  
        } else if (context.getTestInstanceLifecycle().orElse(Lifecycle.PER_METHOD) == Lifecycle.PER_METHOD) {  
            return "";  
        } else {  
            return context.getExecutionMode() == ExecutionMode.SAME_THREAD ? "" : "Test classes or @Nested test classes that @RecordApplicationEvents must not be run in parallel with the @TestInstance(PER_CLASS) lifecycle mode. Configure either @Execution(SAME_THREAD) or @TestInstance(PER_METHOD) semantics, or disable parallel execution altogether. Note that when recording events in parallel, one might see events published by other tests since the application context may be shared.";  
        }  
    }, String.class);  
    if (!errorMessage.isEmpty()) {  
        throw new IllegalStateException(errorMessage);  
    }  
}
```


### prepareTestInstance
```java
public void prepareTestInstance(Object testInstance) throws Exception {  
    try {  
      
        this.getTestContext().updateState(testInstance, (Method)null, (Throwable)null);  
        Iterator var2 = this.getTestExecutionListeners().iterator();  
  
        while(var2.hasNext()) {  
            TestExecutionListener testExecutionListener = (TestExecutionListener)var2.next();  
  
            try {  
                testExecutionListener.prepareTestInstance(this.getTestContext());  
                //각 Listener 실행
            } catch (Throwable var8) {  
            //생략
            }  
        }  
    }  
  
}

/**
 *1. ServletTestExecutionListener   // Mock ServletContext 준비
 *2. DirtiesContextBeforeModesTestExecutionListener
 *3. ApplicationEventsTestExecutionListener
 *4. DependencyInjectionTestExecutionListener  // ★ DI 수행
 *5. DirtiesContextTestExecutionListener
 *6. TransactionalTestExecutionListener    // 트랜잭션 설정
 *7. SqlScriptsTestExecutionListener       // @Sql 실행
 *8. EventPublishingTestExecutionListener
 */
```

### DependencyInjectionTestExecutionListener
```java
//org.springframework.spring-test
package org.springframework.test.context.support;

public class DependencyInjectionTestExecutionListener extends AbstractTestExecutionListener {  
    public static final int ORDER = 2000;  
    public static final String REINJECT_DEPENDENCIES_ATTRIBUTE = Conventions.getQualifiedAttributeName(DependencyInjectionTestExecutionListener.class, "reinjectDependencies");  
    private static final Log logger = LogFactory.getLog(DependencyInjectionTestExecutionListener.class);  
    private final AotTestContextInitializers aotTestContextInitializers = new AotTestContextInitializers();  
  
    public DependencyInjectionTestExecutionListener() {  
    }  
  
    public final int getOrder() {  
        return 2000;  
    }  
  
    public void prepareTestInstance(TestContext testContext) throws Exception {  
//생략


//AOT 모드 확인 후 적절한 DI 전략 선택
//Ahead-Of-Time: Spring Application의 시작 속도를 높이고 메모리 사용량을 줄이기 위한 기술, 프로그램 실행 전 바이트 코드를 미리 네이티브 이미지로 컴파일하는 방식
        if (this.runningInAotMode(testContext.getTestClass())) {  
            this.injectDependenciesInAotMode(testContext);  
        } else {  
            this.injectDependencies(testContext);  
        }  
  
    }  
  
    public void beforeTestMethod(TestContext testContext) throws Exception {  
        if (Boolean.TRUE.equals(testContext.getAttribute(REINJECT_DEPENDENCIES_ATTRIBUTE))) {  
            if (logger.isTraceEnabled()) {  
                logger.trace("Reinjecting dependencies for test context " + String.valueOf(testContext));  
            } else if (logger.isDebugEnabled()) {  
                logger.debug("Reinjecting dependencies for test class " + testContext.getTestClass().getName());  
            }  
  
            if (this.runningInAotMode(testContext.getTestClass())) {  
                this.injectDependenciesInAotMode(testContext);  
            } else {  
                this.injectDependencies(testContext);  
            }  
        }  
  
    }  

//일반 DI 모드
    protected void injectDependencies(TestContext testContext) throws Exception {  
//1. 테스트 인스턴스와 클래스 정보 추출
        Object bean = testContext.getTestInstance();  
        Class<?> clazz = testContext.getTestClass();  

//2. AutowireCapableBeanFactory 획득
        AutowireCapableBeanFactory beanFactory = testContext.getApplicationContext().getAutowireCapableBeanFactory();  

//3. 의존성 주입

//3-1. 필드/ Setter 주입
        beanFactory.autowireBeanProperties(bean, 0, false);  
//3-2. initializeBean: Bean 후처리
        beanFactory.initializeBean(bean, clazz.getName() + ".ORIGINAL");  
//3-3. 재주입 플래그 제거
        testContext.removeAttribute(REINJECT_DEPENDENCIES_ATTRIBUTE);  
    }  
//4. AOT 모드 DI
    private void injectDependenciesInAotMode(TestContext testContext) throws Exception {  
        ApplicationContext applicationContext = testContext.getApplicationContext();  
// GeneralApplicationContext만 지원
        if (applicationContext instanceof GenericApplicationContext gac) {  
            Object bean = testContext.getTestInstance();  
            String beanName = testContext.getTestClass().getName() + ".ORIGINAL";  
            ConfigurableListableBeanFactory beanFactory = gac.getBeanFactory();  

//@Autowire처리
            AutowiredAnnotationBeanPostProcessor autowiredAnnotationBpp = new AutowiredAnnotationBeanPostProcessor();  
            autowiredAnnotationBpp.setBeanFactory(beanFactory);  
            autowiredAnnotationBpp.processInjection(bean);  
//@Resource, @PostConstructor
            CommonAnnotationBeanPostProcessor commonAnnotationBpp = new CommonAnnotationBeanPostProcessor();  
            commonAnnotationBpp.setBeanFactory(beanFactory);  
            commonAnnotationBpp.processInjection(bean);  

//Bean 초기화
            beanFactory.initializeBean(bean, beanName);  
//재주입
            testContext.removeAttribute(REINJECT_DEPENDENCIES_ATTRIBUTE);  
        } else {  
      
        }  
    }  
  
    private boolean runningInAotMode(Class<?> testClass) {  
        return this.aotTestContextInitializers.isSupportedTestClass(testClass);  
    }  
}
```


### BeforeAllCallback
```java
@Override
public void beforeAll(ExtensionContext context) throws Exception {
    // 1. TestContextManager 생성 (클래스당 1회)
    getTestContextManager(context)
        .beforeTestClass();  // TestExecutionListener들에게 알림
}

private static TestContextManager getTestContextManager(
    ExtensionContext context) {
    
    Class<?> testClass = context.getRequiredTestClass();
    Store store = context.getStore(NAMESPACE);
    
    // Store에 캐싱 (클래스 생명주기 동안 유지)
    return store.getOrComputeIfAbsent(
        testClass,
        key -> new TestContextManager(testClass),
        TestContextManager.class
    );
}
```