---
layout: post
categories: [SPRING]
---



from [Dictionary - ConfigurableApplicationContext](https://github.com/newkayak12/Dictionary/blob/master/spring/13.ConfigurableApplicationContext.md)



# ConfigurableApplicationContext
```java

class SpringApplication {

    public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
        this.resourceLoader = resourceLoader;
        Assert.notNull(primarySources, "PrimarySources must not be null");
        this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
        this.webApplicationType = WebApplicationType.deduceFromClasspath();
        this.bootstrapRegistryInitializers = new ArrayList<>(getSpringFactoriesInstances(BootstrapRegistryInitializer.class));
        setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
        setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
        this.mainApplicationClass = deduceMainApplicationClass();
    }
    
    public ConfigurableApplicationContext run(String... args) {
        long startTime = System.nanoTime();

        // #1. BootStrapContext 생성
        DefaultBootstrapContext bootstrapContext = createBootstrapContext();
        ConfigurableApplicationContext context = null;

        // #2. SYSTEM_PROPERTY_JAVA_AWT_HEADLESS 생성 {
        //
        //      -> SpringApplication.java
        //      private void configureHeadlessProperty() {
        //          System.setProperty(SYSTEM_PROPERTY_JAVA_AWT_HEADLESS,
        //                  System.getProperty(SYSTEM_PROPERTY_JAVA_AWT_HEADLESS, Boolean.toString(this.headless)));
        //      }   
        // 
        // }
        configureHeadlessProperty();
        
        // #3. SpringApplicationListener 조회 및 start
        SpringApplicationRunListeners listeners = getRunListeners(args);
        //
        // -> SpringApplication.java
        // private SpringApplicationRunListeners getRunListeners(String[] args) {
        //     Class<?>[] types = new Class<?>[] { SpringApplication.class, String[].class };
        //     return new SpringApplicationRunListeners(logger,
        //             getSpringFactoriesInstances(SpringApplicationRunListener.class, types, this, args),
        //             this.applicationStartup);
        // }
        //
        listeners.starting(bootstrapContext, this.mainApplicationClass);
        //
        // -> SpringApplicationRunListeners.java
        // void starting(ConfigurableBootstrapContext bootstrapContext, Class<?> mainApplicationClass) {
        //    doWithListeners("spring.boot.application.starting", (listener) -> listener.starting(bootstrapContext),
        //            (step) -> {
        //                if (mainApplicationClass != null) {
        //                    step.tag("mainApplicationClass", mainApplicationClass.getName());
        //                }
        //            });
        //
        // }
        
        
        
        try {
            
            // #4. Arguments 래핑 및 Environment 준비
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
            ConfigurableEnvironment environment = prepareEnvironment(listeners, bootstrapContext, applicationArguments);
            
            // #5. IgnoreBeanInfo 설정 {
            //
            //      -> SpringApplication.java
            //
            //      private void configureIgnoreBeanInfo(ConfigurableEnvironment environment) {
            //          if (System.getProperty(CachedIntrospectionResults.IGNORE_BEANINFO_PROPERTY_NAME) == null) {
            //              Boolean ignore = environment.getProperty(CachedIntrospectionResults.IGNORE_BEANINFO_PROPERTY_NAME,
            //                      Boolean.class, Boolean.TRUE);
            //              System.setProperty(CachedIntrospectionResults.IGNORE_BEANINFO_PROPERTY_NAME, ignore.toString());
            //          }
            //      }
            // }
            configureIgnoreBeanInfo(environment);
            Banner printedBanner = printBanner(environment);
            
            // #6. ApplicationContext 생성
            context = createApplicationContext();
            context.setApplicationStartup(this.applicationStartup);
            
            // #7. Context 준비
            prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);
            
            // #8. Context Refresh
            refreshContext(context);
            
            // #9. Context Refresh 후처리 
            afterRefresh(context, applicationArguments);
            
            Duration timeTakenToStartup = Duration.ofNanos(System.nanoTime() - startTime);
            if (this.logStartupInfo) {
                new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), timeTakenToStartup);
            }
            
            // #10. Listener 시작
            listeners.started(context, timeTakenToStartup);
            
            // #11. Runners 실행
            callRunners(context, applicationArguments);
        }
        catch (Throwable ex) {
            handleRunFailure(context, ex, listeners);
            throw new IllegalStateException(ex);
        }
        try {
            Duration timeTakenToReady = Duration.ofNanos(System.nanoTime() - startTime);
            listeners.ready(context, timeTakenToReady);
        }
        catch (Throwable ex) {
            handleRunFailure(context, ex, null);
            throw new IllegalStateException(ex);
        }
        return context;
    }
}
```


## 1. BootStrapContext 생성
BootStrapContext 란 애플리케이션 컨텍스트 준비 전까지 Spring의 Environment 객체를 후처리하기 위한 임시 컨텍스트 생성

## 2. SYSTEM_PROPERTY_JAVA_AWT_HEADLESS 생성 
Java AWT로 UI를 생성할 경우 UI 없이도 작동할 수 있게 해주는 설정

## 3. SpringApplicationListener 조회 및 start
컨텍스트 준비 시 필요한 리스너를 찾아서 BootStrapContext를 사용해서 실행한다. 
생성 시간이 길 경우 Listener로 등록해서 Notify해서 애플리케이션 컨텍스트를 준비함과 동시에 객체를 생성할 수 있게 해준다. 

## 4. Arguments 래핑 및 Environment 준비
`String[]` 인자를 `ApplicationArgument`로 래핑한다. 이를 Environment를 준비하는 `prepareEnvironment`에 넘겨준다. 
애플리케이션 타입에 따라 Environment 구현체를 생성한다.

```java
private ConfigurableEnvironment getOrCreateEnvironment() {
    if (this.environment != null) {
        return this.environment;
    }
    switch (this.webApplicationType) {
    case SERVLET:
        return new ApplicationServletEnvironment();
    case REACTIVE:
        return new ApplicationReactiveWebEnvironment();
    default:
        return new ApplicationEnvironment();
    }
}
```

## 5. IgnoreBeanInfo 설정 
JSP의 JavaBeans를 Ingore
```java
private void configureIgnoreBeanInfo(ConfigurableEnvironment environment) {
    if (System.getProperty(CachedIntrospectionResults.IGNORE_BEANINFO_PROPERTY_NAME) == null) {
        Boolean ignore = environment.getProperty("spring.beaninfo.ignore", Boolean.class, Boolean.TRUE);
        System.setProperty(CachedIntrospectionResults.IGNORE_BEANINFO_PROPERTY_NAME, ignore.toString());
    }
}
```

## 6. ApplicationContext 생성
팩토리 클래스에 위임한다. 
```java
@FunctionalInterface
public interface ApplicationContextFactory {

    ApplicationContextFactory DEFAULT = (webApplicationType) -> {
        try {
            switch (webApplicationType) {
            case SERVLET:
                return new AnnotationConfigServletWebServerApplicationContext();
            case REACTIVE:
                return new AnnotationConfigReactiveWebServerApplicationContext();
            default:
                return new AnnotationConfigApplicationContext();
            }
        }
        catch (Exception ex) {
            throw new IllegalStateException("Unable create a default ApplicationContext instance, "
                + "you may need a custom ApplicationContextFactory", ex);
        }
    };

    ConfigurableApplicationContext create(WebApplicationType webApplicationType);

    static ApplicationContextFactory ofContextClass(Class<? extends ConfigurableApplicationContext> contextClass) {
        return of(() -> BeanUtils.instantiateClass(contextClass));
    }

    static ApplicationContextFactory of(Supplier<ConfigurableApplicationContext> supplier) {
        return (webApplicationType) -> supplier.get();
    }
}
```


## 7. Context 준비
Context 준비 후 하는 후처리 작업과 빈을 등록하는 Refresh 단계를 위한 전처리 작업이 수행된다. 
```java
private void prepareContext(DefaultBootstrapContext bootstrapContext, ConfigurableApplicationContext context, ConfigurableEnvironment environment, SpringApplicationRunListeners listeners, ApplicationArguments applicationArguments, Banner printedBanner) {
    context.setEnvironment(environment);
    postProcessApplicationContext(context);
    applyInitializers(context);
    listeners.contextPrepared(context);
    bootstrapContext.close(context);
    if (this.logStartupInfo) {
        logStartupInfo(context.getParent() == null);
        logStartupProfileInfo(context);
    }
    // Add boot specific singleton beans
    ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
    beanFactory.registerSingleton("springApplicationArguments", applicationArguments);
    if (printedBanner != null) {
        beanFactory.registerSingleton("springBootBanner", printedBanner);
    }
    if (beanFactory instanceof AbstractAutowireCapableBeanFactory) {
        ((AbstractAutowireCapableBeanFactory) beanFactory).setAllowCircularReferences(this.allowCircularReferences);
        if (beanFactory instanceof DefaultListableBeanFactory) {
            ((DefaultListableBeanFactory) beanFactory)
                .setAllowBeanDefinitionOverriding(this.allowBeanDefinitionOverriding);
        }
    }

}
```
beanNameGenerator, resourceLoader, conversionService 등이 생성됐다면 싱글톤 bean으로 등록한다. 
추가로 BootStrapContext는 필요 없어지므로 종료한다. 

## [8. Context Refresh](14.RefreshContext.md)
빈을 찾아서 등록하고 웹 서버를 만들어 실행하는 등의 핵심 작업들이 진행된다. refresh를 거치면 모든 객체들이 싱글톤으로 인스턴스화 되어 있다. 
에러가 나면 모든 빈을 제거한다. 그래서 모 아니면 도다. 

## 9. Context Refresh 후처리

```java
protected void afterRefresh(ConfigurableApplicationContext context, ApplicationArguments args) {
}
```

이전에 callRunners()가 있어서 `ApplicationRunner, CommandLineRunner`가 있었다고 한다. 

## 10. Listener 시작
## 11. Runners 실행
어플리케이션이 실행된 이후에 초기화하는 작업을 필요로 하는 경우에 Runner로 등록하는데, 이들을 찾아서 실행한다. 