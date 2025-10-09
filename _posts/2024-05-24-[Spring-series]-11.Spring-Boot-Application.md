---
layout: post
categories: [SPRING]
---



from [Dictionary - SpringBootApplication](https://github.com/newkayak12/Dictionary/blob/master/spring/11.SpringBootApplication.md)




# @SpringBootApplication

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {

    @AliasFor(annotation = EnableAutoConfiguration.class)
    Class<?>[] exclude() default {};
    //AutoConfigure 제외 대상

    @AliasFor(annotation = EnableAutoConfiguration.class)
    String[] excludeName() default {};
    //AutoConfigure 제외 대상 (클래스 명)

    @AliasFor(annotation = ComponentScan.class, attribute = "basePackages")
    String[] scanBasePackages() default {};
    //ComponentScan Packages

    @AliasFor(annotation = ComponentScan.class, attribute = "basePackageClasses")
    Class<?>[] scanBasePackageClasses() default {};
    //ComponentScan classes

    @AliasFor(annotation = ComponentScan.class, attribute = "nameGenerator")
    Class<? extends BeanNameGenerator> nameGenerator() default BeanNameGenerator.class;
    //BeanNaming 담당 클래스

    @AliasFor(annotation = Configuration.class)
    boolean proxyBeanMethods() default true;
    //@Bean을 프록시로 처리하도록 설정
    //프록시가 필요한 이유는 해당 메소드를 직접 호출하는 경우에도
    //항상 싱글톤 스코프를 강제해서 1개의 객체만 생성하기 위함
}
```

1. @SpringBootConfiguration
`@Configuration`을 담은 Annotation
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
@Indexed
public @interface SpringBootConfiguration {

    @AliasFor(annotation = Configuration.class)
    boolean proxyBeanMethods() default true;

}
```

2. @EnableAutoConfiguration
필요한 Spring auto configuration을 활성화하는 어노테이션 
자동 설정할 클래스 선별은 `AutoConfigurationImportSelector`가 처리한다. 
`@Import`를 통해서 진행한다. 
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {

    String ENABLED_OVERRIDE_PROPERTY= "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```
autoConfigure 가능 대상은 spring.factories에 있다.(spring-boot-autoconfigure)

auto-configuration 클래스는 아래의 어노테이션을 자주 사용한다. 
- @ConditionalOnClass: 해당 클래스가 클래스 패스에 존재하는 경우
- @ConditionlOnBean: 해당 클래스나 이름이 빈 팩토리에 포함되어 있는 경우
- @ConditionalOnMissingBean: 해당 빈이 등록되어있지 않은 경우 -> bean이 없을 경우만 올라가게 할 수 있다. 


3. @ComponentScan
빈을 등록하기 위한 어노테이션을 탐색하는 basePackage를 지정한다. 
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Repeatable(ComponentScans.class)
public @interface ComponentScan {

    @AliasFor("basePackages")
    String[] value() default {};

    @AliasFor("value")
    String[] basePackages() default {};

    Class<?>[] basePackageClasses() default {};

    Class<? extends BeanNameGenerator> nameGenerator() default BeanNameGenerator.class;

    Class<? extends ScopeMetadataResolver> scopeResolver() default AnnotationScopeMetadataResolver.class;

    ScopedProxyMode scopedProxy() default ScopedProxyMode.DEFAULT;

    String resourcePattern() default ClassPathScanningCandidateComponentProvider.DEFAULT_RESOURCE_PATTERN;

    boolean useDefaultFilters() default true;

    Filter[] includeFilters() default {};

    Filter[] excludeFilters() default {};

    boolean lazyInit() default false;

    @Retention(RetentionPolicy.RUNTIME)
    @Target({})
    @interface Filter {

        FilterType type() default FilterType.ANNOTATION;

        @AliasFor("classes")
        Class<?>[] value() default {};

        @AliasFor("value")
        Class<?>[] classes() default {};

        String[] pattern() default {};
    }
}
```