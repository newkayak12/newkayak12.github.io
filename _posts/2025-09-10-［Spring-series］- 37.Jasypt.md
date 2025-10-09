---
layout: page
categories:
  - SPRING
---


# Jasypt?
- Java Simplified Encryption의 약자이다.

> Jasypt is a java library which allows the developer to add basic encryption capabilities to his/her projects with minimum effort, and without the need of having deep knowledge on how cryptography works
>
>[출처: Japsypt 공식 홈페이지](http://www.jasypt.org/index.html)

- 프로젝트에 민감한 정보를 직접적으로 노출시키지 않는 방법 중 하나

# 의존성

```kotlin
implementation("com.github.ulisesbocchio:jasypt-spring-boot-starter:3.0.5")
```

- 위 의존성은 `jasypt-spring-boot-starter` -> `jaspt-spring-boot` -> `jasypt` 의 의존성을 갖는다.

# 사용
- 기본적으로 auto-configure 설정이 되어 있다.
```factory
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.ulisesbocchio.jasyptspringbootstarter.JasyptSpringBootAutoConfiguration  
  
org.springframework.cloud.bootstrap.BootstrapConfiguration=com.ulisesbocchio.jasyptspringbootstarter.JasyptSpringCloudBootstrapConfiguration
```
com.github.ulisesbocchio:jaspyt-spring-boot-starter/META-INF/spring.factories

- `@JasyptSpringBootAutoConfiguration`를 선언으로 명시적으로 선언할 수 있다.
- 덧붙여서 String에 대해서 Encrypt할 경우 `StringEncryptor`를 선언하면 설정한 StringEncryptor를 바탕으로 encrypt, decrypt를 진행한다.
- .yaml, .yaml에 `ENC(암호문)`와 같은 형식으로 작성하면 Spring의 Bean 등록하는 과정에 Property에 대한 복호화를 진행한다.


```java
package com.ulisesbocchio.jasyptspringboot.annotation;  
  
import com.ulisesbocchio.jasyptspringboot.configuration.EnableEncryptablePropertiesConfiguration;  
import java.lang.annotation.ElementType;  
import java.lang.annotation.Retention;  
import java.lang.annotation.RetentionPolicy;  
import java.lang.annotation.Target;  
import org.springframework.context.annotation.Import;  
  
@Target({ElementType.TYPE})  
@Retention(RetentionPolicy.RUNTIME)  
@Import({EnableEncryptablePropertiesConfiguration.class})  
public @interface EnableEncryptableProperties {  
}
```
- 위와 같이 `EnableEncryptablePropertiesConfiguration`를 포함하고 주입하고 있다.

```java
@Configuration  
@Import({EncryptablePropertyResolverConfiguration.class, CachingConfiguration.class})  
public class EnableEncryptablePropertiesConfiguration {  
    private static final Logger log = LoggerFactory.getLogger(EnableEncryptablePropertiesConfiguration.class);  
  
    public EnableEncryptablePropertiesConfiguration() {  
    }  
  
    @Bean  
    public static EnableEncryptablePropertiesBeanFactoryPostProcessor enableEncryptablePropertySourcesPostProcessor(ConfigurableEnvironment environment, EncryptablePropertySourceConverter converter) {  
        return new EnableEncryptablePropertiesBeanFactoryPostProcessor(environment, converter);  
    }  
}
```
- `EncryptablePropertyResolverConfiguration`는 실질적으로 resolve 하는 구현에 대한 내용을 담고 있다.
- `CachingConfiguration`는  Spring Cloud에서 RefreshScope가 갱신될 때 복호화가 깨지지 않도록 재작업할 때에 대한 처리를 가지고 있다.

```java
@Configuration  
public class EncryptablePropertyResolverConfiguration {  
    private static final String ENCRYPTOR_BEAN_PROPERTY = "jasypt.encryptor.bean";  
    private static final String ENCRYPTOR_BEAN_PLACEHOLDER = String.format("${%s:jasyptStringEncryptor}", "jasypt.encryptor.bean");  
    private static final String DETECTOR_BEAN_PROPERTY = "jasypt.encryptor.property.detector-bean";  
    private static final String DETECTOR_BEAN_PLACEHOLDER = String.format("${%s:encryptablePropertyDetector}", "jasypt.encryptor.property.detector-bean");  
    private static final String RESOLVER_BEAN_PROPERTY = "jasypt.encryptor.property.resolver-bean";  
    private static final String RESOLVER_BEAN_PLACEHOLDER = String.format("${%s:encryptablePropertyResolver}", "jasypt.encryptor.property.resolver-bean");  
    private static final String FILTER_BEAN_PROPERTY = "jasypt.encryptor.property.filter-bean";  
    private static final String FILTER_BEAN_PLACEHOLDER = String.format("${%s:encryptablePropertyFilter}", "jasypt.encryptor.property.filter-bean");  
    private static final String ENCRYPTOR_BEAN_NAME = "lazyJasyptStringEncryptor";  
    private static final String DETECTOR_BEAN_NAME = "lazyEncryptablePropertyDetector";  
    private static final String CONFIG_SINGLETON = "configPropsSingleton";  
    public static final String RESOLVER_BEAN_NAME = "lazyEncryptablePropertyResolver";  
    public static final String FILTER_BEAN_NAME = "lazyEncryptablePropertyFilter";  
  
    public EncryptablePropertyResolverConfiguration() {  
    }  
/*
 * EnableEncryptablePropertiesBeanFactoryPostProcessor의
 * postProcessBeanFactory에서 사용하는  EncryptablePropertySourceConverter가
 * 여기에서 생성됩니다.
 */
  
    @Bean  
    public static EncryptablePropertySourceConverter encryptablePropertySourceConverter(ConfigurableEnvironment environment, @Qualifier("lazyEncryptablePropertyResolver") EncryptablePropertyResolver propertyResolver, @Qualifier("lazyEncryptablePropertyFilter") EncryptablePropertyFilter propertyFilter) {  
        boolean proxyPropertySources = (Boolean)environment.getProperty("jasypt.encryptor.proxy-property-sources", Boolean.TYPE, false);  
        List<String> skipPropertySources = (List)environment.getProperty("jasypt.encryptor.skip-property-sources", List.class, Collections.EMPTY_LIST);  
        List<Class<PropertySource<?>>> skipPropertySourceClasses = (List)skipPropertySources.stream().map(EncryptablePropertySourceConverter::getPropertiesClass).collect(Collectors.toList());  
        InterceptionMode interceptionMode = proxyPropertySources ? InterceptionMode.PROXY : InterceptionMode.WRAPPER;  
        return new EncryptablePropertySourceConverter(interceptionMode, skipPropertySourceClasses, propertyResolver, propertyFilter);  
    }

	@Bean(  
	    name = {"lazyJasyptStringEncryptor"}  
	)  
	public StringEncryptor stringEncryptor(EnvCopy envCopy, BeanFactory bf) {  
	    String customEncryptorBeanName = envCopy.get().resolveRequiredPlaceholders(ENCRYPTOR_BEAN_PLACEHOLDER);  
	    //우리가 Bean으로 등록한 jasyptStringEncryptor가 여기에서 쓰인다.
	    boolean isCustom = envCopy.get().containsProperty("jasypt.encryptor.bean");  
	    return new DefaultLazyEncryptor(envCopy.get(), customEncryptorBeanName, isCustom, bf);  
	}
}
```

- `EnableEncryptablePropertiesConfiguration에서` `@Bean`으로 만든 `EnableEncryptablePropertiesBeanFactoryPostProcessor`를 바탕으로 기존 PropertySource를 래핑한다.
```java
//  
// Source code recreated from a .class file by IntelliJ IDEA  
// (powered by FernFlower decompiler)  
//  
  
package com.ulisesbocchio.jasyptspringboot.configuration;  
  
import com.ulisesbocchio.jasyptspringboot.EncryptablePropertySourceConverter;  
import org.slf4j.Logger;  
import org.slf4j.LoggerFactory;  
import org.springframework.beans.BeansException;  
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;  
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;  
import org.springframework.core.Ordered;  
import org.springframework.core.env.ConfigurableEnvironment;  
import org.springframework.core.env.MutablePropertySources;  

/**
 * BeanFactoryPostProcessor을 implements 해서
 * ApplicationContext 초기화 -> Environment, PropertySource 생성 이후
 * BeanDefinition으로 Bean 생성하기 전 단계에서 조작을 시작한다.
 *  
 * 추가로
 * BeanDefinition은 Bean에 대한 명세를 들고 있는 메타 정보를 만드는 시기
 * BeanFactoryPostProcessor는 Bean Instantiate하기 전
 * BeanPostProcessor는 bean을 생성한 이후 시기 주로 Proxy로 감싸거나 AOP, @Autowired 검증, @PostConstruct 호출 시기
 */
public class EnableEncryptablePropertiesBeanFactoryPostProcessor implements BeanFactoryPostProcessor, Ordered {  
    private static final Logger log = LoggerFactory.getLogger(EnableEncryptablePropertiesBeanFactoryPostProcessor.class);  
    private final ConfigurableEnvironment environment;  
    private final EncryptablePropertySourceConverter converter;  
  
    public EnableEncryptablePropertiesBeanFactoryPostProcessor(ConfigurableEnvironment environment, EncryptablePropertySourceConverter converter) {  
        this.environment = environment;  
        this.converter = converter;  
    }  
  
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {  
        log.info("Post-processing PropertySource instances");  
        MutablePropertySources propSources = this.environment.getPropertySources();  
    //이 부분에서 래핑을 시도한다.
        this.converter.convertPropertySources(propSources);  
    }  
  
    public int getOrder() {  
        return 2147483547;  
    }  
}
```

- 실제 래핑하는 `convertPropertySource`를 살펴보면
```java
package com.ulisesbocchio.jasyptspringboot;  
  
import com.ulisesbocchio.jasyptspringboot.aop.EncryptableMutablePropertySourcesInterceptor;  
import com.ulisesbocchio.jasyptspringboot.aop.EncryptablePropertySourceMethodInterceptor;  
import com.ulisesbocchio.jasyptspringboot.configuration.EnvCopy;  
import com.ulisesbocchio.jasyptspringboot.wrapper.EncryptableEnumerablePropertySourceWrapper;  
import com.ulisesbocchio.jasyptspringboot.wrapper.EncryptableMapPropertySourceWrapper;  
import com.ulisesbocchio.jasyptspringboot.wrapper.EncryptableMutablePropertySourcesWrapper;  
import com.ulisesbocchio.jasyptspringboot.wrapper.EncryptablePropertySourceWrapper;  
import com.ulisesbocchio.jasyptspringboot.wrapper.EncryptableSystemEnvironmentPropertySourceWrapper;  
import java.lang.reflect.Modifier;  
import java.util.Arrays;  
import java.util.List;  
import java.util.Objects;  
import java.util.stream.Collectors;  
import java.util.stream.Stream;  
import org.slf4j.Logger;  
import org.slf4j.LoggerFactory;  
import org.springframework.aop.framework.ProxyFactory;  
import org.springframework.aop.support.AopUtils;  
import org.springframework.core.env.CommandLinePropertySource;  
import org.springframework.core.env.EnumerablePropertySource;  
import org.springframework.core.env.MapPropertySource;  
import org.springframework.core.env.MutablePropertySources;  
import org.springframework.core.env.PropertySource;  
import org.springframework.core.env.PropertySources;  
import org.springframework.core.env.SystemEnvironmentPropertySource;  
  
public class EncryptablePropertySourceConverter {  
    ...
  
    public void convertPropertySources(MutablePropertySources propSources) {  
        ((List)propSources.stream()
        .filter((ps) -> !(ps instanceof EncryptablePropertySource)) //Encryptable이 아닌 것만
        .map(this::makeEncryptable) //Encryptable로 바꾸고
        .collect(Collectors.toList()))
        .forEach((ps) -> propSources.replace(ps.getName(), ps));  //원래 이름으로 교체
    }
}
```
- 위와 같이 EncryptableMapPropertySourceWrapper로 래핑이 되어 있으면 넘어가고 아니면 래핑한다.

```java
  
package com.ulisesbocchio.jasyptspringboot.wrapper;  
  
import com.ulisesbocchio.jasyptspringboot.EncryptablePropertyFilter;  
import com.ulisesbocchio.jasyptspringboot.EncryptablePropertyResolver;  
import com.ulisesbocchio.jasyptspringboot.EncryptablePropertySource;  
import com.ulisesbocchio.jasyptspringboot.caching.CachingDelegateEncryptablePropertySource;  
import java.util.Map;  
import org.springframework.core.env.MapPropertySource;  
import org.springframework.core.env.PropertySource;  
  
public class EncryptableMapPropertySourceWrapper extends MapPropertySource implements EncryptablePropertySource<Map<String, Object>> {  
    private final CachingDelegateEncryptablePropertySource<Map<String, Object>> encryptableDelegate;  
  
    public EncryptableMapPropertySourceWrapper(MapPropertySource delegate, EncryptablePropertyResolver resolver, EncryptablePropertyFilter filter) {  
        super(delegate.getName(), (Map)delegate.getSource());  
        this.encryptableDelegate = new CachingDelegateEncryptablePropertySource(delegate, resolver, filter);  
    }  
  
    public Object getProperty(String name) {  
        return this.encryptableDelegate.getProperty(name);  
    }  
  
    public PropertySource<Map<String, Object>> getDelegate() {  
        return this.encryptableDelegate;  
    }  
}
```
- 위와 같이 래핑된 객체가 반환된다. 여기서 `this.encryptableDeletage.getProperty(..)`가 호출 될 때 비로소 `ENC()`로 된 문제를 decrypt한다.
- - encryptableDelegate로 실제 처리를 위임하는 객체는 아래와 같다.
```java
  
public class DefaultPropertyResolver implements EncryptablePropertyResolver {  
    private final Environment environment;  
    private StringEncryptor encryptor;  
    private EncryptablePropertyDetector detector;  
  
    public DefaultPropertyResolver(StringEncryptor encryptor, Environment environment) {  
        this(encryptor, new DefaultPropertyDetector(), environment);  
    }  
  
    public DefaultPropertyResolver(StringEncryptor encryptor, EncryptablePropertyDetector detector, Environment environment) {  
        this.environment = environment;  
        Assert.notNull(encryptor, "String encryptor can't be null");  
        Assert.notNull(detector, "Encryptable Property detector can't be null");  
        this.encryptor = encryptor;  
        this.detector = detector;  
    }  
  
    public String resolvePropertyValue(String value) {  
        Optional var10000 = Optional.ofNullable(value);  
        Environment var10001 = this.environment;  
        Objects.requireNonNull(var10001);  
        var10000 = var10000.map(var10001::resolvePlaceholders);  
        EncryptablePropertyDetector var3 = this.detector;  
        Objects.requireNonNull(var3);  
        return (String)var10000.filter(var3::isEncrypted).map((resolvedValue) -> {  
            try {  
                String unwrappedProperty = this.detector.unwrapEncryptedValue(resolvedValue.trim());  
                String resolvedProperty = this.environment.resolvePlaceholders(unwrappedProperty);  
                return this.encryptor.decrypt(resolvedProperty);  
            } catch (EncryptionOperationNotPossibleException e) {  
                throw new DecryptionException("Unable to decrypt property: " + value + " resolved to: " + resolvedValue + ". Decryption of Properties failed,  make sure encryption/decryption passwords match", e);  
            }  
        }).orElse(value);  
    }  
}
```
- 결과적으로 EncryptablePropertyDetector로 `ENC()` 를 감지하고 필요하면 복호화하고 아니라면 그냥 내보낸다.
- 아래는 추가로 Detector에 대한 구현이 사항이다.
```java
package com.ulisesbocchio.jasyptspringboot.detector;  
  
import com.ulisesbocchio.jasyptspringboot.EncryptablePropertyDetector;  
import org.springframework.util.Assert;  
  
public class DefaultPropertyDetector implements EncryptablePropertyDetector {  
    private String prefix = "ENC(";  
    private String suffix = ")";  
  
    public DefaultPropertyDetector() {  
    }  
  
    public DefaultPropertyDetector(String prefix, String suffix) {  
        Assert.notNull(prefix, "Prefix can't be null");  
        Assert.notNull(suffix, "Suffix can't be null");  
        this.prefix = prefix;  
        this.suffix = suffix;  
    }  
  
    public boolean isEncrypted(String property) {  
        if (property == null) {  
            return false;  
        } else {  
            String trimmedValue = property.trim();  
            return trimmedValue.startsWith(this.prefix) && trimmedValue.endsWith(this.suffix);  
        }  
    }  
  
    public String unwrapEncryptedValue(String property) {  
        return property.substring(this.prefix.length(), property.length() - this.suffix.length());  
    }  
}
```
