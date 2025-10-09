---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# 생성자 대신 정적 팩토리 메소드

## 정적 팩토리 메소드

해당 클래스의 인스턴스를 반환하는 정적 메소드를 의미한다. (GOF에서 의미하는 팩토리 메소드와는 다르다.)

ex)

```java
public static Boolean valueOf(boolean b) {
    return b ? Boolean.TRUE : Boolean.FALSE;
}
```

## 장점

1. 이름을 가질 수 있다. : 생성자로는 반환될 객체 특성을 제대로 설명하지 못할 수 있다. 
2. 호출될 때마다 인스턴스를 새로 생성할 필요는 없다. : 불변 클래스는 인스턴스를 미리 만들어 놓거나 새로 생성한 것을 캐싱하여 재활용 할 여지가 생겼다. 이는 생성 비용 절감과 직결된다. 
FlyWeight와도 비슷하다. 반복되는 요청에 같은 객체를 반환하는 식으로 인스턴스 생명을 통제할 수 있다. `(Instance-controlled)` 이는 `singleton`이나 
`noninstantiable`로도 만들 수도 있다. 
3. 반환 타입의 하위 타입 객체를 반환할 수 있는 능력이 있다. 
4. 입력 매개변수에 따라 매번 다른 클래스의 객체를 반환할 수 있다. : 반환 타입의 하위 타입이기만 하면 상관이 없다.  
5. 정적 팩토리 메소드를 작성하는 시점에는 반환된 객체의 클래스가 존재하지 않아도 된다. : 이런 부분이 프레임워크를 만드는 근간이 된다고 한다. 
구현과 - 제공을 분리할 수 있게 해준다. 

## 단점
1. 상속을 위해서 `public`, `protected`가 필요한데 정적 팩토리 메소드만 제공하면 하위 클래스를 만들 수 없다. : 이는 결론적으로 컴포지션을 사용하도록 종용한다.
2. 정적 팩토리 메소드는 프로그래머가 찾기 어렵다. : 구현이 드러나 있지 않으므로 인스턴스화할 방법을 알아내야 한다.  이런 문제를 해결 하기 위해서 아래와 같은 규약을 따르는 것이 좋다. 
    - `from` : 매개변수를 하나 받아서 해당 타입의 인스턴스를 반환하는 형변환 메소드이다. -> `Date d = Date.from(instance);`
    - `of` : 여러 매개변수를 받아 적합한 타입의 인스턴스를 반환하는 집계 메소드 -> `Set<Rank> faceCards = EnumSet.of(JACK, QUEEN, KING);`
    - `valueOf`: `from`, `of`의 더 자세한 버전 -> `BigInteger prime = BigInteger.valueof(Integer.MAX_VALUE);`
    - `instance`/`getInstance` : 명시한 인스턴스 반환하지만 같은 인스턴스인지는 알 수 없음 -> `Example.getInstance()`
    - `create`/`newInstance` : 항상 새로운 인스턴스 반환 보장 ->  `Array.newInstance(classObject,arrayLength)`
    - `getType` : 생성할 클래스가 아닌 다른 클래스를 반환하는 팩토리 메소드를 정의한다. -> `Files.getFileStore(path)`
    - `newType` : `newInstance`와 같으니 생성할 클래스가 아닌 다른 클래스를 반환하는 팩토리 메소드를 정의한다. -> `Files.newBufferedReader(path)`
    - `type` : `getType`, `newType`의 짧은 버전 -> `Collections.list(legacyLitany)`