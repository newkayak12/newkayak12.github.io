---
layout: post
categories: [SPRING]
---



from [Dictionary - Eureka](https://github.com/newkayak12/Dictionary/blob/master/spring/04.Eureka.md)




# Spring Eureka

```yaml
eureka:
  client: 
    allow-redirect: #true/false 
## 서버가 클라이언트 요청을 백업 서버/ 클러스터로 리디렉션 할 수 있는지 나타낸다.
## true면 http 리디렉션을 새 서버 위치와 함께 클라인트로 보낼 수 있다.

##    availability-zones: 
## 리전의 가용 영역 목록을 가져옴

     backup-registry-impl: {name}
## BackupRegistry를 구현하는 구현의 이름을 가져온다. (레지스트리 정보에 대한 복원력이 필요할 때)
    
     cache-refresh-executor-exponential-back-oof-bound: 10
## 시간 초과 발생 시 재시도 지연에 대한 최대 승수 값이다.
    
     cache-refresh-executor-thread-pool-size: 2
## 초기화 할 cacheRefreshExecutor 쓰레드 풀 크기
    
     client-data-accept: {name}
## 클라이언트 데이터를 받을 유레카 이름
    
     disable-delta: false
## 유레카 클라이언트가 변경된 부분만 가져올지 정합니다.    
    
     dollar-replacement: _
## $대신할 문자열를 지정합니다.    
    
     escape-char-replacement: __
## _대신할 문자열을 지정합니다.    
    
     enabled: true
## Eureka 클라이언트 활성화에 대한 설정이다.

    eureka-connection-idle-timeout-second: 30
## HTTP 연결이 닫히기 전 idle을 유지할 수 있는 시간을 나타낸다.

    eureka-server-connect-timeout-seconds: 5
## 연결 초과되기 까지 대기하는 시간을 지정한다.

   eureka-server-dns-name: {DNS_NAME}
## 유레카 서버 목록을 가져 오기 위해 쿼리할 DNS 이름을 가져온다.

   eureka-server-port: 8761
## Erureka Server port

   eureka-server-read-timeout-seconds: 8
## read-timeout

   eureka-server-total-connections: 200
## 유레카 클라이언트에서 모든 유레카 서버로 허용되는 총 연결 수

   eureka-server-total-connection-per-host: 50
## 유레카 클라이언트 - 서버 호스트 총 연결 수 

   eureka-service-url-poll-interval-seconds: 0
## 서버 정보의 변경을 폴링하는 빈도를 나타낸다.

   fetch-registry: true
## 이 클라이언트가 유레카 레재스트리 정보를 가져와야하는지 여부를 나타낸다.

   g-zip-content: true
## eureka 서버에서 가져온 콘텐츠를 서버에서 지원할 때 압축할지 여부를 나타낸다.
  
   initial-instance-info-replication-interval-seconds: 40
## 인스턴스 정보를 유레카 서버에 복제하는 초기 시간을 나타낸다.
  
   instance-info-replication-interval-seconds: 30
## 유레카 서버에 복제 할 인스턴스 변경 사항을 복제하는 빈도
  
   proxy-host: {host}
   proxy-port: {port}
   proxy-username: {username}
   proxy-password: {password}
## 프록시 설정
  
   registry-fetch-interval-seconds: 30
## 레지스트리 정보를 가져오는 빈도를 나타낸다.
  
   service-url: url
 
 dashboard:
   enable: true
   path: /

## 대시보드 설정
   
 instance:
   app-group-name: 앱 그룹 이름
## 애플리케이션 그룹 이름     
   appname: {name}  
##  유레카에 등록할 이름을 가져온다.
   health-check-url: { url }
## health check url 설정
   health-check-url-path: /health

   home-page-url: {url}
   home-page-url-path: /
  
   instance-id: {ID}
## 인스턴스의 고유 아이디
   
   lease-expiration-duration-in-seconds: 90
##  마지막 heartbeat - 인스턴스 제거 전 사이 시간을 지정한다.
   lease-renewal-interval-in-seconds: 30
##  하트 비트 인터벌을 정한다.( exipration-duration 보다 작아야 한다.)
   prefer-ip-address: false
##  호스트 이름 추측에 IP 주소를 사용해야 함을 나타내는 플래그

```