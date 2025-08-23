---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# 추상 클래스보다는 인터페이스를 우선하라

자바에서 다중 상속이 불가능하다는 한계점이 있다. 반면 인터페이스는 구현한 클래스가 규약만 잘 지킨다면 어떤 클래스를 상속했든 같은 타입으로 취급한다.
기존 클래스에도 손쉽게 인터페이스를 구현할 수 있다.

이런 인터페이스는 믹스인(mixin) 정의에 안성 맞춤이다. 믹스인을 구현한 클래스에 원래 원 타입 외에도 특정 선택적 행위를 제공한다고 선언하는 효과를 준다.
(swift의 protocol과 유사한 것 같다.) 이처럼 대상 타입의 주된 기능에 선택적 기능을 혼합 한다고 해서 믹스인이라고 부른다. 

인터페이스로는 계층 구조가 없는 타입 프레임 워크를 만들 수 있다. 만일 상속을 이용했다면 소위 말하는 `조합 폭발`이 벌어졌을 수도 있는 상황에도 인터페이스는 유연하게
대응할 수 있다.

한 편 인터페이스와 abstract class를 함께 사용하는 추상 골격 구현(skeletal implementation)을 함께 제공하는 식으로 인터페이스와 추상 클래스의 장점을 모두 취한느 방법 도 있다.


```java
import java.util.Map;

public abstract class AbstractMapEntry<K, V> implements Map.Entry<K, V> {
    
}
```