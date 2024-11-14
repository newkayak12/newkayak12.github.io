# annotation

## annotation
- 커스텀 메타데이터를 정의하고 소스쿄ㅗ드 상의 선언 식 전체 파일등의 요소에 엮는 방법을 제시
- kotlin의 annotation은 식에도 적용할 수 있다.
- kotlin annotation은 인터페이스가 아닌 특별한 종류의 클래스로 구성된다. 멤버나 부생성자, 초기화 코드가 없는 형태다.
- 1.3 부터 내포 클래스 인터페이스, 객체를 annotation 본문에 넣을 수 있다.
- annotation 파라미터는 항상 val로 선언해야 한다.
- 이 부분도 java와 차이가 있는데, java는 메소드 형태로 지정한다면 kotlin은 생성자 파라미터가 property의 역할을 한다.
- 이 파라미터는 아래와 같은 경우로 이뤄질 수 있다.
  1. Int, Boolean 등 원시 타입
  2. String
  3. Enumeration
  4. 다른 annotation
  5. 클래스 리터렁
  6. 위 타입의 배열
- kotlin annotation 안에서 `java.lang.Class`의 인스턴스를 쓸 수 있고 이러면 annotation이 자바 클래스로 컴파일 타임에 자동 변환된다.
- kotlin의 주 생성자 부근에 annotation을 붙이려면 그냥 붙이며 되고 혹시 get에 붙인다고 하면 `@get:Annotation`와 같이 붙인다.
- 이러한 annotation 대상 지정은 아래와 같다.
  1. property: 프로퍼티 자체를 대상으로 한다.
  2. field: 뒷받침하는 필드를 대상으로 한다.
  3. get
  4. set
  5. param: 생성자 파라미터를 대상으로 한다.(var/val)
  6. setparam: 프로퍼티 세터의 파라미터에 대상으로 한다.( var만 )
  7. delegate: 위임 객체를 저장하는 필드를 대상으로 한다.
- annotation을 여러 개 선언해야 한다면 `[]`으로 감싸거나 java 같이 매번 지정하면 된다.
- `@file:Annotation`으로 파일 전체를 대상으로 annotation을 붙일 수 있다.


## 내장 annotation
### @Retention
- annotation이 저장되고 유지되는 방식을 제어한다.
- kotlin의 AnnotationRetention enum의 명세는 아래와 같다.
  1. SOURCE: 컴파일 시점에만 존재, 컴파일러 바이너리 출력에는 저장 X
  2. BINARY: 컴파일러의 바이너리 출력만 런타임에 리플렉션에서 검출 X
  3. RUNTIME: 컴파일러 바이너리 출력에 저장되며, 런타임에 리플렉션 API로 관찰할 수도 있다.

- 자바는 `java.lang.annotation.RetentionPolicy`고
  1. SOURCE: compile-time
  2. CLASS: binary
  3. RUNTIME: runtime에

- java는 RetentionPolicy.CLASS가 기본이며, kotlin은 AnnotationRentention.BINARY

### @MustBeDocumented
- annotation을 문서에 꼭 포함시키라는 뜻이다. 
- java의 @Documented와 같은 역할을 한다.

### @Target
- 어떤 언어 요소에 붙일 수 있는지 지정한다. AnnotationTarget에 정의된다.
  1. CLASS: 클래스, 인터페이스, 객체
  2. ANNOTATION_CLASS: annotation 클래스
  3. TYPEALIAS: 타입 별명
  4. PROPERTY: 주생성자에 정의된 val/var에 붙일 수 있다. (지역변수는 포함되지 않는다.)
  5. FIELD: 프로퍼티를 뒷받침하는 필드
  6. LOCAL_VARIABLE: 지역변수
  7. VALUE_PARAMETER: 생성자, 함수, 프로퍼티 세터의 파라미터
  8. CONSTRUCTOR: 주생성자, 부생성자,
  9. FUNCTION: 람다나 익명 함수를 포함해서 함수에 붙일 수 있다.
  10. PROPERTY_GETTER/PROPERTY_SETTER: 프로퍼티 게터/ 프로퍼티 세터
  11. FILE: 파일
  12. TYPE: 타입에 지정해서 붙일 수 있다. 변수 타입이나 함수의 파라미터 타입, 반환 타입
  13. EXPRESSION: 식
- java는 아래와 같다.
  1. TYPE: classes, interfaces, enums, annotations
  2. FIELD: fields
  3. METHOD: methods
  4. PARAMETER: parameters
  5. CONSTRUCTOR: constructors
  6. LOCAL_VARIABLE: local variables inside method
  7. ANNOTATION_TYPE: annotations
  8. PACKAGE: package declaration
  9. TYPE_PARAMETER: type parameters
  10. TYPE_USE: variable declarations, method return type, type bounds and even generic type arguments

### @StrictFP
- 부동소수점 정밀도 조정( 플랫폼 간 이식성 )

### @Synchronized
- annotation이 붙은 함수나 프로퍼티 접근자의 본문에 진입하기 전에 monitor를 획득하고 본문 수행 후 monitor를 해제

### @Volatile
- 필드 변경 내용 즉시 다른 쓰레드에서 관찰할 수 있게 해준다.
- java에서는 `volatile` 예약어가 있다. 
- JMM(Java Memory Model)이 `1. 다른 쓰레드에도 보임 즉, 가시성 보장`, `2. 캐싱하지 않음 즉, 매번 메인 메모리에서 가져옴`을 보장한다.

### @Suppress
- java와 같이 경고를 제한한다.

### @Deprecated

### @ReplaceWith
- 단독으로 사용할 수 없고 `@Deprecated`와 함께 사용한다.
- deprecate 될 녀석의 대안(import 문)을 제시한다.
- 심각성은 DeprecationLevel enum을 사용한다.
  1. WARNING
  2. ERROR
  3. HIDDEN