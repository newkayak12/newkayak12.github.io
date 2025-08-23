---
layout: post

categories: [SPRING]
---



from [Dictionary - Webflux vs. WebMVC](https://github.com/newkayak12/Dictionary/blob/master/spring/26.WebfluxVs.WebMvc.md)


# Webflux vs. WebMVC

- WebMVC  : 멀티 쓰레드 기반 웹 프레임워크
- WebFlux : 리액티브 스택 기반 웹 프레임워크 

## 둘 다 있는 경우?
애플리케이션 클래스 패스를 기반으로 애플리케이션 타입을 선택한다. 
- NONE
- SERVLET
- REACTIVE

[this.webApplicationType = WebApplicationType.deduceFromClasspath();](12.Initialize.md)
```java
class WebApplicationType {
    static WebApplicationType deduceFromClasspath() {
        if (ClassUtils.isPresent(WEBFLUX_INDICATOR_CLASS, null) 
            && !ClassUtils.isPresent(WEBMVC_INDICATOR_CLASS, null)
            && !ClassUtils.isPresent(JERSEY_INDICATOR_CLASS, null)) {
                return WebApplicationType.REACTIVE;
        }
        for (String className : SERVLET_INDICATOR_CLASSES) {
            if (!ClassUtils.isPresent(className, null)) {
                return WebApplicationType.NONE;
            }
        }
        return WebApplicationType.SERVLET;
    }
}
```

## WebFluxAutoConfiguration이 활성화되는 조건
1. 애플리케이션이 리액티브 타입인 경우
2. 클래스패스에 웹플럭스가 존재하는 경우
3. WebFluxConfigurationSupport 타입의 빈이 없는 경우

## 결론
둘 다 존재하면 SERVLET이 되므로 WebFlux는 disabled 된다. `@EnableWebFlux`를 사용하면 강제로 활성화된다. 