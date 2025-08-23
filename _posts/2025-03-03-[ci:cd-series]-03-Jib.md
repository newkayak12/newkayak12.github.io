---
layout: post
categories: [CI/CD]
---

# Jib

- 애플리케이션을 컨테이너 이미지로 패키징하는 모든 단계를 빠르게 처리하는 컨테이너 이미지 빌더다.
- Dockerfile을 작성하거나 도커를 따로 설치할 필요가 없다.
- Maven, Gradle 플러그인으로 동작한다.
- 플러그인 정의하고 타겟 이미지에 대한 설정, 빌드에 대한 정의를 하면 Java Application을 컨테이너화 할 수 있다.

![https://cloud.google.com/java/getting-started/jib?hl=ko](img/Screenshot%202025-02-01%20at%2016.02.02.png)

* 출처: https://cloud.google.com/java/getting-started/jib?hl=ko

## kotlin plugin

```kotlin
plugins {
    id("com.google.cloud.tools.jib' version '3.4.4")
}
```

## jib configuration

|           필드            |     클로저 파라미터     |    변수    |         타입          |      기본 값       |                                                             설명                                                              |
|:-----------------------:|:----------------:|:--------:|:-------------------:|:---------------:|:---------------------------------------------------------------------------------------------------------------------------:|
|           to            |                  |          |         to          |    required     |                                                         구축할 대상 이미지                                                          |
|                         |      image       |          |       String        | eclipse-temurin |                                                        기본 이미지에 대한 참조                                                        |
|                         |       tags       |          |    List<String>     |                 |                                                           푸시할 태그                                                            |
|                         |    credHelper    |          |       String        |                 |                                           대상 이미지를 푸시하는 것을 인증할 수 있는 자격 증명 도우미를 지정                                            |
|                         |       auth       |          |        auth         |                 |                                                         자격 증명 직접 지정                                                         |
|                         |                  | username |       String        |                 |                                                             아이디                                                             |
|                         |                  | password |       String        |                 |                                                            비밀번호                                                             |
|          from           |                  |          |        from         |                 |                                                           기본 이미지                                                            |
|                         |      image       |          |       String        | eclipse-temurin |                                                        기본 이미지에 대한 참조                                                        |
|                         |    credHelper    |          |       String        |                 |                                           대상 이미지를 푸시하는 것을 인증할 수 있는 자격 증명 도우미를 지정                                            |
|                         |       auth       |          |        auth         |                 |                                                         자격 증명 직접 지정                                                         |
|                         |                  | username |       String        |                 |                                                             아이디                                                             |
|                         |                  | password |       String        |                 |                                                            비밀번호                                                             |
|        container        |                  |          |      container      |                 |                                                       빌드된 이미지의 도커 설정                                                        |
|                         |     appRoot      |          |       String        |      /app       |                                                      앱 콘텐츠가 있는 루트 디렉토리                                                      |
|                         |       args       |          |    List<String>     |                 |                                     컨테이너 시작하기 위해 명령에 추가된 추가 프로그램 인수   (Docker의 CMD와 유사)                                     |
|                         |    entrypoint    |          |    List<String>     |                 |                                                     도커의 entrypoint와 유사                                                      |
|                         |   environment    |          | Map<String, String> |                 |                                                         컨테이너 환경 변수                                                          |
|                         |     jvmFlags     |          |    List<String>     |                 |                                                           JVM 플래그                                                           |
|                         |      labels      |          | Map<String, String> |                 |                                                이미지 메타데이터를 적용하기 위한 key-value                                                 |
|                         |      ports       |          |    List<String>     |                 |                                                         EXPOSE 될 포트                                                         |
|                         |     volumes      |          |    List<String>     |                 |                                                        컨테이너 마운트 포인트                                                         |
|                         | workingDirectory |          |       String        |                 |                                                        컨테이너 작업 디렉토리                                                         |
|                         |       user       |          |       String        |                 |                                                      컨테이너 운용 할 사용자 그룹                                                       |
|    extraDirectories     |                  |          |  extraDirectories   |                 |                                                      이미지에 추가할 임의의 디렉토리                                                      |
|       outputPaths       |                  |          |     outputPaths     |                 |                                               Jib에 의해서 생성된 추가 빌드 아티팩트의 위치 구성                                                |
|   containerizingMode    |                  |          |       String        |    exploded     | `package`로 설정하면 Gradle Java 플러그인에 의해 구축된 JAR 아티팩트를 최종 이미지에 넣습니다. <br/>`exploded`(기본값)로 설정하면 개별 .class 파일과 리소스 파일을 컨테이너화합니다. |
| allowInsecureRegistries |                  |          |       boolean       |      false      |                                                 true면 https 인증서 오류를 무시합니다.                                                  |


## 예시

```kotlin
jib {
  from {
    image = "openjdk:alpine"
  }
  to {
    image = "localhost:5000/my-image/built-with-jib"
    credHelper = "osxkeychain"
    tags = setOf("tag2", "latest")
  }
  container {
    jvmFlags = listOf("-Dmy.property=example.value", "-Xms512m", "-Xdebug")
    mainClass = "mypackage.MyApp"
    args = arrayOf("some", "args")
    ports = listOf("1000", "2000-2003/udp")
    labels = mapOf("key1" to "value1", "key2" to "value2")
    format = "OCI"
  }
}
```