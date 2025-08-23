---
layout: post
categories: [SPRING]
---



from [Dictionary - Bean](https://github.com/newkayak12/Dictionary/blob/master/spring/08.Autowired.md)





# AbstractAutowireCapableBeanFactory
기본 빈 생성을 구현하는 추상 BeanFactory 상위 클래스. `RootBeanDefinition` 클래스에서 지정한 모든 기능을 사용할 수 있다.
`AutowireCapableBeanFactory` 인터페이스를 구현하며 빈 생성을 담당하는 createBean 메소드가 있다. 

Autowire 및 초기화를 제공하는 추상 beanFactory `@Autowire` 시 의존관계 주입이 필요한 Bean에 `@Autowire` 처리를 한다. 

# AutowiredAnnotationBeanPostProcessor
BeanPostProcessor를 상속 받고 있다. 내부 inject 메소드로 객체를 주입한다. 
[ReflectionUtils](https://newkayak12.github.io/java/2024/05/23/07.Utils.md)를 내부에서 사용하고 있다.