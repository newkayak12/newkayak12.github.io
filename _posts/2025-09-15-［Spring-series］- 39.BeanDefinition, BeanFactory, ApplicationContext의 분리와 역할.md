---
layout: page
categories:
  - SPRING
---


## 1. 왜 세 가지로 나뉘는가?
1. Spring은 구성 정보의 표현, 빈 생성/관리, 전체 애플리케이션 문맥 관리까지 계층적으로 나눴다.
2. DI 컨테이너로써 단일,인터페이스/클래스로 모든 것을 표현하면 확장성, 테스트성, 유지보수성이 감소
3. 따라서 구성 -> 생성/관리 -> 애플리케이션 레벨 관리로 계층을 분리

### (1) BeanDefinition
#### 1. 정의
-  Bean의 설계도 역할, Bean 클래스, 의존성, 초기화/소멸 메소드, 스코프, 프로퍼티 등 메타 정보를 보관
#### 2. 역할
- Bean을 어떻게 만들지에 대한 정보를 가진다.
- "이 Bean은 이런 클래스로 생성되고, 이런 프로퍼티와 의존성을 갖는다."는 정의를 담당
#### 3. 예시
- RootBeanDefinition
- GenericBeanDefinition
#### 4. 저장소
- BeanDefinitionRegistry
- DefaultListableBeanFactory

### (2) BeanFactory
#### 1. 정의
- Bean의 생성과 생명 주기 관리를 담당하는 최상위 컨테이너 인터페이스
### 2. 주요 역할
- BeanDefinition을 참고해서 실제 객체를 생성(lazy, singleton, prototype) 등 관리
- 의존성 주입
- getBean() 제공
### 3. 구현체
- DefaultListableBeanFactory
- XmlBeanFactory(deprecated)

### (3) ApplicationContext
#### 1. 정의
- BeanFactory를 상속하는, 실질적인 Spring의 대표 컨테이너
#### 2. 확장된 책임
- 국제화 메시지, 리소스 로딩
- 이벤트 발행(ApplicationEvent)
- AOP 자동 프록시 생성
- 여러 Context 계층 지원
- 라이프 사이클 관리, 환경 변수 등
#### 3. 주요 구현체
- ClassPathXmlApplicationContext
- AnnotationConfigApplicationContext
- WebApplicationContext
#### 4. 관계
- 내부적으로 BeanFactory 기능을 포함하면서, 상위 계층에서 다양한 부가 기능 제공

## 2. 동작 과정

### 1. SpringApplication 시작
```java
public class SpringApplication {

	public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {  
	    return (new SpringApplication(primarySources)).run(args);  
	}
	
	public ConfigurableApplicationContext run(String... args) {  
	    Startup startup = SpringApplication.Startup.create();  
	    if (this.registerShutdownHook) {  
	        shutdownHook.enableShutdownHookAddition();  
	        //JVM 종료시 graceful shutdown 준비
	    }  
	  
	    DefaultBootstrapContext bootstrapContext = this.createBootstrapContext();  
	    ConfigurableApplicationContext context = null;  
	    this.configureHeadlessProperty();  
	    SpringApplicationRunListeners listeners = this.getRunListeners(args);  
	    listeners.starting(bootstrapContext, this.mainApplicationClass);  
	  
	    try {  
	        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);  
	        //Args Parsing -> ApplicationAgruments
	        ConfigurableEnvironment environment = this.prepareEnvironment(listeners, bootstrapContext, applicationArguments);  
	        //Environment 준비, Profile 처리
	        Banner printedBanner = this.printBanner(environment);  
	        
	        context = this.createApplicationContext();  
	        //ApplicationContext 생성
	        context.setApplicationStartup(this.applicationStartup);  
	       
			this.prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);  
			//Context에 Environment, Bean등 부가 초기화
		
	        this.refreshContext(context);
	        // ApplicationContext.refresh()로 BeanDefinition 로딩
	        // BeanFactory 초기화, 싱글톤 인스턴스화
	          
	        this.afterRefresh(context, applicationArguments);  
	        startup.started();  
	        if (this.logStartupInfo) {  
	            (new StartupInfoLogger(this.mainApplicationClass)).logStarted(this.getApplicationLog(), startup);  
	        }  
	  
	        listeners.started(context, startup.timeTakenToStarted());  
	        this.callRunners(context, applicationArguments);  
	    } catch (Throwable ex) {  
	        throw this.handleRunFailure(context, ex, listeners);  
	    }  
	  
	    try {  
	        if (context.isRunning()) {  
	            listeners.ready(context, startup.ready());  
	        }  
	  
	        return context;  
	    } catch (Throwable ex) {  
	        throw this.handleRunFailure(context, ex, (SpringApplicationRunListeners)null);  
	    }  
	}


	protected ConfigurableApplicationContext createApplicationContext() {  
	    return this.applicationContextFactory.create(this.webApplicationType);  
	}


	private void prepareContext(DefaultBootstrapContext bootstrapContext, ConfigurableApplicationContext context, ConfigurableEnvironment environment, SpringApplicationRunListeners listeners, ApplicationArguments applicationArguments, Banner printedBanner) {  
	    context.setEnvironment(environment);  
	    this.postProcessApplicationContext(context);  
	    this.addAotGeneratedInitializerIfNecessary(this.initializers);  
	    this.applyInitializers(context);  
	    listeners.contextPrepared(context);  
	    bootstrapContext.close(context);  
	    if (this.logStartupInfo) {  
	        this.logStartupInfo(context.getParent() == null);  
	        this.logStartupProfileInfo(context);  
	    }  
	  
	    ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();  
	    beanFactory.registerSingleton("springApplicationArguments", applicationArguments);  
	    if (printedBanner != null) {  
	        beanFactory.registerSingleton("springBootBanner", printedBanner);  
	    }  
	  
	    if (beanFactory instanceof AbstractAutowireCapableBeanFactory autowireCapableBeanFactory) {  
	        autowireCapableBeanFactory.setAllowCircularReferences(this.allowCircularReferences);  
	        if (beanFactory instanceof DefaultListableBeanFactory listableBeanFactory) {  
	            listableBeanFactory.setAllowBeanDefinitionOverriding(this.allowBeanDefinitionOverriding);  
	        }  
	    }  
	  
	    if (this.lazyInitialization) {  
	        context.addBeanFactoryPostProcessor(new LazyInitializationBeanFactoryPostProcessor());  
	    }  
	  
	    if (this.keepAlive) {  
	        context.addApplicationListener(new KeepAlive());  
	    }  
	  
	    context.addBeanFactoryPostProcessor(new PropertySourceOrderingBeanFactoryPostProcessor(context));  
	    if (!AotDetector.useGeneratedArtifacts()) {  
	        Set<Object> sources = this.getAllSources();  
	        Assert.notEmpty(sources, "Sources must not be empty");  
	        this.load(context, sources.toArray(new Object[0]));  
	    }  
	  
	    listeners.contextLoaded(context);  
	}

	private void refreshContext(ConfigurableApplicationContext context) {  
	    if (this.registerShutdownHook) {  
	        shutdownHook.registerApplicationContext(context);  
	    }  
	//Context.refresh()고 
	//이는 ServletWebServerApplicationContext
	//내부에서 super.refresh() 호출해서 
	//결과적으로 AbstractApplicationContext.super를 호출
	    this.refresh(context);  
	}
}
```

```java
public class ServletWebServerApplicationContext extends GenericWebApplicationContext implements ConfigurableWebServerApplicationContext {
	public final void refresh() throws BeansException, IllegalStateException {  
	    try {  
	        super.refresh();  
	    } catch (RuntimeException ex) {  
	        WebServer webServer = this.webServer;  
	        if (webServer != null) {  
	            webServer.stop();  
	            webServer.destroy();  
	        }  
	  
	        throw ex;  
	    }  
	}

}


public abstract class AbstractApplicationContext extends DefaultResourceLoader implements ConfigurableApplicationContext {
	public void refresh() throws BeansException, IllegalStateException {  
	    this.startupShutdownLock.lock();  
	  
	    try {  
	        this.startupShutdownThread = Thread.currentThread();  
	        StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");  
	        this.prepareRefresh();  
	        ConfigurableListableBeanFactory beanFactory = this.obtainFreshBeanFactory();  
	        this.prepareBeanFactory(beanFactory);  
	  
	        try {  
	            this.postProcessBeanFactory(beanFactory);  
	            StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");  
	            this.invokeBeanFactoryPostProcessors(beanFactory);  
	            this.registerBeanPostProcessors(beanFactory);  
	            beanPostProcess.end();  
	            this.initMessageSource();  
	            this.initApplicationEventMulticaster();  
	            this.onRefresh();  
	            this.registerListeners();  
	            this.finishBeanFactoryInitialization(beanFactory);  
	            this.finishRefresh();  
	        } catch (Error | RuntimeException var12) {  
	            if (this.logger.isWarnEnabled()) {  
	                this.logger.warn("Exception encountered during context initialization - cancelling refresh attempt: " + var12);  
	            }  
	  
	            this.destroyBeans();  
	            this.cancelRefresh(var12);  
	            throw var12;  
	        } finally {  
	            contextRefresh.end();  
	        }  
	    } finally {  
	        this.startupShutdownThread = null;  
	        this.startupShutdownLock.unlock();  
	    }  
	  
	}

}
```
### 2. Context에 Environment, Bean등 부가 초기화
```java
private void prepareContext(DefaultBootstrapContext bootstrapContext, ConfigurableApplicationContext context, ConfigurableEnvironment environment, SpringApplicationRunListeners listeners, ApplicationArguments applicationArguments, Banner printedBanner) {  
	    context.setEnvironment(environment);  
	    this.postProcessApplicationContext(context);  
	    this.addAotGeneratedInitializerIfNecessary(this.initializers);  
	    this.applyInitializers(context);  
	    listeners.contextPrepared(context);  
	    bootstrapContext.close(context);  
	    if (this.logStartupInfo) {  
	        this.logStartupInfo(context.getParent() == null);  
	        this.logStartupProfileInfo(context);  
	    }  
	  
	    ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();  
	    // BeanFactory를 취득한다.
	    beanFactory.registerSingleton("springApplicationArguments", applicationArguments);  
	    // BeanFactory에 'springApplicationArguments'를 빈으로 등록


	    if (printedBanner != null) {  
	        beanFactory.registerSingleton("springBootBanner", printedBanner);  
	    }  
	
	    if (beanFactory instanceof AbstractAutowireCapableBeanFactory autowireCapableBeanFactory) {  
	        autowireCapableBeanFactory.setAllowCircularReferences(this.allowCircularReferences);  
	        if (beanFactory instanceof DefaultListableBeanFactory listableBeanFactory) {  
	            listableBeanFactory.setAllowBeanDefinitionOverriding(this.allowBeanDefinitionOverriding);  
	        }  
	    }  
	//BeanFactory 옵션( 순환 참조, Bean 덮어쓰기 허용) 설정
	  
	    if (this.lazyInitialization) {  
	        context.addBeanFactoryPostProcessor(new LazyInitializationBeanFactoryPostProcessor());  
	    }  
	  // LazyInitialization 옵션(전체 bean을 lazy) 처리 추가
	  
	    if (this.keepAlive) {  
	        context.addApplicationListener(new KeepAlive());  
	    }  
	  
	    context.addBeanFactoryPostProcessor(new PropertySourceOrderingBeanFactoryPostProcessor(context));  

		// Property Source 순서 보장용 후처리
	
	    if (!AotDetector.useGeneratedArtifacts()) {  
	        Set<Object> sources = this.getAllSources();  
	        Assert.notEmpty(sources, "Sources must not be empty");  
	        this.load(context, sources.toArray(new Object[0]));  
	    }  
	
	//로드 완료
	    listeners.contextLoaded(context);  
	}
```
### 3. refresh
```java
public abstract class AbstractApplicationContext extends DefaultResourceLoader implements ConfigurableApplicationContext {
	public void refresh() throws BeansException, IllegalStateException {  
	    this.startupShutdownLock.lock();  
	  	// 컨텍스트 초기화 락 획득
	  	
	    try {  
	        this.startupShutdownThread = Thread.currentThread();  
	        StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");  
	    
			this.prepareRefresh();  
			//PropertySource, activeProfiles 초기화
	    
	        ConfigurableListableBeanFactory beanFactory = this.obtainFreshBeanFactory();  
			//BeanFactory 생성, BeanDefinition 로딩

	        this.prepareBeanFactory(beanFactory);  
	        //BeanFactory 세팅 (ClassLoader, Environtment, ApplicationContext 등)
	  
	        try {  
	            this.postProcessBeanFactory(beanFactory);  
	            StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");  
	            this.invokeBeanFactoryPostProcessors(beanFactory);  
	            this.registerBeanPostProcessors(beanFactory);  
	            beanPostProcess.end();  
	            this.initMessageSource();  
	            this.initApplicationEventMulticaster();  
	            this.onRefresh();  
	            this.registerListeners();  
	            this.finishBeanFactoryInitialization(beanFactory);  
	            //싱글톤 빈 인스턴스화 
	            //@Bean, @Component
	            this.finishRefresh();  
	        } catch (Error | RuntimeException var12) {  
	            if (this.logger.isWarnEnabled()) {  
	                this.logger.warn("Exception encountered during context initialization - cancelling refresh attempt: " + var12);  
	            }  
	  
	            this.destroyBeans();  
	            this.cancelRefresh(var12);  
	            throw var12;  
	        } finally {  
	            contextRefresh.end();  
	        }  
	    } finally {  
	        this.startupShutdownThread = null;  
	        this.startupShutdownLock.unlock();  
	    }  

	protected void finishBeanFactoryInitialization(ConfigurableListableBeanFactory beanFactory) {  
	    if (beanFactory.containsBean("conversionService") && beanFactory.isTypeMatch("conversionService", ConversionService.class)) {  
	        beanFactory.setConversionService((ConversionService)beanFactory.getBean("conversionService", ConversionService.class));  
	    }  
	  
	    if (!beanFactory.hasEmbeddedValueResolver()) {  
	        beanFactory.addEmbeddedValueResolver((strVal) -> this.getEnvironment().resolvePlaceholders(strVal));  
	    }  
	  
	    String[] weaverAwareNames = beanFactory.getBeanNamesForType(LoadTimeWeaverAware.class, false, false);  
	  
	    for(String weaverAwareName : weaverAwareNames) {  
	        try {  
	            beanFactory.getBean(weaverAwareName, LoadTimeWeaverAware.class);  
	        } catch (BeanNotOfRequiredTypeException ex) {  
	            if (this.logger.isDebugEnabled()) {  
	                this.logger.debug("Failed to initialize LoadTimeWeaverAware bean '" + weaverAwareName + "' due to unexpected type mismatch: " + ex.getMessage());  
	            }  
	        }  
	    }  
	  
	    beanFactory.setTempClassLoader((ClassLoader)null);  
	    beanFactory.freezeConfiguration();  
	    //BeanFactory 설정 완료( 더 이상 BeanDefinition 추가/ 수정 X )
	    beanFactory.preInstantiateSingletons();  
	    //Singleton Bean 인스턴스화
	}



}
```
### 3.1 BeanFactory InstantiateSingletons
```java

public class DefaultListableBeanFactory extends AbstractAutowireCapableBeanFactory implements ConfigurableListableBeanFactory, BeanDefinitionRegistry, Serializable {
	
	public void preInstantiateSingletons() throws BeansException {  
	    if (this.logger.isTraceEnabled()) {  
	        this.logger.trace("Pre-instantiating singletons in " + this);  
	    }  
	  
	    List<String> beanNames = new ArrayList(this.beanDefinitionNames);  
	    //모든 BeanDfinition 이름을 순회한다.
	  
	    for(String beanName : beanNames) {  
	        RootBeanDefinition bd = this.getMergedLocalBeanDefinition(beanName);  
	        if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {  
	            if (this.isFactoryBean(beanName)) {  
	            //BeanFactory 면
	                Object bean = this.getBean("&" + beanName);  
				// &BeanName으로 FactoryBean 생성

	                if (bean instanceof SmartFactoryBean) {  
	                    SmartFactoryBean<?> smartFactoryBean = (SmartFactoryBean)bean;  
	                    if (smartFactoryBean.isEagerInit()) {  
	                        this.getBean(beanName);  
	                        //Bean 생성
	                        //리턴 값은 안쓰고 singleton Cache에 저장
	                    }  
	                }  
	            } else {  
	            //일반 Bean 이면
	                this.getBean(beanName);  
	                //Bean 생성
	            }  
	        }  
	    }  
	  
	    for(String beanName : beanNames) {  
	        Object singletonInstance = this.getSingleton(beanName);  
	        if (singletonInstance instanceof SmartInitializingSingleton smartSingleton) {  
	            StartupStep smartInitialize = this.getApplicationStartup().start("spring.beans.smart-initialize").tag("beanName", beanName);  
	            smartSingleton.afterSingletonsInstantiated();  
	            smartInitialize.end();  
	        }  
	    }  
	  
	}

	public Object getBean(String name) throws BeansException {  
	    return this.doGetBean(name, (Class)null, (Object[])null, false);  	}

	protected <T> T doGetBean(String name, @Nullable Class<T> requiredType, @Nullable Object[] args, boolean typeCheckOnly) throws BeansException {  
	    String beanName = this.transformedBeanName(name);  
	    Object sharedInstance = this.getSingleton(beanName);  
		//SingletonObjects에서 이미 만들어진 인스턴스가 있으면 꺼낸다.

	    Object beanInstance;  
	    if (sharedInstance != null && args == null) {  
	    // 이미 생성된 싱글톤이 있으면 반환
	        if (this.logger.isTraceEnabled()) {  
	            if (this.isSingletonCurrentlyInCreation(beanName)) {  
	                this.logger.trace("Returning eagerly cached instance of singleton bean '" + beanName + "' that is not fully initialized yet - a consequence of a circular reference");  
	            } else {  
	                this.logger.trace("Returning cached instance of singleton bean '" + beanName + "'");  
	            }  
	        }  
	  
	        beanInstance = this.getObjectForBeanInstance(sharedInstance, name, beanName, (RootBeanDefinition)null);  
	        //FactoryBean이면 실제 객체 반환 처리
	    } else {  
		    // prototype, 아직 없는 singleton, 또는 args 가 있으면 -> 새로 생성
	        if (this.isPrototypeCurrentlyInCreation(beanName)) {  
	            throw new BeanCurrentlyInCreationException(beanName);  
	        }  
	  
	        BeanFactory parentBeanFactory = this.getParentBeanFactory();  
	        // 부모 BeanFactory에서 찾는 케이서 -> BeanDefinition이 없다면
	        
	        if (parentBeanFactory != null && !this.containsBeanDefinition(beanName)) {  
	            String nameToLookup = this.originalBeanName(name);  
	            if (parentBeanFactory instanceof AbstractBeanFactory) {  
	                AbstractBeanFactory abf = (AbstractBeanFactory)parentBeanFactory;  
	                return (T)abf.doGetBean(nameToLookup, requiredType, args, typeCheckOnly);  
	            }  
	  
	            if (args != null) {  
	                return (T)parentBeanFactory.getBean(nameToLookup, args);  
	            }  
	  
	            if (requiredType != null) {  
	                return (T)parentBeanFactory.getBean(nameToLookup, requiredType);  
	            }  
	  
	            return (T)parentBeanFactory.getBean(nameToLookup);  
	        }  
	  
	        if (!typeCheckOnly) {  
	            this.markBeanAsCreated(beanName);  
	        }  
	  
	        StartupStep beanCreation = this.applicationStartup.start("spring.beans.instantiate").tag("beanName", name);  
	  
	        try {  
	            if (requiredType != null) {  
	                Objects.requireNonNull(requiredType);  
	                beanCreation.tag("beanType", requiredType::toString);  
	            }  
	  
	            RootBeanDefinition mbd = this.getMergedLocalBeanDefinition(beanName);  
	            this.checkMergedBeanDefinition(mbd, beanName, args);  
				//BeanDefinition 취득
	            String[] dependsOn = mbd.getDependsOn();  
	            //DependsOn 처리
	            if (dependsOn != null) {  
	                for(String dep : dependsOn) {  
	                    if (this.isDependent(beanName, dep)) {  
	                        throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Circular depends-on relationship between '" + beanName + "' and '" + dep + "'");  
	                    }  
	  
	                    this.registerDependentBean(dep, beanName);  
	  
	                    try {  
	                        this.getBean(dep);
	                        //DependsOn 의존 Bean 재귀 처리  
	                    } catch (NoSuchBeanDefinitionException ex) {  
	                        throw new BeanCreationException(mbd.getResourceDescription(), beanName, "'" + beanName + "' depends on missing bean '" + dep + "'", ex);  
	                    } catch (BeanCreationException ex) {  
	                        if (requiredType != null) {  
	                            String var10002 = mbd.getResourceDescription();  
	                            String var10004 = ex.getBeanName();  
	                            throw new BeanCreationException(var10002, beanName, "Failed to initialize dependency '" + var10004 + "' of " + requiredType.getSimpleName() + " bean '" + beanName + "': " + ex.getMessage(), ex);  
	                        }  
	  
	                        throw ex;  
	                    }  
	                }  
	            }  
	  
	            if (mbd.isSingleton()) { 
	            // Singleton
	             
	                sharedInstance = this.getSingleton(beanName, () -> {   //SingletonObjects로 연결
	                    try {  
	                        return this.createBean(beanName, mbd, args); 
	                        //실제 인스턴스 생성 (AOP, DI)
	                    } catch (BeansException ex) {  
	                        this.destroySingleton(beanName);  
	                        throw ex;  
	                    }  
	                });  
	                beanInstance = this.getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
	                //FactoryBean 등 처리 후 결과 객체 추출  
	            } else if (mbd.isPrototype()) { 
				//prototype
				 
	                Object prototypeInstance = null;  
	  
	                try {  
	                    this.beforePrototypeCreation(beanName);  
	                    prototypeInstance = this.createBean(beanName, mbd, args);  
	                } finally {  
	                    this.afterPrototypeCreation(beanName);  
	                }  
	  
	                beanInstance = this.getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);  
	            } else {  
		        //Custom Scope
	                String scopeName = mbd.getScope();  
	                if (!StringUtils.hasLength(scopeName)) {  
	                    throw new IllegalStateException("No scope name defined for bean '" + beanName + "'");  
	                }  
	  
	                Scope scope = (Scope)this.scopes.get(scopeName);  
	                if (scope == null) {  
	                    throw new IllegalStateException("No Scope registered for scope name '" + scopeName + "'");  
	                }  
	  
	                try {  
	                    Object scopedInstance = scope.get(beanName, () -> {  
	                        this.beforePrototypeCreation(beanName);  
	  
	                        Object var4;  
	                        try {  
	                            var4 = this.createBean(beanName, mbd, args);  
	                        } finally {  
	                            this.afterPrototypeCreation(beanName);  
	                        }  
	  
	                        return var4;  
	                    });  
	                    beanInstance = this.getObjectForBeanInstance(scopedInstance, name, beanName, mbd);  
	                } catch (IllegalStateException ex) {  
	                    throw new ScopeNotActiveException(beanName, scopeName, ex);  
	                }  
	            }  
	        } catch (BeansException ex) {  
	            beanCreation.tag("exception", ex.getClass().toString());  
	            beanCreation.tag("message", String.valueOf(ex.getMessage()));  
	            this.cleanupAfterBeanCreationFailure(beanName);  
	            throw ex;  
	        } finally {  
	            beanCreation.end();  
	            if (!this.isCacheBeanMetadata()) {  
	                this.clearMergedBeanDefinition(beanName);  
	            }  
	  
	        }  
	    }  
	  
	    return (T)this.adaptBeanInstance(name, beanInstance, requiredType);  
	}


}
```

### 3.2 실제 사용 `@Autowired`
- 위의 `doCreateBean(..)`을 타고 들어가면 `org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory`로 진입한다.

```java
public abstract class AbstractAutowireCapableBeanFactory extends AbstractBeanFactory implements AutowireCapableBeanFactory {

	protected Object createBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args) throws BeanCreationException {  
	    if (this.logger.isTraceEnabled()) {  
	        this.logger.trace("Creating instance of bean '" + beanName + "'");  
	    }  
	  
	    RootBeanDefinition mbdToUse = mbd;  
	    Class<?> resolvedClass = this.resolveBeanClass(mbd, beanName, new Class[0]);  
	    //BeanDefinition에 class 정보가 없으면 class name으로부터 Class 객체 변환
	    if (resolvedClass != null && !mbd.hasBeanClass() && mbd.getBeanClassName() != null) {  
	        mbdToUse = new RootBeanDefinition(mbd);  
	        mbdToUse.setBeanClass(resolvedClass);  
	  
	        try {  
	            mbdToUse.prepareMethodOverrides();  
	        } catch (BeanDefinitionValidationException ex) {  
	            throw new BeanDefinitionStoreException(mbdToUse.getResourceDescription(), beanName, "Validation of method overrides failed", ex);  
	        }  
	    }  
	//BeanDefinition resolve
	//RootBeanDefinition 복사
	//BeanDefinition 준비 및 변환
	  
	    try {  
	        Object bean = this.resolveBeforeInstantiation(beanName, mbdToUse);  
	        if (bean != null) {  
	            return bean;  
	        }  
	    } catch (Throwable ex) {  
	        throw new BeanCreationException(mbdToUse.getResourceDescription(), beanName, "BeanPostProcessor before instantiation of bean failed", ex);  
	    }  
//resolveBeforeInstantiation
//BeanPostProcessor 중 postProcessBeforeInstantiation() 호출
//AOP, Proxy/ScopeProxy 등이 미리 개입할 수 있는 시점
//Bean이 반환되면 실제 생성 생략하고 종료



	    try {  
	        Object beanInstance = this.doCreateBean(beanName, mbdToUse, args);  
	        if (this.logger.isTraceEnabled()) {  
	            this.logger.trace("Finished creating instance of bean '" + beanName + "'");  
	        }  
	  
	        return beanInstance;  
	    } catch (ImplicitlyAppearedSingletonException | BeanCreationException ex) {  
	        throw ex;  
	    } catch (Throwable ex) {  
	        throw new BeanCreationException(mbdToUse.getResourceDescription(), beanName, "Unexpected exception during bean creation", ex);  
	    }  
	//doCreateBean 호출
	
	}


	protected Object doCreateBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args) throws BeanCreationException {  
	    BeanWrapper instanceWrapper = null;  
	    if (mbd.isSingleton()) {  
	        instanceWrapper = (BeanWrapper)this.factoryBeanInstanceCache.remove(beanName);  
	    }  
	  
	    if (instanceWrapper == null) {  
	        instanceWrapper = this.createBeanInstance(beanName, mbd, args);  
	    }  
	//Singleton이면 캐시에서 꺼내옴 -> 보통 null
	//this.createBeanInstance(beanName, mbd, args);  보통 실행
	//생성자/ 팩토리 메소드 호출해서 Bean 인스턴스 만든다.
	//생성자 주입도 여기서 발생한다.
	
	  
	    Object bean = instanceWrapper.getWrappedInstance();  
	    Class<?> beanType = instanceWrapper.getWrappedClass();  
	    if (beanType != NullBean.class) {  
	        mbd.resolvedTargetType = beanType;  
	    }  
	//생성된 인스턴스에서 타입 정보를 BeanDefinition에 기록
	  
	    synchronized(mbd.postProcessingLock) {  
	        if (!mbd.postProcessed) {  
	            try {  
	                this.applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);  
	            } catch (Throwable ex) {  
	                throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Post-processing of merged bean definition failed", ex);  
	            }  
	  
	            mbd.markAsPostProcessed();  
	        }  
	    }  
	//@Autowire, @Value, @Resource 등의 메타 데이터를 미리 스캔하는 후처리 동작
	//실제 주입이 일어나지는 않는다.
	  
	    boolean earlySingletonExposure = mbd.isSingleton() && this.allowCircularReferences && this.isSingletonCurrentlyInCreation(beanName);  
	    if (earlySingletonExposure) {  
	        if (this.logger.isTraceEnabled()) {  
	            this.logger.trace("Eagerly caching bean '" + beanName + "' to allow for resolving potential circular references");  
	        }  
	  
	        this.addSingletonFactory(beanName, () -> this.getEarlyBeanReference(beanName, mbd, bean));  
	    }  
	//순환 참조 허용한다면 
	//임시로 "미완성 인스턴스"를 싱글톤 컨테이너에 노출
	  
	    Object exposedObject = bean;  
	  
	    try {  
	        this.populateBean(beanName, mbd, instanceWrapper);  
	        
	        exposedObject = this.initializeBean(beanName, exposedObject, mbd);  
	    } catch (Throwable var18) {  
	        if (var18 instanceof BeanCreationException bce) {  
	            if (beanName.equals(bce.getBeanName())) {  
	                throw bce;  
	            }  
	        }  
	  
	        throw new BeanCreationException(mbd.getResourceDescription(), beanName, var18.getMessage(), var18);  
	    }  
	//@Autowired/ @Value/ @Resource 등 모든 필드/메소드 의존성 주입 발생
	  
	    if (earlySingletonExposure) {  
	        Object earlySingletonReference = this.getSingleton(beanName, false);  
	        if (earlySingletonReference != null) {  
	            if (exposedObject == bean) {  
	                exposedObject = earlySingletonReference;  
	            } else if (!this.allowRawInjectionDespiteWrapping && this.hasDependentBean(beanName)) {  
	                String[] dependentBeans = this.getDependentBeans(beanName);  
	                Set<String> actualDependentBeans = new LinkedHashSet(dependentBeans.length);  
	  
	                for(String dependentBean : dependentBeans) {  
	                    if (!this.removeSingletonIfCreatedForTypeCheckOnly(dependentBean)) {  
	                        actualDependentBeans.add(dependentBean);  
	                    }  
	                }  
	  
	                if (!actualDependentBeans.isEmpty()) {  
	                    throw new BeanCurrentlyInCreationException(beanName, "Bean with name '" + beanName + "' has been injected into other beans [" + StringUtils.collectionToCommaDelimitedString(actualDependentBeans) + "] in its raw version as part of a circular reference, but has eventually been wrapped. This means that said other beans do not use the final version of the bean. This is often the result of over-eager type matching - consider using 'getBeanNamesForType' with the 'allowEagerInit' flag turned off, for example.");  
	                }  
	            }  
	        }  
	    }  
	    //조기 노출된 Bean 교체 및 점금
	  
	    try {  
	        this.registerDisposableBeanIfNecessary(beanName, bean, mbd);  
	        return exposedObject;  
	    } catch (BeanDefinitionValidationException ex) {  
	        throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Invalid destruction signature", ex);  
	    }  
	    //타입에 맞게(싱글톤, 프로토타입) -> 소멸자 등록
	}

	protected BeanWrapper createBeanInstance(String beanName, RootBeanDefinition mbd, @Nullable Object[] args) {  
	    Class<?> beanClass = this.resolveBeanClass(mbd, beanName, new Class[0]);  
	    if (beanClass != null && !Modifier.isPublic(beanClass.getModifiers()) && !mbd.isNonPublicAccessAllowed()) {  
	        throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Bean class isn't public, and non-public access not allowed: " + beanClass.getName());  
	    }
	    //Bean이 Public이 아니면서 non-public 생성이 혀용 안 된 경우 예외
		else {  
	        if (args == null) {  
	            Supplier<?> instanceSupplier = mbd.getInstanceSupplier();  
	            if (instanceSupplier != null) {  
	                return this.obtainFromSupplier(instanceSupplier, beanName, mbd);  
	            }  
	        }  
	        //BeanDefinition에 Supplier가 등록된 경우 (`@Bean`메소드가 Supplier로 래핑)
	        // 람다/Supplier로 Bean 생성
	  
	        if (mbd.getFactoryMethodName() != null) {  
	            return this.instantiateUsingFactoryMethod(beanName, mbd, args);  
	        }
	        //팩토리 메소드(@Bean, static factory method 등) 사용 시
	        // this.instantiateUsingFactoryMethod(beanName, mbd, args);에서 리플렉션으로 해당 메소드 실행
	        
	         else {  
	            boolean resolved = false;  
	            boolean autowireNecessary = false;  
	            if (args == null) {  
	                synchronized(mbd.constructorArgumentLock) {  
	                    if (mbd.resolvedConstructorOrFactoryMethod != null) {  
	                        resolved = true;  
	                        autowireNecessary = mbd.constructorArgumentsResolved;  
	                    }  
	                }  
	            }  
	  
	            if (resolved) {  
	            
	                return autowireNecessary ? this.autowireConstructor(beanName, mbd, (Constructor[])null, (Object[])null) : this.instantiateBean(beanName, mbd);  
	            // autowire 필요하면 ? constructor : 기본 생성자
	            }
	             else {  
	                Constructor<?>[] ctors = this.determineConstructorsFromBeanPostProcessors(beanClass, beanName); 
					// autowired가 붙은 생성자 스캔해서 리턴
					 
	                if (ctors == null && mbd.getResolvedAutowireMode() != 3 && !mbd.hasConstructorArgumentValues() && ObjectUtils.isEmpty(args)) {  
	                    ctors = mbd.getPreferredConstructors();  
	                    return ctors != null ? this.autowireConstructor(beanName, mbd, ctors, (Object[])null) : this.instantiateBean(beanName, mbd);  
	                } else {  
	                    return this.autowireConstructor(beanName, mbd, ctors, args);  
	                }  
	            }  
	        }  
	    }  
	}



	protected void populateBean(String beanName, RootBeanDefinition mbd, @Nullable BeanWrapper bw) {  
	    if (bw == null) {  
	        if (mbd.hasPropertyValues()) {  
	            throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Cannot apply property values to null instance");  
	        }  
	    } 
	    //이 경우 property injection을 하지 않는다.
	    // 보통 불변 객체, 레코드
	
	    else if (bw.getWrappedClass().isRecord()) {  
	        if (mbd.hasPropertyValues()) {  
	            throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Cannot apply property values to a record");  
	        }  
	    } else {  
	        if (!mbd.isSynthetic() && this.hasInstantiationAwareBeanPostProcessors()) {  
	            for(InstantiationAwareBeanPostProcessor bp : this.getBeanPostProcessorCache().instantiationAware) {  
	                if (!bp.postProcessAfterInstantiation(bw.getWrappedInstance(), beanName)) {  
	                    return;  
	                }  
	            }  
	        }  
	        
	  
	        PropertyValues pvs = mbd.hasPropertyValues() ? mbd.getPropertyValues() : null;  
	        int resolvedAutowireMode = mbd.getResolvedAutowireMode();  
	        if (resolvedAutowireMode == 1 || resolvedAutowireMode == 2) {  
	            MutablePropertyValues newPvs = new MutablePropertyValues(pvs);  
	            if (resolvedAutowireMode == 1) {  
	                this.autowireByName(beanName, mbd, bw, newPvs);  
	            }  
	  
	            if (resolvedAutowireMode == 2) {  
	                this.autowireByType(beanName, mbd, bw, newPvs);  
	            }  
	  
	            pvs = newPvs;  
	        }  
	  
	        if (this.hasInstantiationAwareBeanPostProcessors()) {  
	            if (pvs == null) {  
	                pvs = mbd.getPropertyValues();  
	            }  
	  
	            for(InstantiationAwareBeanPostProcessor bp : this.getBeanPostProcessorCache().instantiationAware) {  
	                PropertyValues pvsToUse = bp.postProcessProperties(pvs, bw.getWrappedInstance(), beanName);  
	                if (pvsToUse == null) {  
	                    return;  
	                }  
	  
	                pvs = pvsToUse;  
	            }  
	        } 
	        // Annotation 기반 DI
	        // @Autowire, @Value, @Inject가 붙은 필드, setter에 주입
	        // Relfection 사용 
	  
	        boolean needsDepCheck = mbd.getDependencyCheck() != 0;  
	        if (needsDepCheck) {  
	            PropertyDescriptor[] filteredPds = this.filterPropertyDescriptorsForDependencyCheck(bw, mbd.allowCaching);  
	            this.checkDependencies(beanName, mbd, filteredPds, pvs);  
	        }  
	    //DI check -> fail-fast
	    
	  
	        if (pvs != null) {  
	            this.applyPropertyValues(beanName, mbd, bw, pvs);  
	        }  
	  
	    }  
	}

	protected Object initializeBean(String beanName, Object bean, @Nullable RootBeanDefinition mbd) {  
	    this.invokeAwareMethods(beanName, bean);  
	    Object wrappedBean = bean;  
	    if (mbd == null || !mbd.isSynthetic()) {  
	        wrappedBean = this.applyBeanPostProcessorsBeforeInitialization(bean, beanName);  
	    }  
	  
	    try {  
	        this.invokeInitMethods(beanName, wrappedBean, mbd);  
	    } catch (Throwable ex) {  
	        throw new BeanCreationException(mbd != null ? mbd.getResourceDescription() : null, beanName, ex.getMessage(), ex);  
	    }  
	  
	    if (mbd == null || !mbd.isSynthetic()) {  
	        wrappedBean = this.applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);  
	    }  
	  
	    return wrappedBean;  
	}

}
```

## 3. QnA
### Q1. GenericBeanDefinition vs. RootBeanDefinition

#### 1.GenericBeanDefinition
- BeanDefinition의 가장 범용적 구현
- 설정 정보 중심
#### 2. RootBeanDefinition
- 실제 Bean 생성에 사용되는, 내부 변환 및 캐싱용 구현
- 최종 실행용 BeanDefinition
- 부모-자식, 여러 설정이 병합된 상태
- Bean 생성 직전/중에 RootBeanDefinition으로 변환