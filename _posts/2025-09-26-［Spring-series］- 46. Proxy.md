---
layout: page
categories:
  - SPRING
---
# 0. Spring에서 Proxy 전략

1. 필요한 이유
	1. AOP
	2. @Transactional
	3. @Cachable
	4. @PreAuthorize 등 권한 검사 
	5. @Lazy 초기화
2. 전략
	1. JDK DynamicProxy: 인터페이스 기반, 런타임 프록시 생성
	2. GCLIB: 클래스 기반, 바이트 코드 조작으로 서브클래스 생성

# 1. JDK Dynamic Proxy vs CGLIB 비교

1. **JDK Dynamic Proxy:**

	- **조건**: 대상 클래스가 인터페이스 구현 필요
	- **방식**: `java.lang.reflect.Proxy` 사용
	- **성능**: 메서드 호출 시 리플렉션 오버헤드
	- **제약**: 인터페이스 메서드만 프록시 가능

2. **CGLIB (Code Generation Library):**

	- **조건**: 클래스 직접 상속 (final 클래스/메서드 불가)
	- **방식**: 바이트코드 조작으로 서브클래스 생성
	- **성능**: 직접 메서드 호출, 더 빠름
	- **제약**: 생성자 호출 필요, private 메서드 프록시 불가
# 2. Spring 버전별 전략 선정
1. **Spring Boot 2.0 이전:**
	- 인터페이스 있으면 → JDK Dynamic Proxy
	- 인터페이스 없으면 → CGLIB

2. **Spring Boot 2.0 이후:**
	- **기본값**: CGLIB 사용 (`spring.aop.proxy-target-class=true`)
	- **이유**: 성능 개선 + 일관성 향상


# 3. 구현

```java
// org.springframework.aop.framework.DefaultAopProxyFactory
public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {

    /**
     * Spring의 프록시 전략 결정 핵심 로직
     * AOP 프록시 생성 시점에 JDK vs CGLIB 선택
     */
    @Override
    public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
        // 1. 최적화 모드이거나 클래스 기반 프록시 강제 설정인 경우
        if (!NativeDetector.inNativeImage() &&
            (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config))) {
            
            Class<?> targetClass = config.getTargetClass();
            if (targetClass == null) {
                throw new AopConfigException("TargetSource cannot determine target class: " +
                        "Either an interface or a target is required for proxy creation.");
            }
            
            // 2. 대상이 인터페이스이거나 이미 JDK 프록시인 경우 → JDK Dynamic Proxy
            if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
                return new JdkDynamicAopProxy(config);
            }
            
            // 3. 일반 클래스인 경우 → CGLIB
            return new ObjenesisCglibAopProxy(config);
        }
        else {
            // 4. 기본 전략: 인터페이스 기반 → JDK Dynamic Proxy
            return new JdkDynamicAopProxy(config);
        }
    }
    
    /**
     * 사용자가 명시적으로 지정한 인터페이스가 없는지 확인
     */
    private boolean hasNoUserSuppliedProxyInterfaces(AdvisedSupport config) {
        Class<?>[] ifcs = config.getProxiedInterfaces();
        return (ifcs.length == 0 || (ifcs.length == 1 && SpringProxy.class.isAssignableFrom(ifcs[0])));
    }
}
```
```java

// ============ JDK Dynamic Proxy 구현 ============
// org.springframework.aop.framework.JdkDynamicAopProxy
final class JdkDynamicAopProxy implements AopProxy, InvocationHandler, Serializable {

    /** AdvisedSupport 설정 정보 */
    private final AdvisedSupport advised;

    /** 프록시할 인터페이스들 */
    private final Class<?>[] proxiedInterfaces;

    /**
     * JDK Dynamic Proxy 생성
     */
    @Override
    public Object getProxy(@Nullable ClassLoader classLoader) {
        if (logger.isTraceEnabled()) {
            logger.trace("Creating JDK dynamic proxy: " + this.advised.getTargetSource());
        }
        
        // 프록시할 인터페이스 결정
        return Proxy.newProxyInstance(classLoader, this.proxiedInterfaces, this);
    }

    /**
     * 프록시 메서드 호출 시 실행되는 핵심 로직
     * 모든 메서드 호출이 여기를 거쳐감
     */
    @Override
    @Nullable
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object oldProxy = null;
        boolean setProxyContext = false;

        TargetSource targetSource = this.advised.targetSource;
        Object target = null;

        try {
            // 1. equals() 메서드 특수 처리
            if (!this.equalsDefined && AopUtils.isEqualsMethod(method)) {
                return equals(args[0]);
            }
            // 2. hashCode() 메서드 특수 처리  
            else if (!this.hashCodeDefined && AopUtils.isHashCodeMethod(method)) {
                return hashCode();
            }
            // 3. DecoratingProxy 인터페이스 처리
            else if (method.getDeclaringClass() == DecoratingProxy.class) {
                return AopProxyUtils.ultimateTargetClass(this.advised);
            }
            // 4. Advised 인터페이스 처리 (프록시 설정 조회/변경)
            else if (!this.advised.opaque && method.getDeclaringClass().isInterface() &&
                    method.getDeclaringClass().isAssignableFrom(Advised.class)) {
                return AopUtils.invokeJoinpointUsingReflection(this.advised, method, args);
            }

            Object retVal;

            // 5. expose-proxy 설정 확인 (프록시 객체를 ThreadLocal에 노출)
            if (this.advised.exposeProxy) {
                oldProxy = AopContext.setCurrentProxy(proxy);
                setProxyContext = true;
            }

            // 6. 실제 타겟 객체 획득
            target = targetSource.getTarget();
            Class<?> targetClass = (target != null ? target.getClass() : null);

            // 7. === 핵심: 인터셉터 체인 획득 ===
            List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);

            if (chain.isEmpty()) {
                // 8. 어드바이스가 없으면 타겟 메서드 직접 호출
                Object[] argsToUse = AopProxyUtils.adaptArgumentsIfNecessary(method, args);
                retVal = AopUtils.invokeJoinpointUsingReflection(target, method, argsToUse);
            }
            else {
                // 9. === ReflectiveMethodInvocation으로 인터셉터 체인 실행 ===
                MethodInvocation invocation = new ReflectiveMethodInvocation(proxy, target, method, args, targetClass, chain);
                retVal = invocation.proceed();
            }

            // 10. 반환값 후처리
            Class<?> returnType = method.getReturnType();
            if (retVal != null && retVal == target &&
                    returnType != Object.class && returnType.isInstance(proxy) &&
                    !RawTargetAccess.class.isAssignableFrom(method.getDeclaringClass())) {
                // this 반환 시 프록시 객체 반환
                retVal = proxy;
            }
            else if (retVal == null && returnType != Void.TYPE && returnType.isPrimitive()) {
                throw new AopInvocationException(
                        "Null return value from advice does not match primitive return type for: " + method);
            }
            return retVal;
        }
        finally {
            if (target != null && !targetSource.isStatic()) {
                targetSource.releaseTarget(target);
            }
            if (setProxyContext) {
                AopContext.setCurrentProxy(oldProxy);
            }
        }
    }
}

/**
 * JDK Dynamic Proxy 호출 경로
 * 1. 프록시 메서드 호출
 * 2. InvocationHandler.invoke() - 리플렉션
 * 3. Method.invoke(target, args) - 리플렉션
 *
 * 오버헤드: 리플렉션 2회
 */

```
```java
// ============ CGLIB Proxy 구현 ============  
// org.springframework.aop.framework.CglibAopProxy
class CglibAopProxy implements AopProxy, Serializable {

    /** AdvisedSupport 설정 정보 */
    protected final AdvisedSupport advised;

    /** 생성된 프록시 클래스들 캐시 */
    private static final Map<Class<?>, Boolean> validatedClasses = new WeakHashMap<>();

    /**
     * CGLIB 프록시 생성
     */
    @Override
    public Object getProxy(@Nullable ClassLoader classLoader) {
        if (logger.isTraceEnabled()) {
            logger.trace("Creating CGLIB proxy: " + this.advised.getTargetSource());
        }

        try {
            Class<?> rootClass = this.advised.getTargetClass();
            Assert.state(rootClass != null, "Target class must be available for creating a CGLIB proxy");

            Class<?> proxySuperClass = rootClass;
            
            // 1. 이미 CGLIB 프록시인 경우 원본 클래스 찾기
            if (rootClass.getName().contains(ClassUtils.CGLIB_CLASS_SEPARATOR)) {
                proxySuperClass = rootClass.getSuperclass();
                Class<?>[] additionalInterfaces = rootClass.getInterfaces();
                for (Class<?> additionalInterface : additionalInterfaces) {
                    this.advised.addInterface(additionalInterface);
                }
            }

            // 2. 프록시 클래스 검증 (final 클래스, 메서드 체크)
            validateClassIfNecessary(proxySuperClass, classLoader);

            // 3. === CGLIB Enhancer 설정 ===
            Enhancer enhancer = createEnhancer();
            if (classLoader != null) {
                enhancer.setClassLoader(classLoader);
                if (classLoader instanceof SmartClassLoader &&
                        ((SmartClassLoader) classLoader).isClassReloadable(proxySuperClass)) {
                    enhancer.setUseCache(false);
                }
            }
            
            // 상위 클래스 설정
            enhancer.setSuperclass(proxySuperClass);
            
            // 인터페이스 추가
            enhancer.setInterfaces(AopProxyUtils.completeProxiedInterfaces(this.advised));
            
            // 네이밍 정책 설정 (클래스명에 $$EnhancerBySpringCGLIB$$ 추가)
            enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);
            
            // 바이트코드 생성 전략 설정
            enhancer.setStrategy(new ClassLoaderAwareGeneratorStrategy(classLoader));

            // 4. === 콜백 설정 (메서드 호출 시 실행될 로직) ===
            Callback[] callbacks = getCallbacks(rootClass);
            Class<?>[] types = new Class<?>[callbacks.length];
            for (int x = 0; x < types.length; x++) {
                types[x] = callbacks[x].getClass();
            }
            
            // CallbackFilter로 메서드별 콜백 선택
            enhancer.setCallbackFilter(new ProxyCallbackFilter(
                    this.advised.getConfigurationOnlyCopy(), this.fixedInterceptorMap, this.fixedInterceptorOffset));
            enhancer.setCallbackTypes(types);

            // 5. === 프록시 인스턴스 생성 ===
            return createProxyClassAndInstance(enhancer, callbacks);
        }
        catch (CodeGenerationException | IllegalArgumentException ex) {
            throw new AopConfigException("Could not generate CGLIB subclass of " + this.advised.getTargetClass() +
                    ": Common causes of this problem include using a final class or a non-visible class",
                    ex);
        }
        catch (Throwable ex) {
            throw new AopConfigException("Unexpected AOP exception", ex);
        }
    }

    /**
     * CGLIB 콜백 생성 - 메서드별 처리 로직 정의
     */
    private Callback[] getCallbacks(Class<?> rootClass) throws Exception {
        // expose-proxy 설정 확인
        boolean exposeProxy = this.advised.isExposeProxy();
        boolean isFrozen = this.advised.isFrozen();
        boolean isStatic = this.advised.getTargetSource().isStatic();

        // === 메인 콜백: DynamicAdvisedInterceptor ===
        Callback aopInterceptor = new DynamicAdvisedInterceptor(this.advised);

        // 타겟 메서드 직접 호출용 콜백 (어드바이스 없는 메서드)
        Callback targetInterceptor;
        if (exposeProxy) {
            targetInterceptor = (isStatic ?
                    new StaticUnadvisedExposedInterceptor(this.advised.getTargetSource().getTarget()) :
                    new DynamicUnadvisedExposedInterceptor(this.advised.getTargetSource()));
        } else {
            targetInterceptor = (isStatic ?
                    new StaticUnadvisedInterceptor(this.advised.getTargetSource().getTarget()) :
                    new DynamicUnadvisedInterceptor(this.advised.getTargetSource()));
        }

        // Advised 인터페이스 메서드 처리용 콜백
        Callback targetDispatcher = (isStatic ?
                new StaticDispatcher(this.advised.getTargetSource().getTarget()) : new SerializableNoOp());

        Callback[] mainCallbacks = new Callback[] {
                aopInterceptor,  // AOP 메서드
                targetInterceptor,  // 일반 메서드
                new SerializableNoOp(),  // 어드바이스 불가능한 메서드
                targetDispatcher, // Advised 인터페이스
                this.advisedDispatcher,  // equals, hashCode 등
                new EqualsInterceptor(this.advised),  // equals 특수 처리
                new HashCodeInterceptor(this.advised)  // hashCode 특수 처리
        };

        return mainCallbacks;
    }

    /**
     * CGLIB 메서드 인터셉터 - JDK의 InvocationHandler와 동일한 역할
     */
    private static class DynamicAdvisedInterceptor implements MethodInterceptor, Serializable {

        private final AdvisedSupport advised;

        public DynamicAdvisedInterceptor(AdvisedSupport advised) {
            this.advised = advised;
        }

        @Override
        @Nullable
        public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
            Object oldProxy = null;
            boolean setProxyContext = false;
            Object target = null;
            TargetSource targetSource = this.advised.getTargetSource();
            
            try {
                if (this.advised.exposeProxy) {
                    oldProxy = AopContext.setCurrentProxy(proxy);
                    setProxyContext = true;
                }
                
                target = targetSource.getTarget();
                Class<?> targetClass = (target != null ? target.getClass() : null);
                
                // === 인터셉터 체인 획득 (JDK와 동일) ===
                List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
                Object retVal;
                
                if (chain.isEmpty() && Modifier.isPublic(method.getModifiers())) {
                    // 어드바이스가 없으면 MethodProxy로 직접 호출 (성능 최적화)
                    Object[] argsToUse = AopProxyUtils.adaptArgumentsIfNecessary(method, args);
                    retVal = methodProxy.invoke(target, argsToUse);
                }
                else {
                    // === CglibMethodInvocation으로 인터셉터 체인 실행 ===
                    retVal = new CglibMethodInvocation(proxy, target, method, args, targetClass, chain, methodProxy).proceed();
                }
                
                retVal = processReturnType(proxy, target, method, retVal);
                return retVal;
            }
            finally {
                if (target != null && !targetSource.isStatic()) {
                    targetSource.releaseTarget(target);
                }
                if (setProxyContext) {
                    AopContext.setCurrentProxy(oldProxy);
                }
            }
        }
    }
}
/**
 * CGLIB 호출 경로
 * 1. 프록시 메서드 호출
 * 2. MethodInterceptor.intercept()
 * 3. MethodProxy.invoke(target, args) - 직접 호출
 *
 * 오버헤드: 리플렉션 0회 (FastClass 메커니즘 사용)
 */

```

## Spring의 Proxy 전략 결정 로직

**DefaultAopProxyFactory 결정 흐름:**

- **1차**: `config.isProxyTargetClass()` 확인 (강제 CGLIB 설정)
- **2차**: 타겟이 인터페이스인지 확인
- **3차**: 이미 JDK 프록시인지 확인
- **최종**: 조건에 따라 JDK vs CGLIB 선택

## JDK Dynamic Proxy 상세 메커니즘

**특징:**

- **리플렉션 기반**: `Method.invoke()` 사용으로 오버헤드 존재
- **인터페이스 제약**: 구현체가 아닌 인터페이스만 프록시 가능
- **런타임 생성**: `Proxy.newProxyInstance()`로 즉시 생성

**핵심 클래스:**

- `JdkDynamicAopProxy`: InvocationHandler 구현체
- 모든 메서드 호출이 `invoke()` 메서드로 집중

## CGLIB 상세 메커니즘

**특징:**

- **바이트코드 조작**: ASM 라이브러리로 서브클래스 생성
- **FastClass 최적화**: 리플렉션 없이 직접 메서드 호출
- **다양한 콜백**: 메서드별로 다른 처리 로직 적용 가능

**핵심 클래스:**

- `CglibAopProxy`: CGLIB Enhancer 설정 및 관리
- `DynamicAdvisedInterceptor`: MethodInterceptor 구현체
- `MethodProxy`: FastClass 기반 고성능 메서드 호출

## 성능 비교 및 트레이드오프

**CGLIB 장점:**

- **메서드 호출 성능**: 2-3배 빠름 (리플렉션 제거)
- **클래스 기반**: 인터페이스 없어도 프록시 가능
- **일관성**: 모든 빈에 동일한 프록시 방식 적용

**JDK Dynamic Proxy 장점:**

- **생성 속도**: 프록시 생성이 빠름
- **메모리 효율**: 바이트코드 생성 없어 메모리 절약
- **JVM 내장**: 외부 라이브러리 의존성 없음


---
## CGLIB FastClass



```java
/**
 * CGLIB이 실제로 생성하는 바이트코드 예시
 * 원본 클래스: UserService
 */
public class UserService {
    public void saveUser(String name) {
        System.out.println("Saving user: " + name);
    }
}

/**
 * CGLIB이 런타임에 생성하는 프록시 클래스 (의사코드)
 * 실제 클래스명: UserService$$EnhancerBySpringCGLIB$$12345678
 */
public class UserService$$EnhancerBySpringCGLIB$$12345678 extends UserService {
    
    private MethodInterceptor CGLIB$CALLBACK_0; // DynamicAdvisedInterceptor
    private static Method CGLIB$saveUser$0$Method;
    private static MethodProxy CGLIB$saveUser$0$Proxy;
    
    static {
        // 클래스 로딩 시 메서드 정보 캐싱
        CGLIB$saveUser$0$Method = ReflectUtils.findMethod("saveUser", 
            UserService.class, new Class[] { String.class });
        CGLIB$saveUser$0$Proxy = MethodProxy.create(UserService.class, 
            UserService$$EnhancerBySpringCGLIB$$12345678.class, 
            "(Ljava/lang/String;)V", "saveUser", "CGLIB$saveUser$0");
    }
    
    @Override
    public void saveUser(String name) {
        MethodInterceptor interceptor = this.CGLIB$CALLBACK_0;
        if (interceptor == null) {
            // 콜백이 없으면 부모 메서드 직접 호출
            super.saveUser(name);
        } else {
            // AOP 인터셉터를 통한 호출
            try {
                interceptor.intercept(this, CGLIB$saveUser$0$Method, 
                    new Object[] { name }, CGLIB$saveUser$0$Proxy);
            } catch (Throwable t) {
                throw new UndeclaredThrowableException(t);
            }
        }
    }
    
    // FastClass에서 사용할 직접 호출 메서드
    final void CGLIB$saveUser$0(String name) {
        super.saveUser(name);
    }
}

/**
 * CGLIB이 생성하는 FastClass (성능 최적화의 핵심)
 * 클래스명: UserService$$FastClassBySpringCGLIB$$87654321
 */
public class UserService$$FastClassBySpringCGLIB$$87654321 extends FastClass {
    
    @Override
    public Object invoke(int index, Object target, Object[] args) throws InvocationTargetException {
        UserService obj = (UserService) target;
        
        // 메서드 인덱스로 직접 분기 - switch문으로 최적화
        switch (index) {
            case 0:  // saveUser 메서드
                obj.saveUser((String) args[0]);
                return null;
            case 1:  // getName 메서드  
                return obj.getName();
            case 2:  // setName 메서드
                obj.setName((String) args[0]);
                return null;
            // ... 다른 메서드들
        }
        throw new InvocationTargetException(
            new IllegalArgumentException("Cannot find matching method"));
    }
    
    @Override
    public Object newInstance(int index, Object[] args) throws InvocationTargetException {
        // 생성자 호출도 인덱스 기반으로 최적화
        switch (index) {
            case 0:
                return new UserService();
            case 1:
                return new UserService((String) args[0]);
        }
        throw new InvocationTargetException(
            new IllegalArgumentException("Cannot find matching constructor"));
    }
    
    @Override
    public int getIndex(String name, Class[] parameterTypes) {
        // 메서드 시그니처를 인덱스로 변환
        if ("saveUser".equals(name) && parameterTypes.length == 1 && 
            parameterTypes[0] == String.class) {
            return 0;
        }
        if ("getName".equals(name) && parameterTypes.length == 0) {
            return 1;
        }
        // ...
        return -1;
    }
}

/**
 * MethodProxy의 실제 동작 방식
 */
public class MethodProxy {
    private FastClass f1; // 타겟 클래스의 FastClass
    private FastClass f2; // 프록시 클래스의 FastClass  
    private int i1;       // 타겟 메서드 인덱스
    private int i2;       // 프록시 메서드 인덱스
    
    /**
     * FastClass를 통한 고속 메서드 호출
     * 리플렉션 없이 직접 호출!
     */
    public Object invoke(Object target, Object[] args) throws Throwable {
        try {
            init(); // FastClass 초기화 (한 번만)
            // FastClass.invoke()는 switch문 기반 직접 호출
            return f1.invoke(i1, target, args);
        } catch (InvocationTargetException e) {
            throw e.getTargetException();
        }
    }
    
    /**
     * 프록시를 통한 super 메서드 호출
     */
    public Object invokeSuper(Object proxy, Object[] args) throws Throwable {
        try {
            init();
            // 프록시의 CGLIB$메서드명$0 직접 호출
            return f2.invoke(i2, proxy, args);
        } catch (InvocationTargetException e) {
            throw e.getTargetException();
        }
    }
}

/**
 * 성능 차이가 나는 이유 비교
 */
public class PerformanceComparison {
    
    /**
     * JDK Dynamic Proxy 호출 경로
     */
    public void jdkProxyCall() {
        // 1. 프록시.saveUser("test") 호출
        // 2. InvocationHandler.invoke() 진입
        // 3. Method method = target.getClass().getMethod("saveUser", String.class); // 리플렉션
        // 4. method.invoke(target, "test"); // 리플렉션
        
        // 문제점: 매번 리플렉션 2회 발생
    }
    
    /**
     * CGLIB 호출 경로  
     */
    public void cglibProxyCall() {
        // 1. 프록시.saveUser("test") 호출
        // 2. MethodInterceptor.intercept() 진입  
        // 3. methodProxy.invoke(target, args); // FastClass 사용
        // 4. fastClass.invoke(index, target, args); // switch문으로 직접 호출
        
        // 장점: 리플렉션 0회, 직접 메서드 호출
    }
}


/**
 * CGLIB 프록시 생성 시 실제 과정
 */
public class CglibProxyCreationProcess {
    
    public void createProxy() {
        // 1. ASM을 사용한 바이트코드 생성
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);
        
        // 2. 클래스 헤더 작성
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, 
            "UserService$$EnhancerBySpringCGLIB$$12345678", 
            null, "com/example/UserService", null);
            
        // 3. 필드 추가 (콜백, 메서드 캐시 등)
        cw.visitField(ACC_PRIVATE, "CGLIB$CALLBACK_0", 
            "Lnet/sf/cglib/proxy/MethodInterceptor;", null, null);
            
        // 4. 메서드 오버라이드 코드 생성
        MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "saveUser", 
            "(Ljava/lang/String;)V", null, null);
        // ... 바이트코드 작성 ...
        
        // 5. FastClass 생성
        // 6. 클래스 로더에 로딩
        // 7. 인스턴스 생성 및 콜백 설정
    }
}
```