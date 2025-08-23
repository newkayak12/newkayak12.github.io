---
layout: post
categories: [NETWORK]
---
from [Dictionary - Nginx](https://github.com/newkayak12/Dictionary/blob/master/Nginx/01.ReverseProxy.md)




# Nginx 기본 + ReverseProxy

## [ReverseProxy에 대한 기본 내용 참조 ](../apache/01.ReverseProxy.md)

## Config

```nginx
server {
    listen 80;
    server_name www.example.com;
## 띄어쓰기 민감한 편
    if ($http_x_forwarded_proto = 'http'){
            return 301 https://$host$request_uri;
    }
}

server {
    listen 443;
    server_name www.example.com;
    root /{rootPath};
    index index.html;
    
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```


## Syntax
`nginx -t` 로 syntax 점검을 받을 수도 있다.