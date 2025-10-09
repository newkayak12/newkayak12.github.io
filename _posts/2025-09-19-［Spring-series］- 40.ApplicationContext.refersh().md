---
layout: page
categories:
  - SPRING
---
## 1. 구조의 필요성
- Spring은 "Bean의 생성/의존성 주입"뿐만 아니라 라이프사이클 후킹, 확장 포인트, 이벤트 시스템, 커스텀 초기화 등 "복잡한 컨테이너 초기화"를 확장성 있게 지원해야 한다.
- `refresh()`를 통해서 아래와 같은 흐름으로 진행됩니다.
	1) 컨테이너 준비
	2) BeanDefinition 로딩
	3) PostProcessor
	4) BeanInstantiate
	5) AddEventListener
- 일련의 작업을 명확히 분리해서 진행

## 2. 동작
```java
public abstract class AbstractApplicationContext extends DefaultResourceLoader implements ConfigurableApplicationContext {

// 대표 구현체: GenericApplicationContext, AnnotationConfigApplicationContext, ClassPathXmlApplicationContext

		public void refresh() throws BeansException, IllegalStateException {  
	    this.startupShutdownLock.lock();  
	  
	    try {  
	        this.startupShutdownThread = Thread.currentThread();  
	        StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");  
	        
	        this.prepareRefresh();  
	        //Environment, Property 준비
	        //PropertySource, Environment, ActiveProfiles 세팅
	        //ApplicationContext의 상태를 "초기화 준비로 마킹"
	        
	        ConfigurableListableBeanFactory beanFactory = this.obtainFreshBeanFactory();  
		    //BeanFactory 생성 및 BeanDefinition 로딩
		    //BeanFactory 생성 -> default: DefaultListableBeanFactory
		    //BeanDefinition 읽고 BeanFactory에 로드
		    /**
		     * - GenericApplicationContext: 이미 생성된 DefaultListableBeanFactory 사용
		     * - ClassPathXmlApplicationContext: 내부적으로 loadBeanDefinition()호출 -> XmlBeanDefinitionReader
		     * - AnnotationConfigApplicationContext: AnnotationBeanDefinitionReader, ClassPathBeanDefinitionScanner 활용
		     */
	
	        this.prepareBeanFactory(beanFactory);  
	        //BeanFactory 기본 설정 및 내부 Bean 등록
	        //BeanFactory에 ApplicationContext 고유 Bean/속성 주입
	        //ClassLoader, Environment, ApplicationContext, ResourceLoader 등
	  
	        try {  
	        
				this.postProcessBeanFactory(beanFactory);  
				//BeanFactoryPostProcess 적용 (Hook)
				//사용자 정의 Hook 등
				//AbstractApplicationContext에서는 비워져 있음
/**
* ServletWebServerApplicationContext 기준
*  ```java
*  protected void postProcessBeanFactory(ConfigurableListableBeanFactory   beanFactory) {  
*     super.postProcessBeanFactory(beanFactory);  
*     if (!ObjectUtils.isEmpty(this.basePackages)) {  
*         this.scanner.scan(this.basePackages);  
*     }  
*   
*     if (!this.annotatedClasses.isEmpty()) {  
*         this.reader.register(ClassUtils.toClassArray(this.annotatedClasses));  
*     }  
*   
* }
* ```
*/
				
	        
	            StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");  
	            
	            this.invokeBeanFactoryPostProcessors(beanFactory);  
	            //BeanFactoryPostProcess 실행
	            //BeanDefinition 실제 인스턴스화 전 커스터마이즈 가능
	            //@Configuration처리, @ComponentScan, @Import, @PropertySource 등 파싱/등록(BeanDefinition)
	            //ProeprtyPlaceholder 치환, 설정
	            //BeanDefinition 등록이 이 단계에서 종료
	            
	
	            this.registerBeanPostProcessors(beanFactory);  
	            //BeanPostProcessor 등록
	            //Bean 인스턴스 생성 전/후 동적 후킹
	            //ex) AutowiredAnnotationBeanPostProcessor, AOP,
	            //@Async, @Transactional 등
				//
				//생성 이후/직전의 동작을 커스터마이징(프록시, 주입, 래핑)
				//실제로 동작은 `getBean()`이나 싱글톤 인스턴스에 동작


	            beanPostProcess.end();  
	            
	            this.initMessageSource();  
	            //MessageSource 초기화
	        
	            this.initApplicationEventMulticaster();  
	            //이벤트 멀티캐스터 초기화(ApplicationEventMulticaster)
	        
	            this.onRefresh();  
	            
	            this.registerListeners();  
	            //리스너 등록(ApplicationListener)
	        
	            this.finishBeanFactoryInitialization(beanFactory);  
				//Singleton Bean Initialization
				//모든 singleton(non-lazy) 인스턴스화
				//의존성 주입, @PostConstruct, BeanPostProcessor
				//Bean 생성 -> BeanPostProcessor 전/후 후킹 -> 의존성 주입 -> 초기화 메소드 호출
				//@Autowired, @Value, AOP Proxy, @Transactional이 여기서 적용된다.
				//@PostConstruct, initializingBean 등 호출
				//AutowiredAnnotationBeanPostProcessor가 의존성 주입
				//AnnotationAwareAspectJAutoProxyCreator가 프록시 래핑
				//모든 싱글톤 빈이 실제 객체로 할당됨

	            this.finishRefresh();  
	            // 전체 초기화 마무리, 이벤트 발행
	            //초기화 완료 마킹
	            //ApplicationContextEvent 발행
	            
	    
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

	protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {  
	    beanFactory.setBeanClassLoader(this.getClassLoader());  
	    beanFactory.setBeanExpressionResolver(new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));  
	    beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, this.getEnvironment()));  
	    beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));  
	    beanFactory.ignoreDependencyInterface(EnvironmentAware.class);  
	    beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);  
	    beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);  
	    beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);  
	    beanFactory.ignoreDependencyInterface(MessageSourceAware.class);  
	    beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);  
	    beanFactory.ignoreDependencyInterface(ApplicationStartupAware.class);  
	    beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);  
	    beanFactory.registerResolvableDependency(ResourceLoader.class, this);  
	    beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);  
	    beanFactory.registerResolvableDependency(ApplicationContext.class, this);  
	    beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));  
	    if (!NativeDetector.inNativeImage() && beanFactory.containsBean("loadTimeWeaver")) {  
	        beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));  
	        beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));  
	    }  
	  
	    if (!beanFactory.containsLocalBean("environment")) {  
	        beanFactory.registerSingleton("environment", this.getEnvironment());  
	    }  
	  
	    if (!beanFactory.containsLocalBean("systemProperties")) {  
	        beanFactory.registerSingleton("systemProperties", this.getEnvironment().getSystemProperties());  
	    }  
	  
	    if (!beanFactory.containsLocalBean("systemEnvironment")) {  
	        beanFactory.registerSingleton("systemEnvironment", this.getEnvironment().getSystemEnvironment());  
	    }  
	  
	    if (!beanFactory.containsLocalBean("applicationStartup")) {  
	        beanFactory.registerSingleton("applicationStartup", this.getApplicationStartup());  
	    }  
	  
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
	    beanFactory.preInstantiateSingletons();  
	}
}
```
