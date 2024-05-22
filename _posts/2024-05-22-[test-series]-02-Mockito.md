---
layout: post
categories: [TEST]
---
from [Dictionary - Mockito](https://github.com/newkayak12/Dictionary/blob/master/test/02.Mockito.md)


# Mockito

직접 제어할 수 있는 가짜 객체를 지원하는 테스트 프레임워크다.

1. mocking
- @Mock : 가짜 객체를 반환해주는 어노테이션
- @Spy : Stub하지 @Mock과 비슷하지만 실제 객체를 할당하는 어노테이션
- @InjectMocks: @Mock, @Spy를 자동으로 주입시키는 어노테이션

2. Stub
가짜 객체를 주입했을 때 원하는 동작을 오버라이딩하기 위해서 
- doReturn()
- doNothing()
- doThrow()
를 사용할 수 있다. 