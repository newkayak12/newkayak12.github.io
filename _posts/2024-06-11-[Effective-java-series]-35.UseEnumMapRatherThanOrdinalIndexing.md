---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# ordinal 인덱싱 대신 EnumMap을 사용하자

배열이나 리스트에서 원소를 꺼낼 때 ordinal로 인덱로 사용한다고 해보자.
 그러면 이전부터 있던 문제점이 노출된다. ordinal을 사용해서 정확한 정수 값을 사용한다는 보장이 없다.

이 경우 EnumMap을 사용하는게 나을 수도 있다. EnumMap도 내부에 배열을 사용하기 때문에 성능적으로 전혀 밀리지 않는다. 내부 구현을 숨겨서 Map의 타입 안정성,
배열의 성능을 모두 얻어냈다. 