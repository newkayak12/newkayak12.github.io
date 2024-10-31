---
layout: post
categories: [KOTLIN]
---




# Object
- kotlin의 Object는 클래스와 상수를 합한 것이다. 객체 선언을 통해서 singleton을 만들 수 있다.

## 선언
- class 대신 object를 사용한다.

```kotlin
object Application {
    val name = "Application"
    
}
```
````java
public final class Application {
    public static final Application INSTANCE;
    private static final String name = "Application";
    static {
        INSTANCE = new Application();
        name = "Application";
    }
}
````
- java에서는 이렇게 표현된다.

## 동반 객체
- nested 클래스와 마찬가지로 inner 객체도 인스턴스가 생기면 자신을 둘러싼 클래스 private에 접근할 수 있다.
- 이 경우 덮은 클래스부터 import를 해야한다. `import Outer.Inner` 이렇게 말이다.
- 이럴 때는 `companion`으로 선언해서 외부 클래스명 만으로 내부 객체에 접근할 수 있다.
```kotlin
class Application private constructor(val name: String) {
    object Factory {
        fun create(args: Array<String>): Application? {
            val name = args.firstOrNull() ?: return null
            return Application(name)
        }
    }
}

fun main() {
    Application.Factory.create(Array(1){"Hi"})
}
```

- companion으로 바꾸면
```kotlin
class Application private constructor(val name: String) {
    companion object Factory {
        fun create(args: Array<String>): Application? {
            val name = args.firstOrNull() ?: return null
            return Application(name)
        }
    }
}

fun main() {
    Application.create(Array(1){"Hi"})
}
```


## 객체 식
- objectExpression은 java의 anonymousClass와 유사하다.

```kotlin
fun main() {
    fun midPoint(xRange: IntRange, yRange: IntRange) = object {
        val x = (xRange.first + yRange.last) / 2
        val y = (yRange.first + xRange.last) / 2
    }
}
```
- 반화나 타입은 `anonymous object type`이다.
- 