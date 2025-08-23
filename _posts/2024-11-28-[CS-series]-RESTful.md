---
layout: post
categories: [CS]
---




# RESTful

## 1. 들어가며
### 1. REST
- REpresentational State Transfer의 약자

### 2. 출현 계기
- 1991년 `www` 출범. 아이디어는 <q>정보들을 하이퍼 텍스트로 연결한다.</q>
- 표현 형식은 HTML, 식별자는 URI, 전송 프로토콜은 HTTP(Hypertext Transfer Protocol)
- http 1.0 명세가 나오기 전에 http는 프로토콜로 사용되고 있었다.
- 명세를 추가하면서 이미 사용 중인 프로토콜을 망가뜨리지 않고 기능을 증가시키는 방향을 모색함
  - HTTP Object Model이라는 것을 만든다.
  - 4년 후 <strong><q>Representational State Transfer:An Architectural Style for Distributed Hypermedia interaction</q></strong>에서 REST 를 공개

### 3. API
- MS에서 XML-RPC(1998) 프로토콜을 만들고 SOAP(Symbolic Optimal Assembly Program)로 이름이 바뀐다.
```xml
<?xml version='1.0' Encoding= 'UTF-8' ?>
<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope ">
  <env:Header>
    <m:reservation xmins:m="http://travelcompany.example.org/reservation"
                   env:role="http://www.w3.org/2003/05/soap-envelope/role/next">
        <m:reference>uuid: 093a2da1-q345-739r-ba5d-pqff98fe8j7d</m:reference>
        <m:dateAndTime >2007-11-29T13:20:00.000-05:00</m:dateAndTime>
    </m:reservation>
    <n:passenger xmlns:n="http://mycompany.example.com/employees" 
                 env:role="http://www.w3.org/2003/05/soap-envelope/role/next">
        <n:name>Fred Bloggs</n:name>
    </n:passenger>
  </env:Header>
  <env:Body>
    <p:itinerary xmlns:p="http://travelcompany.example.org/reservation/travel">
      <p:departure>
        <p:departing>New York</p:departing>
        <p:arriving>Los Angeles</p:arriving>
        <p:departureDate>2007-12-14</p:departureDate>
        <p:departureTime>late afternoon</p:departureTime>
        <p:seatPreference>aisle</p:seatPreference>
      </p:departure>
      <p:return>
        <p:departing>Los Angeles</p:departing>
        <p:arriving>New York</p:arriving>
        <p:departureDate>2007-12-20</p:departureDate>
        <p:departureTime>mid-morning</p:departureTime>
        <p:seatPreference></p:seatPreference>
      </p:return>
    </p:itinerary>
  </env:Body>
</env:Envelope>
<!--
참고: https://www.altexsoft.com/blog/what-is-soap-formats-protocols-message-structure-and-how-soap-is-different-from-rest/
-->
```
- 너무 복잡하여 개선을 했고, 논문을 바탕으로  REST라는 이름으로 발표
- 결과적으로 REST라는 이름의 형태로 정착이 되는 듯 싶었다.

### 4. REST에 대해서 
- 2008년 CMS를 위해서 CMIS(Content Management, Interoperability Service) API를 발표
  - RESTful 바인딩을 지원한다고 발표
  > <q>CMIS는 REST API가 아니다.</q>
- MS에서 REST API Guidlines를 2016에 발표
  - URI는 https://{serviceRoot}/{collection}/{id} 형식
  - GET, PUT, DELETE, POST, HEAD, PATCH, OPTIONS를 지원
  - API 버전은 Major, Minor로 하고 URI에 포함
> <q>REST API는 hypertext driven이어야 한다. 이는 http API다.</q>

## 2.RESTful

### 1. REST API
- REST 아키텍쳐를 따르는 API
- REST -> 분산 하이퍼 미디어 시스템을 위한 아키텍쳐 스타일(제약조건)


### 2. REST를 구성하는 요소
1. Client-Server: 클라이언트가 서버로 요청을 보내고 서버는 이에 대해서 응답하는 형태
2. Stateless: 각 클라이언트에서 서버로 보내는 요청이 독립적이며 처리에 필요한 모든 정보가 기술되어 있어야 한다는 것
3. Cache: 캐시 사용이 가능해야 한다는 것 
4. Uniform Interface: 
   1. Identification of resources: URI로 리소스가 식별되면 된다.
   2. Manipulation of resources through representations: 표현으로 리소스를 전송해야 한다.
   3. Self-descriptive messages: 메시지는 스스로를 설명해야 한다.
      - 요청 자체로 목적지를 알 수 있어야 하고 -> 
      - 리턴된 요청이 어떻게 읽어야 하는지 기술되어야 하고 -> application/json이라고 쓰여있다고 다가 아니다. 이 json이 어떻게 동작할지도 적어야 한다.
   4. Hypermedia as the engine of application state(HATEOAS)
      - 애플리케이션 상태는 Hyperlink를 이용해서 전이되어야 한다.
      - html의 경우 HATEOAS를 만족한다. (a 태그로 다음 상태로 전이가 가능하다.)
   > 왜 필요한가?
   > 1. 독립적 진화
   >    1. 서버와 클라이언트가 독립적으로 진화된다.
   >    2. 서버 기능 변경에 클라이언트가 독립적이다. ( REST는 웹을 해치지 않고 HTTP를 개선하는데 목적이 있다.)
   > 2. 실제로 잘 지켜지는가?
   >    1. 웹에서는 잘 지켜지는 편이다.
   >    2. 모바일은 애매하다.
   > 3. 상호 운용성(interoperability)에 대한 고려
   >    1. Referer는 오타 -> 안 고침
   >    2. charset: 잘못 지은 이름 -> 안 고침
   >    3. HTTP status 418은 만우절에 지어진 상태 값 -> 못 고침
   >    4. HTTP/0.9 아직도 지원
5. Layered System: 하위 계층이 상위 계층의 기능과 서비스를 지원하는 기능과 서비스를 제공하도록 계층적으로 구성 요소가 그룹화되는 시스템
6. Code-on-Demand(optional):

## 3. 지켜야 하는가?
<h3><q>아니다.</q></h3>
조건이 있다. 
1. 클라이언트, 서버 둘 다 한다면
2. 진화에 관심이 없다면

## 4. 어떻게 하는게 좋은가?
1. self-descriptive와 HATEOAS를 만족하게 쓰거나
2. 아니면 적절히 타입해서 쓰거나

> 개인적으로 SPRING HATEOAS를 써서라도 1을 지키는 것이 좋아 보이나
> 실제로는 다 지키기 어려울 수 있다.
> 
>  Uniform Interface의
>    1. Identification of resources
>    2. Manipulation of resources through representations
>    3. Self-descriptive messages (100% 다 지키기 어렵다.)
> 
> 라고 잘 지키면서 사용하자.
>    


-----------------------
[[참고 문헌]: 그런 REST API로 괜찮은가?](https://velog.io/@kjh03160/그런-REST-API로-괜찮은가)

