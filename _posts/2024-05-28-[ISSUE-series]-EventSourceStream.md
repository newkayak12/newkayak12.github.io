---
layout: post
categories: [ISSUE]
---


from [Dictionary - EventSourceStream-ISSUE](https://github.com/newkayak12/Dictionary/blob/master/issue/EventSourceStream.md)


# EventSourceStream and Issue

> 모 프로젝트에서 채팅을 구현하던 도중 `Server-Sent Event`으로 채팅방 정렬, 새로운 채팅방 개설 등의 작업을 진행하던 도중 겪었던 일이다.
> 

#  short polling/ long polling

![스크린샷 2024-05-27 19.03.29.png](/assets/img/스크린샷 2024-05-27 19.03.29.png)

이렇게 주기적으로 서버에 질의를 던지고 바뀐 점이 있으면 가져온다.
`short polling`은 주기가 짧게, `long polling` 주기 길게 

## SSE

![스크린샷 2024-05-27 19.03.52.png](/assets/img/스크린샷 2024-05-27 19.03.52.png)

## Server

```java
@RestController  
@Slf4j  
public class SseController {  
  
    private final SseEmitters sseEmitters;  
  
    public SseController(SseEmitters sseEmitters) {  
        this.sseEmitters = sseEmitters;  
    }  
  
    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)  
    public ResponseEntity<SseEmitter> connect() throws RuntimeException{  
        SseEmitter emitter = new SseEmitter(60 * 1000L);  
        sseEmitters.add(emitter);
            emitter.send(SseEmitter.event()  
                    .name("connect")  
                    .data("connected!"));  
        return ResponseEntity.ok(emitter);  
    }  
}
```


## Client
```js
const sse = new EventSource("http://localhost:8080/connect");

sse.addEventListener('connect', (e) => {
	const { data: receivedConnectData } = e;
	console.log('connect event data: ',receivedConnectData);  // "connected!"
});
```

Server에서 `SseEmitter` 를 생성해서 Client에서 `EventSource`를 생성해서 
그리고 `eventListener`를 등록해서 이벤트를 Emit 받으면 Listen해서 동작하는 식이다.


## 이슈 

1. 503 Service Unavailable : 맨 처음 Sse를 만들고 이벤트를 emit하지 않으면 발생한다. 

```java
 emitter.send(SseEmitter.event().name("connect").data("connected!"));  
```

그래서 위 코드와 같이 바로 `send()` 한다.


2. Jpa Connection 고갈 : `open-in-view`를 열어놓으면 DB 커넥션이 고갈될 수 있다. 

3. MemoryLeak : `client`에서 사용하지 않을 때 `heartbeat`를 보내는 것으로 보인다. 그런데, 문제는 client에서 커넥션을 끊어도, 서버에서 emitter를 정리해도
메모리에서 해제되지 않는 이슈가 있었다. 

```java
emitter.onCompletion(() -> {  
    this.emitters.remove(emitter);    // 만료되면 리스트에서 삭제
});  
emitter.onTimeout(() -> {  
    emitter.complete();  
});  
```

등의 훅을 설정해도 문제가 있었다.  찾아보니 이 메모리 누수 문제는 꽤나 많이 발생하던 문제로 보였다.
결국 websocket으로 해결했다.


## 결론

SSE(EventSource)는 쓰기에 무리가 있는 것으로 보인다.