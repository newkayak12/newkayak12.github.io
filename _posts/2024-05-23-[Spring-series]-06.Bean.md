---
layout: post
categories: [SPRING]
---



from [Dictionary - Bean](https://github.com/newkayak12/Dictionary/blob/master/spring/06.Bean.md)


# Bean

## ~Aware
콜백, 리스너, 옵저버 디자인 패넡이 혼합되어 있다.

## BeanNameAware
- 객체가 컨테이너에 정의된 빈 이름을 인식하게 한다. 
- 빈을 생성하는 시점에 `setBeanName`으로 이름을 얻어올 수 있다. (`@Bean(name="")`)

## BeanFactoryAware
- BeanFactory 객체를 주입하는데 사용된다.
- `setBeanFactory`를 통해서 beanFactory를 주입받을 수 있다.

## BeanFactory
- 빈을 생성하고 의존관계를 설정하는 기능을 담당하는 IOC 컨테이너
- 스프링 빈을 관리하고 조회하는 역할을 담당
- `getBean()`을 제공
- Lazy-loading 을 사용

## BeanDefinition
- 스프링 컨테이너는 `BeanDefinition`을 기반으로 Bean을 생성한다. 
- 상세
  1. BeanClassName: 생성할 빈의 클래스 명
  2. factoryBeanName: 팩토리 빈을 사용할 경우
  3. factoryMethodName: 빈을 생성할 때 팩토리 메소드 이름
  4. Scope: 싱글톤이 기본 값이다.
  5. lazyInit: 스프링 컨테이너 생성시 Bean을 주입하는 것이 아니라 Proxy로 지연시켜서 생성할지 여부
  6. initMethodName: 빈을 생성하고 의존 관계를 적용하고, 호출되는 초기화 메소드 명
  7. DestroyMethodName: 빈의 생명 주기가 끝나고 제거되기 직전에 호출되는 메소드 명
  8. Constructor arguments, Properties: 의존 관계 주입에서 사용

## AttributeAccessorSupport
모든 메소드의 기본 구현을 제공, 서브클래싱으로 확장됨

## BeanMetadataAttributeAccessor
`AttributeAccessorSupport` 확장. 빈 메타 데이터를 정의로 담고 있다.  

## AbstractBeanDefinition
BeanDefinition의 추상 클래스  
GenericBeanDefinition, RootBeanDefinition, ChildBeanDefinition의 뼈

## RootBeanDefinition
Spring Beanfactory의 특정 bean을 뒷받침 

## GenericBeanDefinition
BeanDefinition 기본 형태라고 생각하면 된다. 클래스, Optional한 생성자 파라미터, 프로퍼티 값을 사요앟ㄹ 수 있다. 


## Bean Scope
- Singleton : 싱글톤
- Proto : 매번 다른 인스턴스 생성
- Request : 웹 요청이 들어오고 나갈 때까지 유지
- Session : 웹 세션이 생성되고 종료될 때까지
- Application : 서블릿 컨텍스트와 같은 범위로 유지


## Life cycle

1. BeanNameAware
2. BeanClassLoaderAware
3. BeanFactoryAware
4. EnvironmentAware
5. EmbeddedValueResolverAware
6. ResourceLoaderAware
7. MessageSourceAware
8. ApplicationContextAware
9. ServletContextAware
10. postProcessBeforeInitialization
11. Initializing Bean(afterPropertiesSet)
12. initMethod
13. postProcessAfterInitialization

## BeanFactoryPostProcessor
beanDefinition을 커스터마이징하게 도와준다. 모든 definition들이 로드 된 후 스프링의 startup 프로세스에 의해서 호출된다. 
그러나 아무런 Bean이 초기화된 상태는 아니다.

```java
public class ConfigBeanFactory implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {


        ((DefaultListableBeanFactory)beanFactory).registerBeanDefinition("myBeanName", gbd);


    }
}
```

## BeanPostProcessor
Bean을 정의하고 컨테이너에 등록하기 전에 후처리 할 수 있도록 지원한다.
```java
public interface BeanPostProcessor {

  @Nullable
  default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
    //생성 후 초기화 작업 이전
    return bean;
  }

  @Nullable
  default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
    //생성 후 초기화 작업 이후
    return bean;
  }
}
```