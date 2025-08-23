---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# 비트 필드 대신 EnumSet

```java
public class Text {
 public static final int STYLE_BOLD = 1 << 0;
 public static final int STYLE_ITALIC = 1 << 1;
 public static final int STYLE_UNDERLINE = 1 << 2;
 public static final int STYLE_STRIKE_THROUGH= 1 << 3;
 
}


```

이러고 `Text.STYLE_BOLD | Text.STYLE_ITALIC` 같이 하면 집합 연산을 수행할 수 있다.  그러나 비트 필드는 정수 열거 상수의 단점을 가지고 있으며 추가로

1. 비트 필드(합, 교집합)에 맞춰서 모든 필드를 순회하는데 까다롭다.
2. 최대 몇 비트가 필요할지 미리 예측해서 적절한 타입을 선언해야한다.

등의 이슈가 있다. 차라리 `java.util.EnumSet`을 사용하는 방법이 있다. 내부는 비트 벡터로 이뤄져 있다.

`EnumSet.of(Text.STYLE_BOLD, Text.STYLE_ITALIC)` 같이 사용하면 된다. 