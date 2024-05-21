from [Dictionary - Builder](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/04.Builder.md)


# Builder
빌더 패턴(Builder Pattern)은 복잡한 객체의 생성 과정과 표현 방법을 분리하여 다양한 구성의 인스턴스를 만드는 생성 패턴이다.
생성자에 들어갈 매개 변수를 메서드로 하나하나 받아들이고 마지막에 통합 빌드해서 객체를 생성하는 방식이다.

## 1. 점층적 생성자 패턴
우리가 다양한 매개변수를 입력받아 인스턴스를 생성하고 싶을때 사용하던 생성자를 오버로딩 하는 방식이다.
문제는 타입이 다양할수록 생성자 메서드 수가 기하급수적으로 늘어나 가독성이나 유지보수 측면에서 좋지 않다.

## 2. 자바 빈(Java Beans) 패턴
이러한 단점을 보완하기 위해 Setter 메소드를 사용한 자바 빈(Bean) 패턴이 고안 되었다.
매개변수가 없는 생성자로 객체 생성후 Setter 메소드를 이용해 클래스 필드의 초깃값을 설정하는 방식이다
기존 생성자 오버로딩에서 나타났던 가독성 문제점이 사라지고 선택적인 파라미터에 대해 해당되는 Setter 메서드를 호출함으로써 유연적으로 객체 생성이 가능해졌다.

하지만 이러한 방식은 객체 생성 시점에 모든 값들을 주입 하지 않아 일관성(consistency) 문제와 불변성(immutable) 문제가 나타나게 된다.

### 1) 일관성 문제
필수 매개변수란 객체가 초기화될때 반드시 설정되어야 하는 값이다. 하지만 개발자가 깜빡하고 `set~()` 메서드를 호출하지 않았다면 이 객체는 일관성이 무너진 상태가 된다. 
즉, 객체가 유효하지 않은 것이다. 만일 다른곳에서 햄버거 인스턴스를 사용하게 된다면 런타임 예외가 발생할 수도 있다.
이는 객체를 생성하는 부분과 값을 설정하는 부분이 물리적으로 떨어져 있어서 발생하는 문제점이다.
물론 이는 어느정도 생성자(Constructor)와 결합하여 극복은 할 수 있다.
하지만 다음에 소개할 불변성의 문제 때문에 자바 빈즈 패턴은 지양해야 한다.

### 2) 불변성 문제 
자바 빈즈 패턴의 Setter 메서드는 객체를 처음 생성할때 필드값을 설정하기 위해 존재하는 메서드이다.
하지만 객체를 생성했음에도 여전히 외부적으로 Setter 메소드를 노출하고 있으므로, 협업 과정에서 언제 어디서 누군가 Setter 메서드를 호출해 함부로 객체를 조작할수 있게 된다. 
이것을 불변함을 보장할 수 없다고 얘기한다.

## Builder 패턴
빌더 패턴은 이러한 문제들을 해결하기 위해 별도의 Builder 클래스를 만들어 메소드를 통해 step-by-step 으로 값을 입력받은 후에 최종적으로 build() 메소드로 하나의 인스턴스를 생성하여 리턴하는 패턴이다.
빌더 패턴 사용법을 잠시 살펴보면, StudentBuilder 빌더 클래스의 메서드를 체이닝(Chaining) 형태로 호출함으로써 자연스럽게 인스턴스를 구성하고 마지막에 build() 메서드를 통해 최종적으로 객체를 생성하도록 되어있음을 볼 수 있다.


### 패턴 구조
```java
class Student {
    private int id;
    private String name = "아무개";
    private String grade = "freshman";
    private String phoneNumber = "010-0000-0000";

    public Student(int id, String name, String grade, String phoneNumber) {
        this.id = id;
        this.name = name;
        this.grade = grade;
        this.phoneNumber = phoneNumber;
    }
    
    @Override
    public String toString() {
        return "Student { " +
                "id='" + id + '\'' +
                ", name=" + name +
                ", grade=" + grade +
                ", phoneNumber=" + phoneNumber +
                " }";
    }

    public static class StudentBuilder {
        private int id;
        private String name;
        private String grade;
        private String phoneNumber;

        public StudentBuilder id(int id) {
            this.id = id;
            return this;
        }

        public StudentBuilder name(String name) {
            this.name = name;
            return this;
        }

        public StudentBuilder grade(String grade) {
            this.grade = grade;
            return this;
        }

        public StudentBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }
     
        public Student build() {
            return new Student(id, name, grade, phoneNumber); // Student 생성자 호출
        }
    }
}
```

### 빌더 네이밍
1. 멤버이름()
2. set멤버이름()
3. with멤버이름()

### 장점
1. 객체 생성 과정을 일관된 프로세스로 표현
2. 디폴트 매개변수 생략을 간접적으로 지원
3. 필수 멤버와 선택적 멤버를 분리 가능 
4. 객체 생성 단계를 지연할 수 있다. 
5. 초기화 검증을 멤버별로 분리할 수 있다. 
6. 멤버에 대한 변경 가능성 최소화를 추구한다. 

### 단점
1. 코드 복잡성 증가
2. 생성자보다 성능이 떨어짐

## Simple Builder
```java
class Person {
    // final 키워드로 필드들을 불변 객체로 만든다.
    private final String name;
    private final String age;
    private final String gender;
    private final String job;
    private final String birthday;
    private final String address;

    // 정적 내부 빌더 클래스
    public static class Builder {

        // 필수 파라미터
        private final String name;
        private final String age;

        // 선택 파라미터
        private String gender;
        private String job;
        private String birthday;
        private String address;

        // 필수 파라미터는 빌더 생성자로 받게 한다
        public Builder(String name, String age) {
            this.name = name;
            this.age = age;
        }

        // 선택 파라미터는 각 메서드를 통해 정의한다
        public Builder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public Builder job(String job) {
            this.job = job;
            return this;
        }

        public Builder birthday(String birthday) {
            this.birthday = birthday;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        // 대상 객체의 private 생성자를 호출하여 최종 인스턴스화 한다
        public Person build() {
            return new Person(this); // 빌더 객체 자신을 넘긴다.
        }
    }

    // private 생성자 - 생성자는 외부에서 호출되는것이 아닌 빌더 클래스에서만 호출되기 때문에
    private Person(Builder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.gender = builder.gender;
        this.job = builder.gender;
        this.birthday = builder.birthday;
        this.address = builder.address;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age='" + age + '\'' +
                ", gender='" + gender + '\'' +
                ", job='" + job + '\'' +
                ", birthday='" + birthday + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}
```

## Director Builder
GOF에서 정의하고 있는 디자인 패턴은 복잡한 객체의 생성 알고리즘과 조립 방법을 분리하여 빌드 공정을 구축하는것이 목적이다. 빌더를 받아 조립 방법을 정의한 클래스를 Director라고 부른다.
```java
class Data {
    private String name;
    private int age;

    public Data(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
abstract class Builder {
    // 상속한 자식 클래스에서 사용하도록 protected 접근제어자 지정
    protected Data data;

    public Builder(Data data) {
        this.data = data;
    }

    // Data 객체의 데이터들을 원하는 형태의 문자열 포맷을 해주는 메서드들 (머리 - 중간 - 끝 형식)
    public abstract String head();
    public abstract String body();
    public abstract String foot();

}
// Data 데이터들을 평범한 문자열로 변환해주는 빌더
class PlainTextBuilder extends Builder {

    public PlainTextBuilder(Data data) {
        super(data);
    }

    @Override
    public String head() {
        return "";
    }

    @Override
    public String body() {
        StringBuilder sb = new StringBuilder();

        sb.append("Name: ");
        sb.append(data.getName());
        sb.append(", Age: ");
        sb.append(data.getAge());

        return sb.toString();
    }

    @Override
    public String foot() {
        return "";
    }
}

// Data 데이터들을 JSON 형태의 문자열로 변환해주는 빌더
class JSONBuilder extends Builder {

    public JSONBuilder(Data data) {
        super(data);
    }

    @Override
    public String head() {
        return "{\n";
    }

    @Override
    public String body() {
        StringBuilder sb = new StringBuilder();

        sb.append("\t\"Name\" : ");
        sb.append("\"" + data.getName() + "\",\n");
        sb.append("\t\"Age\" : ");
        sb.append(data.getAge());

        return sb.toString();
    }

    @Override
    public String foot() {
        return "\n}";
    }
}

// Data 데이터들을 XML 형태의 문자열로 변환해주는 빌더
class XMLBuilder extends Builder {
    public XMLBuilder(Data data) {
        super(data);
    }

    @Override
    public String head() {
        StringBuilder sb = new StringBuilder();

        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n");
        sb.append("<DATA>\n");

        return sb.toString();
    }

    @Override
    public String body() {
        StringBuilder sb = new StringBuilder();

        sb.append("\t<NAME>");
        sb.append(data.getName());
        sb.append("<NAME>");
        sb.append("\n\t<AGE>");
        sb.append(data.getAge());
        sb.append("<AGE>");

        return sb.toString();
    }

    @Override
    public String foot() {
        return "\n</DATA>";
    }
}

// 각 문자열 포맷 빌드 과정을 템플릿화 시킨 디렉터
class Director {
    private Builder builder;

    public Director(Builder builder) {
        this.builder = builder;
    }

    // 일종의 빌드 템플릿 메서드라 보면 된다
    public String build() {
        StringBuilder sb = new StringBuilder();

        // 빌더 구현체에서 정의한 생성 알고리즘이 실행됨
        sb.append(builder.head());
        sb.append(builder.body());
        sb.append(builder.foot());

        return sb.toString();
    }
}
```

## Lombok의 @Builder/ @SuperBuilder
클래스에 @Builder 어노테이션만 붙여주면 클래스를 컴파일 할 때 자동으로 클래스 내부에 빌더 API가 만들어진다. 
롬복의 @Builder는 GOF의 디렉터 빌더가 아닌 심플 빌더 패턴을 다룬다


## 실무 예제
- java.lang.StringBuilder의 append()
- java.lang.StringBuffer의 append()
- java.nio.ByteBuffer의 put() - CharBuffer, ShortBuffer, IntBuffer, LongBuffer, FloatBuffer, DoubleBuffer 도 마찬가지
- javax.swing.GroupLayout.Group의 addComponent()
- java.lang.Appendable의 구현체
- java.util.stream.Stream.Builder
