# 명명 패턴보다 어노테이션

명명패턴은 시그니쳐 네이밍 패턴으로 구분되어야하는 부분, 아닌 부분을 나누는 패턴을 의미한다. 좋은 시도지만 몇 가지 단점이 있다.

- 오타가 나면 안된다.
- 개발자가 의도한대로 실패없이 작동할거라는 보장이 없다.

어노테이션, 위 문제를 해결해주는 강력한 도구다. Annotation을 선언하고 이후 AnnotationProcessor(javax.annotation.processing)로 이를 처리한다.
Junit의 `@Test`가 적절한 예시이다. 단순히 마커 어노테이션으로써 마킹하고 이후 프로세싱하도록 한다. 이러면 비즈니스 로직은 그대로 두고 어노테이션의 관심사면
처리할 수 있다. 보통 이 처리는 리플렉션으로 진행한다.

어노테이션에도 매개변수를 선언해서 이를 처리에 활용할 수도 있다.  이와같이 생각보다 어노테이션으로 할 수 있는 일들은 많다. 굳이 명명 패턴으로 처리할 명분이 없다.