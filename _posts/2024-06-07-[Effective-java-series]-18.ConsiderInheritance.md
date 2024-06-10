---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# 상속을 고려하거나 아니면 아예 금지하라

상속용 클래서는 override 할 수 있는  메소드들은 어떻게 내부적으로 사용하는지 문서로 남겨야 한다. 그렇지 않으면 재정의로 예기치 못한 상황이 벌어질 수도 있다.
특히 'Implementation Requirements'로 시작하는 절은 그 메소드의 내부 동작 방식을 설명하는 곳이다. `@ImplSpec`을 붙이면 자바독 도구가 생성한다. 

이는 API 문서가 '어떻게'가 아니라 '무엇'을 하는지 설명해야 한다는 지향점과 대치된다. 그렇지만 클래스를 안전하게 상속할 수 있도록 하기 위해서는 위와 같은
내부 구현 방식을 설명해야 한다.

물론 상속에 의한 영향도룰 줄이려면 외부 노출을 줄이는게 맞지만 너무 적게 노출하면 상속으로 얻는 이점마자 없앨 수 있다. 그러니 주의해야 한다. 
필요하다면 직접 구현해서 영향도를 평가해보는 방법도 좋다. 

또한, 상속용 클래스 생성자는 직/간접적으로 재정의 가능 메소드를 생성자에서 호출하면 안 된다. 추가적으로 `clone`, `readObject`도 생성자와 비슷한 효과를 내므로
이들 또한 재정의 가능 메소드를 호출해서는 안 된다. 

아예 상속을 금지하는 것도 좋은 방법이다. 1) `final`로 선언하거나 2) 모든 생성자를 `private`, `package-private`로 선언하고 `public 정적 팩토리`를 
만드는 방법도 있다. (물론 이런 문제들 때문에 상속을 허용할 클래스만을 지정하는 `permit`이 생겼다.)


```java
public sealed class GameCharacter permits Kirby, Mario {}

public class Kirby extends GameCharacter { } //O

public class Mario extends GameCharacter { } //O

public class Sonic extends GameCharacter { } //X
```