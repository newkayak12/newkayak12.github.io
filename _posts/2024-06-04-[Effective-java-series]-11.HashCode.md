---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# HashCode 재정의


## 규약

equals를 재정의하면 hashCode도 재정의해야 한다. Object 명세에서 발췌한 규약을 보자.

- equals 비교에 사용되는 정보가 변경되지 않았다면, 애플리케이션이 실행되는 동안 그 객체의 hashCode 메소드는 몇 번을 호출해도 일관되게 같은 값을 반환해야 한다.
- equals가 두 객체가 같다고 판단한다면 hashCode도 같은 값을 반환해야 한다.
- equals가 두 객체가 다르다고 판단했더라도 hashCode가 무조건 다를 필요는 없다.


## 주의점

- equals에서 사용하지 않은 필드는 '반드시' hashCode에서 제외해야만 한다. 성능 높인답시고 제외시키면 안된다.
- hashCode를 lazy로 설정하려면 threadSafe까지 고려해야 한다.
- hashCode 대상을 공개하지 않는 것이 좋다. 그래야 추후 계산 방식을 바꿀 수도 있다.

## 정의 방법

1. int 필드(result)를 하나 생성한다.
2. 1에서 만든 필드에
   1. Type.hashCode()를 할당한다.
   2. 참조 타입이면 표준형(canonical representation)을 만들어 호출한다.
   3. 필드가 배열이면 핵심 원소를 각각 필드처럼 다룬다. 혹은 Arrays.hashCode를 사용한다.
   4. result = 31 * result + Type.hashCode()를 필드마다 반복한다.

31인 이유는 홀수이면서 소수이기 때문에 전통적으로 썻다고 한다. 위 예시를 풀어보면 아래와 같다.

```java
@Override
public int hashCode () {
    int result = Short.hashCode(a);
    result = 31 * result + Integer.hashCode(b);
    result = 31 * result + Double.hashCode(c);
    
    return result;
}
```