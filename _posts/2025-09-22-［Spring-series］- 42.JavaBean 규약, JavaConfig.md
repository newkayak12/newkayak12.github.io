---
layout: page
categories:
  - SPRING
---
## 1. JavaBean 규약
- 정의: Java에서 재사용 가능한 컴포넌트를 만들기 위한 규약
- 요건: 
	- 기본 생성자가 있어야 한다.
	- private field, public getter/setter를 갖는 POJO여야 한다.
	- 직렬화 가능
- 상태 저장 객체를 외부 라이브러리, 컨테이너, 프레임워크가 자동으로 생성, 초기화, 주입할 수 있게 하는 형식
- 과거 JSP/Servlet, EJB, Spring XML DI 등 모두 JavaBean 규약으로 동작

## 2. Spring BeanDefinition/BeanFactory
- 모든 Bean은 JavaBean 규약을 준수
- BeanDefinition
	- 해당 객체의 타입, 생성자, 프로퍼티, 라이프사이클 등을 추상적으로 기술한 메타 정보
	- BeanFactory/ApplicationContext가 BeanDefinition을 참고해서 Bean 생성
- DI
	- 초기 XML -> Setter로 DI
	- `@Component`, `@Autowired` 등 annotation 기반으로 변경
	- 생성자, 필드 주입 등 유연성 확장
## 3. JavaConfig
- XML이 아닌 Java 코드로 DI 설정/ Bean 등록을 선언하는 방법
- 기존 XML 설정 방식이 가독성/ 유지보수성이 낮았음
	- 타입 안정성 부족, 자동완성/ 리팩토링 지원이 어려움
- 애플리케이션 로직과 설정의 결합 필요성 증가
	- 빈 생성 과정에서 조건식이 필요한 경우
	- 동적 환경 프로퍼티, 외부 연동, 컨텍스트 기반 구성 등
- 테스트 용이성/모듈화 강화
	- 여러 설정 클래스를 조합/상속 가능
	- 코드 기반 DI 환경에서 다양한 테스트/Mocking 가능
## 4. 동작
- JavaConfig -> ConfigurationClassPostProcessor
	- Spring 컨테이너가 @Configuration 클래스 스캔/파싱
	- 내부적으로 BeanDefinition 등록
	- @Bean은 CGLIB 기반 프록시로 싱글톤 보장

### 1.ConfigurationClassPostProcessor
- Spring 컨테이너가 refresh()
	- invokeBeanFactoryPostProcessor(beanFactory)
		- postProcessBeanDefinitionRegistry(registry)
			- ConfigurationClassPostProcessor.postProcessBeanDefinitionRegistry()


```java

public class ConfigurationClassPostProcessor implements BeanDefinitionRegistryPostProcessor, BeanRegistrationAotProcessor, BeanFactoryInitializationAotProcessor, PriorityOrdered, ResourceLoaderAware, ApplicationStartupAware, BeanClassLoaderAware, EnvironmentAware {
	
	public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {  
	    List<BeanDefinitionHolder> configCandidates = new ArrayList();  
	    String[] candidateNames = registry.getBeanDefinitionNames();  
	
	//BeanDefinition 중에서 @Configuration/@Component/@Import/@ImportResource 등 붙은 것만 
	    for(String beanName : candidateNames) {  
	        BeanDefinition beanDef = registry.getBeanDefinition(beanName);  
	        if (beanDef.getAttribute(ConfigurationClassUtils.CONFIGURATION_CLASS_ATTRIBUTE) != null) {  
	        //이미 처리된 경우
	            if (this.logger.isDebugEnabled()) {  
	                this.logger.debug("Bean definition has already been processed as a configuration class: " + beanDef);  
	            }  
	        }
	        
			 else if (ConfigurationClassUtils.checkConfigurationClassCandidate(beanDef, this.metadataReaderFactory)) {  
			 //후보인 경우
	            configCandidates.add(new BeanDefinitionHolder(beanDef, beanName));  
	            //리스트에 추가
	        }  
	    }  
	  
	    if (!configCandidates.isEmpty()) {  
	    //후보가 있으면
	    
	        configCandidates.sort((bd1, bd2) -> {  
	            int i1 = ConfigurationClassUtils.getOrder(bd1.getBeanDefinition());  
	            int i2 = ConfigurationClassUtils.getOrder(bd2.getBeanDefinition());  
	            return Integer.compare(i1, i2);  
	        });  
	    //우선 순위대로 정렬
	
	        SingletonBeanRegistry singletonRegistry = null;  
	        if (registry instanceof SingletonBeanRegistry) {  
	            SingletonBeanRegistry sbr = (SingletonBeanRegistry)registry;  
	            singletonRegistry = sbr;  
	            if (!this.localBeanNameGeneratorSet) {  
	                BeanNameGenerator generator = (BeanNameGenerator)sbr.getSingleton("org.springframework.context.annotation.internalConfigurationBeanNameGenerator");  
	                if (generator != null) {  
	                    this.componentScanBeanNameGenerator = generator;  
	                    this.importBeanNameGenerator = generator;  
	                }  
	            }  
	        }  
	        //BeanGenerator 준비
	  
	        if (this.environment == null) {  
	            this.environment = new StandardEnvironment();  
	        }  
	        //Environment 준비
	  
	        ConfigurationClassParser parser = new ConfigurationClassParser(this.metadataReaderFactory, this.problemReporter, this.environment, this.resourceLoader, this.componentScanBeanNameGenerator, registry);  
			//ConfigurationClassParser 생성

	        Set<BeanDefinitionHolder> candidates = new LinkedHashSet(configCandidates);  
	        Set<ConfigurationClass> alreadyParsed = new HashSet(configCandidates.size());  
	  
	        do {  
	            StartupStep processConfig = this.applicationStartup.start("spring.context.config-classes.parse");  
	            parser.parse(candidates);  
	            parser.validate();  
				//파싱 및 검증

	            Set<ConfigurationClass> configClasses = new LinkedHashSet(parser.getConfigurationClasses());      
	            configClasses.removeAll(alreadyParsed);  
	            //파싱 결과 configCLasses로 추출
	            
	            if (this.reader == null) {  
	                this.reader = new ConfigurationClassBeanDefinitionReader(registry, this.sourceExtractor, this.resourceLoader, this.environment, this.importBeanNameGenerator, parser.getImportRegistry());  
	            }  
	            //@Bean 등 모든 메타데이터를 BeanDefinition으로 변환, 등록
	  
	            this.reader.loadBeanDefinitions(configClasses);  
	            //@Bean 등 모든 메타 데이터 -> BeanDefinition으로 변환/ 등록
	        
	            alreadyParsed.addAll(configClasses); 
				
				 
	            processConfig.tag("classCount", () -> String.valueOf(configClasses.size())).end();  
	            candidates.clear();  
	            if (registry.getBeanDefinitionCount() > candidateNames.length) {  
	                String[] newCandidateNames = registry.getBeanDefinitionNames();  
	                Set<String> oldCandidateNames = Set.of(candidateNames);  
	                Set<String> alreadyParsedClasses = new HashSet();  
	  
	                for(ConfigurationClass configurationClass : alreadyParsed) {  
	                    alreadyParsedClasses.add(configurationClass.getMetadata().getClassName());  
	                }  
	  
	                for(String candidateName : newCandidateNames) {  
	                    if (!oldCandidateNames.contains(candidateName)) {  
	                        BeanDefinition bd = registry.getBeanDefinition(candidateName);  
	                        if (ConfigurationClassUtils.checkConfigurationClassCandidate(bd, this.metadataReaderFactory) && !alreadyParsedClasses.contains(bd.getBeanClassName())) {  
	                            candidates.add(new BeanDefinitionHolder(bd, candidateName));  
	                        }  
	                    }  
	                }  
	  
	                candidateNames = newCandidateNames;  
	            }  
	        } while(!candidates.isEmpty());  
	  //파싱 후 추가된 경우가 있으면 반복
	
	        if (singletonRegistry != null && !singletonRegistry.containsSingleton(IMPORT_REGISTRY_BEAN_NAME)) {  
	            singletonRegistry.registerSingleton(IMPORT_REGISTRY_BEAN_NAME, parser.getImportRegistry());  
	        }  
	  
	        this.propertySourceDescriptors = parser.getPropertySourceDescriptors();  
	        MetadataReaderFactory var26 = this.metadataReaderFactory;  
	        if (var26 instanceof CachingMetadataReaderFactory) {  
	            CachingMetadataReaderFactory cachingMetadataReaderFactory = (CachingMetadataReaderFactory)var26;  
	            cachingMetadataReaderFactory.clearCache();  
	        }  
//ImportRegistry, PropertySource 등 여타 정보 컨테이너 등록
	    }  
	}

}
```

- `org.springframework.context.annotation.ConfigurationClassParser` : 실제 파싱 로직을 담고 있다.
- ConfigurationClassBeanDefinitionReader
```java
//org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader

class ConfigurationClassBeanDefinitionReader {
  
	public void loadBeanDefinitions(Set<ConfigurationClass> configurationModel) {  
	    TrackedConditionEvaluator trackedConditionEvaluator = new TrackedConditionEvaluator();  
	  
	    for(ConfigurationClass configClass : configurationModel) {  
	        this.loadBeanDefinitionsForConfigurationClass(configClass, trackedConditionEvaluator);  
	    }  
	  
	}

}
```
- ConfigurationClassPostProcess.enhanceConfigurationClasses()
  ```java
//org.springframework.context.annotation.ConfigurationClassPostProcess

public class ConfigurationClassPostProcessor implements BeanDefinitionRegistryPostProcessor, BeanRegistrationAotProcessor, BeanFactoryInitializationAotProcessor, PriorityOrdered, ResourceLoaderAware, ApplicationStartupAware, BeanClassLoaderAware, EnvironmentAware {


	
	public void enhanceConfigurationClasses(ConfigurableListableBeanFactory beanFactory) {  
	    StartupStep enhanceConfigClasses = this.applicationStartup.start("spring.context.config-classes.enhance");  
	    Map<String, AbstractBeanDefinition> configBeanDefs = new LinkedHashMap();  
	
	//BeanDefinition 순회
	    for(String beanName : beanFactory.getBeanDefinitionNames()) {  
	        BeanDefinition beanDef = beanFactory.getBeanDefinition(beanName);  
	        Object configClassAttr = beanDef.getAttribute(ConfigurationClassUtils.CONFIGURATION_CLASS_ATTRIBUTE);  
	        AnnotationMetadata annotationMetadata = null;  
	        MethodMetadata methodMetadata = null;  
	        if (beanDef instanceof AnnotatedBeanDefinition annotatedBeanDefinition) {  
	            annotationMetadata = annotatedBeanDefinition.getMetadata();  
	            methodMetadata = annotatedBeanDefinition.getFactoryMethodMetadata();  
	        }  
	  
	        if ((configClassAttr != null || methodMetadata != null) && beanDef instanceof AbstractBeanDefinition abd) {  
	        //BeanClass가 없으면 클래스 로드 
	            if (!abd.hasBeanClass()) {  
	                boolean liteConfigurationCandidateWithoutBeanMethods = "lite".equals(configClassAttr) && annotationMetadata != null && !ConfigurationClassUtils.hasBeanMethods(annotationMetadata);  
	                if (!liteConfigurationCandidateWithoutBeanMethods) {  
	                    try {  
	                        abd.resolveBeanClass(this.beanClassLoader);  
	                    } catch (Throwable ex) {  
	                        throw new IllegalStateException("Cannot load configuration class: " + beanDef.getBeanClassName(), ex);  
	                    }  
	                }  
	            }  
	            //lite: 일반 @Component, @Import 등 혹은 proxyBeanMethods=false
	        }  
	  
	        if ("full".equals(configClassAttr)) {  
	        //CGLIB 프록시 대상으로 선정
	            if (!(beanDef instanceof AbstractBeanDefinition)) {  
	                throw new BeanDefinitionStoreException("Cannot enhance @Configuration bean definition '" + beanName + "' since it is not stored in an AbstractBeanDefinition subclass");  
	            }  
	  
	            AbstractBeanDefinition abd = (AbstractBeanDefinition)beanDef;  
	            if (this.logger.isWarnEnabled() && beanFactory.containsSingleton(beanName)) {  
	            //이미 객체가 생성된 경우에는 프록시화 못하고 경고만 날린다.(등록 순서 문제)
	                this.logger.warn("Cannot enhance @Configuration bean definition '" + beanName + "' since its singleton instance has been created too early. The typical cause is a non-static @Bean method with a BeanDefinitionRegistryPostProcessor return type: Consider declaring such methods as 'static' and/or marking the containing configuration class as 'proxyBeanMethods=false'.");  
	            }  
	  
	            configBeanDefs.put(beanName, abd);  
	            //프록시화 대상 목록에 추가
	        }  
	        //full: Proxy @Configuration 혹은 proxyBeanMethods=true
	    }  
	  
	    if (configBeanDefs.isEmpty()) {  
	        enhanceConfigClasses.end();  
	    } 
	    //대상 클래스가 없으면 끝
	    
	    else {  
	        ConfigurationClassEnhancer enhancer = new ConfigurationClassEnhancer();  
	  
	        for(Map.Entry<String, AbstractBeanDefinition> entry : configBeanDefs.entrySet()) {  
	            AbstractBeanDefinition beanDef = (AbstractBeanDefinition)entry.getValue();  
	            beanDef.setAttribute(AutoProxyUtils.PRESERVE_TARGET_CLASS_ATTRIBUTE, Boolean.TRUE);  
	            //프록시 객체로 생성하겠다는 힌트(AOP 등과 충돌 방지)
	            
	            Class<?> configClass = beanDef.getBeanClass();  
	            //실제 BeanClass
	            
	            Class<?> enhancedClass = enhancer.enhance(configClass, this.beanClassLoader);  
	            //CGLIB Enhancer로 프록시 클래스 생성

	            if (configClass != enhancedClass) {  
	                if (this.logger.isTraceEnabled()) {  
	                    this.logger.trace(String.format("Replacing bean definition '%s' existing class '%s' with enhanced class '%s'", entry.getKey(), configClass.getName(), enhancedClass.getName()));  
	                }  
	  
	                beanDef.setBeanClass(enhancedClass);  
	            }  
		        //기존 BeanDefinition의 BeanClass를 프록시 클래스로 대체
		        
	        }  
	  
	        enhanceConfigClasses.tag("classCount", () -> String.valueOf(configBeanDefs.keySet().size())).end();  
	    }  
	}
}

```

### 2. `@Configuration(proxyBeanMethos = )`
1. true
	1. 기본 값이다.
	2. Spring이 해당 클래스를 CGLIB 프록시로 래핑한다.
	3. @Bean 메소드 호출 시 "싱글톤 캐싱" 및 "순환 참조 보호"를 자동 보장
	4. @Bean 간 호출 많음, 싱글톤 / 순환 참조 보장이 필요할 떄 사용
2. false
	1. 프록시 사용 안함
	2. @Bean 메소드 호출 시 직접 호출
	3. 싱글톤 보장 X/ 순환 참조 X
	4. @Bean 간 직접 호출이 불필요, 단순/ DI 성능 최적화 목적

### 3. 결과적으로
- 프록시 사용으로
	- @Bean의 메소드 간 직접 호출에도 항상 컨테이너에 동일 Bean 인스턴스 반환
	- 순환 참조에 기존 캐싱된 Bean을 리턴해서 순환 참조를 해결
