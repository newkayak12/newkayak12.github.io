---
layout: post
categories: [SPRING]
---



from [Dictionary - Application Context](https://github.com/newkayak12/Dictionary/blob/master/spring/09.ApplicationContext.md)




# ApplicationContext
빈들의 생성과 의존성 주입 등의 역할을 하는 일종의 DI 컨테이너(애플리케이션을 실행하기 위한 황경)

`ListableBeanFactory`, `HierarchicalBeanFactory`, `MessageSource`, `ApplicationEventPublisher`, `ResourcePatternResolver` 를 상속 받음

## StaticApplicationContext
빈 설정 메타 정보를 담은 `BeanDefinition`을 직접 만들고, 코드를 통해 IOC 등록하기 위해 사용되는 구현체이다. 

## GenericApplicationContext
XML 등의 외부에 있는 빈 설정 메타 정보를 `BeanDefinitionReader`로 읽어서 BeanDefinition을 정의하기 위해서 사용한다.
`BeanDefinitionReader` 구현체로는 `XmlBeanDefinitionReader`, `PropertiesBeanDefinitionReader` 등이 있다.

> `AbstractApplicationContext`를 상속받고 `BeanDefinitionRegistry`를 구현했다. 
> 내부에는 `DefaultListableBeanFactory`를 필드로 갖고 있다. 

## GenericXMLApplicationContext
XML 파일로 설정을 만들고 컨텍스트에서 XML 을 읽어서 사용하는 코드를 만들 때 사용한다.

## WebApplicationContext

## AnnotationConfigApplicationContext
-> 일반 애플리케이션
## AnnotationConfigServletWebServerApplicationContext
-> 서블릿 기반 웹 (Tomcat)
## AnnotationConfigReactiveWebServerApplicationContext
-> 리액터 Netty

## ConfigurableApplicationContext
거의 모든 애플리케이션 컨텍스트가 갖는 공통 애플리케이션 컨텍스트 인터페이스다. 
`ApplicationContext`, `LifeCycle`, `Closable`를 상속받는다.