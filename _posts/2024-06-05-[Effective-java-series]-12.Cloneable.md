---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# Clone 재정의는 주의하자

`Cloneable`은 복제해도 되는 클래스임을 명시하는 용도의 믹스인 인터페이스지만 큰 문제는 `clone()`이 선언된 곳이 Object에 있다는 것이다. 이는 단순
Cloneable 구현만으로 clone을 호출할수 없다는 뜻이 된다.

`Cloneable`은 clone의 동작 방식을 결정한다. 여기서 단순 `clone` 은 문제가 있다. 예를 들어 내부에 `Array[]`가 있다고 해보자. 이를 clone하면
복사를 했더라도 같은 배열을 참조하도록 된다. 이는 곧 `복제본 중 하나를 수정하면 다른 하나도 수정되어 불변성을 해친다는 뜻이다.`

clone은 사실상 생성자와 같이 원본 객체에 아무런 해를 끼치지 않는 동시에 복제된 객체의 불변식을 보장해야만 한다. 따라서 올바르게 clone 하려면 내부 정보를
복사해야 한다. 가장 쉬운 방법은 참조형 필드는 직접 clone하는 방법 뿐이다.

여기서 Cloneable 아키텍처는 '가변 객체를 참조하는 필드는 final로 선언'하라는 일반 용법과 충돌한다. 또, Cloneable을 구현한 클래스를 clone 할 때는 ThreadSafe를 보장해야한다.


살짝 두서가 없었지만 정리하면

1. `super.clone()`을 호출하고 필드를 적절히 수정한다. 필요하면 DeepCopy를 수행한다.
2. 접근제한자는 `public`으로
3. 반환 타입은 클래스 자신으로

만약 이게 녹록지 않다면 `복사 생성자`/`복사 팩토리`를 제공할 수 있다.


- 복사 생성자

```java
public class CloneObject {
    public CloneObject(CloneObject co) {
        
        return ....;
    }
}
```

- 복사 팩토리

```java
public class CloneFactory {
    public static CloneFactory newInstance(CloneFactory cloneFactory) {
        
        return .... ;
    }
}
```