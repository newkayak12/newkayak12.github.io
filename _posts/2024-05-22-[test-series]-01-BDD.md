---
layout: post
categories: [TEST]
---

from [Dictionary - BDD](https://github.com/newkayak12/Dictionary/blob/master/test/01.BDD.md)



# BDD(Behavior-Driven Development)

시나리오를 기반으로 테스트하는 패턴을 의마한다. 

- given : 시나리오 진행에 필요한 조건을 미리 설정해두는 단계
- when : 시나리오를 진행 시 필요한 변화를 명시(mocking/ stubbing)
- Then : 예상되는 결과 

## BDDMockito
###  `when().thenReturn();`
- 메소드를 실제 호출하지만 리턴 값을 정의할 수 있다. 
- 메소드 작업이 오래 걸린다면 끝까지 기다려야 한다.
- 실제 메소드를 호출하기에 호출 대상이 문제가 있으면 안된다.
    
###  `doReturn().when();`
- 실제 메소드 호출하지 않으면서 리턴 값을 정의할 수 있다.
- 실제 메소드 호출하지 않기 때문에 호출 대상의 문제 여부는 확인할 수 없다.
- void 리턴 메소드 stubbing 가능
