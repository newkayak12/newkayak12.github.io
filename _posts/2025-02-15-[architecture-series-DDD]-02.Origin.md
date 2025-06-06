---
layout: post
categories: [ARCHITECTURE, DDD, DOMAIN]
---

# 배경과 기원

## 탄생
- 2003 에릭 에반스의 **Domain-Driven Design: Tackling Complexity in the Heart of Software**에서 소개됨
- 핵심 비즈니스 문제에 중점을 두기 보다는 기술적 세부사항에 집착하는 것을 인식
- 개발자가 비즈니스 문제를 효과적으로 모델링 할 수 있는 설계 접근법이 필요하다는 것을 깨달음

## 핵심 개념
1. **유비쿼터스 언어:**
   1. 공통의 공유 언어 사용을 강조.
   2. 명확한 의사소통을 보장하고 도메인에 대한 공유된 이해를 가능하게 한다.
2. **전략적 디자인:** 
   1. 핵심 도메인과 그 경계를 식별하고 정의하는 데 중점을 둔 전략적 설계의 개념을 도입
3. **바운디드 컨텍스트:** 
   1. 특정 모델이 유효한 도메인 내에서 명시적인 경계를 정의한느 바운디드 컨텍스트의 개념을 장려
   2. 일관성을 유지하면서 더 큰 시스템 내에서 다양한 모델이 공존할 수 있다.
4. **전술적 설계:**
   1. 도메인의 복잡성과 특정 비즈니스 규칙을 정확하게 반영하는 도메인 모델을 만드는 것이 포함
   
## 영향
1. 도메인을 중심에 배치함으로써 비즈니스 문제를 더 깊이 이해하여 보다 정확하고 강력한 소프트웨어 솔루션으로 이어지게 한다.
2. 비즈니스에 요구사항에 부합하는 유지 관리, 확장 및 발전 가능한 시스템을 만들 수 있다.


## 중요성
### 1. 복잡성 처리
- 복잡한 문제를 더 작고 관리하기 위한 쉬운 부분으로 세분화함으로써 DDD는 체계적이고 구조적인 개발 접근 방식을 가능하게 한다.

### 2. 협업 및 커뮤니케이션
- 도메인 전문가와 개발자 간의 협업과 커뮤니케이션에 중점을 둔다.
- 유비쿼터스 언어를 사용하여 비즈니스와 기술 간의 격차를 해소하고 효과적인 커뮤니케이션 이해를 촉진
#### 2.1. 도메인 전문가와 개발자 간 협업 강화
- 상호 의사 소통으로 도메인의 복잡성을 정확하게 반영하여 더욱 효과적이고 가치를 높이게 된다.
#### 2.2. 소프트웨어 유지 보수성 및 확장성 향상
- 응집성 단위인 바운디드 컨텍스트에 기반하여 모듈화를 강조하고 시간이 지남에 따른 변화해 연쇄적 변화에 면역력이 있다.
#### 2.3. 비즈니스 도메인에 대한 더 명확하고 깊은 이해
- 도메인을 이해하고 모델링하는 데 중점을 둔다.
#### 2.4. 기술적 복잡성 완화
- 다양한 구성 요소 간의 상호 연결과 비즈니스 요구 사항을 솔루션에 매핑하는 과정에서 복잡성이 증가한다.
- 기술적 복잡성을 완화할 수 있는 여러 가지 장치( 애그리거트 루트, 엔티티 등 )로 유지 관리가 가능하고 확장 가능한 소프트웨어를 만들 수 있다.

### 3. 유연성 및 적응성
- 유연성, 적응력이 장점이다.
- 시간이 지남에 따라 변하는 요구사항과 시스템도 따라 진화해야 한다는 것을 인정한다.
- 바운디드 컨텍스트를 사용하면 도메인 모델을 독립적으로 개발하고 업데이트할 수 있으므로 점진적 개발, 적응이 가능

### 4. 코드 품질 개선
- 응집성이 높고 느슨하게 결합된 코드를 생성하도록 장려