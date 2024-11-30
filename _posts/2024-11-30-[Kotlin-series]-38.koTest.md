---
layout: post
categories: [KOTLIN]
---

# koTest
- 코테스트는 여러 명세 스타일을 지원한다.
- AbstractSpec 또는 하위를 구현함으로써 커스터마이징할 수 있다.
- 상속 후 생성자에 테스트를 추가하거나 상위 클래스 생성자에 전달하는 람다 안에 테스트를 추가한다.
- 대부분은 DSL과 비슷한 API를 통해서 정의한다.


## spec 

```kotlin

    class NumberTest: StringSpec(
        {
            "2 + 2 should be 4" { 2 + 2 shouldBe 4}
            "2 + 2 should be 4" { 2 + 2 shouldBe 4}
            //문자열 { 람다 }
        }
    )
// 모든 테스트가 한 클래스 안에 들어간다.
// 평편한 구조의 테스트가 된다.
```

- 계층 구조를 원한다면 다른 class를 상속 받는 식이다.
```kotlin
class NumbersTest2: WordSpec (
        {
            "Addition" When {
                "1 + 2" should {
                    "be equal to 3 " { 1 + 2 shouldBe 3}
                    "be equal to 2 + 1 " { 1 + 2 shouldBe 2 + 1}
                }
            }
        }
    )
```

- 다른 스펙으로
```kotlin
 class NumberTest3: FunSpec(
        {
            test("0 should be equal to 0") {0 shouldBe 0}
            context("Arithmetic") {
                context("Addition") {
                    test("2 + 2 shoud be 4") { (2 + 2) shouldBe 4}
                }
                context("Multiplication") {
                    test("2 * 2 shoud be 4") { (2 * 2) shouldBe 4}
                }
            }
        }
    )

    class NumberTest4: DescribeSpec(
        {
            describe("Arithmetic") {
                describe("Addition") {
                    context("1 + 2") {
                        it("should give 3") { 1 + 2 shouldBe  3 }
                    }
                }
                describe("Multiplication") {
                    context("1 * 2") {
                        it("should give 2") { 1 * 2 shouldBe  2 }
                    }
                }
            }
        }
    )
```
- 등이 있고 추가로 `ShouldSpec`, `FreeSpec`, `FeatureSpec`, `BehaviorSpec` 등이 있다.

## Matcher
- 일반 함수 호출, 주우이 연산자 형태로 사용할 수 있는 확장 함수로 정의된다. 
- 모두 `shouldBe`로 시작한다. (shouldBeGreaterThanOrEqual)
- 커스텀 매처 정의를 위해서는 Matcher 인터페이스를 구현하고 `test()` 메소드를 오버라이드 해야 한다.
- `MatcherResult`는 결과를 표시한다.
  1. passed
  2. failureMessage
  3. negatedFailureMessage

```kotlin
fun beOdd() = object: Matcher<Int> {
        override fun test(value: Int): MatcherResult {
            return MatcherResult(
                value % 2 != 0,
                "$value shoud be odd",
                "$value should not be odd"
            )
        }
}

class NumberTestWithOddMatcher: StringSpec (
    {
        "5 is odd" { 5 should  beOdd() }
    }
)
```

- Matcher 인터페이스 구현은 자동으로 and/or/invert 연산을 지원한다.
- compose() 연산은 기존 매처에 타입 변환 함수를 추가함으로써 새로운 타입에 대한 매처를 만든다.


## 인스펙터
- 컬렉션 함수에 대한 확정 함수로, 주어진 단언문이 컬렉션 원소 중 어떤 그룹에 대해 성립하는지 검증할 수 있게 해준다.
  - `forAll()`/`forNone()`: 단언문을 모든 원소가 만족하거나 안하는지 확인
  - `forExactly(n)` : 단언문을 정확히 n개의 원소가 만족하는지
  - `forAtLeast(n)`/`forAtMost(n)` : 최소 n, 최대 n 개 만족하는지
  - `forSome()` : 단어눔ㄴ을 만족하는 원소가 존재하되, 모든 원소가 만족하는건 아닌지

## 예외 처리
- 어떤 코드가 특정 예외에 중단됐는지 검사흔 `shouldThrow()`가 있다.
- try/catch로 잡아내는 방식을 대신할 수 있다.
- soft assertion도 제공한다. `assertSoftly` 블록에서 사용할 수 있다.
```kotlin
class NumberTestWithForAll: StringSpec(
    {
        val numbers = Array(10) {it + 1}
        "invalid numbers" {
            assertSoftly{
                numbers.forAll{ it shouldBeLessThan 5}
            }
        }
    }
)
```

## 비결정적 코드 테스트
- 여러 번 테스트 해야 테스트를 통과하는 비 결정적 코드를 사용해야 한다면 타임아웃, 반복 실행을 기입할 수 있는 `eventually()`가 있다.


## 픽스쳐와 설정
- 테스트를 위한 환경을 세팅하고, 끝나면 정리하는 경우 `TestListenr` 인터페이스를 구현해서 픽스쳐를 지정할 수 있다.
- TestListener는 BeforeTestListener 등의 개별 픽스쳐 인터페이스를 모아둔 리스너다.
```kotlin
public interface TestListener : io.kotest.core.listeners.BeforeTestListener,
                                io.kotest.core.listeners.AfterTestListener,
                                io.kotest.core.listeners.BeforeContainerListener,
                                io.kotest.core.listeners.AfterContainerListener,
                                io.kotest.core.listeners.BeforeEachListener,
                                io.kotest.core.listeners.AfterEachListener,
                                io.kotest.core.listeners.BeforeSpecListener,
                                io.kotest.core.listeners.AfterSpecListener,
                                io.kotest.core.listeners.BeforeInvocationListener,
                                io.kotest.core.listeners.AfterInvocationListener,
                                io.kotest.core.listeners.PrepareSpecListener,
                                io.kotest.core.listeners.FinalizeSpecListener,
                                io.kotest.core.listeners.Listener {
    public open val name: kotlin.String /* compiled code */
        public open get
}
/**
 * public open suspend fun beforeTest(testCase: io.kotest.core.test.TestCase): kotlin.Unit { /* compiled code */ }
 * public open suspend fun afterTest(testCase: io.kotest.core.test.TestCase, result: io.kotest.core.test.TestResult): kotlin.Unit { /* compiled code */ }
 * public open suspend fun beforeContainer(testCase: io.kotest.core.test.TestCase): kotlin.Unit { /* compiled code */ }
 * public open suspend fun afterContainer(testCase: io.kotest.core.test.TestCase, result: io.kotest.core.test.TestResult): kotlin.Unit { /* compiled code */ }
 * public open suspend fun beforeEach(testCase: io.kotest.core.test.TestCase): kotlin.Unit { /* compiled code */ }
 * public open suspend fun afterEach(testCase: io.kotest.core.test.TestCase, result: io.kotest.core.test.TestResult): kotlin.Unit { /* compiled code */ }
 * public open suspend fun beforeSpec(spec: io.kotest.core.spec.Spec): kotlin.Unit { /* compiled code */ }
 * public open suspend fun afterSpec(spec: io.kotest.core.spec.Spec): kotlin.Unit { /* compiled code */ }
 * public open suspend fun beforeInvocation(testCase: io.kotest.core.test.TestCase, iteration: kotlin.Int): kotlin.Unit { /* compiled code */ }
 * public open suspend fun afterInvocation(testCase: io.kotest.core.test.TestCase, iteration: kotlin.Int): kotlin.Unit { /* compiled code */ }
 * public open suspend fun prepareSpec(kclass: kotlin.reflect.KClass<out io.kotest.core.spec.Spec>): kotlin.Unit { /* compiled code */ }
 * public open suspend fun finalizeSpec(kclass: kotlin.reflect.KClass<out io.kotest.core.spec.Spec>, results: kotlin.collections.Map<io.kotest.core.test.TestCase, io.kotest.core.test.TestResult>): kotlin.Unit { /* compiled code */ }
 */

object CustomListener: TestListener {
    override suspend fun beforeTest(testCase: TestCase) {
        println("beforeTest")
    }

    override suspend fun afterSpec(spec: Spec) {
        println("afterSpec")
    }

    override suspend fun beforeSpec(spec: Spec) {
        println("beforeSpec")
    }

    override suspend fun afterTest(testCase: TestCase, result: TestResult) {
        println("afterTest")
    }

    override suspend fun finalizeSpec(kclass: KClass<out Spec>, results: Map<TestCase, TestResult>) {
        println("finalizeSpec")
    }

    override suspend fun prepareSpec(kclass: KClass<out Spec>) {
        println("prepareSpec")
    }
}
```

## 설정
- koTest는 테스트 환경을 설정할 수 있는 여러 수단을 제공한다.  `config()`를 통해서 여러 테스트 실행 파라미터를 지정할 수 있다.
```kotlin
class StringSpecWithConfig: StringSpec (
    {
        "2 + 2 should be 4".config(invocations = 10) { 2 + 2 shouldBe  4}
    }
)
```
- config의 파라미터는 아래와 같다.
  1. invocations : 테스트 실행 횟수 (모두 성공해야 성공한 것으로 간주)
  2. threads: 테스트 실행 쓰레드 개수(invocation이 2 이상일 때 유효)
  3. enabled: 테스트 실행 여부
  4. timeout: 테스트 타임아웃

- koTest  테스트 간 테스트 케이스 인스턴스를 공유할 수도 있다. 이를 isolation mode라고 부른다. 
- 모든 테스트 케이스는 한 번만 initialize 되고 모든 테스트에서 같은 인스턴스를 사용한다.
- 성능면에서 좋을지 모르지만 일부 시나리오에는 부적합할 수 있다.
- isolationMode를 오버라이드 해야 한다.
```kotlin
 object customIsolationMode: AbstractProjectConfig () {
    override val isolationMode: IsolationMode?
        get() = IsolationMode.SingleInstance
}
/**
 * junit의 @TestInstance와 유사하다.
 * SingleInstance: 테스트 케이스의 인스턴스가 하나만 만들어진다. [default]
 * InstancePerTest: 문맥이나 테스트 블록 진행 시마다 새 인스턴스를 만든다.
 * InstancePerLeaf: 말단 개별 테스트 블록 실행 전에 인스턴스화한다.
 */
```