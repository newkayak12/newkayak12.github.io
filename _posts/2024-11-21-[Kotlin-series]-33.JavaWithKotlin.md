# kotlin 코드를 java에서 사용

## 프로퍼티 접근
- java, JVM에는 프로퍼티 개념이 없으므로, kotlin property를 java에서 접근할 수 없다.
- compile 된 JVM 바이트 코드에서는 각 프로퍼티가 접근자 메소드로 표현되기에 이 때는 접근할 수 있다.
- kotlin property에서 뒷받침 필드가 필요한 경우, compiler가 접근자 메소드와 함께 필드도 만든다. 
- 캡슐화를 위해서 기본 private이며 getter/setter만을 통해 접근할 수 있다. public으로 두려면 `@JvmField`를 넣으면 된다.
- `@JvmField`는 추상 프로퍼티나 열린 프로퍼티에서는 오버라이드, 커스텀 접근자 등 때문에 사용할 수 없다. 
- 이름이 붙은 객체 프로퍼티에 `@JvmField`를 붙이면 정적 필드를 만든다.
```kotlin
object Application { 
    @JvmField val name = "Application"
    //const가 붙어도 마찬가지다.
}
```

## 파일 파사드와 최상위 선언
- kotlin에서는 최상위 선언을 자주 사용한다. java, JVM에서는 없기에 `file facade`라는 클래스에 넣는다. 
- 이렇게 만들어진 클래스의 메소드는 static이므로 initialize 할 필요가 없다.
- `@file:JvmName`으로 facade class 이름을 정할 수 있다.
- `@JvmMultifilClass`와 `@JvmName`으로 여러 파일을 하나의 파일로 몰 수 있다.

## 객체와 정적 멤버
- kotlin의 객체 선언은 INSTANCE 필드가 있는 일반 클래스로 컴파일 된다.
- `@JavaFiled`를 객체 프로퍼티에 사용하면 정적 필드로 바뀐다.
- `@JvmStatic`으로 객체 함수나 프로퍼티 접근자를 정적 메소드로 만들 수도 있다.

## 노출된 선언 이름 변경
- `@JvmName`으로 최상위 선언이 들어가는 facade 클래스 이름을 바꿀 수 있다.
- 추가로 `@JvmName`는 함수나 프로퍼티 접근자에도 사용할 수 있다.
- 이는 kotlin에서 옳지만 java에서 금지된 선언이 되는 시그니처 충돌을 막기 위해서 있다.
- 프로퍼티 자체에 annotation을 붙일 수도 있다. `@get:JvmName("getFullNameFamilyLast")`

## 오버로딩한 메소드 생성
- kotlin 디폴트 값이 지정된 경우, 함수 인자 중 일부를 생략할 수 있기에 인자 수가 달라질 수 있다.
- java에서는 `@JvmOverloads`로 오버로딩된 함수를 추가로 생성한다.

## 예외
- kotlin은 java와 다르게 checked, unchecked가 없다.
- `@Throws`를 붙여서 명시할 수 있다.

## 인라인 함수
- java에는 inline 함수가 없다. kotlin 에서 inline이 붙으면 java에서는 일반 메소드로 노출된다.
- 실제로 인라인이 되지는 않는다.
- 제네릭 인라인 함수는 인라인을 사용하지 않고 타입 구체화를 구현할 방법이 없으므로, 자바 코드에서 이런 함수를 호출하는 것이 불가하다.

## 타입 별명
- java에서는 타입 별명을 다 풀어 헤친 상태로 변환된다.