---
layout: post
categories: [ARCHITECTURE, DDD, HEXAGONAL]
---

## 헥사고날
- 여러 가지를 고려했을 때 헥사고날 아키텍쳐가 꽤나 클린아키텍쳐에 부합한다.
- 물론 헥사고날이 silver bullet은 아니다.
- 앞서 본 바와 같이 `inputPort`, `ouputPort`로 관심사를 한정하고, 의존성 역전을 실행한다.
- 이 두 가지를 가지면서 유지보수에 용이한 SW로의 발걸음을 내딛을 수 있다.
- 물론 trade-off는 뒤따르기 마련이다. 막대한 보일러플레이트가 따라온다.

## pacakge 구성
 <pre>
 {somethingNeedToResolveDomainName}
            ᅡ- application
            ᅵ     ᅡ ports
            ᅵ     ᅵ  ᅡ input
            ᅵ     ᅵ  ᅵ  ᄂ ExampleUseCase
            ᅵ     ᅵ  ᅵ
            ᅵ     ᅵ  ᅡ output
            ᅵ     ᅵ      ᄂ ExamplePort
            ᅵ     ᅵ
            ᅵ     ᅡ service
            ᅵ     ᅵ  ᅡ ...Service
            ᅵ
            ᅡ- domain 
            ᅵ     ᅡ model
            ᅵ         ᄂ ... 
            ᅵ     
            ᅡ adapter
                ᅡ input
                ᅵ   ᄂ rest
                         ᄂ ...Controller
                ᅡ output
                    ᄂ persistence
                         ᄂ ...DatabaseAdapter
                         ᄂ ...JpaRepository
                         ᄂ ...QueryDSLRepository
</pre>

- service는 책임을 좁혀서 특정 UseCase를 채용한 목적에 확실한 domainService로 구성한다.
- `~Controller`는 `~UseCase`에 의존한다.
- `~Service`는 `~UseCase`를 구현한다.
- `~Service`는 `~Port`에 의존한다.
- `~DatabaseAdapter`는 `~Port`를 구현한다.
- `port` 들은 public이어야 한다.
-  Service를 중심으로 의존성 주입을 사용할 수 있다.