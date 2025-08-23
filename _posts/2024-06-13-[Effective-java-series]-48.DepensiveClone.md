---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# 방어적 복사본을 고려하자.

자바는 시스템의 다른 부분과는 별개다. 그래서 불변식이 자연스레 지켜진다. 그럼에도 불변식을 지키기 위한 노력은 계속된다. 우리는 개발할 때 누군가는 이를 무너뜨리려한다고
가정하고 방어적으로 프로그램을 작성해야 한다. 예를 들어 `java.util.Date` `getter`로 리턴해도 `setYear`같은 메소드를 콜하면 원본이 변경되므로
불변식을 지킬 수 없다. 이런 경우 아예 복사본을 던질 수도 있다.

매개변수 유효성 검사에서도 그 전에 방어적 복사본을 두고 복사본으로 검사하면 특히 멀티쓰레딩 환경에서 원본을 지킬 수 있다는 장점이 있다.

```java
public Period( Date start, Date end ) {
    this.start = new Date(start.getTime());
    this.end = new Date(end.getTime());
    
    if( this.start.compareTo(this.end) > 0 ) throw new IllegalArgumentException();
}
```

위 코드를 보면 이상하다 정상일지 아닐지 모르는 객체를 복사한다? 그러나 위에 기술한 바와 같이 멀티 쓰레딩 환경에서는 찰나에 어떤 문제가 생길지 모른다.
검사시점/사용시점(time-of-check/time-of-use) 공격 혹은 TOCTOU 공격을 받을 경우 위 코드는 방어할 수 있다. 또한 `clone`을 사용하지 않았는데,
clone 재정의로 어떻게 될지 모른다.

```java

public getDate() {
    return this.date;
}

//...


Period period = new Period();
period.getDate().setYear(1);

```
방어적 복사본을 반환해서 위의 불변식을 해치는 상황을 막을 수 있다. 방어적 복사가 불변 객체만을 위한건 아니다. 메소드든 생성자든 클라이언트가 제공한 객체의 참조를
내부의 자료구조에 보관해야 한다면 그 객체가 잠재적으로 변경될 수 있는지 확인해야 한다. 확실할 수 없다면 복사본을 만들자.

방어적 복사가 항상 옳은건 아니다. 성능 저하가 수반되고 항상 사용할 수 있는 건 아니다. 또한, 호출자가 컴포넌트 내부를 수정하지 않을거라는 확신이 있다면 방어적 복사를
생략할 수도 있다. 또한 생략으로 영향이 클라이언트에게만 간다고 확신한다면 생략할 수도 있다. 

