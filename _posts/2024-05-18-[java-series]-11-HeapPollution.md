---
layout: post
categories: [JAVA]
---

from [Dictionary - 힙 오염](https://github.com/newkayak12/Dictionary/blob/master/java/11.HeapPollution.md)

# Heap Pollution
힙 오염은 JVM의 Heap 메모리 영역에 저장되어 있는 특정 변수가 불량 데이터를 참조함으로써, 만일 힙에서 데이터를
가져오려고 할 때 얘기치 못한 런타임 에러가 발생할 수 있는 오염 상태를 의미한다.

힙 오염의 대표 이유는 `Generic`이다.
Generic collection은 이전 버전과의 호환성을 위해서 Compile 때 Generic을 Object으로 변환하거나 제거함으로써 하위 호환을 했다.

>
> 
> ## 제네릭 타입 소거(Erasure)
> 제네릭은 type-safe하며 실행 시간 오버헤드를 줄이기 위해서 도입된 문법으로, 이전 자바에서 제네릭 타입 파라미터가 없던 탓에 호환성을 위해서
> 제네릭은 컴파일되면 제네릭 타입은 사라졌다. 즉, `.class`에는 제네릭 정보가 존재하지 않았다.
>
> 컴파일 타임에만 타입 제약 조건을 정의하고, 런타임에는 타입을 제거하기 때문에 잠재적 힙 오염 문제에 빠질 수 있게 됐다.
> 
> ## Reifiable, Non-Reifiable
> 실체화 타입(Reifiable Type)이란 컴파일 단계에서 타입 소거에 의해 지워지지 않는 타입 정보를 말한다.
> 1. int, double, float, byte 등 원시 타입
> 2. Number, Integer 등 일반 클래스와 인터페이스 타입
> 3. List, ArrayList, Map 등 자체(Raw Type)
> 4. List<?>, ArrayList<?> 등 비한정 와일드 카드가 포함된 매개변수화 타입 (와일드 카드 <?> 는 애초에 타입 정보가 명시되지 않았으므로 타입 소거를 해도 별 문제가 없다. 컴파일 타임에 Object로 변환 됨)
> 
> 비실체화 타입(Non-Reifiable Type) 컴파일 단계에서 타입 소거에 의해서 타입 정보가 제거된 타입을 의미한다. 제네릭 타입 파라미터는 모두 제거된다.
> 1. List<T>, List<E>
> 2. List<Number>, ArrayList<String>
> 3. List<? extends Number>, List<? super String>
> 
> ## 제네릭 소거 과정
> 컴파일러는 제네릭 타입을 이용해서 소스 파일을 체크하고 개발자가 지정한 코드에 따라 필요한 곳에 형 변환을 넣고 최종적으로 컴파일 코드에 `Type Erasure`로 제네릭 타입을 제거하게 된다.
> 
> 1. 제네릭 타입의 경계(bound)를 제거
>   - 제네릭 <T extends Number> -> T는 Number로 치환
>   - <T>는 Object로 치환
> ```java
> // T extends Type -> Type 
> /* 치환 전 */
> class Box<T extends Number> {
> List<T> list = new ArrayList<>();
>
>     void add(T item) {
>        list.add(item);
>     }
>
>     T getValue(int i) {
>         return list.get(i);
>     }
> }
> 
> /* 치환 후 */
> class Box {
>     List list = new ArrayList(); // Object
> 
>     void add(Number item) {
>         list.add(item);
>     }
> }
> ```
> 
> 2. 제네릭 타입을 제거한 후 타입이 일치하지 않는 곳은 형 변환을 추가한다.
> ```java
> /* 치환 전 */
> class Box {
>     List list = new ArrayList(); // Object
> 
>     void add(Number item) {
>         list.add(item);
>     }
> }
> 
> /* 치환 후 */
> class Box {
>     List list = new ArrayList(); // Object
> 
>     void add(Number item) {
>         list.add(item);
>     }
> 
>     Number getValue(int i) {
>         return (Number) list.get(i); // 캐스팅 연산자 추가
>     }
> }
> ```
> 3. 소거는 똑같이 진행
> ```java
> // T -> Object
> /* 치환 전 */
> public static <T> int count(T[] anArray, T elem) {
>     int cnt = 0;
>     for (T e : anArray)
>         if (e.equals(elem))
>             ++cnt;
>         return cnt;
> }
> 
> /* 치환 후 */
> public static int count(Object[] anArray, Object elem) {
>     int cnt = 0;
>     for (Object e : anArray)
>         if (e.equals(elem))
>             ++cnt;
>         return cnt;
> }
> ```
> ## Bridge 메소드
> 컴파일러는 확장된 제네릭 타입에 대해서 타입 소거를 해도 다형성 보존을 위해서 별도의 `bridge method`를 생성한다.
> 
> 
> 


# 제네릭 힙 오염
1. 원시 타입과 매개변수 타입을 동시에 사용하는 경우
2. 확인되지 않은 형 변환을 수행하는 경우

```java
//ClassCastException 발생 예정
ArrayList<String> list1 = new ArrayList<>();
list1.add("A");
list1.add("B");

Object obj = list1; //상위 타입 Object로 변경

ArrayList<Double> list2 = (ArrayList<Double>) obj; //DownCast
list2.add(1.0);
list2.add(2.0);

System.out.println(list2); // [홍길동, 임꺾정, 1.0, 2.0]

for(double n : list2) {
    System.out.println(n);
}
```
컴파일러는 위의 코드에 대해서 컴파일 에러를 내지 않는다. 이는 제네릭 타입 소거에 의해서 나타나는 문제다. 

### 1. 컴파일러는 타입 캐스팅을 검사하지 않는다. 
-> 컴파일러는 형변환 대상 객체에 대해서 검사하지 않는다. 정확히 말하면 캐스팅 했을 때 대입되는 변수에 저장할 수 있느냐만 검사한다. 
### 2. 제네릭 타입이 소거되면 결국 Object
-> 컴파일되면서 결국 제네릭은 Object가 된다. 결국 위 예시는 RawType이 되면서 어떤 정보든 저장할 수 있게 되면서 컴파일 에러가 나지 않는다.


## 제네릭 힙 오염 방지책
자바에서 Collections 클래스의 `checkList()` 메소드를 지원한다 해당 객체에 대해서 의도치 않은 타입의 데이터가 들어갔을 때 이를 감지하여 예외를 발생시킨다.





<cite> https://inpa.tistory.com/entry/JAVA-☕-제네릭-타입-소거-컴파일-과정-알아보기 </cite>