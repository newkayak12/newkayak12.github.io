---
layout: post

categories: [SPRING]
---


# Resolver

스프링에서는 요청에 맞는 처리를 위해서 `Resolver`라는 개념이 존재한다.

## 종류

1. viewResolver :  쉽게 말하면 Contoller에서 String으로 return하면 JSP, Mustache 등을 찾아주는 녀석이다.
조금 거창하게 말하면 컨트롤러에서 반환한 뷰 이름에 맞는 뷰를 찾아주는 역할을 한다.

```java
class Mvc implements WebMvcConfigurer {
    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }
}
```

와 같이 설정할 수 있다.

2. HandlerMethodArgumentResolver : 컨트롤러로 들어가는 메소드 파라미터를 변환하는 역할을 한다. `@RequestBody`, `@RequestParam`, `@PathVariable`
등을 리졸빙하는 역할을 해준다. 추가로 이 녀석은 Spring Web의 경우 `DispatcherServlet`와 함께 동작한다.

    - 구현

```java
public class TestMethodArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        return true;
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer,
                                  NativeWebRequest nativeWebRequest, WebDataBinderFactory webDataBinderFactory) throws Exception {
        return null;
    }
}
```

커스텀하려면 위의 둘을 구현해야 한다. `supportsParameter`는 파라미터가 resolver를 지원하는 여부를 확인해준다. `resolveArgument`는 메소드 파라미터를
argument로 바인딩하는 역할을 한다.
   
  - 동작 시점: DispatcherServlet에서 요청을 처리하고 HandlerMapping을 한 뒤 -> RequestMappingHandlerAdapter -> Interceptor 이후 발생한다.
   그 뒤는 MessageConverter가 처리를 하고 Controller Method를 invoke 한다.

  - HandlerMethodArgumentResolver 작동 :  `org.springframework.web.method.support.InvocableHandlerMethod`의 `invokeForRequest`가 실행된다고 한다.

  ```java
   @Nullable
    public Object invokeForRequest(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
        Object[] args = this.getMethodArgumentValues(request, mavContainer, providedArgs);
        if (logger.isTraceEnabled()) {
            logger.trace("Arguments: " + Arrays.toString(args));
        }
    
        if (this.shouldValidateArguments() && this.methodValidator != null) {
            this.methodValidator.applyArgumentValidation(this.getBean(), this.getBridgedMethod(), this.getMethodParameters(), args, this.validationGroups);
        }
        //argumentValidate (@Validated 작동 부분으로 보인다.
    
        Object returnValue = this.doInvoke(args);
        if (this.shouldValidateReturnValue() && this.methodValidator != null) {
            this.methodValidator.applyReturnValueValidation(this.getBean(), this.getBridgedMethod(), this.getReturnType(), returnValue, this.validationGroups);
        }
        //return validate
    
        return returnValue;
    }

    //메소드 args 바인딩
    protected Object[] getMethodArgumentValues(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
        MethodParameter[] parameters = this.getMethodParameters();
        if (ObjectUtils.isEmpty(parameters)) {
            return EMPTY_ARGS;
        } else {
            Object[] args = new Object[parameters.length];
    
            for(int i = 0; i < parameters.length; ++i) {
                MethodParameter parameter = parameters[i];
                parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);
                args[i] = findProvidedArgument(parameter, providedArgs);
                if (args[i] == null) {
                    if (!this.resolvers.supportsParameter(parameter)) {
                        throw new IllegalStateException(formatArgumentError(parameter, "No suitable resolver"));
                    }
    
                    try {
                        args[i] = this.resolvers.resolveArgument(parameter, mavContainer, request, this.dataBinderFactory);
                    } catch (Exception var10) {
                        Exception ex = var10;
                        if (logger.isDebugEnabled()) {
                            String exMsg = ex.getMessage();
                            if (exMsg != null && !exMsg.contains(parameter.getExecutable().toGenericString())) {
                                logger.debug(formatArgumentError(parameter, exMsg));
                            }
                        }
    
                        throw ex;
                    }
                }
            }
    
            return args;
        }
    }
    
    @Nullable
    protected Object doInvoke(Object... args) throws Exception {
        Method method = this.getBridgedMethod();
    
        try {
            if (KotlinDetector.isKotlinReflectPresent()) {
                if (KotlinDetector.isSuspendingFunction(method)) {
                    return this.invokeSuspendingFunction(method, this.getBean(), args);
                }
    
                if (KotlinDetector.isKotlinType(method.getDeclaringClass())) {
                    return InvocableHandlerMethod.KotlinDelegate.invokeFunction(method, this.getBean(), args);
                }
            }
    
            return method.invoke(this.getBean(), args); //여기서 Controller에 Args 넣어서 invoke한다.
        } catch (IllegalArgumentException var8) {
            IllegalArgumentException ex = var8;
            this.assertTargetBean(method, this.getBean(), args);
            String text = ex.getMessage() != null && !(ex.getCause() instanceof NullPointerException) ? ex.getMessage() : "Illegal argument"; //여기다 parameter 잘못 넣으면 에러 뱉는 곳
            throw new IllegalStateException(this.formatInvokeError(text, args), ex);
        } catch (InvocationTargetException var9) {
            InvocationTargetException ex = var9;
            Throwable targetException = ex.getCause();
            if (targetException instanceof RuntimeException runtimeException) {
                throw runtimeException;
            } else if (targetException instanceof Error error) {
                throw error;
            } else if (targetException instanceof Exception exception) {
                throw exception;
            } else {
                throw new IllegalStateException(this.formatInvokeError("Invocation failure", args), targetException);
            }
        }
    }

    
    //this.resolvers는 HandlerMethodArgumentResolverComposite 타입이다.
    
    public class HandlerMethodArgumentResolverComposite implements HandlerMethodArgumentResolver {
        private final List<HandlerMethodArgumentResolver> argumentResolvers = new ArrayList();
        private final Map<MethodParameter, HandlerMethodArgumentResolver> argumentResolverCache = new ConcurrentHashMap(256);
    
        public HandlerMethodArgumentResolverComposite() {
        }
    
        public HandlerMethodArgumentResolverComposite addResolver(HandlerMethodArgumentResolver resolver) {
            this.argumentResolvers.add(resolver);
            return this;
        }
    
        public HandlerMethodArgumentResolverComposite addResolvers(@Nullable HandlerMethodArgumentResolver... resolvers) {
            if (resolvers != null) {
                Collections.addAll(this.argumentResolvers, resolvers);
            }
    
            return this;
        }
    
        public HandlerMethodArgumentResolverComposite addResolvers(@Nullable List<? extends HandlerMethodArgumentResolver> resolvers) {
            if (resolvers != null) {
                this.argumentResolvers.addAll(resolvers);
            }
    
            return this;
        }
    
        public List<HandlerMethodArgumentResolver> getResolvers() {
            return Collections.unmodifiableList(this.argumentResolvers);
        }
    
        public void clear() {
            this.argumentResolvers.clear();
            this.argumentResolverCache.clear();
        }
    
        public boolean supportsParameter(MethodParameter parameter) {
            return this.getArgumentResolver(parameter) != null;
        }
    
        @Nullable
        public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer, NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {
            HandlerMethodArgumentResolver resolver = this.getArgumentResolver(parameter);
            if (resolver == null) {
                throw new IllegalArgumentException("Unsupported parameter type [" + parameter.getParameterType().getName() + "]. supportsParameter should be called first.");
            } else {
                return resolver.resolveArgument(parameter, mavContainer, webRequest, binderFactory);
            }
        }
    
        @Nullable
        public HandlerMethodArgumentResolver getArgumentResolver(MethodParameter parameter) {
            HandlerMethodArgumentResolver result = (HandlerMethodArgumentResolver)this.argumentResolverCache.get(parameter);
            if (result == null) {
                Iterator var3 = this.argumentResolvers.iterator();
    
                while(var3.hasNext()) { //loop를 돌면서 Resolver를 구현하면서 본 `supportsParameter`로 파싱이 가능한지 체크한다.
                    HandlerMethodArgumentResolver resolver = (HandlerMethodArgumentResolver)var3.next();
                    if (resolver.supportsParameter(parameter)) {
                        result = resolver;
                        this.argumentResolverCache.put(parameter, result);
                        break;
                    }
                }
            }
    
            return result;
        }
    }
  ```

3. ContentNegotiationConfigurer : HTTP 요청에 Accept 헤더에따라 적절한 미디어 타입을 선택하는데 제공된다. `DefaultServletHttpRequestHandler`를 이용해서 정적 리소스를, `ContentNegotiationConfigurer`로 JSON 등을 처리한다.
4. LocaleResolver : `AcceptHeaderLocaleResolver`를 기본 제공하며 `Accept-Language` 가중치에 따라서 로케일을 설정한다.
5. MultipartResolver : 멀티파트 파일을 처리하는데 사용한다. `StandardServletMultipartResolver`을 기본 제공한다.