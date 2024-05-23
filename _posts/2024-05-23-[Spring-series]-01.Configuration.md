---
layout: post
categories: [SPRING]
---



from [Dictionary - Spring Yaml settings](https://github.com/newkayak12/Dictionary/blob/master/spring/01.Configuration.md)

# Spring Configuration
## 1. Shutdown Gracefully
```yaml
server:
  shutdown: graceful ##[default immediate]
spring:
  lifecycle:
    timeout-per-shutdown-phase: 2m
```

이러면 -9로 끝내는게 아니라 할 일을 다 마치고 종료된다.
