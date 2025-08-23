---
layout: post
title: "[미니 프로젝트] 07 디미터 법칙 적용 중 생긴 고민"
tags:
  - MINI_PROJECT
  - BOOK
categories:
  - MINI_PROJECT
  - BOOK
---
> - [일전의 공부한 내용](./rollup-2025-01.firstHalf.html)을 실제로 구현해보면서 공부해보고자 시작한 프로젝트다.
> - [이전 글](https://newkayak12.github.io/mini_project/book/2025/08/20/mini-project-06-문서-작성에-대해서!.html)
> - 아직 공부 중인 개념입니다. 조금 틀려도 너른 이해 부탁드립니다!
> - 이 글은 개인적인 의견을 다룹니다.

# 다루는 내용
- 디미터 법칙 어떻게 적용할까?

---
# 디미터 법칙 어떻게 적용할까?
## 디미터 법칙이란?
  
> - **디미터 법칙(Law of Demeter)**는 객체지향 설계 원칙 중 하나로, 객체 간 결합도를 낮추고 캡슐화를 강화하기 위한 원칙입니다.  
> - "이웃과만 얘기하라" 라는 원칙입니다.  
    >  
- 자기 자신  
>   - 자신의 필드/프로퍼티  
> - 자신이 생성한 객체  
> - 메소드 매개변수로 받은 객체  
> - 위 객체들의 메소드 결과 값  
> - 이를 위반 하는 사례는 아래와 같습니다.  
> ```kotlin  
> val street = user.getAddress().getStreet().getName()  
> ```  
> - 이를 지키면 아래와 같습니다.  
> ```kotlin  
> val street = user.getStreetName()  
> ```  
>  
> - 왜 하는건가?  
> -  
> |     효과     |                     설명                      |  
> |:----------:|:-------------------------------------------:|  
> |    캡슐화     |               내부 객체 구조를 감춥니다.               |  
> |  유지보수성 향상  | 구조 변경 시 연쇄 변경과 같은 사이드 이펙트 감소(ripple effect) |  
> |   결합도 감소   |              호출자가 내부 구조에 덜 의존               |  
> | 테스트 용이성 증가 |                 객체 경로가 단순해짐                 |  
>   
  
### 과연 "절대적 가치"인가?  
- 프로젝트를 진행하면서 마주하는 상황들이 있다.  
```kotlin  
class Company(  
    val id: String,    private var brand: Brand,    private val business: Business,    private var contact: Contact,    private var address: Address,    private var representative: Representative,) {  
    val brandName: String        get() = brand.name    val brandUrl: String        get() = brand.url  
    fun changeBrand(brand: Brand) {        this.brand = brand    }}  
```  
- 위와 같이 vo로 덮여 있는 객체가 외부에 어떤 구성이 있는지 알리기 싫은 경우  
- 알리더라도 vo를 그대로 뱉고 싶지 않은 경우  
- vo를 그대로 뱉더라도 외부에서 `a.b().c().d()`과 같이 지저분해지는 경우  
- 이런 경우를 위해서 **"사용하는 것"** 에는 디미터 법칙을 지키려고 했다.  
- 다른 환경에서 Company에 내부에 대해서 알 필요는 없다. 더더욱이 내부 '사정'까지 속속들이 알 필요가 없다고 생각했다.  
- 그래야 외부 변경과 단절이 되니까.  
- 그렇게 해야 Company라는 클래스의 의미를 부여하는 작업이 되니까  
  
### 그러나 생각보다 복잡해진다.  
- 위 구조는 java에서 메소드로 처리하던 것들을 getter를 가진 프로퍼티로 변경한 것들이었다.  
- 분명 vo로 의미 단위로 객체를 표현했는데, 어느 날 그 내용물을 다 발골하고 프로퍼티로 작성하는 모습을 볼 수 있었다.  
- 물론 필요한 부분만 노출하기 위해서 선택적으로 진행했다.   
  
### 그러면 어떻게 할 것인가?  
1. VO자체가 불변인 경우: 불변이면 변경 가능성이 적어져서 바깥으로 내보내고 큰 문제가 없다.  
2. VO의 필드가 많은 경우: 모든 경우의 수를 하나씩 다 나열해줄 수는 없다. 이런 경우 비용 대비 효율을 생각해서 그냥 내보내자.  
2. 자주 사용하지 않는 경우: 자주 사용하지 않는 경우까지 생각해서 `Company`를 어지럽게 하면 우리가 도달하고자 하는 목표에 오히려 멀어질 수도 있다.  
3. 정 그러면 복사하자: Kt에서 copy()는 `shallow copy`이다. 중첩 VO를 내보내야 하고 이 과정이 우려가 된다면 copy를 통해서 `deep copy`를 해서 내보내는 방법이 있을 것으로 본다.  
4. KotlinDSL로 작성하자: Lambda와 같은 형식으로 외부에서 받아서 Apply를 한다거나 KotlinDSL로 구성해서 복잡한 작업을 외부로 돌릴 수 있다.