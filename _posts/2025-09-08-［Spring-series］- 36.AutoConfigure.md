---
layout: page
categories:
  - SPRING
---


## AutoConfigure?
- 애플리케이션이 필요한 설정을 자동으로 적용해주는 기능
- 아니, 따로 설정을 하지 않으면 미리 구성되어 있는 설정을 적용한다고 보는게 맞을 것이다.
- `@EnableAutoConfigure`과 `META-INF/spring.factories` 파일을 바탕으로 동작한다.
- 커스텀 dependency도 `META-INF/spring.factories`에 등록하여 auto-configure를 받을 수 있다.

```kotlin

@Target({ElementType.TYPE})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
@Inherited  
@SpringBootConfiguration  
@EnableAutoConfiguration   // <- 여기 AutoConfiguration을 enable
@ComponentScan(  
    excludeFilters = {@Filter(  
    type = FilterType.CUSTOM,  
    classes = {TypeExcludeFilter.class}  
), @Filter(  
    type = FilterType.CUSTOM,  
    classes = {AutoConfigurationExcludeFilter.class}  
)}  
)  
public @interface SpringBootApplication 
```
<div> > SpringBootApplication</div>

```kotlin
@Target({ElementType.TYPE})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
@Inherited  
@AutoConfigurationPackage  
@Import({AutoConfigurationImportSelector.class})  // <- 자동 구성할 bean을 불러온다.
public @interface EnableAutoConfiguration 
```
<div> > SpringBootApplication</div>

```kotlin
package org.springframework.boot.autoconfigure;  
  
  
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {  
    static final int ORDER = 2147483646;

	private ConfigurationClassFilter getConfigurationClassFilter() {  
	    ConfigurationClassFilter configurationClassFilter = this.configurationClassFilter;  
	    if (configurationClassFilter == null) {  
	        List<AutoConfigurationImportFilter> filters = this.getAutoConfigurationImportFilters();  
	        Iterator var3 = filters.iterator();  
	  
	        while(var3.hasNext()) {  
	            AutoConfigurationImportFilter filter = (AutoConfigurationImportFilter)var3.next();  
	            this.invokeAwareMethods(filter);  
	        }  
	  
	        configurationClassFilter = new ConfigurationClassFilter(this.beanClassLoader, filters);  
	        this.configurationClassFilter = configurationClassFilter;  
	    }  
	  
	    return configurationClassFilter;  
	}

	protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {  
	    if (!this.isEnabled(annotationMetadata)) {  
	        return EMPTY_ENTRY;  
	    } else {  
	        AnnotationAttributes attributes = this.getAttributes(annotationMetadata);  
	        List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);  
	        configurations = this.removeDuplicates(configurations);  
	        Set<String> exclusions = this.getExclusions(annotationMetadata, attributes);  
	        this.checkExcludedClasses(configurations, exclusions);  
	        configurations.removeAll(exclusions);  
	        configurations = this.getConfigurationClassFilter().filter(configurations);  
	        //여기서 필터링을 진행한다.
	        this.fireAutoConfigurationImportEvents(configurations, exclusions);  
	        return new AutoConfigurationEntry(configurations, exclusions);  
	    }  
	}
	protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {  
	    ImportCandidates importCandidates = ImportCandidates.load(this.autoConfigurationAnnotation, this.getBeanClassLoader());  
	    List<String> configurations = importCandidates.getCandidates();  
	    Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring/" + this.autoConfigurationAnnotation.getName() + ".imports. If you are using a custom packaging, make sure that file is correct.");  
	    return configurations;  
	}
}


///////// 여기서 불러온다.
public final class ImportCandidates implements Iterable<String> {  
    private static final String LOCATION = "META-INF/spring/%s.imports";  
    private static final String COMMENT_START = "#";  
    private final List<String> candidates;  
  
    public static ImportCandidates load(Class<?> annotation, ClassLoader classLoader) {  
        Assert.notNull(annotation, "'annotation' must not be null");  
        ClassLoader classLoaderToUse = decideClassloader(classLoader);  
        String location = String.format("META-INF/spring/%s.imports", annotation.getName());  
        Enumeration<URL> urls = findUrlsInClasspath(classLoaderToUse, location);  
        List<String> importCandidates = new ArrayList();  
  
        while(urls.hasMoreElements()) {  
            URL url = (URL)urls.nextElement();  
            importCandidates.addAll(readCandidateConfigurations(url));  
        }  
  
        return new ImportCandidates(importCandidates);  
    }
}
```
<div> > AutoConfigurationImportSelector, ImportCandidates</div>
```factories
# ApplicationContext Initializers  
org.springframework.context.ApplicationContextInitializer=\  
org.springframework.boot.autoconfigure.SharedMetadataReaderFactoryContextInitializer,\  
org.springframework.boot.autoconfigure.logging.ConditionEvaluationReportLoggingListener  
  
# Application Listeners  
org.springframework.context.ApplicationListener=\  
org.springframework.boot.autoconfigure.BackgroundPreinitializer  
  
# Environment Post Processors  
org.springframework.boot.env.EnvironmentPostProcessor=\  
org.springframework.boot.autoconfigure.integration.IntegrationPropertiesEnvironmentPostProcessor  
  
# Auto Configuration Import Listeners  
org.springframework.boot.autoconfigure.AutoConfigurationImportListener=\  
org.springframework.boot.autoconfigure.condition.ConditionEvaluationReportAutoConfigurationImportListener  
  
# Auto Configuration Import Filters  
org.springframework.boot.autoconfigure.AutoConfigurationImportFilter=\  
org.springframework.boot.autoconfigure.condition.OnBeanCondition,\  
org.springframework.boot.autoconfigure.condition.OnClassCondition,\  
org.springframework.boot.autoconfigure.condition.OnWebApplicationCondition  
  
# Failure Analyzers  
org.springframework.boot.diagnostics.FailureAnalyzer=\  
org.springframework.boot.autoconfigure.data.redis.RedisUrlSyntaxFailureAnalyzer,\  
org.springframework.boot.autoconfigure.diagnostics.analyzer.NoSuchBeanDefinitionFailureAnalyzer,\  
org.springframework.boot.autoconfigure.jdbc.DataSourceBeanCreationFailureAnalyzer,\  
org.springframework.boot.autoconfigure.jdbc.HikariDriverConfigurationFailureAnalyzer,\  
org.springframework.boot.autoconfigure.jooq.NoDslContextBeanFailureAnalyzer,\  
org.springframework.boot.autoconfigure.r2dbc.ConnectionFactoryBeanCreationFailureAnalyzer,\  
org.springframework.boot.autoconfigure.r2dbc.MissingR2dbcPoolDependencyFailureAnalyzer,\  
org.springframework.boot.autoconfigure.r2dbc.MultipleConnectionPoolConfigurationsFailureAnalyzer,\  
org.springframework.boot.autoconfigure.r2dbc.NoConnectionFactoryBeanFailureAnalyzer,\  
org.springframework.boot.autoconfigure.ssl.BundleContentNotWatchableFailureAnalyzer  
  
# Template Availability Providers  
org.springframework.boot.autoconfigure.template.TemplateAvailabilityProvider=\  
org.springframework.boot.autoconfigure.freemarker.FreeMarkerTemplateAvailabilityProvider,\  
org.springframework.boot.autoconfigure.groovy.template.GroovyTemplateAvailabilityProvider,\  
org.springframework.boot.autoconfigure.mustache.MustacheTemplateAvailabilityProvider,\  
org.springframework.boot.autoconfigure.thymeleaf.ThymeleafTemplateAvailabilityProvider,\  
org.springframework.boot.autoconfigure.web.servlet.JspTemplateAvailabilityProvider  
  
# DataSource Initializer Detectors  
org.springframework.boot.sql.init.dependency.DatabaseInitializerDetector=\  
org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializerDatabaseInitializerDetector  
  
# Depends on Database Initialization Detectors  
org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitializationDetector=\  
org.springframework.boot.autoconfigure.batch.JobRepositoryDependsOnDatabaseInitializationDetector,\  
org.springframework.boot.autoconfigure.quartz.SchedulerDependsOnDatabaseInitializationDetector,\  
org.springframework.boot.autoconfigure.session.JdbcIndexedSessionRepositoryDependsOnDatabaseInitializationDetector
```
<div> > spring-autoconfigure:/META-INF/spring.factories </div>


- 특히 아래의 항목은 불러와서 `ConfigurationClassFilter`를 반환한다.
```factory
  
  org.springframework.boot.autoconfigure.AutoConfigurationImportFilter=\   
  org.springframework.boot.autoconfigure.condition.OnBeanCondition,\   
  org.springframework.boot.autoconfigure.condition.OnClassCondition,\   
  org.springframework.boot.autoconfigure.condition.OnWebApplicationCondition
```

- 이는 순서대로 `OnClassCondition`
```java
  
@Order(Integer.MIN_VALUE)  
class OnClassCondition extends FilteringSpringBootCondition {  
    OnClassCondition() {  }

	public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {  
	    ClassLoader classLoader = context.getClassLoader();  
	    ConditionMessage matchMessage = ConditionMessage.empty();  
	    List<String> onClasses = this.getCandidates(metadata, ConditionalOnClass.class);  
	    List onMissingClasses;  
	    if (onClasses != null) {  
	        onMissingClasses = this.filter(onClasses, ClassNameFilter.MISSING, classLoader);  
	        if (!onMissingClasses.isEmpty()) {  
	            return ConditionOutcome.noMatch(ConditionMessage.forCondition(ConditionalOnClass.class, new Object[0]).didNotFind("required class", "required classes").items(Style.QUOTE, onMissingClasses));  
	        }  
	  
	        matchMessage = matchMessage.andCondition(ConditionalOnClass.class, new Object[0]).found("required class", "required classes").items(Style.QUOTE, this.filter(onClasses, ClassNameFilter.PRESENT, classLoader));  
	    }  
	  
	    onMissingClasses = this.getCandidates(metadata, ConditionalOnMissingClass.class);  
	    if (onMissingClasses != null) {  
	        List<String> present = this.filter(onMissingClasses, ClassNameFilter.PRESENT, classLoader);  
	        if (!present.isEmpty()) {  
	            return ConditionOutcome.noMatch(ConditionMessage.forCondition(ConditionalOnMissingClass.class, new Object[0]).found("unwanted class", "unwanted classes").items(Style.QUOTE, present));  
	        }  
	  
	        matchMessage = matchMessage.andCondition(ConditionalOnMissingClass.class, new Object[0]).didNotFind("unwanted class", "unwanted classes").items(Style.QUOTE, this.filter(onMissingClasses, ClassNameFilter.MISSING, classLoader));  
	    }  
	  
	    return ConditionOutcome.match(matchMessage);  
	}
}
```
- `OnBeanCondition` 
```java
@Order(Integer.MAX_VALUE)  
class OnBeanCondition extends FilteringSpringBootCondition implements ConfigurationCondition {  
    OnBeanCondition() {     }

	public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {  
	    ConditionOutcome matchOutcome = ConditionOutcome.match();  
	    MergedAnnotations annotations = metadata.getAnnotations();  
	    Spec spec;  
	    if (annotations.isPresent(ConditionalOnBean.class)) {  
	        spec = new Spec(context, metadata, annotations, ConditionalOnBean.class);  
	        matchOutcome = this.evaluateConditionalOnBean(spec, matchOutcome.getConditionMessage());  
	        if (!matchOutcome.isMatch()) {  
	            return matchOutcome;  
	        }  
	    }  
	  
	    if (metadata.isAnnotated(ConditionalOnSingleCandidate.class.getName())) {  
	        Spec<ConditionalOnSingleCandidate> spec = new SingleCandidateSpec(context, metadata, metadata.getAnnotations());  
	        matchOutcome = this.evaluateConditionalOnSingleCandidate(spec, matchOutcome.getConditionMessage());  
	        if (!matchOutcome.isMatch()) {  
	            return matchOutcome;  
	        }  
	    }  
	  
	    if (metadata.isAnnotated(ConditionalOnMissingBean.class.getName())) {  
	        spec = new Spec(context, metadata, annotations, ConditionalOnMissingBean.class);  
	        matchOutcome = this.evaluateConditionalOnMissingBean(spec, matchOutcome.getConditionMessage());  
	        if (!matchOutcome.isMatch()) {  
	            return matchOutcome;  
	        }  
	    }  
	  
	    return matchOutcome;  
	}
}
```

- `OnWebApplicationCondition`
```java
@Order(-2147483628)  
class OnWebApplicationCondition extends FilteringSpringBootCondition {  
    private static final String SERVLET_WEB_APPLICATION_CLASS = "org.springframework.web.context.support.GenericWebApplicationContext";  
    private static final String REACTIVE_WEB_APPLICATION_CLASS = "org.springframework.web.reactive.HandlerResult";  
  
    OnWebApplicationCondition() {  
    }
	public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {  
	    boolean required = metadata.isAnnotated(ConditionalOnWebApplication.class.getName());  
	    ConditionOutcome outcome = this.isWebApplication(context, metadata, required);  
	    if (required && !outcome.isMatch()) {  
	        return ConditionOutcome.noMatch(outcome.getConditionMessage());  
	    } else {  
	        return !required && outcome.isMatch() ? ConditionOutcome.noMatch(outcome.getConditionMessage()) : ConditionOutcome.match(outcome.getConditionMessage());  
	    }  
	}
}
```

- 위와 같이 반환하며 순서대로 아래와 같이 리턴한다.
	- OnBeanCondition
		- `@ConditionalOnBean` : 해당 Bean이 존재하면 진행
		- `@ConditionalOnMissingBean` : 해당 Bean이 존재하지 않으면 진행
		- `@ConditionalOnSingleCandidate` : 해당 타입의 Bean이 단 하나라면 진행
	- OnClassCondition
		- `@ConditionalOnClass` : 해당 Class가 존재하면 진행
		- `@ConditionalOnMissingClass` : 해당 Class가 존재하지 않으면 진행
	- OnWebApplicationCondition
		- `@ConditionalOnWebApplication` : WebApplication이면 진행
		- `@ConditionalOnNotWebApplication` : WebApplication이 아니면 진행

- 추가로 JPA의 예시를 보면 아래와 같이 명시되어 있다.
```java
  
@AutoConfiguration(  
    after = {HibernateJpaAutoConfiguration.class, TaskExecutionAutoConfiguration.class}  
)  
@ConditionalOnBean({DataSource.class})  
@ConditionalOnClass({JpaRepository.class})  
@ConditionalOnMissingBean({JpaRepositoryFactoryBean.class, JpaRepositoryConfigExtension.class})  
@ConditionalOnProperty(  
    prefix = "spring.data.jpa.repositories",  
    name = {"enabled"},  
    havingValue = "true",  
    matchIfMissing = true  
)  
@Import({JpaRepositoriesImportSelector.class})  
public class JpaRepositoriesAutoConfiguration {  
    public JpaRepositoriesAutoConfiguration() {  
    }
}
```
- 이를 자동구성으로 포함하는 것은 `spring-data-jpa:META-INF/spring.factories`
```text

org.springframework.data.repository.core.support.RepositoryFactorySupport=org.springframework.data.jpa.repository.support.JpaRepositoryFactory  
org.springframework.data.util.ProxyUtils$ProxyDetector=org.springframework.data.jpa.util.HibernateProxyDetector
```
