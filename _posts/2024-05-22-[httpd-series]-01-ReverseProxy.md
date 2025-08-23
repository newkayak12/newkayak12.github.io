---
layout: post
categories: [APACHE]
---
from [Dictionary - HTTPD CONFIG](https://github.com/newkayak12/Dictionary/blob/master/apache/01.ReverseProxy.md)

# ReverseProxy

Proxy는 Forward / Reverse Proxy 두가지가 있는데,
보통 Forward Proxy는 사내망 Client에서 외부에 있는 웹서버를 접근할 때 사용되며(미리 Proxy 지정이 필요함),
Reverse Proxy는 Client에서 웹서버에 접근 할 때, 내부망에 위치한 WAS서버를 대신하여 요청한 Request에 대해 Response를 하는 구조이다.

아파치와 톰캣에 리버스 프록시(reverse proxy) 환경을 구축하는 이유는 톰캣에 올린 웹 서비스의 서버 ip를 외부 사용자로부터 감추기 위한 것이며(보안), 로드밸런싱 기능으로 트래픽 분산을 하여 서버의 가용성을 유지하기 위해서 인프라를 구성하기 위해서 이다.

```
<VirtualHost *:80>
	
	# Forward Proxy 경우 On / Reverse Proxy Off
	ProxyRequests Off

	# 호스트가 받은 HTTP 요청을 Proxy 요청시 사용
    # Reverse 경우 On으로 해야함
	ProxyPreserveHost On

	# Proxy에 연결할 URL 
    # ServerHost:localhost -> Apache -> ProxyPass URL
	ProxyPass / http://192.168.10.146:8080/service/ # 뒤에 슬래쉬는 붙여줘야함

	# WAS 가 redirect HTTP 응답을 보냈을 경우 Location, Content-Location HTTP 헤더를 수정 클라이언트에 전달한다.
	# reverse proxy가 이 헤더를 수정하지 않으면 클라이언트는 redirect 시 제대로 연결할 수 없으므로 꼭 설정해야 한다.
	ProxyPassReverse / http://192.168.10.146:8080/service/

	# 로드밸런싱 - 경로 분기
	<Location /html>
		ProxyPass http://192.168.10.146:8080/html/
		ProxyPassReverse http://192.168.10.146:8080/html/
	</Location>
    
    <Location /user>
		ProxyPass http://192.168.10.146:8080/user/
		ProxyPassReverse http://192.168.10.146:8080/user/
	</Location>
	
</VirtualHost>
```