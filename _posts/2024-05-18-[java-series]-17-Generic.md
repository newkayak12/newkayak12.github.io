from [Dictionary - Generic](https://github.com/newkayak12/Dictionary/blob/master/java/17.Generic.md)

# Generic
클래스 내부에서 사용할 데이터 타입을 외부에서 지정하는 법을 의미한다.
```java
ArrayList<String> list = new ArrayList<>();
```

## 제네릭 타입 매개변수
위에서 보다시피, 제네릭은 <> 꺾쇠 괄호 키워드를 사용하는데 이를 다이아몬드 연산자라고 한다. 
그리고 이 꺾쇠 괄호 안에 식별자 기호를 지정함으로써 파라미터화 할 수 있다. 
이것을 마치 메소드가 매개변수를 받아 사용하는 것과 비슷하여 제네릭의 타입 매개변수(parameter) / 타입 변수 라고 부른다.


## 타입 파라미터 정의
이 타입 매개변수는 제네릭을 이용한 클래스나 메소드를 설계할 때 사용된다.
예를들어 다음 코드는 제네릭을 감미한 클래스를 정의한 코드이다. 클래스명 옆에 <T> 기호로 제네릭을 붙여준 걸 볼 수 있다.
그리고 클래스 내부에서 식별자 기호 T 를 클래스 필드와, 메소드의 매개변수의 타입으로 지정되어 있다.

```java
class FruitBox<T> {
    List<T> fruits = new ArrayList<>();

    public void add(T fruit) {
        fruits.add(fruit);
    }
}
```

제네릭 클래스를 만들었으면 이를 인스턴스화 해보자. 마치 파라미터를 지정해서 보내는 것 처럼 생성 코드에서 꺾쇠 괄호 안에 지정해주고 싶은 타입명을 할당해주면,
제네릭 클래스 선언문 부분으로 가서 타입 파라미터 T 가 지정된 타입으로 모두 변환되어 클래스의 타입이 지정되게 되는 것이다.

## 타입 파라미터 생략
제네릭 객체를 사용하는 문법 형태를 보면 양쪽 두 군데에 꺾쇠 괄호 제네릭 타입을 지정함을 볼 수 있다. 하지만 맨 앞에서 클래스명과 함께 타입을 지정해 주었는데 굳이 생성자까지 제네릭을 지정해 줄 필요가 없다.
따라서 jdk 1.7 버전 이후부터,  new 생성자 부분의 제네릭 타입을 생략할 수 있게 되었다. 제네릭 나름대로 타입 추론을 해서 생략 된 곳을 넣어주기 때문에 문제가 없는 것이다.

```java
FruitBox<Apple> intBox = new FruitBox<Apple>();

// 다음과 같이 new 생성자 부분의 제네릭의 타입 매개변수는 생략할 수 있다.
FruitBox<Apple> intBox = new FruitBox<>();
```

## 복수 타입 파라미터
제네릭은 반드시 한개만 사용하라는 법은 없다. 만일 타입 지정이 여러개가 필요할 경우 2개, 3개 얼마든지 만들 수 있다.
제네릭 타입의 구분은 꺽쇠 괄호 안에서 쉽표(,)로 하며 <T, U> 와 같은 형식을 통해 복수 타입 파라미터를 지정할 수 있다. 
그리고 당연히 클래스 초기화할때 제네릭 타입을 두개를 넘겨주어야 한다.

````java
import java.util.ArrayList;
import java.util.List;

class Apple {}
class Banana {}

class FruitBox<T, U> {
    List<T> apples = new ArrayList<>();
    List<U> bananas = new ArrayList<>();

    public void add(T apple, U banana) {
        apples.add(apple);
        bananas.add(banana);
    }
}

public class Main {
    public static void main(String[] args) {
    	// 복수 제네릭 타입
        FruitBox<Apple, Banana> box = new FruitBox<>();
        box.add(new Apple(), new Banana());
        box.add(new Apple(), new Banana());
    }
}
````

## 중첩 타입 파라미터
제네릭 객체를 제네릭 타입 파라미터로 받는 형식도 표현할 수 있다.
ArrayList 자체도 하나의 타입으로써 제네릭 타입 파라미터가 될수 있기 때문에 이렇게 중첩 형식으로 사용할 수 있는 것이다.

```java
public static void main(String[] args) {
    // LinkedList<String>을 원소로서 저장하는 ArrayList
    ArrayList<LinkedList<String>> list = new ArrayList<LinkedList<String>>();

    LinkedList<String> node1 = new LinkedList<>();
    node1.add("aa");
    node1.add("bb");

    LinkedList<String> node2 = new LinkedList<>();
    node2.add("11");
    node2.add("22");

    list.add(node1);
    list.add(node2);
    System.out.println(list);
}
```

## 타입 파라미터 기호 네이밍
| 타입  |	설명|
|:---:|:-----:|
| <T> |타입(Type)|
|<E>|요소(Element), 예를 들어 List|
|<K>|키(Key), 예를 들어 Map<k, v>|
|<V>|리턴 값 또는 매핑된 값(Variable)|
|<N>|숫자(Number)|
|<S, U, V>|2번째, 3번째, 4번째에 선언된 타입|

## 제네릭 사용 이유, 장점
1. 컴파일 타임에 타입 검사
2. 불필요한 캐스팅을 없앨 수 있음

## 주의 사항
1. 제네릭 타입의 객체는 생성이 불가
2. static 멤버에 제네릭 타입이 올 수 없음 ( 제네릭 객체 생성 전에 자료 타입이 정해져 있어야 해서 )
3. 제네릭으로 배열을 만들 수 없다. 

## 제네릭 범위 한정
제네릭에 타입을 지정해줌으로서 클래스의 타입을 컴파일 타임에서 정하여 타입 예외에 대한 안정성을 확보하는 것은 좋지만 문제는 너무 자유롭다는 점이다.
예를들어 다음 계산기 클래스가 있다고 하자. 정수, 실수 구분없이 모두 받을 수 있게 하기위해 제네릭으로 클래스를 만들어주었다.
하지만 단순히 <T> 로 지정하게 되면 숫자에 관련된 래퍼 클래스 뿐만 아니라 String이나 다른 클래스들도 대입이 가능하다는 점이 문제이다.

```java
// 숫자만 받아 계산하는 계산기 클래스 모듈
class Calculator<T> {
    void add(T a, T b) {}
    void min(T a, T b) {}
    void mul(T a, T b) {}
    void div(T a, T b) {}
}

public class Main {
    public static void main(String[] args) {
        // 제네릭에 아무 타입이나 모두 할당이 가능
        Calculator<Number> cal1 = new Calculator<>();
        Calculator<Object> cal2 = new Calculator<>();
        Calculator<String> cal3 = new Calculator<>();
        Calculator<Main> cal4 = new Calculator<>();
    }
}
```

개발자의 의도로는 계산기 클래스의 제네릭 타입 파라미터로 Number 자료형만 들어오도록 하고 문자열이나 또 다른 클래스 자료형이 들어오면 안되게 하고 싶다고 한다.
그래서 나온 것이 제한된 타입 매개변수 (Bounded Type Parameter) 이다.

### 타입 한정 키워드 extends
`<T extends [ 제한 타입 ]>`

### 인터페이스 타입 한정
extends 키워드 다음에 올 타입은 일반 클래스, 추상 클래스, 인터페이스 모두 올 수 있다.
```java
interface Readable {
}

// 인터페이스를 구현하는 클래스
public class Student implements Readable {
}
 
// 인터페이스를 Readable를 구현한 클래스만 제네릭 가능
public class School <T extends Readable> {
}
```

### 다중 타입 한정
만일 2개 이상의 타입을 동시에 상속(구현)한 경우로 타입 제한하고 싶다면,  `&` 연산자를 이용하면 된다. 해당 인터페이스들을 동시에 구현한 클래스가 제네릭 타입의 대상이 되게 된다.
단, 자바에서는 다중 상속을 지원하지 않기 때문에 클래스로는 다중 extends는 불가능하고 오로지 인터페이스로만이 가능하다.
```java
interface Readable {}
interface Closeable {}

class BoxType implements Readable, Closeable {}

class Box<T extends Readable & Closeable> {
    List<T> list = new ArrayList<>();

    public void add(T item) {
        list.add(item);
    }
}
```

### 재귀적 타입 한정 
재귀적 타입 한정이란 자기 자신이 들어간 표현식을 사용하여 타입 매개변수의 허용 범위를 한정 시키는 것을 말한다.
실무에선 주로 Comparable 인터페이스와 함께 쓰인다.
예를들어 다음과 같이 <E extends Comparable<E>> 제네릭 E의 타입 범위를 Comparable<E> 로 한정한다는 E를 중첩시킨 표현식을 사용할수 있는데, 
이 말은 '타입 E는 자기 자신을 서브 타입으로 구현한 Comparable 구현체로 한정' 한다는 뜻이다.

````java
class Compare {
	// 외부로 들어온 타입 E는 Comparable<E>를 구현한 E 객체 이어야 한다.
    public static <E extends Comparable<E>> E max(Collection<E> collection) {
        if(collection.isEmpty()) throw new IllegalArgumentException("컬렉션이 비어 있습니다.");

        E result = null;
        for(E e: collection) {
            if(result == null) {
                result = e;
                continue;
            }

            if(e.compareTo(result) > 0) {
                result = e;
            }
        }

        return result;
    }
}
````

## 제네릭 형변환
### 캐스팅
배열과 같은 일반적인 변수 타입과 달리 지네릭 서브 타입간에는 형변환이 불가능하다. 
심지어 대입된 타입이 Object라도 말이다. 자연스럽게 다형성이 적용될 것이라 생각하였지만, 실상 제네릭은 전달받은 딱 그 타입으로만 서로 캐스팅이 가능한 것이다.

## 와일드 카드
1. <?> : Unbounded Wildcards (제한 없음)
타입 파라미터를 대치하는 구체적인 타입으로 모든 클래스나 인터페이스 타입이 올 수 있다


2. <? extends 상위타입> : Upper Bounded Wildcards (상위 클래스 제한)
타입 파라미터를 대치하는 구체적인 타입으로 상위 타입이나 상위 타입의 하위 타입만 올 수 있다


3. <? super 하위타입> : Lower Bounded Wildcards (하위 클래스 제한)
타입 파라미터를 대치하는 구체적인 타입으로 하위 타입이나 하위 타입의 상위 타입만 올 수 있다



# 자바의 공변성/ 반공변성
제네릭의 와일드카드를 배우기 앞서 선수 지식으로 알고 넘어가야할 개념이 있다.
조금 난이도 있는 프로그래밍 부분을 학습 하다보면 한번쯤은 들어볼수 있는 공변성(Covariance) / 반공변성(Contravariance) 합쳐서 '변성(Variance)' 이라하는 개념이다.
변성은 타입의 상속 계층 관계에서 서로 다른 타입 간에 어떤 관계가 있는지를 나타태는 지표이다. 그리고 공변성은 서로 다른 타입간에 함께 변할수 있다는 특징을 말한다.
이를 객체 지향 개념으로 표현하자면 Liskov 치환 원칙[[1]](#liskov)Visit Website에 해당된다.


- 공변 : S 가 T 의 하위 타입이면,
> S[] 는 T[] 의 하위 타입이다.
> `List<S>` 는 `List<T>` 의 하위 타입이다.

- 반공변 : S 가 T의 하위 타입이면,

> T[] 는 S[] 의 하위 타입이다. (공변의 반대)
> `List<T>` 는 `List<S>` 의 하위 타입이다. (공변의 반대)


- 무공변 / 불공변 : S 와 T 는 서로 관계가 없다.
> `List<S>` 와 `List<T>` 는 서로 다른 타입이다


### 제네릭은 공변성이 없다
객체 타입은 상하 관계가 있다 그러나 제네릭 타입은 상하관계가 없다. 즉, 제네릭의 타입 파라미터(꺾쇠 괄호) 끼리는 타입이 아무리 상속 관계에 놓인다 한들 캐스팅이 불가능하다. 왜냐하면 제네릭은 무공변 이기 때문이다. 제네릭은 전달받은 딱 그 타입으로만 서로 캐스팅이 가능하다.

### 제네릭 와일드 카드
자바 제네릭을 이용해 프로그래밍 할때 간혹 클래스 정의문을 보다보면 꺾쇠 괄호 ? 물음표 기호가 있는 것을 한번쯤 본 적이 있을 것이다. 이 물음표가 와일드카드이며, 물음표의 의미 답게 어떤 타입이든 될 수 있다는 뜻을 지니고 있다.

|와일드카드	|네이밍	|설명|
|:-----------:|:---------:|:-----------:|
| <?> | Unbounded wildcards <br/> 비한정적 와일드 카드 |제한 없음 (모든 타입이 가능)|
|<? extends U>|Upper Bounded Wildcards <br/>상한 경계 와일드카드| 상위 클래스 제한 (U와 그 자손들만 가능)<br/>상한이 U라 상한 경계라고 한다.|
|<? super U>| Lower Bounded Wildcards <br/> 하한 경계 와일드카드| 하위 클래스 제한 (U와 그 조상들만 가능) <br/> 하한이 U라 하한 경계라고 한다.|

### 제네릭의 공변, 반공변
자바의 제네릭은 기본적으로 공변, 반공변을 지원하지 않지만, <? extends T> , <? super T> 와일드카드를 이용하면 컴파일러 트릭을 통해 공변, 반공변이 적용되도록 설정 할 수 있다. 둘을 정리하자면 다음과 같다.

- 상한 경계 와일드카드 <? extends U> : 공변성 적용
> 타입 매개변수의 범위는 U 클래스이거나, U를 상속받은 하위 클래스 (U와 U의 자손 타입만 가능)
> 상한의 뜻 : 타입의 최고 한도는 U 라는 의미. (최대 U 이하)
 

- 하한 경계 와일드카드 <? super U> : 반공변성 적용
> 타입 매개변수의 범위는 U 클래스이거나, U가 상속한 상위 클래스 (U와 U의 조상 타입만 가능)
> 하한의 뜻 : 타입의 최저 한도는 U 라는 의미. (최소 U 이상)

- 비경계
>  타입 매개변수의 범위는 제한이 없다. (모두 가능)
>  < ? extends Object >의 줄임 표현

## PECS (Producer-Extends / Consumer-Super)
- 외부에서 온 데이터를 생산(Producer) 한다면 <? extends T> 를 사용 (하위타입으로 제한)
- 외부에서 온 데이터를 소비(Consumer) 한다면 <? super T> 를 사용 (상위타입으로 제한).




------------
<a href="liskov"> [1]</a> : 리스코프 치환 원칙은 1988년 바바라 리스코프(Barbara Liskov)가 올바른 상속 관계의 특징을 정의하기 위해 발표한 것으로, 서브 타입은 언제나 기반 타입으로 교체할 수 있어야 한다는 것을 뜻한다.