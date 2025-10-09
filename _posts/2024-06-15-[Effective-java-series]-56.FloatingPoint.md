---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# 부동 소수점 이슈

[blog](https://newkayak12.github.io/java/2024/05/18/java-series-22-FloatingPoint.html)에서 다룬 바와 같이 부동소수 계산에는 정밀도가 
떨어진다는 문제가 있다. 그래서 소수점이 있는 금융 계산에 치명적이다. 그래서 `BigDecimal`, `int`, `long`을 사용해야 한다.