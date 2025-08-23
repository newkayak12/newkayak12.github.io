---
layout: post
categories: [JAVA_OTHERS]
---
from [Dictionary - OOPD](https://github.com/newkayak12/Dictionary/blob/master/java/oop/04.OOP.md)

# OOP ( Object-Oriented Programming )
## 장점
- 코드의 재사용성이 높아진다.
- 유지보수가 쉽다.
- 코드가 간결해진다.
## 단점
- 처리 시간이 비교적 오래 걸린다.
- 프로그램을 설계할 때 많은 고민과 시간을 투자해야한다.

## 원칙
- S (SRP : Single Responsibility Principle) : 한 클래스는 하나의 책임만 가져야 한다.
- O (OCP : Open/Closed Principle) : 확장에는 열려(Open) 있으나, 변경에는 닫혀(Closed)있어야 한다.
- L (LSP : Liskov’s Substitution Principle) : 프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀 수 있어야 한다.
- I (ISP : Interface Segregation Principle) : 특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다.
- D (DIP : Dependency Inversion Principle) : 추상화에 의존한다. 구체화에 의존하면 안된다.

## 특징
1. 캡슐화
> 실제로 구현 부분을 외부에 드러나지 않도록 하는 것
> 변수와 메소드를 하나로 묶음
> 데이터를 외부에서 직접 접근하지 않고 함수를 통해서만 접근
> 
> ex) public, private, protected
> public : 클래스 외부에서 접근 가능
> private : 클래스 내부에서만 접근 가능
> protected : 상속받은 자식 클래스에서만 접근 가능
 
2. 상속
> 자식 클래스가 부모 클래스의 특성과 기능을 물려받는 것
> 기능의 일부분을 변경하는 경우 자식 클래스에서 상속받아 수정 및 사용함
> 상속은 캡슐화를 유지, 클래스의 재사용이 용이하도록 해 준다.

3. 추상화
> 인터페이스로 클래스들의 공통적인 특성(변수, 메소드)들을 묶어 표현하는 것

4. 다형성
> 어떤 변수,메소드가 상황에 따라 다른 결과를 내는 것