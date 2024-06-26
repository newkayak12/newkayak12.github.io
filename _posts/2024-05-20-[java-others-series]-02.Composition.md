---
layout: post
categories: [JAVA_OTHERS]
---
from [Dictionary - Composition](https://github.com/newkayak12/Dictionary/blob/master/java/oop/02.Composition.md)

# Composition

## 상속과 합성 개념 정리

|상속(Inheritance)| 합성(Composition)|
|:-----------------:|:------------------:|
|부모 클래스와 자식 클래스 사이의 의존성은 컴파일 타임에 해결 |두 객체 사이의 의존성은 런타임에 해결|
|is-a 관계 |has-a 관계|
|부모클래스의 구현에 의존 결합도가 높음. |구현에 의존하지 않음. <br/> 내부에 포함되는 객체의 구현이 아닌 인터페이스에 의존.|
|클래스 사이의 정적인 관계 |객체 사이의 동적인 관계|
|부모 클래스 안에 구현된 코드 자체를 물려 받아 재사용 |포함되는 객체의 퍼블릭 인터페이스를 재사용|


## 상속
상속(Inheritance)은 객체 지향 4가지 특징중 하나로서 클래스 기반의 프로그래밍에서 가장 먼저 배우는 개념일 것이다.
클래스 상속을 통해 자식 클래스는 부모 클래스의 자원을 물려 받게 되며, 부모 클래스와 다른 부분만 추가하거나 재정의함으로써 기존 코드를 쉽게 확장할 수 있다.
그래서 상속 관계를 `is-a` 관계라도 표현하기도 한다.
상속을 사용하는 경우는 명확한 is - a 관계에 있는 경우, 그리고 상위 클래스가 확장할 목적으로 설게되었고 문서화도 잘되어 있는 경우에 사용하면 좋다.

그러나 상속을 제대로 활용하려면 부모 클래스의 내부 구현에 대해서 상세하게 알아야 하므로 결합도가 높아진다. 또한 상속 관계는 컴파일 타임에 결정되고, 고정되기 때문에
코드를 실행하는 도중에 변경할 수 없다.

따라서 여러 기능을 조합해야 하는 설계에 상속을 이용하게 된다면 모든 조합별로 클래스를 하나하나 추가해주어야 한다. 이것을 클래스 폭발 문제라 한다.

## 합성

합성 기법은 기존 클래스를 상속을 통한 확장하는 대신에, 필드로 클래스의 인스턴스를 참조하게 만드는 설계이다.
예를들어 서로 관련없는 이질적인 클래스의 관계에서, 한 클래스가 다른 클래스의 기능을 사용하여 구현해야 한다면
합성의 방식을 사용한다고 보면 된다.


## 상속의 문제점 
### 1. 결합도가 높아진다.
상속을 하면 부모 - 자식 관계가 컴파일 시점에 결정된다.
### 2. 불필요한 기능 상속
### 3. 부모 클래스의 결함이 그대로 넘어온다. 
### 4. 부모 -자식 클래스의 동시 수정 문제
개념적 결합으로 인해, 부모 클래스를 변경할 때 자식도 같이 변경해야 한다. 
### 5. 메소드 오버라이딩 오동작
자식 클래스에서 부모의 public을 이용할 떄 의도하지 않은 동작을 수반할 수 있다. 이는 캡슐화를 위반한 것이다.
### 6. 불필요한 인터페이스 상속 문제
### 7. 클래스 폭발
새롭게 만든 클래스에 하나의 기존 기능을 연결하기 위해서 상속을 해야하고, 또 상속을 하고... 이런 경우를 클래스 폭발이라고 한다.
### 8. 단일 상속의 한계
C에서 문제로 다중 상속을 제한했는데 이로 인해서 클래스 폭발이 유발된다.


## 합성의 장점
### 1. 결합도를 낮출 수 있다.
### 2. 합성 관계는 실행 시점에 동적으로 변경할 수 있다.
### 3. 불필요한 인터페이스 상속 문제를 해결할 수 있다.
### 4. 메소드 오버라이딩 오동작을 방지할 수 있다.
### 5. 단일 상속 문제를 해소할 수 있다.