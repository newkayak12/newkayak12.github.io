---
layout: post
categories: [SPRING]
---



from [Dictionary - Refresh Context](https://github.com/newkayak12/Dictionary/blob/master/spring/14.RefreshContext.md)




# Refresh Context

```java
class SpringApplication {
    private void refreshContext(ConfigurableApplicationContext context) {
        if (this.registerShutdownHook) {
            shutdownHook.registerApplicationContext(context);
        }
        refresh(context);
    }
    protected void refresh(ConfigurableApplicationContext applicationContext) {
        applicationContext.refresh();
    }
}
class SpringApplicationShutdownHook {
    void registerApplicationContext(ConfigurableApplicationContext context) {
        addRuntimeShutdownHookIfNecessary();
        synchronized (SpringApplicationShutdownHook.class) {
            assertNotInProgress();
            context.addApplicationListener(this.contextCloseListener);
            this.contexts.add(context);
        }
    }
}

interface ConfigurableApplicationContext {
    void refresh() throws BeansException, IllegalStateException;
}
```

1. Shutdown Hook 등록 
-> Shutdown 후 후처리 작업에 대해서 명시 (연결 종료, 자원 반납, `@PreDestroy`, Bean의 `DestroyMethod`를 실행)

2. refresh 실행
ServletWebServerApplicationContext 기준으로
```java
@Override
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");

        // 1. refresh 준비 단계 
        // applicationContext 상태를 active로 변경 (BeanFactory에서 bean을 꺼내기 위한 필수 작업)
        prepareRefresh();

        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
        // 2. BeanFactory 준비 단계 (BeanFactory 동작 전에 필요한 작업 수행)
        prepareBeanFactory(beanFactory);
        
        // 클래스 로더를 세팅하고 
        // spEL Resolver
        // PropertyEditory를 빈으로 추가한다. 
        // 의존성 주입을 무시할 인터페이스(~Aware)를 등록하고
        // BeanFactory와 ApplicationContext 같은 특별한 타입들을 빈으로 등록

        try {
            // 3. BeanFactory의 후처리 진행
            // beanFactory 후처리한다.
            postProcessBeanFactory(beanFactory);

            StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");
            
            // 4. BeanFactoryPostProcessor 실행
            // BeanFactory 후처리와는 엄연히 다르다.
            // 빈을 탐색하거나 빈 팩토리가 준비된 후에 해야하는 후처리기들을 실행한다.
            // 예를 들어 싱글톤 객체로 인스턴스화할 빈을 탐색하는 작업
            // 
            // 정리하면 BeanFactory를 준비하고 빈을 인스턴스화 하기 전의 중간 단계로
            // 빈 목록을 불러오고, 빈의 메타 정보를 조작하기 위한
            // BeanFactoryPostProcessor를 객체로 만들어 실행 
            invokeBeanFactoryPostProcessors(beanFactory);

            // 5. BeanPostProcessor 등록
            // 빈 생성되고 나서 빈의 내용이나 빈 자체를 변경하기 위한 빈 후처리기인
            // BeanPostProcessor를 등록
            // @Value, @PostConstruct, @Autowired 등이 BeanPostProcessor에 의해 처리되며 이를 위한 BeanPostProcessor 구현체들이 등록된다.
            registerBeanPostProcessors(beanFactory);
            beanPostProcess.end();

            // 6. MessageSource 및 Event Multicaster 초기화
            // 다국어 처리를 위한 MessageSource와 ApplicationListener에 event를 publish 하기 위한 EventMulticaster를 초기화
            initMessageSource();
            initApplicationEventMulticaster();

            // 7. onRefresh
            // TemplateMethod 패턴으로 필요한 내장 웹서버를 실행
            // ApplicationConfigServletWebServerApplicationContext -> Tomcat
            // ApplicationConfigReactiveWebServerApplicationContext -> ReactorNetty
            onRefresh();

            // 8. ApplicationListener 조회 및 등 록
            // ApplicationListener의 구현체들을 찾아서 EventMultiCaster에 등록해주고 있다.
            registerListeners();

            // 9. 빈들의 인스턴스화 및 후처리
            // BeanDefinition기준으로 객체 생성 
            // BeanPostProcessor를 적용해  @Value, @PostConstruct, @Autowired 등을 처리해주고 객체의 생성을 마무리
            finishBeanFactoryInitialization(beanFactory);

            // 10. refresh 마무리 단계
            // 웹서버 실행
            finishRefresh();
        }

        catch (BeansException ex) {
            if (logger.isWarnEnabled()) {
                logger.warn("Exception encountered during context initialization - " +
                    "cancelling refresh attempt: " + ex);
            }

            // Destroy already created singletons to avoid dangling resources.
            destroyBeans();

            // Reset 'active' flag.
            cancelRefresh(ex);

            // Propagate exception to caller.
            throw ex;
        }
        finally {
            // Reset common introspection caches in Spring's core, since we
            // might not ever need metadata for singleton beans anymore...
            resetCommonCaches();
            contextRefresh.end();
        }
    }
}
```