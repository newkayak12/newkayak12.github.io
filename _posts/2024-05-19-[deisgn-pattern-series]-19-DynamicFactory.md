---
layout: post
categories: [DESIGN_PATTERN]
---
from [Dictionary - Dynamic Factory](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/19.DynamicFactory.md)


# Dynamic Factory
Factory Method의 단점을 보완하기 위한 패턴

# 기존 팩토리 메서드 패턴
오리지날 Factory Method 패턴의 가장 큰 단점은 제품 객체의 갯수마다 공장 서브 클래스를 1:1 매칭으로 모두 구현해야 된다는 점이다. 
그래서 제품 객체가 50개면 공장 객체도 50개를 구현해야 한다. 이는 곧 클래스 폭발로 이어지며 코드 복잡도를 증가시킨다.

# 다이나믹 팩토리 패턴 적용
자바의 Class 클래스를 이용한 Reflection APIVisit Website 기법을 이용하여 유형을 동적으로 등록하고 인스턴스를 초기화 하는 패턴이 바로 Dynamic Factory 패턴이다.
이를 이용해 팩토리 메서드의 서브 클래싱 부피가 늘어나는 한계를 해결 할 수 있다.