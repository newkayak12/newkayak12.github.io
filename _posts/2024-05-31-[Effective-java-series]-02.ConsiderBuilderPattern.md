---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---










# 생성자에 매개변수가 많다면 빌더 패턴을 고려하자.

정적 팩토리, 생성자 모두 매개변수가 많을 때 모든 경우의 수를 고려하여 overload를 해야한다는 단점이 있다. 
이때 `Builder` 를 사용하면 적절히 대응할 수 있다. 



```java
class Pizza {
    
    
    private final List<String> topping;
    private final String cheese;
    
    private Pizza(List<String> topping, String cheese) {
        this.topping = topping;
        this.cheese = cheese;
    } 
    
    public Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private List<String> topping;
        private String cheese;
        
        public Builder topping (List<String> topping) {
            this.topping = topping;
            return this;
        }

        public  Builder cheese (String cheese) {
            this.cheese = cheese;
            return this;
        }
        
        public Pizza build() {
            return new  Pizza(this.topping, this.cheese);
        }
    } 
}

```

또한 이런 식으로 사용하면 객체의 불변성도 지킬 수 있다. 이러면

1. 점층적 생성자 패턴의 매개변수 문제를 해결할 수 있다.
2. 자바빈즈 패턴의 불변성을 해치는 점도 해결할 수 있다. 

이러한 빌더 패턴은 (파이썬, 스칼라에 있는) 명명된 선택적 매개변수를 흉내낸 것이다. 

또한 빌더는 계층적으로 설계된 클래스와 쓰기 좋다.

```java
import java.util.EnumSet;
import java.util.Objects;

public abstract class Pizza {
    public enum Topping {HAM, MUSHROOM, ONION, PEPPER, SAUSAGE}

    final Set<Topping> toppings;

    abstract static class Builder<T extends Builder<T>> {
        EnumSet<Topping> toppings = EnumSet.noneOf(Topping.class);

        public T addTopping(Topping topping) {
            toppings.add(Objects.requireNonNull(topping));
            return self;
        }

        abstract Pizza build();

        protected abstract T self;
    }


    Pizza(Builder<?> builder) {
        toppings = builder.toppings.clone();
    }
}


public class JacksonPizza extends Pizza {
    public enum Size {SMALL, MEDIUM, LARGE}

    private final Size size;

    public static class Builder extends Pizza.Builder<Builder> {
        private final Size size;

        public Builder(Size size) {
            this.size = Objects.requireNonNull(size);
        }

        @Override
        public JacksonPizza build() { 
            return new JacksonPizza(this);
        }
        //공변 반환 타입 : 재정의한 메소드의 반환 타입이 상위에서 정한 타입의 하위가 될 수 있다. 
        
        @Override
        protected Builder self(){ return this; }
    }
    
    private JacksonPizza(Builder builder) {
        super(builder);
        size = builder.size;
    }
}
```