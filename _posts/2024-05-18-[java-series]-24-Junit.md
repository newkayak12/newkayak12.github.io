---
layout: post
categories: [JAVA]
---

from [Dictionary - JUnit](https://github.com/newkayak12/Dictionary/blob/master/java/24.Junit.md)

# Junit

## Annotation

|       Annotation       |                                                            Description                                                             |
|:----------------------:|:----------------------------------------------------------------------------------------------------------------------------------:|
|         @Test          |                                                        메소드가 테스트 메소드임을 나타낸다.                                                        |
|   @ParameterizedTest   |                                                        매개변수가 있는 테스트임을 나타낸다.                                                        |
|      @ValueSource      |                                         반복 테스트에서 지정한 배열을 파라미터 값으로 순서대로 넘겨준다. (하나의 인수일 경우)                                          |
|      @NullSource       |                                                       Null로 값을 전달할 떄  사용한다.                                                        |
|      @EmptySource      |                                                        빈 값을 인수로 전달할 때 사용한다.                                                        |
|  @NullAndEmptySource   |                                                      Null, Empty 모두 전달할 때 사용                                                       |                                                                    @CsvSource                                                                | 테스트 입력값을 Csv로 구성하여 던질 떄 사용한다.
|      @EnumSource       |                                                        열거형의 배열을 테스트 메소드에 전달                                                        |
|     @MethodSource      |                                 Arguments로 파라미터를 여러 개 전달할 떄 사용한다. (Arguments.of(value, value....))                                 |
|     @RepeatedTest      |                                                      메소드가 반복 테스트 메소드임을 나타낸다.                                                       |
|      @DisplayName      |                                                  테스트 클래스 또는 메소드에 대한 사용자 지정 표시 이름                                                   |
| @DisplayNameGeneration |                                                      테스트 클래스 이름 생성기를 선언한다. *                                                       |
|      @BeforeEach       |   @Test, @RepeatedTest, @ParameterizedTest, @TestFactor 전에 실행되는 것을 나타낸다. <br/>테스트 마다 실행 전에 실행된다. <br/> 매 테스트마다 초기화해야 하는 경우 사용된다.   |
|       @AfterEach       | @Test, @RepeatedTest, @ParameterizedTest, @TestFactor 후에 실행되는 것을 나타낸다.  <br/>테스트 마다 실행 후에 실행된다.     <br/> 매 테스트 후 정리해야 하는 경우 사용된다. |
|       @BeforeAll       |                                     @BeforeEach 와 유사하지만 `static` 메소드여야만 하며  테스트 전에 한 번만 실행된다.                                      |
|       @AfterAll        |                                      @AfterEach 와 유사하지만 `static` 메소드여야만 하며  테스트 후에 한 번만 실행된다.                                      |
|        @Nested         |                                                   주석이 달린 클래스가 중첩 테스트 클래스임을 나타낸다.                                                   |
|          @Tag          |                                                   클래스, 메소드 수준 테스트 필터링을 위해서 사용한다.                                                   |
|       @Disabled        |                                                    테스트 클래스, 메소드를 비활성화할 때 사용한다.                                                     |
|        @Timeout        |                                                          테스트 타임아웃을 지정한다.                                                           |
|      @ExtendWith       |                                                       확장을 선언적으로 등록할 때 사용한다.                                                        |
|   @RegisterExtension   |                                                 필드를 통해 프로그래밍 방식으로 확장을 등록할 떄 사용한다.                                                  |
|        @TempDir        |                                             테스트 메소드에서 필드 주입 또는 매개변수 주입을 통해 임시 디렉토리를 제공                                             |
|      @TestFactory      |                                                     동적 테스트를 위한 테스트 팩토리임을 나타낸다.                                                     |
|     @TestTemplate      |                                                                                                                                    |
|    @TestClassOrder     |                                                   @Nested 간 실행 순서를 구성하는 데 사용한다.                                                    |
|    @TestMethodOrder    |                             테스트 메소드간 순서를 구성하는 데 사용한다.                                               @                              |
|     @TestInstance      |                                              주석이 달린 테스트 클래스의 인스턴스 수명 주기를 구성하는데 사용한다.                                               |
|          @Sql              |                                                      sql 파일을 지정하여 Dao 단위 테스트에 미리 구성된 쿼리를 실행한다.                                                                              |

```java
class Junit {
    @TestFactory
    Stream<DynamicTest> testFactory () {
        List<Integer> numbers = Arrays.asList(1,2,3,4,5,6,7,8,9,10);
        return numbers.stream()
                      .forEach( num -> dynamicTest(
                              num,
                              () -> assertThat(number < 10).isTrue()
                      ));
    }

    @ParameterizedTest
    @ValueSource(ints = {1,2,3,4,5,6,7,8,9,10})
    public isUnderThen(int number){
        assertThat(number < 10).isTrue();
    }
}

```



## Spring Test Annotations

### Controller Test
| Annotation                                                                                                                                                    |                                      Description                                      |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------:|
| @SpringBootTest(<br/>webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT,<br/> properties = "spring.profiles.active=[profile]"<br/>)                  | SpringBootTest임을 알린다. 이 어노테이션이 붙으면 SpringContext를 실행하고 Component 스캔 등을 한다. (스프링을 켠다.) |
| @AutoConfigureMockMvc                                                                                                                                         |                                    서블릿 컨테이너를 모킹한다.                                    |
| @TestPropertySource                                                                                                                                           |     테스트 환경의 Property를 지정할 수 있다. (classpath:로 resource 내부에서 찾는건 덤 -> build에서 찾는다.)     |
| @ActiveProfiles                                                                                                                                               |                               Active로 둘 Profile를 지정한다.                                |

| Object                        |                 Description                  |
|:------------------------------|:--------------------------------------------:|
| @Autowired<br/>MockMvc             |     테스트용 MVC환경을 만들어 요청, 전송, 응답을 제공하는 클래스     |
| @LocalServerPort<br/>int port | 현재 mocking 혹은 지정된 포트를 반환한다. (RandomPort의 경우) |
 
```java
//ex)

@Test
@DisplayName(value = "ContextLoadTest")
void contextLoads() throws Exception {
        System.out.println("ContextLoaded");

        //given
        String expect = "junitTest";

        //when
        mockMvc.perform(
        get("/v1/user/test")
        .contentType(MediaType.APPLICATION_JSON)
        .accept(MediaType.APPLICATION_JSON)
        )
        //that
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(jsonPath("$",expect).exists());

        }

```

### ServiceTest
| Annotation  |                 Description                  |
|:------------|:--------------------------------------------:|
| @ExtendWith |        단위 테스트에 공통적으로 사용할 확장 기능을 선언한다.        |
| @Mock       |       Mock 객체를 생성 메소드는 있지만 내부 구현이 없다.        |
| @Spy        | 모든 기능을 가지고 있다. 다만 Stub을 하면 해당 부분만 Mocking된다. |
| @InjectMock |  @Mock, @Spy로 생산한 객체를 주입한다.(생성자 주입으로 추정된다.)  |


### RepositoryTest
| Annotation                                                                                                                                          |                         Descpription                         |
|:----------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------:|
| @DataJpaTest(<br/>&nbsp;&nbsp;showSql = true,<br/>&nbsp;&nbsp;properties = {"classpath:application.yml"},<br/>&nbsp;&nbsp;includeFilters = {}<br/>) | SpringContext 중 Repository에 관련된 요소들만 테스트하기 위해서 사용하는 어노테이션이다. |
| @AutoConfigureTestDatabase(connection="", replace="")                                                                                               |    TestDB를 구성할 때 유용한 어노테이션이다. 테스트 시 DB를 테스트 DB로 대체할 수 있다.    |
