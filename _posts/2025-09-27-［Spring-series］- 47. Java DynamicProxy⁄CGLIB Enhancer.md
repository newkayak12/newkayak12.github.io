---
layout: page
categories:
  - SPRING
---
# 1. Java DynamicProxy

```java
// java.lang.reflect.Proxy
public class Proxy implements java.io.Serializable {

    /** 프록시 클래스 캐시 - WeakHashMap으로 메모리 누수 방지 */
    private static final WeakHashMap<ClassLoader, Map<List<String>, Object>> proxyClassCache
        = new WeakHashMap<>();

    /** 프록시 클래스 생성 카운터 (고유 클래스명 생성용) */
    private static final AtomicLong nextUniqueNumber = new AtomicLong();

    /** 프록시 클래스명 접두사 */
    private static final String proxyClassNamePrefix = "$Proxy";

    /**
     * 프록시 인스턴스 생성 - 진입점
     */
    public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h) throws IllegalArgumentException {
        Objects.requireNonNull(h);

        final Class<?>[] intfs = interfaces.clone();
        final SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            checkProxyAccess(Reflection.getCallerClass(), loader, intfs);
        }

        // === 핵심: 프록시 클래스 획득 (캐싱됨) ===
        Class<?> cl = getProxyClass0(loader, intfs);

        try {
            if (sm != null) {
                checkNewProxyPermission(Reflection.getCallerClass(), cl);
            }

            // 프록시 클래스의 생성자 획득 (InvocationHandler 매개변수)
            final Constructor<?> cons = cl.getConstructor(constructorParams);
            final InvocationHandler ih = h;
            
            if (!Modifier.isPublic(cl.getModifiers())) {
                AccessController.doPrivileged(new PrivilegedAction<Void>() {
                    public Void run() {
                        cons.setAccessible(true);
                        return null;
                    }
                });
            }
            
            // 프록시 인스턴스 생성
            return cons.newInstance(new Object[]{h});
        } catch (IllegalAccessException|InstantiationException e) {
            throw new InternalError(e.toString(), e);
        } catch (InvocationTargetException e) {
            Throwable t = e.getCause();
            if (t instanceof RuntimeException) {
                throw (RuntimeException) t;
            } else {
                throw new InternalError(t.toString(), t);
            }
        } catch (NoSuchMethodException e) {
            throw new InternalError(e.toString(), e);
        }
    }

    /**
     * 프록시 클래스 생성/캐싱 - 성능 최적화의 핵심
     */
    private static Class<?> getProxyClass0(ClassLoader loader, Class<?>... interfaces) {
        if (interfaces.length > 65535) {
            throw new IllegalArgumentException("interface limit exceeded");
        }

        // 인터페이스 리스트를 키로 캐시에서 프록시 클래스 조회
        return proxyClassCache.get(loader, interfaces);
    }

    /**
     * ProxyClassFactory - 실제 프록시 클래스 생성 팩토리
     */
    private static final class ProxyClassFactory
        implements BiFunction<ClassLoader, Class<?>[], Class<?>>
    {
        // 프록시 클래스명 접두사
        private static final String proxyClassNamePrefix = "$Proxy";

        // 다음 번호 생성을 위한 AtomicLong
        private static final AtomicLong nextUniqueNumber = new AtomicLong();

        @Override
        public Class<?> apply(ClassLoader loader, Class<?>[] interfaces) {
            Map<Class<?>, Boolean> interfaceSet = new IdentityHashMap<>(interfaces.length);
            
            // 인터페이스 유효성 검사
            for (Class<?> intf : interfaces) {
                Class<?> interfaceClass = null;
                try {
                    interfaceClass = Class.forName(intf.getName(), false, loader);
                } catch (ClassNotFoundException e) {
                    // 클래스 로더에 인터페이스가 없음
                }
                
                if (interfaceClass != intf) {
                    throw new IllegalArgumentException(
                        intf + " is not visible from class loader");
                }
                
                if (!interfaceClass.isInterface()) {
                    throw new IllegalArgumentException(
                        interfaceClass.getName() + " is not an interface");
                }
                
                if (interfaceSet.put(interfaceClass, Boolean.TRUE) != null) {
                    throw new IllegalArgumentException(
                        "repeated interface: " + interfaceClass.getName());
                }
            }

            String proxyPkg = null;     // 프록시 클래스 패키지
            int accessFlags = Modifier.PUBLIC | Modifier.FINAL;

            // 인터페이스들의 패키지 확인 (non-public 인터페이스 처리)
            for (Class<?> intf : interfaces) {
                int flags = intf.getModifiers();
                if (!Modifier.isPublic(flags)) {
                    accessFlags = Modifier.FINAL;
                    String name = intf.getName();
                    int n = name.lastIndexOf('.');
                    String pkg = ((n == -1) ? "" : name.substring(0, n + 1));
                    if (proxyPkg == null) {
                        proxyPkg = pkg;
                    } else if (!pkg.equals(proxyPkg)) {
                        throw new IllegalArgumentException(
                            "non-public interfaces from different packages");
                    }
                }
            }

            if (proxyPkg == null) {
                // public 인터페이스들만 있으면 기본 패키지 사용
                proxyPkg = ReflectUtil.PROXY_PACKAGE + ".";
            }

            // 고유한 프록시 클래스명 생성
            long num = nextUniqueNumber.getAndIncrement();
            String proxyName = proxyPkg + proxyClassNamePrefix + num;

            // === 핵심: 프록시 클래스 바이트코드 생성 ===
            byte[] proxyClassFile = ProxyGenerator.generateProxyClass(
                proxyName, interfaces, accessFlags);
            
            try {
                // 생성된 바이트코드를 클래스 로더에 로딩
                return defineClass0(loader, proxyName,
                                    proxyClassFile, 0, proxyClassFile.length);
            } catch (ClassFormatError e) {
                throw new IllegalArgumentException(e.toString());
            }
        }
    }
}

/**
 * ProxyGenerator - 실제 바이트코드 생성 클래스
 */
public class ProxyGenerator {

    /** 클래스 파일 버전 */
    private static final int CLASSFILE_MAJOR_VERSION = 49;
    private static final int CLASSFILE_MINOR_VERSION = 0;

    /** 생성할 프록시 클래스 정보 */
    private String className;
    private Class<?>[] interfaces;
    private int accessFlags;

    /** 상수 풀 */
    private ConstantPool cp = new ConstantPool();

    /** 메서드 리스트 */
    private List<MethodInfo> methods = new ArrayList<>();

    /** 필드 리스트 */
    private List<FieldInfo> fields = new ArrayList<>();

    /**
     * 프록시 클래스 바이트코드 생성 메인 메서드
     */
    public static byte[] generateProxyClass(final String name,
                                           Class<?>[] interfaces,
                                           int accessFlags) {
        ProxyGenerator gen = new ProxyGenerator(name, interfaces, accessFlags);
        final byte[] classFile = gen.generateClassFile();

        // 프록시 클래스 파일 저장 옵션 (디버깅용)
        if (saveGeneratedFiles) {
            java.security.AccessController.doPrivileged(
                new java.security.PrivilegedAction<Void>() {
                    public Void run() {
                        try {
                            int i = name.lastIndexOf('.');
                            Path path;
                            if (i > 0) {
                                Path dir = Paths.get(name.substring(0, i).replace('.', File.separatorChar));
                                Files.createDirectories(dir);
                                path = dir.resolve(name.substring(i+1, name.length()) + ".class");
                            } else {
                                path = Paths.get(name + ".class");
                            }
                            Files.write(path, classFile);
                            return null;
                        } catch (IOException e) {
                            throw new InternalError(
                                "I/O exception saving generated file: " + e);
                        }
                    }
                });
        }

        return classFile;
    }

    /**
     * 실제 클래스 파일 생성
     */
    private byte[] generateClassFile() {
        // 1. 기본 메서드들 추가
        addProxyMethod(hashCodeMethod, Object.class);
        addProxyMethod(equalsMethod, Object.class);
        addProxyMethod(toStringMethod, Object.class);

        // 2. 인터페이스 메서드들 추가
        for (Class<?> intf : interfaces) {
            for (Method m : intf.getMethods()) {
                addProxyMethod(m, intf);
            }
        }

        // 3. 생성자 추가
        methods.add(generateConstructor());

        // 4. 필드 추가 (InvocationHandler 참조)
        fields.add(new FieldInfo("h", "Ljava/lang/reflect/InvocationHandler;",
                                 ACC_PRIVATE | ACC_FINAL));

        // 5. === 바이트코드 생성 ===
        cp.getClass(dotToSlash(className));
        cp.getClass(superclassName);
        for (Class<?> intf : interfaces) {
            cp.getClass(dotToSlash(intf.getName()));
        }

        // 프록시 메서드들에 대한 정적 필드 추가
        for (List<ProxyMethod> sigmethods : proxyMethods.values()) {
            for (ProxyMethod pm : sigmethods) {
                pm.codeGeneration(cp);
            }
        }

        // ClassFile 구조 생성
        ByteArrayOutputStream bout = new ByteArrayOutputStream();
        DataOutputStream dout = new DataOutputStream(bout);

        try {
            // 클래스 파일 헤더
            dout.writeInt(0xCAFEBABE);                 // magic
            dout.writeShort(CLASSFILE_MINOR_VERSION);  // minor version
            dout.writeShort(CLASSFILE_MAJOR_VERSION);  // major version

            cp.write(dout);              // 상수 풀

            dout.writeShort(accessFlags); // access flags
            dout.writeShort(cp.getClass(dotToSlash(className)));  // this class
            dout.writeShort(cp.getClass(superclassName));         // super class

            // 인터페이스들
            dout.writeShort(interfaces.length);
            for (Class<?> intf : interfaces) {
                dout.writeShort(cp.getClass(dotToSlash(intf.getName())));
            }

            // 필드들
            dout.writeShort(fields.size());
            for (FieldInfo f : fields) {
                f.write(dout);
            }

            // 메서드들  
            dout.writeShort(methods.size());
            for (MethodInfo m : methods) {
                m.write(dout);
            }

            dout.writeShort(0); // 속성들 (없음)

        } catch (IOException e) {
            throw new InternalError("unexpected I/O Exception", e);
        }

        return bout.toByteArray();
    }

    /**
     * 프록시 메서드 바이트코드 생성
     */
    private void addProxyMethod(Method m, Class<?> fromClass) {
        String name = m.getName();
        Class<?>[] parameterTypes = m.getParameterTypes();
        Class<?> returnType = m.getReturnType();
        Class<?>[] exceptionTypes = m.getExceptionTypes();

        String sig = name + getParameterDescriptors(parameterTypes);
        List<ProxyMethod> sigmethods = proxyMethods.get(sig);
        if (sigmethods != null) {
            for (ProxyMethod pm : sigmethods) {
                if (returnType == pm.returnType) {
                    List<Class<?>> legalExceptions = new ArrayList<>();
                    collectCompatibleTypes(
                        exceptionTypes, pm.exceptionTypes, legalExceptions);
                    collectCompatibleTypes(
                        pm.exceptionTypes, exceptionTypes, legalExceptions);
                    pm.exceptionTypes = new Class<?>[legalExceptions.size()];
                    pm.exceptionTypes = legalExceptions.toArray(pm.exceptionTypes);
                    return;
                }
            }
        } else {
            sigmethods = new ArrayList<>(3);
            proxyMethods.put(sig, sigmethods);
        }
        sigmethods.add(new ProxyMethod(name, parameterTypes, returnType,
                                       exceptionTypes, fromClass));
    }
}

/**
 * 생성된 프록시 클래스의 실제 모습 (의사코드)
 * 클래스명: $Proxy0 (implements UserService, Serializable)
 */
public final class $Proxy0 extends Proxy implements UserService {
    
    private static Method m1; // hashCode
    private static Method m2; // equals  
    private static Method m3; // toString
    private static Method m4; // saveUser
    
    static {
        try {
            m1 = Class.forName("java.lang.Object").getMethod("hashCode");
            m2 = Class.forName("java.lang.Object").getMethod("equals", Class.forName("java.lang.Object"));
            m3 = Class.forName("java.lang.Object").getMethod("toString");
            m4 = Class.forName("com.example.UserService").getMethod("saveUser", Class.forName("java.lang.String"));
        } catch (NoSuchMethodException e) {
            throw new NoSuchMethodError(e.getMessage());
        } catch (ClassNotFoundException e) {
            throw new NoClassDefFoundError(e.getMessage());
        }
    }
    
    public $Proxy0(InvocationHandler h) {
        super(h);
    }
    
    @Override
    public final void saveUser(String name) throws {
        try {
            // InvocationHandler.invoke() 호출
            super.h.invoke(this, m4, new Object[]{name});
            return;
        } catch (RuntimeException | Error e) {
            throw e;
        } catch (Throwable e) {
            throw new UndeclaredThrowableException(e);
        }
    }
    
    @Override
    public final boolean equals(Object obj) {
        try {
            return (Boolean) super.h.invoke(this, m2, new Object[]{obj});
        } catch (RuntimeException | Error e) {
            throw e;
        } catch (Throwable e) {
            throw new UndeclaredThrowableException(e);
        }
    }
    
    // hashCode, toString 등도 동일한 패턴...
}

/**
 * 메모리 구조 및 가비지 컬렉션
 * 
 *    ## 1 프록시 클래스 캐시 구조
 *    - WeakHashMap: ClassLoader가 GC되면 캐시도 함께 정리
 *    - 메모리 누수 방지를 위한 설계
 *    
 *        
 *    ## 2 프록시 클래스 로딩 과정
 *    1. ProxyGenerator가 바이트코드 생성
 *    2. ClassLoader.defineClass()로 JVM에 로딩
 *    3. Method Cache에 메서드 정보 저장
 *    4. JIT 컴파일러가 최적화 수행
 *    
 *        
 *    ## 3 성능 특성
 *    - 클래스 생성: 느림 (바이트코드 생성 + 로딩)
 *    - 메서드 호출: 보통 (리플렉션 오버헤드)
 *    - 메모리 사용: 적음 (필요한 메서드만 생성)
 */    

```

----
### Java Dynamic Proxy 핵심 포인트

1. **바이트코드 생성 과정:**
	- **ProxyGenerator**: 인터페이스 분석 → 메서드별 바이트코드 생성
	- **상수 풀**: 메서드 정보들을 정적 필드로 캐싱
	- **클래스 로더**: `defineClass0()` 네이티브 메서드로 JVM 로딩
2. **성능 특성:**
	- **클래스 생성**: 바이트코드 생성 비용 높음
	- **메서드 호출**: 리플렉션으로 인한 오버헤드
	- **메모리**: WeakHashMap으로 효율적 캐싱
3. **제약사항:**
	- **인터페이스 필수**: 클래스 직접 프록시 불가
	- **리플렉션 의존**: Method.invoke() 성능 한계
	- **패키지 제약**: non-public 인터페이스들은 같은 패키지여야 함



# 2. CGLIB Enhancer
```java

// net.sf.cglib.proxy.Enhancer
public class Enhancer extends AbstractClassGenerator {

    /** 생성할 서브클래스의 상위 클래스 */
    private Class superclass;
    
    /** 구현할 인터페이스들 */
    private Class[] interfaces;
    
    /** 메서드 호출 시 실행될 콜백들 */
    private Callback[] callbacks;
    
    /** 메서드별 콜백 선택 필터 */
    private CallbackFilter filter;
    
    /** 바이트코드 생성 전략 */
    private GeneratorStrategy strategy = DefaultGeneratorStrategy.INSTANCE;

    /**
     * 프록시 클래스 생성 및 인스턴스 반환
     */
    public Object create(Class[] argumentTypes, Object[] arguments) {
        classOnly = false;
        argumentTypes = (argumentTypes != null) ? argumentTypes : Constants.EMPTY_CLASS_ARRAY;
        arguments = (arguments != null) ? arguments : Constants.EMPTY_OBJECT_ARRAY;
        
        // === 핵심: 프록시 클래스 생성 ===
        return createHelper(argumentTypes, arguments);
    }

    private Object createHelper(Class[] argumentTypes, Object[] arguments) {
        preValidate();
        
        // 캐시 키 생성 (클래스 로더 + 상위클래스 + 인터페이스 + 콜백 타입들)
        Object key = KEY_FACTORY.newInstance((superclass != null) ? superclass.getName() : null,
                ReflectUtils.getNames(interfaces),
                filter == ALL_ZERO ? null : new WeakCacheKey<CallbackFilter>(filter),
                callbackTypes,
                useFactory,
                interceptDuringConstruction,
                serialVersionUID);
        this.currentKey = key;
        
        // === 캐싱된 클래스 조회 또는 새로 생성 ===
        Object result = super.create(key);
        return result;
    }

    /**
     * 실제 바이트코드 생성 로직
     */
    public byte[] generateClass(ClassVisitor v) throws Exception {
        Class sc = (superclass == null) ? Object.class : superclass;

        if (TypeUtils.isFinal(sc.getModifiers()))
            throw new IllegalArgumentException("Cannot subclass final class " + sc.getName());
        
        List constructors = new ArrayList(Arrays.asList(sc.getDeclaredConstructors()));
        filterConstructors(sc, constructors);

        // 메서드 정보 수집 및 분석
        List methods = CollectionUtils.transform(ReflectUtils.addAllMethods(sc, new ArrayList()), 
                                                 new ReflectUtils.MethodInfoTransformer());
        CollectionUtils.filter(methods, new VisibilityPredicate(sc, true));
        CollectionUtils.filter(methods, new DuplicatesPredicate());
        CollectionUtils.filter(methods, new RejectModifierPredicate(Modifier.FINAL));
        
        // 인터페이스 메서드들도 추가
        for (int i = 0; i < interfaces.length; i++) {
            if (interfaces[i] != Factory.class) {
                List interfaceMethods = ReflectUtils.addAllMethods(interfaces[i], new ArrayList());
                methods.addAll(interfaceMethods);
            }
        }
        
        CollectionUtils.filter(methods, new DuplicatesPredicate());
        CollectionUtils.filter(methods, new RejectModifierPredicate(Modifier.STATIC));

        // === ASM ClassVisitor를 통한 바이트코드 생성 ===
        ClassEmitter ce = new ClassEmitter(v);
        
        // 1. 클래스 헤더 설정
        ce.begin_class(Constants.V1_8,
                      Constants.ACC_PUBLIC,
                      getClassName(),
                      Type.getType(sc),
                      (useFactory ?
                       TypeUtils.add(TypeUtils.getTypes(interfaces), FACTORY_TYPE) :
                       TypeUtils.getTypes(interfaces)),
                      Constants.SOURCE_FILE);

        // 2. 필드 생성
        List<FieldInfo> fields = new ArrayList<>();
        
        // 콜백 필드들 (CGLIB$CALLBACK_0, CGLIB$CALLBACK_1, ...)
        for (int i = 0; i < callbackTypes.length; i++) {
            ce.declare_field(Constants.ACC_PRIVATE,
                           getCallbackField(i),
                           Type.getType(callbackTypes[i]),
                           null);
        }
        
        // 정적 메서드 필드들 (CGLIB$메서드명$0$Method)
        for (Iterator it = methods.iterator(); it.hasNext();) {
            MethodInfo method = (MethodInfo) it.next();
            int index = filter.accept(method.getMethod());
            if (index >= callbackTypes.length) {
                throw new IllegalArgumentException("Callback filter returned an index (" + 
                                                 index + ") that is too large for the callback array");
            }
            emitMethods.add(method);
            emitCallbacks.add(Integer.valueOf(index));
            
            // Method 객체를 저장할 정적 필드
            ce.declare_field(Constants.ACC_PRIVATE | Constants.ACC_STATIC,
                           getMethodField(method),
                           REFLECT_METHOD_TYPE,
                           null);
            
            // MethodProxy 객체를 저장할 정적 필드  
            ce.declare_field(Constants.ACC_PRIVATE | Constants.ACC_STATIC,
                           getMethodProxyField(method),
                           METHODPROXY_TYPE,
                           null);
        }

        // 3. === 정적 초기화 블록 생성 ===
        CodeEmitter e = ce.begin_static();
        e.catch_exception(begin, end, THROWABLE_TYPE);
        
        for (int i = 0; i < emitMethods.size(); i++) {
            MethodInfo method = (MethodInfo) emitMethods.get(i);
            
            // Method 객체 생성 및 저장
            // CGLIB$메서드명$0$Method = Class.forName("상위클래스").getMethod("메서드명", 매개변수타입들);
            e.push(sc.getName());
            e.invoke_static(CLASS_TYPE, FOR_NAME);
            e.push(method.getSignature().getName());
            e.push(method.getSignature().getArgumentTypes());
            e.invoke_virtual(CLASS_TYPE, GET_DECLARED_METHOD);
            e.putstatic(getThisType(), getMethodField(method), REFLECT_METHOD_TYPE);
            
            // MethodProxy 객체 생성 및 저장
            // CGLIB$메서드명$0$Proxy = MethodProxy.create(상위클래스, 현재클래스, 시그니처, 메서드명, 내부메서드명);
            e.push(sc);
            e.push(getThisType());
            e.push(method.getSignature().getDescriptor());
            e.push(method.getSignature().getName());
            e.push(getMethodProxyName(method));
            e.invoke_static(METHODPROXY_TYPE, CREATE);
            e.putstatic(getThisType(), getMethodProxyField(method), METHODPROXY_TYPE);
        }
        e.return_value();
        e.end_method();

        // 4. === 생성자들 생성 ===
        for (Iterator it = constructors.iterator(); it.hasNext();) {
            Constructor constructor = (Constructor) it.next();
            
            CodeEmitter e2 = EmitUtils.begin_constructor(ce, constructor);
            e2.load_this();
            e2.dup();
            e2.load_args();
            e2.super_invoke_constructor(constructor);
            e2.return_value();
            e2.end_method();
        }

        // 5. === 메서드들 오버라이드 ===
        for (int i = 0; i < emitMethods.size(); i++) {
            MethodInfo method = (MethodInfo) emitMethods.get(i);
            int index = ((Integer) emitCallbacks.get(i)).intValue();
            
            emitMethod(ce, method, index);
        }

        // 6. Factory 인터페이스 구현 (콜백 설정용)
        if (useFactory) {
            emitSetCallback(ce);
            emitSetCallbacks(ce);
            emitGetCallback(ce);
            emitGetCallbacks(ce);
            emitNewInstance(ce);
        }

        ce.end_class();
        return ce.toByteArray();
    }

    /**
     * 개별 메서드 오버라이드 코드 생성
     */
    private void emitMethod(ClassEmitter ce, MethodInfo method, int index) {
        Method m = method.getMethod();
        int modifiers = Constants.ACC_PUBLIC;
        if (m.getDeclaringClass().isInterface()) {
            modifiers |= Constants.ACC_PUBLIC;
        }

        CodeEmitter e = EmitUtils.begin_method(ce, method, modifiers);
        Label nullInterceptor = e.make_label();
        Label endLabel = e.make_label();

        // 콜백 로딩
        e.load_this();
        e.getfield(getCallbackField(index));
        e.dup();
        e.ifnull(nullInterceptor);

        // === MethodInterceptor.intercept() 호출 ===
        if (callbackTypes[index].isAssignableFrom(MethodInterceptor.class)) {
            // intercept(Object obj, Method method, Object[] args, MethodProxy proxy)
            e.load_this();                                    // obj
            e.getstatic(getThisType(), getMethodField(method), REFLECT_METHOD_TYPE); // method
            e.create_arg_array();                            // args
            e.getstatic(getThisType(), getMethodProxyField(method), METHODPROXY_TYPE); // proxy
            e.invoke_interface(METHODINTERCEPTOR_TYPE, INTERCEPT);
            e.unbox_or_zero(method.getSignature().getReturnType());
            e.return_value();
        }

        // 콜백이 null인 경우 super 메서드 직접 호출
        e.mark(nullInterceptor);
        e.load_this();
        e.load_args();
        e.super_invoke(method);
        e.return_value();

        e.mark(endLabel);
        e.end_method();

        // === 내부 메서드 생성 (CGLIB$메서드명$0) ===
        // super.메서드명() 직접 호출용
        CodeEmitter e2 = ce.begin_method(Constants.ACC_FINAL,
                                        new Signature(getMethodProxyName(method), 
                                                    method.getSignature().getDescriptor()),
                                        method.getExceptionTypes());
        e2.load_this();
        e2.load_args();
        e2.super_invoke(method);
        e2.return_value();
        e2.end_method();
    }
}

/**
 * ASM ClassVisitor를 사용한 실제 바이트코드 생성
 */
public class ClassEmitter extends ClassVisitor {
    
    private Type classType;
    private ClassWriter cw;

    public ClassEmitter(ClassVisitor cv) {
        super(Opcodes.ASM7, cv);
        this.cw = (ClassWriter) cv;
    }

    /**
     * 클래스 헤더 생성
     */
    public void begin_class(int version, int access, String className, Type superType, 
                           Type[] interfaces, String source) {
        this.classType = Type.getObjectType(className);
        
        // ASM ClassWriter를 통한 바이트코드 생성
        cv.visit(version,
                access,
                className,
                null,
                superType.getInternalName(),
                TypeUtils.toInternalNames(interfaces));
        
        if (source != null) {
            cv.visitSource(source, null);
        }
    }

    /**
     * 메서드 바이트코드 생성
     */
    public CodeEmitter begin_method(int access, Signature sig, Type[] exceptions) {
        MethodVisitor mv = cv.visitMethod(access,
                                         sig.getName(),
                                         sig.getDescriptor(),
                                         null,
                                         TypeUtils.toInternalNames(exceptions));
        return new CodeEmitter(this, mv, access, sig, exceptions);
    }

    /**
     * 필드 선언
     */
    public void declare_field(int access, String name, Type type, Object value) {
        cv.visitField(access, name, type.getDescriptor(), null, value);
    }
}

/**
 * FastClass 생성 과정
 */
public class FastClassGeneration {
    
    /**
     * FastClass 바이트코드 생성 (MethodProxy.create() 시점)
     * 클래스명: UserService$$FastClassBySpringCGLIB$$87654321
     */
    public void generateFastClass() {
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);
        
        // 클래스 헤더
        cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER,
                "UserService$$FastClassBySpringCGLIB$$87654321",
                null, "net/sf/cglib/reflect/FastClass", null);
        
        // === invoke 메서드 생성 ===
        MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "invoke", 
                "(ILjava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;", null, 
                new String[] { "java/lang/reflect/InvocationTargetException" });
        
        mv.visitCode();
        mv.visitVarInsn(ALOAD, 2);  // target 객체 로드
        mv.visitTypeInsn(CHECKCAST, "com/example/UserService");
        mv.visitVarInsn(ASTORE, 4); // 타입캐스팅된 객체 저장
        
        // switch문으로 메서드 인덱스 분기
        mv.visitVarInsn(ILOAD, 1);  // index 로드
        
        Label defaultLabel = new Label();
        Label[] labels = new Label[메서드개수];
        // ... labels 초기화 ...
        
        mv.visitTableSwitchInsn(0, 메서드개수-1, defaultLabel, labels);
        
        // 각 메서드별 직접 호출 코드
        for (int i = 0; i < 메서드개수; i++) {
            mv.visitLabel(labels[i]);
            mv.visitVarInsn(ALOAD, 4);      // 타겟 객체
            // 매개변수들 언박싱 및 로드
            // 직접 메서드 호출 (INVOKEVIRTUAL)
            // 반환값 박싱
            mv.visitInsn(ARETURN);
        }
        
        // default case - 예외 발생
        mv.visitLabel(defaultLabel);
        mv.visitTypeInsn(NEW, "java/lang/reflect/InvocationTargetException");
        // ...
        
        mv.visitMaxs(0, 0);
        mv.visitEnd();
    }
}


/**
 * CGLIB vs JDK Proxy 바이트코드 크기 비교
 *
 *   
 *   
 *   ## 1 JDK Proxy 생성 바이트코드 크기
 *   - 기본 메서드들 (equals, hashCode, toString) + 인터페이스 메서드들
 *   - 약 1-2KB (메서드 개수에 비례)
 *   
 *     
 *   ## 2 CGLIB Proxy 생성 바이트코드 크기  
 *   - 원본 클래스 + 오버라이드 메서드들 + 내부 메서드들 + FastClass
 *   - 약 5-10KB (메서드 개수의 3배)
 *   - FastClass 추가로 더 많은 메모리 사용
 *   
 *     
 *   ## 3 생성 시간 비교
 *   - JDK Proxy: ProxyGenerator + defineClass (~1ms)
 *   - CGLIB: ASM 바이트코드 조작 + FastClass 생성 (~5-10ms)
 *   
 *     
 *   ## 4실행 시간 비교 (메서드 호출 1000만회)
 *   - JDK Proxy: ~500ms (Method.invoke 리플렉션)
 *   - CGLIB: ~200ms (FastClass 직접 호출)
 *   
 */
 
 ```


### CGLIB Enhancer 핵심 메커니즘

1. **ASM 바이트코드 조작:**
	- **ClassEmitter**: ASM ClassVisitor 래퍼로 편리한 바이트코드 생성
	- **CodeEmitter**: 메서드 바이트코드 생성 (조건문, 반복문, 메서드 호출 등)
	- **동적 클래스 생성**: 런타임에 서브클래스 + FastClass 2개 클래스 생성
2.  **성능 최적화 전략:**
	- **정적 필드 캐싱**: Method, MethodProxy 객체들을 클래스 로딩 시 생성
	- **FastClass**: switch문 기반 직접 메서드 호출로 리플렉션 제거
	- **내부 메서드**: `CGLIB$메서드명$0`으로 super 호출 최적화
3. **메모리 구조:**
	- **프록시 클래스**: 원본 클래스 크기의 약 3배
	- **FastClass**: 메서드별 인덱스 매핑 테이블
	- **캐시**: WeakHashMap으로 클래스 로더별 관리