---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---


# public 클래스에서는 public 필드가 아닌 getter/setter를 쓰자

```java
class Point {
    private double x;
    private double y;
    
    public double getX () {
        return this.x;
    }
    
    public double getY() {
        return this.y;
    }
    
    public void setX( double x ) {
        this.x = x;
    }

    public void setY( double y ) {
        this.y = y;
    }
}
```

데이터 필드에 직접 접근을 막되 정해진 루트로만 접근할 수 있게 해서 캡슐화 이점을 제공하는 예시이다.

물론 모든 클래스에 저런 처리가 필요한건 아니다. `package-private 클래스 혹은 private 클래스`라면 데이터 필드를 노출해도 전혀 문제가 없다.