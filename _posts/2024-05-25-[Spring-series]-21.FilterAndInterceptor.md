---
layout: post

categories: [SPRING]
---



from [Dictionary - Filter, Interceptor](https://github.com/newkayak12/Dictionary/blob/master/spring/21.FilterAndInterceptor.md)



# Filter, Interceptor

## Filter
`Dispatcher Servlet`에 요청이 전달되기 전/후에 부가 작업을 할 수 있게 해주는 기능

![스크린샷 2024-05-25 12.35.33.png](/assets/img/스크린샷 2024-05-25 12.35.33.png)

`Dispatcher Servlet`는 `SpringContext`보다 전이므로 스프링 제어 범위 밖이다.


## in java
`javax.servlet`의 Filter를 구현하면 필터를 추가할 수 있다.

```java
import java.io.IOException;

public interface Filter {
    public default void init(FilterConfig filterConfig) throws ServletExcpetion {}
// 필터 객체 초기화
    
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException;
//  디스패쳐 서블릿 전달 전에 실행되는 메소드다.
    
    public default void destroy() {}
//  자원 반환되기 전 실행되는 메소드다.     
    
}
```

## Interceptor
Spring에서 제공하는 기술이다. 디스패쳐 서블릿이 컨트롤러를 호출하기 전과 후에 요청과 응답을 참조하거나 가공할 수 있는 기능을 제공한다. 

![](/assets/img/스크린샷 2024-05-25 12.35.42.png)

## in java
```java
public interface HandlerInterceptor {

    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws Exception {
        return true;
    }
//  컨트롤러 호출되기 전에 실행.

    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
        @Nullable ModelAndView modelAndView) throws Exception {
    }
//  컨트롤러 호출된 후에 실행.
    
    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
        @Nullable Exception ex) throws Exception {
    }
}
```

## 정리
|            대상             |                                                Filter                                                 |                                   Interceptor                                    |
|:-------------------------:|:-----------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|
|         관리되는 컨테이너         |                                           Servlet Container                                           |                                 Spring Container                                 |
|     스프링에서 예외 가능한지 여부      |                                                   X                                                   |                                        O                                         |
| Request/Response 조작 가능 여부 |                                                   O                                                   |                                        X                                         |
|            용도             | - 공통된 보안 및 인증/ 인가 관련 작업<br/> - 모든 요청에 대한 로깅 및 감사 <br/> - 이미지/데이터 압축 및 문자열 인코딩<br/> - 스프링과 분리되어야 하는 기능 | - 세부적인 보안 및 인증/인가 공통 작업<br/> - API 호출에 대한 로깅 및 감사<br/> - Controller로 넘겨주는 정보의 가공 |


## 이상한 점?
위의 내용을 보면 스프링에 의해서 관리 받지 않기 때문에 스프링 빈으로 등록이 불가능해 보인다. 근데? 실제로 해보면 Filter 역시 스프링 빈으로 등록이 가능하며, 
빈을 주입받을 수도 있다. 

### DelegatingFilterProxy
필터에서도 `DI`를 할 필요가 있다. 이는 `DelegatingFilterProxy`으로 가능해졌다.
필터가 Bean으로 등록됐고, 요청이 오면 `DelegatingFilterProxy`으로 요청을 받아서 우리가 받은 필터(스프링 빈)에게 요청을 위임한다.

1. Filter 구현체가 스프링 빈으로 등록됨
2. ServletContext가 Filter 구현체를 갖는 `DelegatingFilterProxy`를 생성
3. ServletContext가 `DelegatingFilterProxy`를 서블릿 컨텍스트에 필터로 등록
4. 요청이 오면 `DelegatingFilterProxy`가 구현체에게 요청을 위임하여 필터 처리를 진행