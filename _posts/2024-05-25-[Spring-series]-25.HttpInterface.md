---
layout: post

categories: [SPRING]
---



from [Dictionary - Http Interface Client](https://github.com/newkayak12/Dictionary/blob/master/spring/25.HttpInterface.md)



# Http Interface Client

## RestClient
동기 API가 있는 클라이언트

### initialize
`RestClient.crate()`로 생성한다 혹은 `builder`도 제공한다.

````java

RestClient defaultClient = RestClient.create();

RestClient customClient = RestClient.builder()
        .requestFactory(new HttpComponentsClientHttpRequestFactory())
        //Allows to use a pre-configured HttpClient
        .messageConverters(converters -> converters.add(new MyCustomMessageConverter()))
        //메시지 컨버터 지정
        .baseUrl("https://example.com")
        //baseUrl
        .defaultUriVariables(Map.of("variable", "foo"))
        //default Uri
        .defaultHeader("My-Header", "Foo")
        //defaultHeader
        .requestInterceptor(myCustomInterceptor)
        .requestInitializer(myCustomInitializer)
        .build();
````

### Request and Response
```java
restClient.get().uri("https://example.com/orders/{id}", 42)
//Uri는 UriBuilderFactory로 만들 수 있다. 

// .headers()
// .accept()
// .acceptCharset()

.retrieve() //retrieve() 실행으로 body에 접근할 수 있다.  
.body(String.class); //Jackson과 같은 MessageConverter로 Object로 받을 수도 있다.
```

### ResponseEntity
```java
ResponseEntity<String> result = restClient.get()
  .uri("https://example.com")
  .retrieve()
  .toEntity(String.class); //toEntity로 ResponseEntity로 받을 수 있다.

System.out.println("Response status: " + result.getStatusCode());
System.out.println("Response headers: " + result.getHeaders());
System.out.println("Contents: " + result.getBody());

```

### ErrorHandling
````java
String result = restClient.get()
  .uri("https://example.com/this-url-does-not-exist")
  .retrieve()
  .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
      throw new MyCustomRuntimeException(response.getStatusCode(), response.getHeaders())
  })
        //이와 같이  400번 대 에러를 처리할 수도 있다.
  .body(String.class);
````

### Exchange

`retrieve()` 대신 `exchange()`를 사용할 수도 있다. 이를 통해서 더 디테일하게 RestClient를 사용할 수 있다.
```java
Pet result = restClient.get()
  .uri("https://petclinic.example.com/pets/{id}", id)
  .accept(APPLICATION_JSON)
  .exchange((request, response) -> {
    if (response.getStatusCode().is4xxClientError()) {
      throw new MyCustomRuntimeException(response.getStatusCode(), response.getHeaders());
    }
    else {
      Pet pet = convertResponse(response);
      return pet;
    }
  });
```

### MessageConverter
|                                                    MessageConverter                                                    |                                                 Description                                                 |
|:----------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------:|
|                                               StringHttpMessageConverter                                               |                                          메시지를 String으로 변환해주는 컨버터다.                                          |
|                                                FormHttpMessageConverter                                                |           FormData 를 읽고 쓸 수 있게 해주는 컨버터다. 기본적으로 `application/x-www-form-urlencoded`를 형태일 때 읽고 쓴다.            |
|                                             ByteArrayHttpMessageConverter                                              |                        byte[]를 일고 쓸 수 있게 한다. `application/octet-stream`일 때 주로 사용한다.                         |
|                                            MarshallingHttpMessageConverter                                             |               XML 일 때 읽고 쓸 수 있게 해주는 컨버터다.       `text/xml`, `application/xml`  일 때 주로 읽고 쓴다.                |
|                                          MappingJackson2HttpMessageConverter                                           |                            Jackson의 ObjectMapper를 사용해서 JSON을 읽고 쓸 수 있게 해주는 컨버터다.                            |
|                  MappingJackson2XmlHttpMessageConverter                                                                |                            Jackson의 ObjectMapper를 사용해서 XML을 읽고 쓸 수 있게 해주는 컨버터다.                             |
|                                               SourceHttpMessageConverter                                               | `javax.xml.transform.Source`을 읽고 쓸 수 있게 해주는 컨버터다.  `DOMSource`, `SAXSource`, `StreamSource`를 읽고 쓸수 있게 해준다.  |

## WebClient
비동기 API가 있는 클아이언트

### 특징
- 논 블로킹 I/O 지원
- 리액티브 스트림의 백프레셔 지원
- 고가용성
- 함수형 타입을 지원한다
- 동기, 비동기 상호 작용 지원

### initialize
- WebClient.create()
- WebClient.create(String baseUrl)

`WebClient.builder()`는 아래 옵션을 설정할 수 있게 한다.

- uriBuilderFactory: `UriBuilderFactory`로 URI를 커스터마이징 할 수 있다.
- defaultUriVariables: UriTemplate을 확장할 때 사용한다.
- defaultHeader: 매 요청 시 담기는 기본 헤더
- defaultCookie: 매 요청 시 담기는 기본 쿠키
- defaultRequest:매 요청 시 기본 요청으로 실행할 Consumer
- filter: 매 요청 시 적용할 필터
- exchangeStrategies: Http 메시지를 읽고 쓸 전략을 설정한다.
- clientConnector: HTTP client library를 세팅할 수 있다.
- observationRegistry: the registry to use for enabling Observability support.
- observationConvention: an optional, custom convention to extract metadata for recorded observations.

```java
WebClient client1 = WebClient.builder()
		.filter(filterA).filter(filterB).build();

WebClient client2 = client1.mutate()
		.filter(filterC).filter(filterD).build();

// client1 has filterA, filterB

// client2 has filterA, filterB, filterC, filterD
```

### Request
WebClient와 유사하다만 Reactor를 채용하고 있단 부분이 다르다.

1. `retrieve()`로 response를 추출할 수 있다.

```java
WebClient client = WebClient.create("https://example.org");

Mono<ResponseEntity<Person>> result = client.get()
		.uri("/persons/{id}", id).accept(MediaType.APPLICATION_JSON)
		.retrieve()
		.toEntity(Person.class);
```

2. 바디만을 직접 받을 수도 있다.

```java
WebClient client = WebClient.create("https://example.org");

Mono<Person> result = client.get()
		.uri("/persons/{id}", id).accept(MediaType.APPLICATION_JSON)
		.retrieve()
		.bodyToMono(Person.class);

Flux<Quote> result = client.get()
        .uri("/quotes").accept(MediaType.TEXT_EVENT_STREAM)
        .retrieve()
        .bodyToFlux(Quote.class);
```

3. `exchange()`로 디테일하게 사용하기

- `exchangeToMono`()
- `exchangeToFlux`()
- `awaitExchange `()
- `exchangeToFlow`()

```java
Mono<Person> entityMono = client.get()
		.uri("/persons/1")
		.accept(MediaType.APPLICATION_JSON)
		.exchangeToMono(response -> {
			if (response.statusCode().equals(HttpStatus.OK)) {
				return response.bodyToMono(Person.class);
			}
			else {
				// Turn to error
				return response.createError();
			}
		});
```


## RestTemplate
템플릿 메소드 API가 있는 동기 클라이언트
`WebClient`, `RestClient`에 비해 스프링에서 제공하는 오래된 템플릿 클래스다.

| Method |            Description            |
|:-------:|:---------------------------------:|
|      getForObject  |             GET으로 요청              |
|     getForEntity   |    GET으로 요청 ResponseEntity로 반환    |
|   headForHeaders     |        HEAD 메소드로 리소스 헤더 요청        |
|      postForLocation  | POST로 요청하고 Location header를 반환 받음 |
|     postForObject   |         POST로 요청하고  반환 받음         |
|   postForEntity     | POST로 요청하고 ResponseEntity로를 반환 받음 |
|       put |                PUT                |
|      patchForObject  |             PATCH로 요청             |
|       delete |              DELETE               |
|       optionsForAllow |      ALLOW로 허용된 HTTP 메소드 검색       |
|  exchange     |      디테일하게 요청을 설정해서 보내는 메소드       |
|       execute |     콜백 인터페이스로 요청 - 응답을 하는 방식      |


## After Spring 6
spring 6 이후로 정의 된 기능이다. Java Interface로 HTTP 메소드를 정의하면
프록시로 이를 정의해서 API 호출을 가능하게 해준다.

자바 인터페이스 + `@HttpExchange`를 조합해서 `HttpServiceProxyFactory`에 넘기면 프록시로 생성한다.

### 형태
```java
@HttpExchange(url = "/repos/{owner}/{repo}", accept = "application/vnd.github.v3+json")
interface RepositoryService {

    @GetExchange
    Repository getRepository(@PathVariable String owner, @PathVariable String repo);

    @PatchExchange(contentType = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    void updateRepository(@PathVariable String owner, @PathVariable String repo,
                          @RequestParam String name, @RequestParam String description, @RequestParam String homepage);

}
```

### RestClient를 사용해서 HttpInterface 등록

```java
RestClient restClient = RestClient.builder().baseUrl("https://api.github.com/").build();
RestClientAdapter adapter = RestClientAdapter.create(restClient);
HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

RepositoryService service = factory.createClient(RepositoryService.class);
```
### WebClient를 사용해서 HttpInterface 등록

```java
WebClient webClient = WebClient.builder().baseUrl("https://api.github.com/").build();
WebClientAdapter adapter = WebClientAdapter.create(webClient);
HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

RepositoryService service = factory.createClient(RepositoryService.class);
```

### RestTemplate을 사용해서 HttpInterface 등록

```java
RestTemplate restTemplate = new RestTemplate();
restTemplate.setUriTemplateHandler(new DefaultUriBuilderFactory("https://api.github.com/"));
RestTemplateAdapter adapter = RestTemplateAdapter.create(restTemplate);
HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();

RepositoryService service = factory.createClient(RepositoryService.class);
```

### Annotation

|   Annotation    |     Description      |
|:---------------:|:--------------------:|
|  @HttpExchange  | HttpExchange 대상으로 선정 |
| @RequestHeader  |        요청 헤더         |
|  @PathVariable  |  Path Variable을 설정   |
|  @RequestBody   |   RequestBody로 지정    |
|  @RequestParam  |   QueryString으로 지정   |
|  @RequestPart   |     PartFile로 지정     |
|  @CookieValue   |      쿠키 값으로 지정       |
|  @GetExchange   |         GET          |
|  @PostExchange  |         POST         |
|  @PutExchange   |         PUT          |
| @PatchExchange  |        PATCH         |
| @DeleteExchange |        DELETE        |
