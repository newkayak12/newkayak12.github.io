---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# Object보다는 제네릭을 쓰자.

Object를 사용하여 메소드, 클래스를 작성하면 필연적으로 형변환을 마주치게 된다. 이는 당연히 런타임 에러의 위험을 안고 있다. 그렇다면 굳이 Object로 선언하고
형변환하는 불필요한 코드를 작성할 필요가 있을까?

이 경우 제네릭을 사용하여, 컴파일 타임에 타입 체크를 받을 수 있으며, 형변환 하는 불필요한 코드를 줄일 수 있다. 그리고 이 편이 훨씬 type-safe하다.
또한 `<E super Fruit>`나 `<E extends Fruit>` 등과 같이 범위 한정도 가능하며 `<E extends Comparable<E>>`와 같이 재귀적으로 타입한정도 가능하다.
