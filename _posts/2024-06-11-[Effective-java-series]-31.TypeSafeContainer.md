---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# 타입 안전 이종 컨테이너

컨테이너 키를 매개변수화한 다음, 컨테이너에 값을 넣거나 뺄 때 매개변수화한 기를 함께 제공하는 설계 방식을 타입 안전 이종 컨테이너 패턴(type safe heterogeneous container pattern)이라고 한다.
각 타입의 Class 객체를 매개변수화 할 수 있는데 `Class<T>`와 같은 형태가 된다. 이런 class 리터럴을 타입 토큰이라고 한다. 


컨테이너에 데이터를 넣을 때 데이터, 타입을 함께 넣고, 뺄 때 `(Class<T>) type.cast()`로 타입 캐스팅하고 리턴하면 된다. cast는 형변환 연산자의 동적 버전이다.
여기서 주의할 것이 있다. 악의적인 클라이언트가 Class 객체를 raw 타입으로 넘기면 type-safe하지 않아질 수 있다. 두 번째로 class 리터럴에는 실체화 불가 타입을 
사용할 수 없다. 즉, `List<String>.class`같은게 불가하단 소리다. 물론 슈퍼 타입 토큰 같은 것으로 해결하려는 노력은 있다. `Class.getGenericSuperclass()`와 `ParameterizedType.getActualTypeArguments()`를 사용해서 실제 타입을 가져올 수 있다.
spring에서는 `ParameterziedTypeReference`라는 이름으로 슈퍼 타입 토큰을 지원한다. 
