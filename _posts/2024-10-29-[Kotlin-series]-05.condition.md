---
layout: post
categories: [KOTLIN]
---



# 조건문

## if statement
- java와 비슷하다.
- if 문은 kotlin에서 식으로 평가된다. 따라서 return 뒤에도 쓸 수 있다.

> 특이 사항
> - kotlin은 삼항 연산자가 없다.


## 범위, 진행, 연산

- `operator`로 kotlin에서는 여러 경우를 연산으로 정의해 놨다.

1. `..`
2. `<`, `>`, `<=`, `>=`, `==`, `!=`, `&&`, `||`
3. in, !in: `b in c` -> c안의 b가 있는가?

## when
- java의 case-switch 같이 kotlin에서도 `when statment`가 있다.

```kotlin
fun hexDigit(n: Int): Char {
    if (n in 0..9) return '0' + n
    else if (n in 10..15) return 'A' + n - 10
    else return '?'
}
//위의 코드는

fun hexDigitWhen(n: Int): Char {
    return when {
        (n in 0..9) -> '0' + n
        (n in 10..15) -> 'A' + n - 10
        else -> '?'
    }
}

//로 바꿀 수 있다.
```

> 특이사항
> - java는 fallthrough가 지원되지만 kotlin은 아니다.