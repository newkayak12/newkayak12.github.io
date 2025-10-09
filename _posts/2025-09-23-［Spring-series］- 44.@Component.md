---
layout: page
categories:
  - SPRING
---
## 1. ComponentScan이 왜 필요한가?
- 수동 Bean 등록은 프로젝트 크기가 커지면 문제가 생김
	- 생산성 저하
	- 실수 증가
	- 리펙토링이 어려워짐
- 따라서 자동으로 감지/ 등록할 수 있도록 지원
- Pojo개발, DI, 관심사 분리, 느슨한 결합 등을 실현하기 위해서

## 2. 어떻게 동작하는가?
1. @Component, @Service, @Repository, @Controller 등 종류는 여러 개가 있다.
	1. 계층/ 관심사 명확화를 위해서 이름을 붙여 놓음
2. 클래스 단위로 BeanDefinition 자동 등록 대상으로 마킹
3. - ConfigurationClassPostProcessor에서 `postProcessBeanDefinitionRegistry()`
```java
public class ConfigurationClassPostProcessor implements BeanDefinitionRegistryPostProcessor, BeanRegistrationAotProcessor, BeanFactoryInitializationAotProcessor, PriorityOrdered, ResourceLoaderAware, ApplicationStartupAware, BeanClassLoaderAware, EnvironmentAware {

	public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {  
	    int registryId = System.identityHashCode(registry);  
	    if (this.registriesPostProcessed.contains(registryId)) {  
	        throw new IllegalStateException("postProcessBeanDefinitionRegistry already called on this post-processor against " + registry);  
	    } else if (this.factoriesPostProcessed.contains(registryId)) {  
	        throw new IllegalStateException("postProcessBeanFactory already called on this post-processor against " + registry);  
	    } else {  
	        this.registriesPostProcessed.add(registryId);  
	        this.processConfigBeanDefinitions(registry);  
	    }  
	}


	public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {  
	    List<BeanDefinitionHolder> configCandidates = new ArrayList();  
		//@Configuration/@Component 후보
	    String[] candidateNames = registry.getBeanDefinitionNames();  
	  
	    for(String beanName : candidateNames) {  
	        BeanDefinition beanDef = registry.getBeanDefinition(beanName);  
	        if (beanDef.getAttribute(ConfigurationClassUtils.CONFIGURATION_CLASS_ATTRIBUTE) != null) {  
	            if (this.logger.isDebugEnabled()) {  
	                this.logger.debug("Bean definition has already been processed as a configuration class: " + beanDef);  
	            }  
	        } else if (ConfigurationClassUtils.checkConfigurationClassCandidate(beanDef, this.metadataReaderFactory)) {  
	    //@Configuration, @Component, @ComponentScan 등 후보 판별
	            configCandidates.add(new BeanDefinitionHolder(beanDef, beanName));  
	        }  
	    }  
	  
	    if (!configCandidates.isEmpty()) {  
	    //후보가 있으면
	        configCandidates.sort((bd1, bd2) -> {  
	            int i1 = ConfigurationClassUtils.getOrder(bd1.getBeanDefinition());  
	            int i2 = ConfigurationClassUtils.getOrder(bd2.getBeanDefinition());  
	            return Integer.compare(i1, i2);  
	        });  
	        //우선 순위 정렬
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
	  
	        if (this.environment == null) {  
	            this.environment = new StandardEnvironment();  
	        }  
	  
	        ConfigurationClassParser parser = new ConfigurationClassParser(this.metadataReaderFactory, this.problemReporter, this.environment, this.resourceLoader, this.componentScanBeanNameGenerator, registry);  
	        Set<BeanDefinitionHolder> candidates = new LinkedHashSet(configCandidates);  
	        Set<ConfigurationClass> alreadyParsed = new HashSet(configCandidates.size());  
	  
	        do {  
	            StartupStep processConfig = this.applicationStartup.start("spring.context.config-classes.parse");  
	            parser.parse(candidates);  
	            //실제  @ComponentScan 시작 지점
	            parser.validate();  
	            Set<ConfigurationClass> configClasses = new LinkedHashSet(parser.getConfigurationClasses());  
	            configClasses.removeAll(alreadyParsed);  
	            if (this.reader == null) {  
	                this.reader = new ConfigurationClassBeanDefinitionReader(registry, this.sourceExtractor, this.resourceLoader, this.environment, this.importBeanNameGenerator, parser.getImportRegistry());  
	            }  
	  
	            this.reader.loadBeanDefinitions(configClasses);  
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
	    // 파싱하고 등록 루핑

	        if (singletonRegistry != null && !singletonRegistry.containsSingleton(IMPORT_REGISTRY_BEAN_NAME)) {  
	            singletonRegistry.registerSingleton(IMPORT_REGISTRY_BEAN_NAME, parser.getImportRegistry());  
	        }  
	  
	        this.propertySourceDescriptors = parser.getPropertySourceDescriptors();  
	        MetadataReaderFactory var26 = this.metadataReaderFactory;  
	        if (var26 instanceof CachingMetadataReaderFactory) {  
	            CachingMetadataReaderFactory cachingMetadataReaderFactory = (CachingMetadataReaderFactory)var26;  
	            cachingMetadataReaderFactory.clearCache();  
	        }  
	  
	    }  
	}
}
```
- ` ConfigurationClassParser parser = new ConfigurationClassParser(this.metadataReaderFactory, this.problemReporter, this.environment, this.resourceLoader, this.componentScanBeanNameGenerator, registry); `의 `scan()`에서 시작
```java
class ConfigurationClassParser {
	
	@Nullable  
	protected final SourceClass doProcessConfigurationClass(ConfigurationClass configClass, SourceClass sourceClass, Predicate<String> filter) throws IOException {  
	    if (configClass.getMetadata().isAnnotated(Component.class.getName())) {  
	        this.processMemberClasses(configClass, sourceClass, filter);  
	    }  
	  
	    for(AnnotationAttributes propertySource : AnnotationConfigUtils.attributesForRepeatable(sourceClass.getMetadata(), PropertySource.class, PropertySources.class, true)) {  
	        if (this.propertySourceRegistry != null) {  
	            this.propertySourceRegistry.processPropertySource(propertySource);  
	        } else {  
	            this.logger.info("Ignoring @PropertySource annotation on [" + sourceClass.getMetadata().getClassName() + "]. Reason: Environment must implement ConfigurableEnvironment");  
	        }  
	    }  
	  
	    Set<AnnotationAttributes> componentScans = AnnotationConfigUtils.attributesForRepeatable(sourceClass.getMetadata(), ComponentScan.class, ComponentScans.class, MergedAnnotation::isDirectlyPresent);  
	    if (componentScans.isEmpty()) {  
	        componentScans = AnnotationConfigUtils.attributesForRepeatable(sourceClass.getMetadata(), ComponentScan.class, ComponentScans.class, MergedAnnotation::isMetaPresent);  
	    }  
	  
	    if (!componentScans.isEmpty() && !this.conditionEvaluator.shouldSkip(sourceClass.getMetadata(), ConfigurationPhase.REGISTER_BEAN)) {  
	        for(AnnotationAttributes componentScan : componentScans) {  
	        //여기서 시작
	            for(BeanDefinitionHolder holder : this.componentScanParser.parse(componentScan, sourceClass.getMetadata().getClassName())) {  
	            //@ComponentScan 어노테이션 파싱
	            //이 내부에서 doScan을 호출 
	            //ComponentScanAnnotationParser에 존재
	            
	                BeanDefinition bdCand = holder.getBeanDefinition().getOriginatingBeanDefinition();  
	                if (bdCand == null) {  
	                    bdCand = holder.getBeanDefinition();  
	                }  
	  
	                if (ConfigurationClassUtils.checkConfigurationClassCandidate(bdCand, this.metadataReaderFactory)) {  
	                    this.parse(bdCand.getBeanClassName(), holder.getBeanName());  
	                }  
	            }  
	        }  
	    }
}
```
```java
// org.springframework.context.annotation.ComponentScanAnnotationParser
class ComponentScanAnnotationParser {
	public Set<BeanDefinitionHolder> parse(AnnotationAttributes componentScan, final String declaringClass) {  
	    ClassPathBeanDefinitionScanner scanner = new ClassPathBeanDefinitionScanner(this.registry, componentScan.getBoolean("useDefaultFilters"), this.environment, this.resourceLoader);  
	   //scanner를 통해서 스캔을 시작한다. 
	    Class<? extends BeanNameGenerator> generatorClass = componentScan.getClass("nameGenerator");  
	    boolean useInheritedGenerator = BeanNameGenerator.class == generatorClass;  
	    scanner.setBeanNameGenerator(useInheritedGenerator ? this.beanNameGenerator : (BeanNameGenerator)BeanUtils.instantiateClass(generatorClass));  
	    ScopedProxyMode scopedProxyMode = (ScopedProxyMode)componentScan.getEnum("scopedProxy");  
	    if (scopedProxyMode != ScopedProxyMode.DEFAULT) {  
	        scanner.setScopedProxyMode(scopedProxyMode);  
	    } else {  
	        Class<? extends ScopeMetadataResolver> resolverClass = componentScan.getClass("scopeResolver");  
	        scanner.setScopeMetadataResolver((ScopeMetadataResolver)BeanUtils.instantiateClass(resolverClass));  
	    }  
	  
	    scanner.setResourcePattern(componentScan.getString("resourcePattern"));  
	  
	    for(AnnotationAttributes includeFilterAttributes : componentScan.getAnnotationArray("includeFilters")) {  
	        for(TypeFilter typeFilter : TypeFilterUtils.createTypeFiltersFor(includeFilterAttributes, this.environment, this.resourceLoader, this.registry)) {  
	            scanner.addIncludeFilter(typeFilter);  
	        }  
	    }  
	  
	    for(AnnotationAttributes excludeFilterAttributes : componentScan.getAnnotationArray("excludeFilters")) {  
	        for(TypeFilter typeFilter : TypeFilterUtils.createTypeFiltersFor(excludeFilterAttributes, this.environment, this.resourceLoader, this.registry)) {  
	            scanner.addExcludeFilter(typeFilter);  
	        }  
	    }  
	  
	    boolean lazyInit = componentScan.getBoolean("lazyInit");  
	    if (lazyInit) {  
	        scanner.getBeanDefinitionDefaults().setLazyInit(true);  
	    }  
	  
	    Set<String> basePackages = new LinkedHashSet();  
	    String[] basePackagesArray = componentScan.getStringArray("basePackages");  
	  
	    for(String pkg : basePackagesArray) {  
	        String[] tokenized = StringUtils.tokenizeToStringArray(this.environment.resolvePlaceholders(pkg), ",; \t\n");  
	        Collections.addAll(basePackages, tokenized);  
	    }  
	  
	    for(Class<?> clazz : componentScan.getClassArray("basePackageClasses")) {  
	        basePackages.add(ClassUtils.getPackageName(clazz));  
	    }  
	  
	    if (basePackages.isEmpty()) {  
	        basePackages.add(ClassUtils.getPackageName(declaringClass));  
	    }  
	  
	    scanner.addExcludeFilter(new AbstractTypeHierarchyTraversingFilter(false, false) {  
	        protected boolean matchClassName(String className) {  
	            return declaringClass.equals(className);  
	        }  
	    });  
	    return scanner.doScan(StringUtils.toStringArray(basePackages));  
	}
}


///
//org.springframework.context.annotation.ClassPathBeanDefinitionScanner

public class ClassPathBeanDefinitionScanner extends ClassPathScanningCandidateComponentProvider {

		protected Set<BeanDefinitionHolder> doScan(String... basePackages) {  
	    Assert.notEmpty(basePackages, "At least one base package must be specified");  
	    Set<BeanDefinitionHolder> beanDefinitions = new LinkedHashSet();  
	  
	    for(String basePackage : basePackages) {  
	        for(BeanDefinition candidate : this.findCandidateComponents(basePackage)) { 
	        //basePackage 경로 아래 .class 읽고 BeanDefinition 생성
	         
	            ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(candidate);  
			//scope 처리

	            candidate.setScope(scopeMetadata.getScopeName());  
	            String beanName = this.beanNameGenerator.generateBeanName(candidate, this.registry);  
	            if (candidate instanceof AbstractBeanDefinition abstractBeanDefinition) {  
	                this.postProcessBeanDefinition(abstractBeanDefinition, beanName);  
	                //beanDefinition 후처리
	            }  
	  
	            if (candidate instanceof AnnotatedBeanDefinition annotatedBeanDefinition) {  
	                AnnotationConfigUtils.processCommonDefinitionAnnotations(annotatedBeanDefinition);  
	                //@Primary, @Lazy 등 공통 처리
	                
	            }  
	  
	            if (this.checkCandidate(beanName, candidate)) {  
	                BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(candidate, beanName);  
	                definitionHolder = AnnotationConfigUtils.applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);  
	                beanDefinitions.add(definitionHolder);  
	                this.registerBeanDefinition(definitionHolder, this.registry);  
	            }  
	            //BeanDefinition 등록 처리
	        }  
	    }  
	  
	    return beanDefinitions;  
	}


}
```