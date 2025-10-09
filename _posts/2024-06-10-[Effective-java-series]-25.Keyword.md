---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# 용어 정리


|       한       |            영            |                     예시                     |
|:-------------:|:-----------------------:|:------------------------------------------:|
|   매개변수화 타입    |   parameterized type    |                List<String>                |
|  실제 타입 매개변수   |  actual type parameter  |                   String                   |
|    제네릭 타입     |      generic type       |                  List<E>                   |
|  정규 타입 매개변수   |  formal type parameter  |                     E                      |
| 비한정적 와일드카드 타입 | unbounded wildcard type |                  List<?>                   |
|     로 타입      |        raw type         |                    List                    |
|  한정적 타입 매개변수  | bounded type parameter  |             <E extends Number>             |
|   재귀적 타입 한정   |  recursive type bound   |         <T extends Comparable<T>>          |
| 한정적 와일드 카드 타입 |  bounded wildcard type  |           List<? extends Number>           |
|    제네릭 메소드    |     generic method      | static<E> List<E> asList( E [] a ) { ... } |
|     타입 토큰     |       type token        |                String.class                |