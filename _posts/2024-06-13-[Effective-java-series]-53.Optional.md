---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# 옵셔널 반환은 신중히

옵셔널이 나오기 전, 예외를 던지거나 null을 반환하거나 했다. 그러나 이는 에외를 예외답게 사용하지 않는다는 점과 stackTrace 캡쳐에 리소스가 크게 든다는 점
NPE에 시달려야 한다는 점 불편한 점이 많았다.

`Optional`은 자바 8에 추가 됐다. Optional은 원소 1개를 최대로 가지는 불변 컬렉션이다. Optional에서는 null이면 에러를 던질 수도, 기본 값을 할당할 수도 있다.
NPE에서 비교적 자유로워진다. 예외검사와 NullCheck를 모두 겸할 수 있다. 굉장히 편리하지만 무조건 좋은건 아니다.

Collection, Stream, Array 같은 컨테이너 타입은 Optional로 감싸면 원타입도 무거운데 optional로 감싸서 리소스가 너무 많이 든다. 박싱 타입도 같은 이유로
지양하면 좋다. 그래서 `OptionalInt`, `OptionalLong`, `OptionalDouble`을 제공한다. 기본 타입으로 말이다. 또한 Optional를 컬렉션 키로 하는 것도 지양하자.