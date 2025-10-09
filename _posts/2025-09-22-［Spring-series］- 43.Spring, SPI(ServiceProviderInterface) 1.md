---
layout: page
categories:
  - SPRING
---
## 1. SPI(ServiceProviderInterface)란?
- 스프링 프레임워크 자체의 확장/ 커스터마이징을 허용하는 인터페이스
- 프레임워크 내부 동작에 개발자가 직접 Hook을 끼워 넣을 수 있는 규약

## 2. 주요 SPI 확장 목록
### 1. BeanFactoryPostProcessor
- BeanDefinition이 등록된 후, 인스턴스 생성 전에 호출
- BeanDefinition을 직접 수정/ 추가/ 삭제할 수 있는 기회가 주어진다.
- 구현체
	- ConfigurationClassPostProcessor
	- PropertySourcePlaceholderConfigurer
	- CustomEditionConfigurer

### 2. BeanPostProcessor
- AutowiredAnnotationBeanPostProcessor:
	- Bean 인스턴스 생성 후 DI annotation 분석, 주입
- initDestroyAnnotationBeanPostProcessor:
	- @PostConstruct, @PreDestory 등 life-cycle annotation 처리
- AnnotationAwareAspectJAutoProxyCreator: 
	- AOP Advisor/Adivce/Pointcut 정보 분석
	- Proxy가 필요하면 getBean() 시점 래핑
### 3. FactoryBean
	- 
## 3. Spring의 확장성
- Spring이 OCP를 유지하면서 진화/ 확장 가능한 근본 원리