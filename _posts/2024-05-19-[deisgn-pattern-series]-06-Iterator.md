from [Dictionary - Iterator](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/06.Iterator.md)


# Iterator

반복자(Iterator) 패턴은 일련의 데이터 집합에 대하여 순차적인 접근(순회)을 지원하는 패턴이다.
데이터 집합이란 객체들을 그룹으로 묶어 자료의 구조를 취하는 컬렉션을 말한다. 대표적인 컬렉션으로 한번쯤은 들어본 리스트나 트리, 그래프, 테이블 등이 있다.

![](/assets/img/iterator.png)

- Aggregate (인터페이스) : ConcreateIterator 객체를 반환하는 인터페이스를 제공한다.
  - iterator() : ConcreateIterator 객체를 만드는 팩토리 메서드


- ConcreateAggregate (클래스) : 여러 요소들이 이루어져 있는 데이터 집합체
- Iterator (인터페이스) : 집합체 내의 요소들을 순서대로 검색하기 위한 인터페이스를 제공한다.
  - hasNext() : 순회할 다음 요소가 있는지 확인 (true / false)
  - next() : 요소를 반환하고 다음 요소를 반환할 준비를 하기 위해 커서를 이동시킴

- ConcreateIterator (클래스) : 반복자 객체
  - ConcreateAggregate가 구현한 메서드로부터 생성되며, ConcreateAggregate 의 컬렉션을 참조하여 순회한다.
  - 어떤 전략으로 순회할지에 대한 로직을 구체화 한다

# 흐름
```java
// 집합체 객체 (컬렉션)
interface Aggregate {
    Iterator iterator();
}

class ConcreteAggregate implements Aggregate {
    Object[] arr; // 데이터 집합 (컬렉션)
    int index = 0;

    public ConcreteAggregate(int size) {
        this.arr = new Object[size];
    }

    public void add(Object o) {
        if(index < arr.length) {
            arr[index] = o;
            index++;
        }
    }

    // 내부 컬렉션을 인자로 넣어 이터레이터 구현체를 클라이언트에 반환
    @Override
    public Iterator iterator() {
        return new ConcreteIterator(arr);
    }
}

// 반복체 객체
interface Iterator {
    boolean hasNext();
    Object next();
}

class ConcreteIterator implements Iterator {
    Object[] arr;
    private int nextIndex = 0; // 커서 (for문의 i 변수 역할)

    // 생성자로 순회할 컬렉션을 받아 필드에 참조 시킴
    public ConcreteIterator(Object[] arr) {
        this.arr = arr;
    }

    // 순회할 다음 요소가 있는지 true / false
    @Override
    public boolean hasNext() {
        return nextIndex < arr.length;
    }

    // 다음 요소를 반환하고 커서를 증가시켜 다음 요소를 바라보도록 한다.
    @Override
    public Object next() {
        return arr[nextIndex++];
    }
}
```

# 특징
## 사용 시기
- 컬렉션에 상관없이 객체 접근 순회 방식을 통일하고자 할 때
- 컬렉션을 순회하는 다양한 방법을 지원하고 싶을 때
- 컬렉션의 복잡한 내부 구조를 클라이언트로 부터 숨기고 싶은 경우 (편의 + 보안)
- 데이터 저장 컬렉션 종류가 변경 가능성이 있을 때
  - 클라이언트가 집합 객체 내부 표현 방식을 알고 있다면, 표현 방식이 달라지면 클라이언트 코드도 변경되어야 하는 문제가 생긴다.

## 장점
- 일관된 이터레이터 인터페이스를 사용해 여러 형태의 컬렉션에 대해 동일한 순회 방법을 제공한다.
- 컬렉션의 내부 구조 및 순회 방식을 알지 않아도 된다.
- 집합체의 구현과 접근하는 처리 부분을 반복자 객체로 분리해 결합도를 줄 일 수 있다.
  - Client에서 iterator로 접근하기 때문에 ConcreteAggregate 내에 수정 사항이 생겨도 iterator에 문제가 없다면 문제가 발생하지 않는다.
- 순회 알고리즘을 별도의 반복자 객체에 추출하여 각 클래스의 책임을 분리하여 단일 책임 원칙(SRP)를 준수한다.
- 데이터 저장 컬렉션 종류가 변경되어도 클라이언트 구현 코드는 손상되지 않아 수정에는 닫혀 있어 개방 폐쇄 원칙(OCP)를 준수한다

## 단점
- 클래스가 늘어나고 복잡도가 증가한다.
  - 만일 앱이 간단한 컬렉션에서만 작동하는 경우 패턴을 적용하는 것은 복잡도만 증가할 수 있다.
  - 이터레이터 객체를 만드는 것이 유용한 상황인지 판단할 필요가 있다.

- 구현 방법에 따라 캡슐화를 위배할 수 있다.

# 실제 예제
- java.util.Enumeration 과 java.util.Iterator
- Java StAX (Streaming API for XML)의 Iterator 기반 API
  - XmlEventReader, XmlEventWriter