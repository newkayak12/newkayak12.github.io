---
layout: post
categories: [CI/CD]
---
from [Dictionary - Deploy](https://github.com/newkayak12/Dictionary/blob/master/cicd/02.Deploy.md)



# Deploy
## 1. Rolling
![Rolling.png](/assets/img/cicd.png)

kubernetes에서 공부했던 Rolling이다. 하나씩 변경점을 반영하며 전파되는 형식
단점으로 부하 계산을 잘못하면 문제가 될 수 있다.  (70, 70, 70) -> (0, 105, 105)

## 2. BlueGreen
![BlueGreen.png](/assets/img/cicd1.png)

일전에 jojoldu의 책에서 nginx로 새로운 서버로 포트만 바꿔주던 식의 신, 구 서버 스위칭 형식이다. 
단점으로 구/ 신버전을 모두 유지해야 하므로 리소스가 2배가 된다.


## 3. Canary
독가스 검사하는 카나리아에서 차용한 듯
![Canary.png](/assets/img/cicd2.png)

특정 서버만 배포하고 배포된 서버로 트래픽을 늘려서 문제가 없으면
점진적 배포를 하는 방식이다. 결과적으로 모든 서버에 배포한다.
