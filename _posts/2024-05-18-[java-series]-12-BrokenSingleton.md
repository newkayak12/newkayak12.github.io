from [Dictionary - Singleton과 훼손](https://github.com/newkayak12/Dictionary/blob/master/java/12.BrokenSingleton.md)

# Singleton
싱글톤은 기본적으로 단 하나의 유일한 객체를 의미한다.

# 역직렬화에 의한 싱글톤 훼손
자바의 직렬화(Serialize)는 JVM의 힙 메모리에 있는 객체 데이터를 바이트 스트림(byte stream) 형태로 바꿔 외부 파일로 내보낼수 있게 하는 기술을 말한다. 반대로 외부로 내보낸 직렬화 데이터를 다시 읽어들여 자바 객체로 재변환하는 것을 역직렬화(Deserialize) 라 한다.
직렬화하여 내보낸 외부 파일은 데이터베이스에 저장되기도 하며 네트워크를 통해 전송되기도 한다. 이 직렬화를 적용하기 위해선 클래스에 Serializable 인터페이스를 implements 하면 된다.
그런데 만일 어떤 클래스를 직렬화하여 다른 컴퓨터에 전송하려는데, 이 클래스를 싱글톤으로 구성하려고 한다. 하지만 이 싱글톤 클래스는 송신자가 파일을 받고 역직렬화시 깨지게 되어 더이상 싱글톤이 아니게 된다.

이러한 현상이 생기는 이유는 역직렬화 자체가 보이지 않은 생성자로서 역할을 수행하기 때문에 인스턴스를 또다시 만들어, 직렬화에 사용한 인스턴스와는 전혀 다른 인스턴스가 되기 때문에 일어나는 것이다. 따라서 클래스에 Serializable을 구현하면 더 이상 이 클래스는 싱글톤이 아니게 되어 메모리 이점을 더이상 얻을수 없게 된다.

# 훼손 대응 방안
이러한 싱글톤의 역직렬화의 대응 방안으로 직렬화 관련 메서드인 readResolve() 를 정의하면 된다.
readResolve 메서드를 정의하게 되면, 역직렬화 과정에서 readObject를 통해 만들어진 인스턴스 대신 readResolve에서 반환되는 인스턴스를 내가 원하는 것으로 바꿀 수 있기 때문이다. 그리고 기존에 역직렬화를 통해 새로 생성된 객체는 알아서 Garbage CollectorVisit Website의 대상이 된다.
```java
class Singleton implements Serializable {

    private Singleton() {}

    private static class SettingsHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return SettingsHolder.INSTANCE;
    }

    // 역직렬화한 객체는 무시하고 클래스 초기화 때 만들어진 인스턴스를 반환
    private Object readResolve() {
        return SettingsHolder.INSTANCE;
    }
}
```
이때 싱글턴 인스턴스의 직렬화 결과에는 아무런 실 데이터를 가질 이유가 없기 때문에, 싱글톤 클래스에 필드 변수들이 있을 경우 모든 인스턴스 필드를 transient로 선언한다. 아무리 readResolve 메서드라도 역직렬화 과정 중간에 역직렬화된 인스턴스의 참조를 훔쳐오는 공격을 행할경우 다른 객체로 바뀔 위험이 있기 때문이다.

```java
class Singleton implements Serializable {
    // 싱글톤 객체의 필드들을 transient 설정하여 직렬화 제외
    transient String str = "";
    transient ArrayList lists = new ArrayList();
    transient Integer[] integers;
    
    private Singleton() {}

    private static class SettingsHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return SettingsHolder.INSTANCE;
    }

    private Object readResolve() {
        return SettingsHolder.INSTANCE;
    }
}
```

# 리플렉션에 의한 싱글톤 훼손
자바 리플렉션(Reflection - 거울 등에 비친, 반사)은 객체를 통해 클래스의 정보를 분석하여 런타임에 클래스의 동작을 조작하는 프로그램 기법이다. 클래스 파일의 위치나 이름만 있다면 해당 클래스의 정보를 얻어내고 객체를 생성하는 것 또한 가능하게 해준다.
이러한 리플렉션 기법은 프레임워크, 라이브러리에서 많이 사용된다. 왜냐하면 프레임워크, 라이브러리는 사용하는 사람이 어떤 클래스명과 멤버들을 구성할지 모르는데, 이러한 사용자 클래스들을 기존의 기능과 동적으로 연결 시키기 위하서 이다. 이미 Spring, Lombok 등 많은 프레임워크에서 리플렉션 기능을 사용하고 있다.
그런데 문제는 리플렉션을 통해 싱글톤 객체를 생성하게 되면 다른 객체를 반환해 싱글톤이 다시 한번 깨지는 것이다. 클래스 객체를 통해 해당 객체의 생성자를 받아와 newInstance() 메서드를 실행하면 인스턴스를 생성할 수 있게 되는데, 여기서 생성된 인스턴스는 Holder가 가지고 있는 인스턴스와는 전혀 다른 새로운 인스턴스이기 때문이다.



