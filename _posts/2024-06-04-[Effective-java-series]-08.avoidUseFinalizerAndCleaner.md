---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# finalizer, cleaner 사용하지 않기

1. finalizer는 실행 타이밍을 예측하기 어렵다. finalizer 실행 도중 에러가 생겨도 trace를 알 수 없다. 
2. cleaner는 finalizer보다 덜하긴 하지만 여전히 예측 불가에 느리다.

C++ 과 다르게 자바는  finalizer로 리소스 정리를 해줄 필요가 없다. 대신 `try-with-resource` 등으로 회수한다. 이는 java에서 finalizer, cleaner를 
사용할 이유를 퇴색시킨다. 더 나아가 이 둘은 실행 될지 아닐지도 예측하기 어렵다. 

문제는 이 둘에 `FileStream`을 회수하는 등의 동작을 넣으면 언제 회수할지 모르기 때문에 한정된 자원에 누수가 생긴다. 특히 상태를 수정하는 경우는 절대로 
이 둘에 의존하면 안된다. 언제 실행될지도 모르기 때문이다. 그래도, `FileStream`을 닫는 코드가 없을 때 언제 실행할지 모르지만 실행을 할 수도 있는 안전망 정도로 구현해 놓는 식으로 쓸 수도 있긴하다.

두 번째 문제는 finalizer 공격에 노출될 수도 있다는 것이다. 객체를 서브클래싱하고, initialize를 의도적으로 실패해서 finalizer를 유도하고 거기에 
문제가 될 만한 코드를 심는다.

```java
class IgnoreFinalizer {
    
    //Overrides method that is deprecated and marked for removal in 'java.lang.Object' 
    @Override
    @SuppressWarnings
    protected final void finalize() throws Throwable {
        AssertionError();
    }
}
```