from [Dictionary - 직렬화 역직렬화](https://github.com/newkayak12/Dictionary/blob/master/java/13.Serialize_Deserialize.md)

# Serialize & Deserialize
직렬화(serialize)란 자바 언어에서 사용되는 Object 또는 Data를 다른 컴퓨터의 자바 시스템에서도 사용할 수 있도록 바이트 스트림(stream of bytes)
형태로 연속적인(serial) 데이터로 변환하는 포맷 변환 기술을 일컫는다. 그 반대 개념인 역직렬화는(Deserialize)는 바이트로 변환된 데이터를 원래대로 자바 
시스템의 Object 또는 Data로 변환하는 기술이다.
이를 시스템적으로 살펴보면, JVM의 힙(heap) 혹은 스택(stack) 메모리에 상주하고 있는 객체 데이터를 직렬화를 통해 바이트 형태로 변환하여
데이터베이스나 파일과 같은 외부 저장소에 저장해두고, 다른 컴퓨터에서 이 파일을 가져와 역질렬화를 통해 자바 객체로 변환해서 JVM 메모리에 적재하는 것으로 보면 된다.

# 직렬화 사용처 
1. 서블릿 세션
   - 단순히 세션을 서블릿 메모리 위에서 운용한다면 직렬화를 필요로 하지 않지만, 만일 세션 데이터를 저장 & 공유가 필요할때 직렬화를 이용한다.
   - 세션 데이터를 데이터베이스에 저장할때
   - 톰캣의 세션 클러스터링Visit Website을 통해 각 서버간에 데이터 공유가 필요할때
    
2. 캐시
   - 데이터베이스로부터 조회한 객체 데이터를 다른 모듈에서도 필요할때 재차 DB를 조회하는 것이 아닌, 객체를 직렬화하여 메모리나 외부 파일에 저장해 두었다가 역직렬화하여 사용하는 캐시 데이터로서 이용이 가능하다.
   - 물론 자바 직렬화를 이용해서만 캐시를 저장할 수 있는 것은 아니지만 자바 시스템에서 만큼은 구현이 가장 간편하기 때문에 많이 사용된다고 보면 된다.
   - 단, 요즘은 Redis, Memcached 와 같은 캐시 DBVisit Website를 많이 사용하는 편이다.

3. Remote Method Invocation
   - 자바 RMI는 원격 시스템 간의 메시지 교환을 위해서 사용하는 자바에서 지원하는 기술이다.
   - 이 메세지에 객체 데이터를 직렬화하여 송신하는 것이다.
   - 최근에는 소켓을 이용하기 때문에 안쓰이는 기술이다.

# 직렬화 vs. JSON
## 자바 직렬화의 장점
1. 직렬화는 자바의 고유 기술인 만큼 당연히 자바 시스템에서 개발에 최적화되어 있다.
2. 자바의 광활한 레퍼런스 타입에 대해 제약 없이 외부에 내보낼 수 있다는 것이다.

사실 그 외에는 JSON이 훨씬 낫다.


# 직렬화 방법
1. Serialize 구현
Serializable 인터페이스는 아무런 내용도 없는 마커 인터페이스Visit Website 로서, 직렬화를 고려하여 작성한 클래스인지를 판단하는 기준으로 사용된다.
2. ObjectOutputStream 객체 직렬화
직렬화(스트림에 객체를 출력) 에는 ObjectOutputStream을 사용한다.
객체가 직렬화될때 오직 객체의 인스턴스 필드값 만을 저장한다. static 필드나 메서드는 직렬화하여 저장하지 않는다

# 직렬화 요소의 제외
1. transient 키워드
```java
class Customer implements Serializable {
    int id; 
    String name; 
    transient String password; // 직렬화 대상에서 제외
    int age; 

    public Customer(int id, String name, String password, int age) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.age = age;
    }
    
    ...
}
```

2. readObject / writeObject 재정의
직렬화 & 역직렬화할때 호출되는 readObject() 와 writeObject() 는 기본적으로 모든 요소에 대해 자동 직렬화 한다. 
그런데 이 메서드들을 직렬화할 클래스에 별도로 재정의 해주면 직렬화를 선택적으로 조작할 수 있게 된다. 이를 커스텀 직렬화 라고도 불리운다.

```java
class Customer implements Serializable {
    int id; // 고객 아이디
    String name; // 고객 닉네임
    String password; // 고객 비밀번호
    int age; // 고객 나이

    public Customer(int id, String name, String password, int age) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.age = age;
    }

    // 직렬화 동작 재정의
    private void writeObject(ObjectOutputStream out) throws IOException{
        out.writeInt(id);
        out.writeObject(name);
        out.writeInt(age);
    }

    // 역직렬화 동작 재정의
    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException{
        this.id = in.readInt();
        this.name = (String) in.readObject();
        this.age = in.readInt();
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

3. 상속 관계에서 직렬화
만약 부모-자식 상속 관계에서 부모 클래스가 Serializable을 구현했다면 자식 클래스는 Serializable을 구현하지 않아도 직렬화가 가능하다. 그러면 
반대로 부모 클래스는 Serializable을 구현하지 않고 자식 클래스만 구현했다면 어떤 방식으로 직렬화될까?


직렬화할때 부모 클래스의 인스턴스 필드는 무시되고 자식 필드만 직렬화가 된다. 따라서 상위 클래스의 필드까지 직렬화하려면 부모 클래스가 Serializable을 구현하도록 설정하던지,
위에서 다뤄본 writeObject / readObject 메서드를 재정의하여 직접 직렬화 코드를 추가 하면 된다.

# 직렬화 버전 관리
1. SerialVersionUID
Serializable 인터페이스를 구현하는 모든 직렬화된 클래스는 serialVersionUID(이하 SUID) 이라는 고유 식별번호를 부여 받는다. 이 식별 ID는 클래스를 직렬화, 역직렬화 과정에서 동일한 특성을 갖는지 확인하는데 사용된다. 그래서 클래스 내부 구성이 수정될 경우, 기존에 직렬화한 SUID와 현재 클래스의 SUID 버전이 다르기 때문에 이를 인지하고 InvalidClassException 예외가 발생시켜 값 불일치 되는 현상을 미연에 방지한다.
단, 직렬화 스펙 상 serialVersionUID 값 명시는 필수가 아니며, 만일 클래스에 SUID 필드를 명시하지 않는다면, 시스템이 런타임에 클래스의 이름, 생성자 등과 같이 클래스의 구조를 이용해 암호 해시함수를 적용해 자동으로 클래스 안에 생성하게 된다.

2. 수동 버전 관리
만일 네트워크로 객체를 직렬화하여 전송하거나 협업을 하는 경우 수신자와 송신자 모두 같은 버전의 클래스를 가지고 있어야 할텐데, 
만일 클래스가 조금만 변경사항이 있으면 모든 사용자에게 재배포해야 하는 애로사항이 생겨 프로그램을 관리하기 어렵게 만든다.

따라서 직렬화 클래스는 왠만한 상황에선 serialVersionUID 를 직접 명시해주어 클래스 버전을 수동으로 관리하는 것을 권장하는 편이다.
SUID를 직접 명시해주면 클래스의 내용이 변경되어도, 클래스의 버전이 시스템이 자동 생성된 값으로 변경되지 않기 때문이다. 이외에도 런타임에 SUID를 생성하는 시간도 많이 잡아먹기 때문에 미리 명시를 강력히 권장되는 바이다.


> ## SerialVersionUID 수동 관리 유의사항
> 클래스 serialVersionUID를 명시하더라도 절대 만능이 아니다. 위와 같이 단순히 필드 변수 하나 추가하는 정도는 문제가 없겠지만 필드 타입을 변경하는 상황에서는 버전 수동 관리를 하여도 예외를 막을순 없다.
> 
>

# 직렬화 예외
1. InvalidClassException
2. NotSerializableException

# 직렬화의 단점
1. 용량이 크다. (메타 정보를 모두 가지고 있다.)
2. 역직렬화 과정에서 공격당할 위험이 있다.
3. 릴리즈 후 수정이 어렵다.
4. 클래스 캡슐화가 깨진다.
5. 버그와 보안에 취약하다.



