---
layout: post
categories: [KOTLIN]
---


# Loop

## while, do-while

- java의 do-while, while과 같다.

## for, iterable
- kotlin의 `for`는 java의 for-each와 유사하다.
- kotlin은 문자열에도 루핑할 수 있다.
- for 루핑을 위해서는 iterable만 구현되면 된다.

## break, continue
- break: 루프를 즉시 종료
- continue: 현재 iteration을 마치고 다음 루핑을 한다. 
- 둘 다 java와 같다.
- kotlin의 break, continue는 Nothing 타입의 식으로 쓸 수 있다. return 과 마찬가지로


## 내포된 루프, 테이블
- loop에 태그를 붙일 수 있다. java와 같다. 
- @으로 마킹한다.
```kotlin
loop@ while(true) break@loop
```
```java
class Test {
    public static void main(String[] args) {
        loop: while(true) break loop;
    }
}
```


## 꼬리 재귀
- 코틀린은 꼬리 재귀함수에 대한 최적화 컴파일을 지원한다.
- 메소드 시그니처에 `tailrec`을 붙이면 된다.
- 
```kotlin
tailrec fun binIndexOf(x: Int, array: IntArray, from: Int = 0, to: Int = array.size): Int {
    if( from == to ) return -1
    val midIndex = (from + to - 1)
    val mid = array[midIndex]
    return when {
        mid < x -> binIndexOf(x, array, midIndex + 1, to)
        mid > x -> binIndexOf(x, array, from, midIndex)
        else -> midIndex
    }
}
```