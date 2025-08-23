---
layout: post

categories: [SPRING]
---


# ModelAttribute

- 일반 클라이언트로부터 HTTP 파라미터, multipart/form-data 형태 파라미터를 받아서 객체로 사용하고 싶을 때 이용된다.
- 적절한 생성자를 찾아서 초기화 한다.  생성 및 초기화 > 바인딩(getter, setter 사용) > validation 순서로 진행된다.


## 작동 원리 (ModelAttributeMethodProcessor)

`ModelAttributeMethodProcessor#resolveArgument`가 처리한다.

1. 생성자 찾기 (ReflectionUtils)를 사용한다. -> 보통 매개변수가 가장 적은 생선자를 찾는다.
2. initialize
3. 바인딩 (resolveArgument)


[springDoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/method/annotation/ModelAttributeMethodProcessor.html)

```java

//org.springframework.web.method.annotation.ModelAttributeMethodProcessor
public class ModelAttributeMethodProcessor implements HandlerMethodArgumentResolver, HandlerMethodReturnValueHandler {
    protected final Log logger = LogFactory.getLog(this.getClass());
    private final boolean annotationNotRequired;

    public ModelAttributeMethodProcessor(boolean annotationNotRequired) {
        this.annotationNotRequired = annotationNotRequired;
    }

    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(ModelAttribute.class) || this.annotationNotRequired && !BeanUtils.isSimpleProperty(parameter.getParameterType());
    }

    @Nullable
    public final Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer, NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {
        Assert.state(mavContainer != null, "ModelAttributeMethodProcessor requires ModelAndViewContainer");
        Assert.state(binderFactory != null, "ModelAttributeMethodProcessor requires WebDataBinderFactory");
        String name = ModelFactory.getNameForParameter(parameter);
        ModelAttribute ann = (ModelAttribute)parameter.getParameterAnnotation(ModelAttribute.class);
        if (ann != null) {
            mavContainer.setBinding(name, ann.binding());
        }

        BindingResult bindingResult = null;
        Object attribute;
        if (mavContainer.containsAttribute(name)) {
            attribute = mavContainer.getModel().get(name);
            if (attribute == null || ObjectUtils.unwrapOptional(attribute) == null) {
                bindingResult = binderFactory.createBinder(webRequest, (Object)null, name).getBindingResult();
                //binding
                attribute = wrapAsOptionalIfNecessary(parameter, (Object)null);
            }
        } else {
            try {
                attribute = this.createAttribute(name, parameter, binderFactory, webRequest);
            } catch (MethodArgumentNotValidException var11) {
                MethodArgumentNotValidException ex = var11;
                if (this.isBindExceptionRequired(parameter)) {
                    throw ex;
                }

                attribute = wrapAsOptionalIfNecessary(parameter, ex.getTarget());
                bindingResult = ex.getBindingResult();
            }
        }

        if (bindingResult == null) {
            ResolvableType type = ResolvableType.forMethodParameter(parameter);
            WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, name, type);
            if (attribute == null) {
                this.constructAttribute(binder, webRequest);
                attribute = wrapAsOptionalIfNecessary(parameter, binder.getTarget());
            }

            if (!binder.getBindingResult().hasErrors()) {
                if (!mavContainer.isBindingDisabled(name)) {
                    this.bindRequestParameters(binder, webRequest);
                }

                this.validateIfApplicable(binder, parameter);
            }

            if (binder.getBindingResult().hasErrors() && this.isBindExceptionRequired(binder, parameter)) {
                throw new MethodArgumentNotValidException(parameter, binder.getBindingResult());
            }

            if (!parameter.getParameterType().isInstance(attribute)) {
                attribute = binder.convertIfNecessary(binder.getTarget(), parameter.getParameterType(), parameter);
            }

            bindingResult = binder.getBindingResult();
        }

        Map<String, Object> bindingResultModel = bindingResult.getModel();
        mavContainer.removeAttributes(bindingResultModel);
        mavContainer.addAllAttributes(bindingResultModel);
        return attribute;
    }

    @Nullable
    private static Object wrapAsOptionalIfNecessary(MethodParameter parameter, @Nullable Object target) {
        return parameter.getParameterType() == Optional.class ? Optional.ofNullable(target) : target;
    }

    @Nullable
    protected Object createAttribute(String attributeName, MethodParameter parameter, WebDataBinderFactory binderFactory, NativeWebRequest request) throws Exception {
        return null;
    }

    protected void constructAttribute(WebDataBinder binder, NativeWebRequest request) {
        ((WebRequestDataBinder)binder).construct(request);
    }

    protected void bindRequestParameters(WebDataBinder binder, NativeWebRequest request) {
        ((WebRequestDataBinder)binder).bind(request);
    }

    protected void validateIfApplicable(WebDataBinder binder, MethodParameter parameter) {
        Annotation[] var3 = parameter.getParameterAnnotations();
        int var4 = var3.length;

        for(int var5 = 0; var5 < var4; ++var5) {
            Annotation ann = var3[var5];
            Object[] validationHints = ValidationAnnotationUtils.determineValidationHints(ann);
            if (validationHints != null) {
                binder.validate(validationHints);
                break;
            }
        }

    }

    protected boolean isBindExceptionRequired(WebDataBinder binder, MethodParameter parameter) {
        return this.isBindExceptionRequired(parameter);
    }

    protected boolean isBindExceptionRequired(MethodParameter parameter) {
        int i = parameter.getParameterIndex();
        Class<?>[] paramTypes = parameter.getExecutable().getParameterTypes();
        boolean hasBindingResult = paramTypes.length > i + 1 && Errors.class.isAssignableFrom(paramTypes[i + 1]);
        return !hasBindingResult;
    }

    public boolean supportsReturnType(MethodParameter returnType) {
        return returnType.hasMethodAnnotation(ModelAttribute.class) || this.annotationNotRequired && !BeanUtils.isSimpleProperty(returnType.getParameterType());
    }

    public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {
        if (returnValue != null) {
            String name = ModelFactory.getNameForReturnValue(returnValue, returnType);
            mavContainer.addAttribute(name, returnValue);
        }

    }
}
```