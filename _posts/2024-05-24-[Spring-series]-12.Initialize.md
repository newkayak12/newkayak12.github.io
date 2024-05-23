---
layout: post
categories: [SPRING]
---



from [Dictionary - SpringBootInitialize](https://github.com/newkayak12/Dictionary/blob/master/spring/12.Initialize.md)



# Initialize

1. SpringApplication.run(~.class, args); 호출
```java
public class SpringApplication {

    public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
        return run(new Class<?>[] { primarySource }, args);
    }

    public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
        return new SpringApplication(primarySources).run(args);
    }

    public ConfigurableApplicationContext run(String... args) {
    }
}
```
2. ApplicationContext를 리턴 받음
```java
class SpringApplication {

    public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
        this.resourceLoader = resourceLoader;
        Assert.notNull(primarySources, "PrimarySources must not be null");
        this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
        //applicationType 추론 {
        //  1. 웹이 아니면 AnnotatoinConfigApplicationContext
        //  2. 서블릿 기반 AnnotaionConfigServletWebServerApplicationContext -> WebMvcAutoConfiguration 찾아다님
        //  3. 리액티브 AnnotationConfigReactiveWebServerApplication
        //
        // 만약 servlet, webflux 둘 다 있으면 servlet이 기본
        //}
        this.webApplicationType = WebApplicationType.deduceFromClasspath();

        // 26.WebfluxVs.WebMvc.md
        

        //BootstrapRegistryInitializer를 불러오고 셋 {
        // ApplicationContext 준비하고 Environment 후처리 동안 이용되는 임시 컨텍스트 객체
        // 이 동안 BootstrapRegistry를 사용하는데 Initializer 들을 SpringFactory에서 가져오고 객체로 만들어 세팅함
        //
        //      private <T> Collection<T> getSpringFactoriesInstances(Class<T> type, Class<?>[] parameterTypes, Object... args) {
        //          ClassLoader classLoader = getClassLoader();
        //          // Use names and ensure unique to protect against duplicates
        //          Set<String> names = new LinkedHashSet<>(SpringFactoriesLoader.loadFactoryNames(type, classLoader));
        //          List<T> instances = createSpringFactoriesInstances(type, parameterTypes, classLoader, args, names);
        //          AnnotationAwareOrderComparator.sort(instances);
        //          return instances;
        //      }
        //
        //}
        this.bootstrapRegistryInitializers = new ArrayList<>(getSpringFactoriesInstances(BootstrapRegistryInitializer.class));


        //ApplicationInitializer 셋 {
        //  Bootstrap 단계에서 캐싱한 값으로 부터 찾아서 실제로 Initialize 한다.
        //}
        setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));


        //ApplicationListener 셋 {
        //   ApplicationListener들을 불러오고 listener 값을 세팅
        //   ApplictionListener는 옵저버 패턴으로 애플리케이션을 구독하는 리스터
        //}
        setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));

        // Main 추론{
        //
        //        
        //    
        // private Class<?> deduceMainApplicationClass() {
        //     try {
        //         StackTraceElement[] stackTrace = new RuntimeException().getStackTrace();
        //         for (StackTraceElement stackTraceElement : stackTrace) {
        //             if ("main".equals(stackTraceElement.getMethodName())) {
        //                 return Class.forName(stackTraceElement.getClassName());
        //             }
        //         }
        //     }
        //     catch (ClassNotFoundException ex) {
        //         // Swallow and continue
        //     }
        //     return null;
        // }
        //      
        //  의도적으로 RuntimeException을 내서 StackTrace를 가져온다. 그리고 Main이 붙어있는 메소드를 찾으면 Main이라고 판단하고 클래스 이름을 찾느다.
        //      
        //
        //}
        this.mainApplicationClass = deduceMainApplicationClass();
    }
    
    public ConfigurableApplicationContext run(String... args) {
        long startTime = System.nanoTime();
        DefaultBootstrapContext bootstrapContext = createBootstrapContext();
        ConfigurableApplicationContext context = null;
        configureHeadlessProperty();
        SpringApplicationRunListeners listeners = getRunListeners(args);
        listeners.starting(bootstrapContext, this.mainApplicationClass);
        try {
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
            ConfigurableEnvironment environment = prepareEnvironment(listeners, bootstrapContext, applicationArguments);
            configureIgnoreBeanInfo(environment);
            Banner printedBanner = printBanner(environment);
            context = createApplicationContext();
            context.setApplicationStartup(this.applicationStartup);
            prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);
            refreshContext(context);
            afterRefresh(context, applicationArguments);
            Duration timeTakenToStartup = Duration.ofNanos(System.nanoTime() - startTime);
            if (this.logStartupInfo) {
                new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), timeTakenToStartup);
            }
            listeners.started(context, timeTakenToStartup);
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

# [ConfigurableApplicationContext](13.ConfigurableApplicationContext.md)