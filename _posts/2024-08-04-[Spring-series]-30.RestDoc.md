---
layout: post

categories: [SPRING]
---

# Restdoc

spring에서 문서 자동화를 위해서 1) OpenAPI - Swagger, 2) Spring - Restdoc이 있다.

Swagger는 보통 Swagger UI와 같이 사용하며, 소스코드에 어노테이션을 작성하여 Reflection으로 JSON을 만들고
이를 UI로 출력하는 형태를 가진다. 추가적으로 API 호출을 해볼 수 있다는 장점이 있다. 그러나 소스코드에 불필요한 어노테이션이 늘어서
불편하다는 단점이 있다.

Restdoc은 테스트를 기반으로 문서를 작성한다. 테스트 코드에 문서화 코드를 삽입하고 테스트 결과를 바탕으로 asciiDoc으로 작성하며
HTML로 변환할 수도 있다. 그러나 API 호출을 해볼 수는 없다는 단점이 존재한다.

```gradle
dependencies {
    asciidoctorExtensions 'org.springframework.restdocs:spring-restdocs-asciidoctor'
    testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc'
}
// 디펜던시 추가

ext {
    snippetsDir = file('build/generated-snippets')
}
test {
    outputs.dir snippetsDir //outputDir 작성
    useJUnitPlatform()
}

// asciidoctor 설정
asciidoctor {
    dependsOn test // test 작업 이후에 작동하도록 하는 설정
    configurations 'asciidoctorExtensions' // 위에서 작성한 configuration 적용
    inputs.dir snippetsDir // snippetsDir 를 입력으로 구성

    // source가 없으면 .adoc파일을 전부 html로 만들어버림
    // source 지정시 특정 adoc만 HTML로 만든다.
    sources{
        include("**/index.adoc","**/common/*.adoc")
    }

    // 특정 .adoc에 다른 adoc 파일을 가져와서(include) 사용하고 싶을 경우 경로를 baseDir로 맞춰주는 설정입니다.
    // 개별 adoc으로 운영한다면 필요 없는 옵션입니다.
    baseDirFollowsSourceFile()
}

// asciidoctor가 실행될 때 static/docs 폴더 비우기
asciidoctor.doFirst {
    delete file('src/main/resources/static/docs')
}

// asccidoctor 작업 이후 생성된 HTML 파일을 static/docs 로 copy
task copyDocument(type: Copy) {
    dependsOn asciidoctor
    from file("build/docs/asciidoc")
    into file("src/main/resources/static/docs")
}

// build 시 codyDocument 실행
build {
    dependsOn copyDocument
}

//build의 bootJar 시 asciidoctor에 의존하여 /static/docs에 index.html이 생성된다.
bootJar {
    dependsOn asciidoctor
    from("${asciidoctor.outputDir}") {
        into 'static/docs'
    }
}
```

```java
@AutoConfigureRestDocs //추가
public class Test {

    @Test
    public void success() throws Exception {
        String phone = randomPhone();
        
        
        
        Map<String,String> map = new HashMap<>();

        map.put("uuid","UUID");
        map.put("phone","전화번호");
        map.put("nickname","닉네임");
        map.put("email","이메일");
        map.put("pushToken","푸시 토큰");
        map.put("tired","피로도");
        map.put("sendable","푸시 전송 가능 여부");
        map.put("joinDate","회원 가입일");
        map.put("lastModifiedDate","마지막 수정일");
        map.put("lastSignInDate","마지막 로그인 날짜");
        map.put("buddies","버디");
        
        mockMvc.perform(get(String.format(prefix + url + "%s", phone)))
                .andExpect(status().isOk())
                .andDo( //Test의  AndDo에 document 뱉는 코드 작성
                        RestDocument.build("회원가입")
                                .rqSnippet(simpleRequestFields(Map.of(
                                        "phone","전화번호",
                                        "password","비밀번호",
                                        "nickname","닉네임"
                                )))
                                .rsSnippet(RestDocument.simpleResponseFields(map))
                                .build()

                );
    }
}
```

```java
//반복된 코드 정리한 class
public class RestDocument {
    public static RequestFieldsSnippet simpleRequestFields(Map<String, String> request) {
        List<FieldDescriptor> linkedRequest = new LinkedList<>();
        for(String key : request.keySet()) {
            linkedRequest.add(PayloadDocumentation.subsectionWithPath(key).description(request.get(key)));
        }

        return   relaxedRequestFields(linkedRequest.toArray(FieldDescriptor[]::new));
    }
    public static ResponseFieldsSnippet simpleResponseFields(Map<String,String> response) {
        List<FieldDescriptor> linkedResponse = new LinkedList<>();
        for(String key : response.keySet()) {
            linkedResponse.add(PayloadDocumentation.subsectionWithPath(key).description(response.get(key)));
        }
        return relaxedResponseFields(linkedResponse.toArray(FieldDescriptor[]::new));
    }


    public static Builder build(String name) {
        return new Builder(name);
    }

    public static class Builder {
        public Builder(String name) {
            this.name = name;
        }

        private String name;
        private RequestFieldsSnippet rqSnippet = null;
        private ResponseFieldsSnippet rsSnippet = null;
        private PathParametersSnippet pathSnippet = null;
        private RequestPartFieldsSnippet partSnippet = null;
        private RequestHeadersSnippet headersSnippet = null;

        public Builder rqSnippet(RequestFieldsSnippet rqSnippet){
            this.rqSnippet = rqSnippet;
            return this;
        }
        public Builder rsSnippet(ResponseFieldsSnippet rsSnippet){
            this.rsSnippet = rsSnippet;
            return this;
        }
        public Builder pathSnippet(PathParametersSnippet pathSnippet){
            this.pathSnippet = pathSnippet;
            return this;
        }
        public Builder partSnippet(RequestPartFieldsSnippet partSnippet){
            this.partSnippet = partSnippet;
            return this;
        }
        public Builder headersSnippet(RequestHeadersSnippet headersSnippet){
            this.headersSnippet = headersSnippet;
            return this;
        }


        private OperationRequestPreprocessor simplePreProcessRequest() {
            return  preprocessRequest(
                    modifyUris() // (1)
                            .scheme("https")
                            .host("docs.api.com")
                            .removePort(),
                    prettyPrint());
        }
        private OperationResponsePreprocessor simplePreProcessResponse( ){
            return preprocessResponse(prettyPrint());
        }

        private Snippet[] simpleSnippets() {
            List<Snippet> snippet = new LinkedList<>();
            if(Objects.nonNull(rqSnippet)) snippet.add(rqSnippet);
            if(Objects.nonNull(rsSnippet)) snippet.add(rsSnippet);
            if(Objects.nonNull(pathSnippet)) snippet.add(pathSnippet);
            if(Objects.nonNull(partSnippet)) snippet.add(partSnippet);
            if(Objects.nonNull(headersSnippet)) snippet.add(headersSnippet);

            return snippet.toArray(Snippet[]::new);
        }
        public RestDocumentationResultHandler build() {
            return document(
                    this.name,
                    this.simplePreProcessRequest(),
                    this.simplePreProcessResponse(),
                    this.simpleSnippets()
            );
        }
    }
}
```

[참고 : 우아한 기술블로그] (https://techblog.woowahan.com/2597/)


# restDoc
- `requestFields` : 요청 값 -> 필드 전체 체크
  - `subsectionWithPath`
  - `fieldWithPath`
- `relaxedRequestFields`: 요청 값 -> 필드 전체 체크 없음

- `responseFields` : 응답 값 -> 필드 전체 체크
  - `subsectionWithPath`
  - `fieldWithPath`
- `relaxedResponseFields` : 응답 값 -> 필드 전체 체크 없음

- `pathParameters`
  - `pathParameters`

- `requestHeaders`
  - `headerWithName`

[참고 velog](https://velog.io/@dhfl0710/Spring-RestDocs-문서화)
[참고 blog](https://jogeum.net/16)