---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# 다쓴 객체의 참조 해제

```java
import java.util.Arrays;
import java.util.EmptyStackException;

public class Stack<T> {
    private T[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        elements = new T[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(T e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public T pop() {
        if (size == 0) throw new EmptyStackException();


//        return elements[--size]; //이러기만 하면 OOM 발생할 수도 있다.

        T element = elements[--size];
        element[size] = null; //이 코드가 필요하다.
        return element;
    }

    private void ensureCapacity() {
        if (elements.length == size) elements = Arrays.copyOf(elements, 2 * size + 1);
    }
}
```

위의 포인트와 같이 오래 사용하면 `OutOfMemoryError`를 피할 수 없는 경우들이 왕왕있다. 그래서 다 쓴 객체(Obsolete reference)를 참조 해제하는 것이
필요할 떄가 있다. 물론 Java는 C++ 같이 일일이 해제할 필요는 없다만 

위의 경우와 같이 스택이 본인의 메모리를 직접 관리하는 경우 ( elements 배열로 풀을 만들어 관리 ) elements를 쓰는지 아닌지 GC는 알 길이 없다. 
이와 같이 본인 메모리를 직접 관리하는 클래스라면 항상 `MemoryLeak`을 염두해야만 한다.

두 번째로 캐시 메모리도 누수 주범이다. 보통 그래서 TTL을 두거나 하는 식으로 관리한다. 혹은 `WeakHashMap` 등으로 방지할 수 있다.

- WeakHashMap

```java
public class Fruit{
    String name;

    public Fruit(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Fruit{" +
                "name='" + name + '\'' +
                '}';
    }
}

public class WeakHashMapExample {
    public static void main(String[] args) {
        WeakHashMap<Fruit, String> map = new WeakHashMap<>();
        Fruit apple = new Fruit("apple");
        Fruit orange = new Fruit("orange");
        map.put(apple, "test a");
        map.put(orange, "test b");
        apple = null;
        System.gc();
        map.entrySet().forEach(System.out::println );
        
        //Fruit{name='orange'}=test b
    }
}
```

- WeakReference

```java
class WeakReferenceExample {
    static class TestObject {
        String exam;

        public TestObject(String exam) {
            this.exam = exam;
        }

        @Override
        public String toString() {
            return "TestObject{" +
                    "exam='" + exam + '\'' +
                    '}';
        }
    }

    public static void main(String[] args) {
        TestObject strong = new TestObject("Strong");
        TestObject weak = new TestObject("Weak");
        
        
        TestObject bindStrong = strong;
        WeakReference<TestObject> bindWeak = new WeakReference<TestObject>(weak);

        System.out.println(bindStrong); //Strong
        System.out.println(bindWeak.get());//Weak

        strong = null;
        weak = null;


        System.gc();

        //bindStrong null을 넣어도 객체 해제 X
        //bindWeak null을 넣으면 객체 해제

        System.out.println(bindStrong); //Strong
        System.out.println(bindWeak.get());//null
    }
}
```

마지막으로 리스너, 콜백 등이 달려 있는 경우다. (EventSource 같은)