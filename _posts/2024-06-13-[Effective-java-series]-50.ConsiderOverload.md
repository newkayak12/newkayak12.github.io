---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# 다중 정의는 신중히

다중 정의된 메소드는 컴파일 타임에 정해진다. 그런데! 매개변수가 일전의 다중 정의 매개변수들을 모두 포함할 수 있는 
다중정의라면? 해당 메소드 외는 호출될 가능성이 없다.

```java
import java.util.Collections;

public String overloading(Set<?> set) {
}

public String overloading(List<?> set) {
}

public String overloading(Collection<?> set) {
}
```

위의 파라미터가 Collection<?>인 메소드만 열심히 호출된다. 다중정의한 메소드는 객체 런타임 타입은 중요하지 않다. 오로지 컴파일 타임에,
오직 매개변수의 컴파일 타입에 의해 결정된다. 다중 정의는 혼동을 일으킬 여지가 있는 방식이다. 안전하게 하려면 매개변수 수가 같은 다중정의는 지양하는 것이 좋다.
더구나 가변인수를 사용하는 메소드는 아예 꿈도 꾸지 않는게 좋다. 차라리 이름을 다르게 짓는게 낫다. 

가장 좋은 방법은 위의 여지가 없는 아예 명확히 구분되는 형식으로 다중정의하는 것이 최고다. 다중 정의의 실효성이야 확실하니 말이다.
예를 들어

```java
import java.util.ArrayList;

List<Integer> list = new ArrayList<>();
list.remove();
```

의 경우에서 remove는 (Object o), (int index)가 있다. 여기서 

```java
list.remove(1)을 던지면 둘 중 어떤걸 실행할까? Boxing된 (Object o)? (int index)?
```

다중 정의의 최상의 결과는 언제 어떤 메소드가 불리는지는 모르는데 아주 명확히 잘 작동하는 경우다. 신경 쓸 게 없는 경우말이다.