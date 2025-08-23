---
layout: post
categories: [ISSUE]
---


from [Dictionary - FilePart-ISSUE](#)



# FilePart

FilePart는 MultipartRequest에서 업로드 된 파일을 표현하는데 특화된 인터페이스다.

|Method |         Description         |Return|
|:-----:|:---------------------------:|:--------|
|filename()| 클라이언트가 업로드한 파일의 원본 명을 리턴한다. |String| 
|  transferTo(File dest)     |   파일을 주어진 목적지로 옮기는 메소드다.    |reactor.core.publisher.Mono<Void>|

## WebFlux에서 MultipartFile?
WebFlux에서 MultipartFile Converter가 없어졌다. 그도 그럴 것이 MultipartFile은 Servlet에서 파일을 다루던 형식이기 때문이다.
FilePart에 content -> `Flux<DataBuffer>`로 byte[]에도 접근할 수 있다.

## 이슈 사항
dependency를 수정하던 도중 

1. multipartFile의 `transferTo`를 리턴 
2. 이 값을 `map`,  `zipWith`, `zipWhen`으로 묶어서 로직을 수행할 수 있도록 수정
3. controller return 으로 이 파이프 라인을 반환하여 webflux가 subscribe 하도록 함

의 순으로 했는데 문제는 로직은 정상이었는데 파일이 복사가 되지 않는 현상이 생겼다. 
추정컨데, controller return 하면서 `transferTo`의 대상인 임시 파일이 삭제되서 생기는 현상으로 보였다.

결국

1. `flatMap`으로 흐름을 정리
2. `thenReturn`으로 정리하도 다른 리턴 값을 정의
3. `subscribe`를 호출하고 그 안에서 새로운 `Mono`를 생성하여 반환하거나

하는 방식으로 해결했다. 
