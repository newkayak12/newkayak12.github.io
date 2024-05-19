from [Dictionary - Equals And Hash Code](https://github.com/newkayak12/Dictionary/blob/master/java/10.EqualsAndHashCode.md)

# EqualsAndHashCode
## Equals
어떤 참조 변수의 값이 같은지 다른지 동등 비교를 할 때 사용
비교할 대상이 객체면 주소 값을 비교한다. 

## override Equals
기본적으로 참조형은 주소 값을 비교한다. 아무래 내부 필드가 같아도 엄연히 다른 주소 값이다. 그래서 Java에서는 필드 값을 비교하도록 오버라이드 해서 주소 값 비교를 
우회한다.

## HashCode
객체 주소 값을 해싱해서 해시코드를 만든 후 반환한다.(객체의 지문과 같다.)
엄밀히 말하면 주소 값으로 만든 고유한 숫자 값이다.

## override Hashcode
만약 Equals만 오버라이드하면 에러를 낸다. java는 equals를 오버라이드하면 당연히 hashcode도 객체의 필드를 다루도록 오버라이드 하도록 한다.
왜냐하면 equals()의 결과가 true면 두 객체의 해시코드는 반드시 같아야 한다는 자바의 규칙때문이다.
이렇게 강요하는 이유는 hash 값을 사용하는 CollectionFrameWork 사용에 문제가 발생하기 때문이다.

ex) set

## Equals and Hashcode 동작 순서?

![](images/eqAndHsh.png)
<cite>https://inpa.tistory.com/entry/JAVA-☕-equals-hashCode-메서드-개념-활용-파헤치기</cite>


### 1. HashCode는 고유하지 않다.
보통 해싱 알고리즘은 서로 다른 주소를 가진 경우 같은 해시코드를 가질 여지가 없다. 64bit(8바이트) 주소값을 hashCode로 이용해서 반환하면
4바이트(32bit)로 강제 캐스팅 되기 때문에 <strong>값이 겹칠 수도 있다.</strong>

<strong> 즉 서로 다른 객체라도 같은 해시코드를 반환할 수 있다. </strong>

### 2. 해결책
`@EqualsAndHashCode`에서 볼 수 있듯 `equals`로 두 객체의 진짜 주소를 직접 비교하는 식으로 극복한다.


## 진짜 주소 값이 필요할때? 
hashcode() 오버라이드 시 비교 대상 객체가 같은지 아닌지를 판별할 수 있다. 그런데, 오버라이드 해버리면 객체 자체의 주소 값(해시코드)가 필요할 때 난감해진다.
그래서 `identityHashCode()`라는 메소드를 제공한다.