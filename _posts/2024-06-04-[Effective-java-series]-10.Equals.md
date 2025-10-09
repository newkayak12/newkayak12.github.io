---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# Equals는 일반 규약을 지켜서 재정의하라


## 정의가 필요/불필요한 경우

1. equal 재정의를 추천하지 않는 경우
 - 인스턴스가 고유하다면 ( 값이 아닌 동작하는 클래스 -> ex) Thread)
 - 인스턴스의 논리적 동치성(logical equality)을 검사할 일이 없다면
 - 상위에서 정의한 equals만으로 충분하다면
 - 클래스가 private 혹은 package-private이고 equals를 호출할 일이 없다면

2. equals 재정의를 추천하는 경우
 - 논리적 동치성 확인할 필요가 있을 경우
 - 상위 클래스의 equals로는 부족할 경우


## 일반 규약
그러면 equals는 어떤 규약을 따라야할까? 아래가 일반 규약이다.

- 반사성(reflexivity) : null이 아닌 모든 값 x에 대해서 `x.equals(x) == true;`
  - 자기 자신은 같아야 한다.
- 대칭성(symmetry) : null이 아닌 모든 참조 값 x,y에 대해서 `x.equals(y) == true` 이면 `y.equals(x) == true`
  - 두 객체 비교 순서를 바꿔도 결과는 같아야 한다.
- 추이성(transitivity) : null이 아닌 x, y, z의 경우 `x.equals(y) == true` 이고 `y.equals(z) == true`이면 `x.equals(z) == true`
  - 삼단 논법과 유사하다.
- 일관성(consistency) : null이 아닌 x,y를 `x.equals(y)`를 여러 번 실행해도 늘 같은 값이 나온다.
  - 반복해도 같은 결과 ( 비교 요소가 불변이든 가변이든 판단에 별 중요하지 않는 요소까지 비교하면 문제가 생길 수 있다.)
- nonNull : null이닌 값에 `x.equals(null) == false`
  - null이 아닌 녀석은 null과 다르다.

이 규약을 어기면 예상하기 어려운 결과를 초래할 수도 있다. 

이 규약은 equals를 override한 서브클래싱한 객체와 부모 객체를 비교했을 때 equals 비교 요소에 따라 결과가 다르게 나타날 수 있다. 그런데 이 둘은
같으면 같은 타입이 아니어서 문제고 달라도 원하는 모습이 나오지 않아서 문제다. `이처럼 구체 클래스를 확장해서 새로운 값을 추가하면서 'equals'를 만족시킬 방법은 없다.`

그래서 상속 대신 has-a 관계로 갖는 `composition`으로 확장하면 해소할 수 있다.

## equals 구현 단계

1. `==` 로 자기 자신 참조인지 확인
2. `instanceof`로 입력 타입을 확인
3. 입력을 올바른 타임으로 형변환(공변성을 이용한다.)
4. 입력한 객체와 자기 자신을 핵심 필드들이 모두 일치하는지 비교 
   - null이 정상 값이라면 `Objects.equals(obj1, obj2)`로 비교해서 `NPE`를 피하자.
   - 비교하기 너무 복잡하면 필드의 표준형(canonical form)을 저장하고 표준형끼리 비교해보자
   - 필드 비교 순서가 `equals`의 성능을 좌우하기도 한다. (확률적으로 다를 가능성이 높은 것 -> 낮은 것으로 비교하자.)
5. equals를 재정의하면 hashcode로 같이 재정의하자