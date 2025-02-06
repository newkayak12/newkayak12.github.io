# Anti-pattern

## 01. 대표적인 안티 패턴
### Singleton

- 클래스의 인스턴스화를 단일 인스턴스로 제한하는 디자인 패턴
- 구현 중 잘못 구현되는 경우가 종종 생긴다.
- 싱글톤 구현을 위해서 정적 메소드, 변수를 사용하는 것이 그 예다.
- 그러면 테스트 가능 성 및 유지 보수성 문제가 발생할 수 있다. 싱글톤 인스턴스와 구현을 긴밀하게 연결하기 때문에 만위 테스트에서 mocking 하거나 교체하기가 어렵다.
- 차라리 의존성주입 또는 `enum`을 사용하는 singleton이 낫다.

### God Object

- 책임이 너무 많거나 시스템의 다른 부분에 대해 너무 많이 알고 있는 클래스를 의미한다.
- 이해, 유지 관리 및 테스트하기 어려운 모놀리식 클래스가 생성된다.
- 갓 객체 방지 패턴을 피하려면 SRP을 따르고 코드에서 관심사를 적절하게 분리하는 것이 좋다.

### MagicNumber

- 코드에서 자명하지 않거나 쉽게 이해할 수 없는 하드 코딩된 숫자 값을 의미한다.
- 이러한 패턴은 혼란, 오류, 유지 관리의 어려움으로 이어질 수 있다.
- 차라리 명명된 상수나, enum을 사용해서 숫자 값을 표현하는 것이 중요하다.
- 그래야 다른 개발자들이 숫자 값의 용도를 쉽게 이해할 수 있고, 잘못 입력되거나 잘못 해석된 값으로 인한 잠재적 오류를 방지할 수 있다.

### ShotgunSurgery

- 하나의 변경으로 여러 클래스 또는 모듈에 걸쳐 여러 번의 변경이 필요할 때 발생
- 코드 중복, 긴밀한 결합, 일관성 유지의 어려움을 초래할 수 있다.
- 이는 캡슐화 부족으로 발생하는 패턴이다.
- OCP를 따르고 코드가 쉽게 확장 가능하고 유지 관리가 가능한지 확인하는 것이 중요하다.

### Null reference

- 코드에서 누락된 값을 표현하기 위해서 optinal, Null 객체 패턴을 이용하는 것이 좋다.

## 설계에서 안티 패턴
- [01.BaseBean.md](01.BaseBean.md)
- [02.GoldenHammer.md](02.GoldenHammer.md)
- [03.InterfaceOverImplementation.md](03.InterfaceOverImplementation.md)
- [04.Poltergeist.md](04.Poltergeist.md)
- [05.BoatAnchor.md](05.BoatAnchor.md)

## 자바에서 안티 패턴
- [06.HardCoding.md](06.HardCoding.md)
- [07.MagicNumber.md](07.MagicNumber.md)
- [08.SingletonAbuse.md](08.SingletonAbuse.md)
- [09.SabotagePerformance.md](09.SabotagePerformance.md)
- [10.OvercomplicatedExpression.md](10.OvercomplicatedExpression.md)

## 안티 코드 패턴
- [11.CodeClones.md](11.CodeClones.md)
- [12.UnnecessaryCondition.md](12.UnnecessaryCondition.md)
- [13.UnnecessaryObject.md](13.UnnecessaryObject.md)
- [14.ThreadStarvation.md](14.ThreadStarvation.md)
- [15.EmptyTryCatch.md](15.EmptyTryCatch.md)

## OOP와 반하는 패턴
- [16.AnemicDomainModel.md](16.AnemicDomainModel.md)
- [17.GodClass.md](17.GodClass.md)
- [18.ClassDoesTooMuch.md](18.ClassDoesTooMuch.md)
- [19.CircularReference.md](19.CircularReference.md)
- [20.InappropriateIntimacy.md](20.InappropriateIntimacy.md)

## 동시성 방해 패턴
[21.LockingToRead.md](21.LockingToRead.md)
[22.ResourceHog.md](22.ResourceHog.md)
[23.PrematureResourceRelease.md](23.PrematureResourceRelease.md)
[24.NeglectingToReleaseResource.md](24.NeglectingToReleaseResource.md)


## 예외 처리에서 안티 패턴
- [25.CatchAll.md](25.CatchAll.md)
- [26.IgnoringException.md](26.IgnoringException.md)
- [27.ThrowsExceptionsInFinallyBlock.md](27.ThrowsExceptionsInFinallyBlock.md)
- [28.CatchAndRelease.md](28.CatchAndRelease.md)

## 리팩토링과 예방
- [29.EffectiveRefactoring.md](29.EffectiveRefactoring.md)
- [30.EvadeAntiPattern.md](30.EvadeAntiPattern.md)
- [31.Tools.md](31.Tools.md)
