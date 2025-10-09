---
layout: post
categories: [SPRING]
---



from [Dictionary - Spring Utils](https://github.com/newkayak12/Dictionary/blob/master/spring/07.Utils.md)




# BeanUtils
빈으로 만들 클래스 또는 객체에 대해 처리를 위한 Util을 제공한다.
1. findMethod
2. findDeclaredMethod
3. getParameterNames
4. getResolvableConstructor
5. instantiateClass

# ReflectionUtils
리플렉션 API를 편리하게 사용할 수 있도록 해준다. 
1. accessibleConstructor
2. declaresException
3. findField
4. findMethod
5. getDeclaredMethods
6. getAllDeclaredMethods
7. getField
8. setField
9. invokeMethod
10. makeAccessible

# FileCopyUtils
파일 복사를 위한 유틸, 파일을 바이트 배열로 복사하거나 문자열로 복사한다.
1. copy
2. copyToByteArray
3. copyToString

# SystemPropertyUtils
시스템 property를 처리하기 위한 유틸
1. resolvePlaceholders

# Input/OutputStreamUtils
1. copy
2. copyRange
3. copyToByteArray
4. copyToString

# AnnotationUtils
어노테이션, 메타 어노테이션을 핸들링하게 편하게 해주는 유틸
1. findAnnotation(Class<?> clazz, Class<A> annotationType) : 특정 clazz에서 annotationType으로 찾는다.
2. findAnnotation(Method method, Class<A> annotationType) : Method로 순회하면서 annotationType으로 찾는다.

[참고](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/core/annotation/AnnotationUtils.html)
기본적으로 어노테이션을 찾는데 주력으로 한다.

#  AnnotatedElementUtils
어노테이션 내용을 오버라이딩할 때 사용한다. 