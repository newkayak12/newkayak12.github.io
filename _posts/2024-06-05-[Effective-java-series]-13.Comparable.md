---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# Comparable 구현 고려하기

`Comparable` 역시 믹스인 인터페이스다. `compareTo`는 단순 동치성 비교에 더해서 순서까지 비교할 수 있으며, 제네릭하다.

compareTo의 규격은 equals와 비슷하다.

> 객체 간 순서를 비교한다. 작으면 음수, 같으면 0 크면 양수

- Comparable을 구현한 클래스는 모든 x, y에 대해서  `Math.abs(x.compareTo(y)) == Math.abs(y.compareTo(x))`
- Comparable을 구현한 클래스는 추이성을 보장해야 한다. `(x.compareTo(y) > 0 && y.compareTo(z) > 0) 이면 x.comapreTo(z) > 0`
- Comparable을 구현한 클래스는 x.compareTo(y) == 0 이면 `Math.abs(x.compareTo(z)) == Math.abs(y.compareTo(z))`
- `(x.compareTo(y) == 0) == (x.equals(y))`이어야 한다. 이는 필수는 아니다.


문제는 equals랑 같다. 상속 받아서 확장하면 `compareTo` 규약을 지키기 어렵다. 우회법도 같다. 상속 확장 대신 컴포지션으로 확장하면 된다. 