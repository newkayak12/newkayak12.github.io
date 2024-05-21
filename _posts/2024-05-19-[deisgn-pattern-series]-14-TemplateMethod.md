from [Dictionary - TemplateMethod](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/14.TemplateMethod.md)


# TemplateMethod

템플릿 메서드(Template Method) 패턴은 여러 클래스에서 공통으로 사용하는 메서드를 템플릿화 하여 상위 클래스에서 정의하고, 하위 클래스마다 세부 동작 사항을 다르게 구현하는 패턴이다.
즉, 변하지 않는 기능(템플릿)은 상위 클래스에 만들어두고 자주 변경되며 확장할 기능은 하위 클래스에서 만들도록 하여, 상위의 메소드 실행 동작 순서는 고정하면서 세부 실행 내용은 다양화 될 수 있는 경우에 사용된다.
템플릿 메소드 패턴은 상속이라는 기술을 극대화하여, 알고리즘의 뼈대를 맞추는 것에 초점을 둔다. 이미 수많은 프레임워크에서 많은 부분에 템플릿 메소드 패턴 코드가 우리도 모르게 적용되어 있다.

![](/assets/img/templateMethod.png)

- AbstractClass(추상 클래스) : 템플릿 메소드를 구현하고, 템플릿 메소드에서 돌아가는 추상 메소드를 선언한다. 이 추상 메소드는 하위 클래스인 ConcreteClass 역할에 의해 구현된다.
- ConcreteClass(구현 클래스) : AbstractClass를 상속하고 추상 메소드를 구체적으로 구현한다. ConcreteClass에서 구현한 메소드는 AbstractClass의 템플릿 메소드에서 호출된다.

# 흐름
```java
abstract class AbstractTemplate {

    // 템플릿 메소드 : 메서드 앞에 final 키워드를 붙이면 자식 클래스에서 오버라이딩이 불가능함.
	// 자식 클래스에서 상위 템플릿을 오버라이딩해서 자기마음대로 바꾸도록 하는 행위를 원천 봉쇄
    public final void templateMethod() {
        // 상속하여 구현되면 실행될 메소드들
        step1();
        step2();
        
        if(hook()) { // 안의 로직을 실행하거나 실행하지 않음
            // ...
        }
        
        step3();
    }

    boolean hook() {
        return true;
    }

    // 상속하여 사용할 것이기 때문에 protected 접근제어자 설정
    protected abstract void step1();
    protected abstract void step2();
    protected abstract void step3();
}


class ImplementationA extends AbstractTemplate {

    @Override
    protected void step1() {}

    @Override
    protected void step2() {}

    @Override
    protected void step3() {}
}

class ImplementationB extends AbstractTemplate {

    @Override
    protected void step1() {}

    @Override
    protected void step2() {}

    @Override
    protected void step3() {}

    // hook 메소드를 오버라이드 해서 false로 하여 템플릿에서 마지막 로직이 실행되지 않도록 설정
    @Override
    protected boolean hook() {
        return false;
    }
}
```

# 특징
## 사용 시기
- 클라이언트가 알고리즘의 특정 단계만 확장하고, 전체 알고리즘이나 해당 구조는 확장하지 않도록 할때
- 동일한 기능은 상위 클래스에서 정의하면서 확장, 변화가 필요한 부분만 하위 클래스에서 구현할 때

## 장점
- 클라이언트가 대규모 알고리즘의 특정 부분만 재정의하도록 하여, 알고리즘의 다른 부분에 발생하는 변경 사항의 영향을 덜 받도록 한다.
- 상위 추상클래스로 로직을 공통화 하여 코드의 중복을 줄일 수 있다.
- 서브 클래스의 역할을 줄이고, 핵심 로직을 상위 클래스에서 관리하므로서 관리가 용이해진다
  - 헐리우드 원칙 (Hollywood Principle) : 고수준 구성요소에서 저수준을 다루는 원칙 (추상화에 의존)

## 단점
- 알고리즘의 제공된 골격에 의해 유연성이 제한될 수 있다.
- 알고리즘 구조가 복잡할수록 템플릿 로직 형태를 유지하기 어려워진다.
- 추상 메소드가 많아지면서 클래스의 생성, 관리가 어려워질 수 있다.
- 상위 클래스에서 선언된 추상 메소드를 하위 클래스에서 구현할 때, 그 메소드가 어느 타이밍에서 호출되는지 클래스 로직을 이해해야 할 필요가 있다.
- 로직에 변화가 생겨 상위 클래스를 수정할 때, 모든 서브 클래스의 수정이 필요 할수도 있다.
- 하위 클래스를 통해 기본 단계 구현을 억제하여 리스코프 치환 법칙을 위반할 여지가 있다.

---------
> ##### 할리우드 원칙 준수
> 헐리우드 원칙(Hollywood Principle) 이란 고수준 모듈(추상클래스, 인터페이스)에 의존하고 고수준 모듈에서 연락(메소드 실행) 하라는 원칙이다.
> 객체 끼리 이상하게 얼키고 설켜, 의존성이 복잡하게 꼬여있는 것을 '의존성 부패(dependency rot)' 라고 부르는데, 헐리우드 원칙을 활용하면 의존성 부패를 방지할 수 있게 된다.
> 자바 프로그래밍으로 간단히 말하자면, 다형성을 이용해 고수준의 객체 타입에서만 왠만하면 메서드 실행을 하라는 말이다.