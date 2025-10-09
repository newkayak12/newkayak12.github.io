---
layout: page
categories:
  - SPRING
---
## 1. BeanLifeCyle 전체 흐름
1. BeanDefinition 등록
2. BeanFactoryPostProcess: BeanDefinition 수정
3. Bean 인스턴스 생성
4. (의존성 주입)
5. BeanNameAware, BeanClassLoaderAware, BeanFactoryAware등 인터페이스
	1. bean 생성 직후, 의존성 주입 직후
	2. `AbstractAutowireCapableBeanFactory.invokeAwareMethods()`
6. BeanPostProcessor(postProcessBeforeInitialization)
	1. Bean 인스턴스 생성 직전/직후, 모든 Bean에 대해서 공통적으로 동작한다.
	2. postProcessBeforeInitialization(..)
	3. postProcessAfterInitialization(..)
	4. 대표 구현체
		1. AutowiredAnnotationBeanPostProcessor(의존성 주입)
		2. AnnotationAwareAspectJAutoProxyCreator(AOP 프록시 래핑)
		3. InitDestroyAnnotationBeanPostProcessor(@PostConstruct, @PreDestroy 지원)
7. `InitialzationBean.afterPropertiesSet()` or `@PostConstruct`
8. BeanPostProcessor(postProcessAfterInitailization)
9. Bean 사용
10. `DisposableBean.destroy()` or `@PreDestroy`

## 2. BeanPostProcessor
1. Bean을 DI 만으로 단순히 생성, 사용하는 것은 "공통 동작 삽입, 프록시 적용, 외부 라이브러리 주입, 커스텀 래핑" 등을 반영하지 못함
2. Bean 생성 ~ 사용 그 사이에 외부 정의 로직을 Bean에 반복적으로 적용
3. Bean 인스턴스 생성 후, Bean의 초기화 전/후 두 번의 Hook으로 공통 기능을 추가할 수 있게 됌

### 2.1. AutowiredAnnotationBeanPostProcessor
- AbstractAutowireCapableBeanFactory.createBean()
	- doCreateBean()
		- poplulateBean()
			- 내부적으로 postProcessMergedBeanDefinition(), postProcessProperties() 호출
			- 
org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor
```java
public class AutowiredAnnotationBeanPostProcessor implements SmartInstantiationAwareBeanPostProcessor, MergedBeanDefinitionPostProcessor, BeanRegistrationAotProcessor, PriorityOrdered, BeanFactoryAware {

	private final Set<String> lookupMethodsChecked = Collections.newSetFromMap(new ConcurrentHashMap(256));  
	private final Map<Class<?>, Constructor<?>[]> candidateConstructorsCache = new ConcurrentHashMap(256);


	public void postProcessMergedBeanDefinition(RootBeanDefinition beanDefinition, Class<?> beanType, String beanName) {  
	    this.findInjectionMetadata(beanName, beanType, beanDefinition);  
	    if (beanDefinition.isSingleton()) {  
	        this.candidateConstructorsCache.remove(beanType);  
	        if (!beanDefinition.hasMethodOverrides()) {  
	            this.lookupMethodsChecked.remove(beanName);  
	        }  
	    }  
	  
	}

	public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) {  
	    InjectionMetadata metadata = this.findAutowiringMetadata(beanName, bean.getClass(), pvs);  
	  
	    try {  
	    //실제 DI 실행
	        metadata.inject(bean, beanName, pvs);  
	        return pvs;  
	    } catch (BeanCreationException ex) {  
	        throw ex;  
	    } catch (Throwable ex) {  
	        throw new BeanCreationException(beanName, "Injection of autowired dependencies failed", ex);  
	    }  
	}

}

```
### 2.2 InitDestroyAnnotationBeanPostProcessor
- spring6부터 분화
- Bean의 초기화/ 소명 시점에
	- `@PostConstruct` -> 초기화 메소드 실행
	- `@PreDestroy` -> 소멸 메소드 실행
- BeanPostProcessor, DestructionAwareBeanProcessor 모두 구현
- Spring container에 자동 등록

#### 1. @PostConstruct
- AbstractAutowireCapableBeanFactory.createBean()
	- doCreateBean()
		- initializeBean()
			- applyBeanPostProcessorBeforeInitialization()
				- InitDestroyAnnotationBeanPostProcessor.postProcessBeforeInitialzation()

```java
package org.springframework.beans.factory.annotation;

public class InitDestroyAnnotationBeanPostProcessor implements DestructionAwareBeanPostProcessor, MergedBeanDefinitionPostProcessor, BeanRegistrationAotProcessor, PriorityOrdered, Serializable {
	
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {  
	    LifecycleMetadata metadata = this.findLifecycleMetadata(bean.getClass());  
	  
	    try {  
	    //reflection으로 스캔한 메소드를 순차적으로 실행
	        metadata.invokeInitMethods(bean, beanName);  
	        return bean;  
	    } catch (InvocationTargetException ex) {  
	        throw new BeanCreationException(beanName, "Invocation of init method failed", ex.getTargetException());  
	    } catch (Throwable ex) {  
	        throw new BeanCreationException(beanName, "Failed to invoke init method", ex);  
	    }  
	}
}
```

#### 2. @PreDestroy
- AbstractApplicationContext.close()
	- doClose()
		- destroyBeans()
			- DisposableBeanAdapter.destroy()
				- InitDestroyAnnotationBeanPostProcessor.postProcessBeforeDestruction()

```java

public class InitDestroyAnnotationBeanPostProcessor implements DestructionAwareBeanPostProcessor, MergedBeanDefinitionPostProcessor, BeanRegistrationAotProcessor, PriorityOrdered, Serializable {
	
	public void postProcessBeforeDestruction(Object bean, String beanName) throws BeansException {  
	    LifecycleMetadata metadata = this.findLifecycleMetadata(bean.getClass());  
	    //reflection으로 파싱
	  
	    try {  
	        metadata.invokeDestroyMethods(bean, beanName);  
	        //순차적으로 실행
	    } catch (InvocationTargetException ex) {  
	        String msg = "Destroy method on bean with name '" + beanName + "' threw an exception";  
	        if (this.logger.isDebugEnabled()) {  
	            this.logger.warn(msg, ex.getTargetException());  
	        } else if (this.logger.isWarnEnabled()) {  
	            this.logger.warn(msg + ": " + ex.getTargetException());  
	        }  
	    } catch (Throwable ex) {  
	        if (this.logger.isWarnEnabled()) {  
	            this.logger.warn("Failed to invoke destroy method on bean with name '" + beanName + "'", ex);  
	        }  
	    }  
	  
	}

}
```

## 3. AnnotationAwareAspectJAutoProxyCreator
- AOP 적용 대상 Bean을 자동으로 Proxy로 래핑
- `@Aspect`, `@Transactional`, `@Async`, `@Cacheable` 등 annotation 기반 기능의 핵심 진입점
- BeanPostProcessor, SmartInstantiationAwareBeanPostProcessor 구현체
```text
상속 계층

ProxyProcessorSupport
		⬆️
AbstractAUtoProxyCreator
		⬆️
AbstractAdvisorAutoProxyCreator
		⬆️
AspectJAwareAdvisorAutoProxyCreator
		⬆️
AnnotationAwareAspectJAutoProxyCreator
```
- AbstractAutowireCapableBeanFactory.createBean()
	- doCreateBean()
		- initializeBean()
			- applyBeanPostProcessorAfterInitialization()
			- AnnotationAwareAspectJAutoProxyCreator.postProcessAfterInitialization()



```java
public abstract class AbstractAutoProxyCreator extends ProxyProcessorSupport implements SmartInstantiationAwareBeanPostProcessor, BeanFactoryAware {

	@Nullable  
	public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {  
	    if (bean != null) {  
	        Object cacheKey = this.getCacheKey(bean.getClass(), beanName);  
	        if (this.earlyBeanReferences.remove(cacheKey) != bean) {  
	            return this.wrapIfNecessary(bean, beanName, cacheKey);  
	        }  
	    }  
	  
	    return bean;  
	}
	
	
	protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {  
	    if (StringUtils.hasLength(beanName) && this.targetSourcedBeans.contains(beanName)) {  
	        return bean;  
	    }
	    // Pooling, ScopedProxy로 관리되면 생략
	    
		 else if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {  
	        return bean;  
	    }
	   //프록시가 아닌 Bean이면 return
	   
	     else if (!this.isInfrastructureClass(bean.getClass()) && !this.shouldSkip(bean.getClass(), beanName)) {  
	        Object[] specificInterceptors = this.getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, (TargetSource)null);  
	        //Advisor/Interceptor가 적용될 대상인가
	        //@Transactional?  @Async?
	        
	        if (specificInterceptors != DO_NOT_PROXY) {  
	        //프록시 대상이라면 
	            this.advisedBeans.put(cacheKey, Boolean.TRUE);  
	            //캐시에 프록시 대상으로 마킹
	        
	            Object proxy = this.createProxy(bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
			//프록시 생성( JDK Proxy or GCLIB Proxy) -> Advisor/Interceptor 체인 내장
				  
	            this.proxyTypes.put(cacheKey, proxy.getClass());  
	            //프록시 타입을 별도 캐시에 저장
	            
	            return proxy;  
	            //프록시 객체 리턴
	        }
	    //InfraBean이 아니고 프록시 적용 검토 필요하다면 
				
	         else {  
	            this.advisedBeans.put(cacheKey, Boolean.FALSE);  
	            return bean;
	            //원본 반환  
	        }  
	        //Advisor가 없으면 프록시 아님으로 캐시
	
	    }
	    
		 else {  
	        this.advisedBeans.put(cacheKey, Boolean.FALSE);  
	        //infraBean, 프록시 제외 대상 -> 프록시 아님
	        return bean;  
	        //원본 반환
	    }  
	}

}

```
