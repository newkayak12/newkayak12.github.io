---
layout: post
categories: [TEST]
---


# FixtureMonkey

## 소개



> <h3> Fixture Monkey </h3>
> 
> <p>Fixture Monkey는 테스트 객체를 쉽게 생성하고 조작할 수 있도록 고안된 Java 및 Kotlin 라이브러리입니다.</p>
> <p>이 라이브러리는 테스트 작성을 간편하게 하기 위해 필요한 테스트 픽스처를 손쉽게 생성하는 데 중점을 두고 있습니다. 기본적이거나 복잡한 테스트 픽스처를 다루고 있더라도, Fixture Monkey는 필요한 테스트 객체를 쉽게 생성하고 원하는 구성에 맞게 손쉽게 수정할 수 있도록 도와줍니다.</p>
> <p>Fixture Monkey를 활용하여 JVM 테스트를 간결하고 안전하게 수행하세요.</p>

> 요약하면? <q> 테스트를 하면서 만들어야 하는 pojo 생성을 도와주는 친구 </q>
> 


## 종속성

|                종속성	                |           설명           |
|:----------------------------------:|:----------------------:|
|           fixture-monkey           |	fixture monkey 코어 라이브러리|
|       fixture-monkey-starter       | 	fixture monkey 시작 패키지 |
|       fixture-monkey-kotlin	       |       Kotlin 지원        |
|   fixture-monkey-starter-kotlin	   |  Kotlin 환경을 위한 시작 패키지  |
|      fixture-monkey-jackson	       |Jackson 지원|
 | fixture-monkey-jakarta-validation	 |Jakarta validation 지원|
  |  fixture-monkey-javax-validation	  |Javax validation 지원|
       |       fixture-monkey-mockito       |	Mockito 지원|
     |     fixture-monkey-autoparams      |	Autoparams 지원|



## 왜 필요했을까?

- 개인적으로는 `record`로 dto를 만들면서 **`builder` 없이 생성자만으로 운용하면서** slice 테스트 시 controller로 전달할 **적당한** 값을 쉽게 만들고자 할 때였다.

## Introspector
- 객체 생성 방법을 지정한다.

> 1. BeanArbitraryIntrospector: setter로 생성한다. `NoArgConstructor`, `setter`가 필요
> 2. ConstructorPropertiesArbitraryIntrospector: 생성자 주입
> 3. FieldReflectionArbitraryIntrospector: 필드 리플렉션 (setter도 없고, noArgContructor만 있다면?)
> 4. BuilderArbitraryIntrospector: 빌더를 사용해서
> 5. FailoverArbitraryIntrospector: 위의 생성 방법을 순서를 정해서 실패하면 다음 방식으로 생성할 수 있도록 유도할 수도 있다.

## 주요 메소드
- giveMeOne() : 대략 초기화한 해당 클래스로 만든 인스턴스 하나 주세요
- giveMe() : 대략 초기화한 해당 클래스로 만든 인스턴스 n개 주세요
- giveMeBuilder() :  : 대략 초기화한 해당 클래스로 만든 인스턴스 하나 주세요 근데 빌더로 받아서 몇 군데는 제가 `set()`으로 채워 넣을래요
- giveMeArbitrary(): Arbitrary하나 넘겨준 클래스로 말아 주세요.


----
**! 모든 내용을 기술하지는 않고 간략하게 적어 놓았으므로 [document](https://naver.github.io/fixture-monkey/v1-0-0-kor/docs/generating-objects/introspector/) 참고하기**