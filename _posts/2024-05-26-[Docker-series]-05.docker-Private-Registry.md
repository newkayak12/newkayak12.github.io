---
layout: post
categories: [DOCKER]
---

g
from [Dictionary - Docker Private Registry](https://github.com/newkayak12/Dictionary/blob/master/docker/05.dockerPrivateRegistry.md)


# Docker Private Registry

## 구축
보통 아래 두 개의 이미지를 사용해서 구축한다.
```docker
registry
hyper/docker-registry-web
```

1. `registry`, `registry-web`을 구성하고 서로 docker network로 엮어 준다.
2. 추가로 registry-web에 env로 `REGISTRY_URL`, `REGISTRY_NAME`을 줘야 한다. 
3. `REGISTRY_URL`는 예를 들어 `http://localhost:port/v2`, `REGISTRY_NAME`는 `http://localhost:port`
4. 둘 다 포트를 개방한다. web은 외부에서 접속할 경우, registry는 이미지를 pull, push 할 때 주로 사용할 것이다.
5. `curl -XGET localhost:5000/v2/_catalog`로 레지스트리를 확인하고 `curl -XGET localhost:5050/`으로 web도 확인해 본다. 


## 이미지 태그 변경
`docker tag  원본:태그   도커 허브 주소:도커 허브 포트/원본:태그`

## 이미지 푸시
`docker push 도커 허브 주소:도커 허브 포트/원본:태그`

## 이미지 풀
`docker pull 도커 허브 주소:도커 허브 포트/원본:태그`

## 이슈!
apache로 연결시 `unknown blob` 메시지 출력 시
```conf 
Header add X-Forwarded-Proto "https"
RequestHeader add X-Forwarded-Proto "https"
```

1. X-Forwarded-Proto(XFP) 란?
X-Forwarded-Proto (XFP) 헤더는 클라이언트가 프록시 또는 로드 밸런서에 접속하는데에 사용했던 
프로토콜(HTTP 또는 HTTPS)이 무엇인지 확인하는 사실상의 표준 헤더 입니다.

2. 클라이언트 -> Proxy 서버 -> 웹 서버

그래서 클라이언트의 HTTP/HTTPS 정보를 프록시에서 X-Forwarded-Proto 요청 헤더를 담아 웹 서버로 전달해줘야 한다. 
만약 설정하지 않으면 클라이언트는 HTTPS로 접속을 하지만 웹 서버(웹 어플리케이션에서)에서는 프록시에서는 HTTP로 요청하기 때문에 클라이언트의 정보와 틀릴 수 있다.


