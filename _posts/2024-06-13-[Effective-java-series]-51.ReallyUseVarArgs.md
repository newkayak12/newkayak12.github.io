# 가변인수는 신중히

가변 인수를 호출하면 인수 개수와 길이가 같은 배열을 만들도 배열에 저장해서 가변인수 메소드에 건낸다. 인수 개수는 런타임에 알 수 있다. 이런 불확실성은 왠지 모르게
불편해지는 부분이다. 더군다나 인수가 1개 이상 필요한데, 가변 인수를 안 넘기면? 원소가 0인 배열이 만들어지고 이를 위한 방어 로직을 짜야한다.

이 경우 꼭 필요한 원소는 파라미터로 선언하고 그 다음부터 가변인수로 만들면?

```java
int avg( int... values) {}
//이거 대신

int avg( int first, int... values) {}
//이렇게 바꾸면?
```

성능적으로 보면? 권장하지 않는다. 이 비용은 감당하기 싫으면서 유연성이 필요하다면?

```java
public void Record(){}
public void Record(int var1){}
public void Record(int var1, int var2){}
public void Record(int var1, int var2, int var3){}
public void Record(int var1, int var2, int var3, int var4){}
public void Record(int var1, int var2, int var3, int var4, int... var5){}
```
스프링에 있는 Jooq가 이런식으로 구현해놓은 경우가 있다. 이러면 마지막 케이스는 정말 극소수가 될거다. 자연스레 비용이 준다.