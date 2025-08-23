---
layout: post
categories: [ARCHITECTURE, DDD, HEXAGONAL]
---

# Driving, Driven Operation

- 헥사고날을 둘러싼 환경을 설명하기 위해서는 Driving, Driven Operation 을 알아야 한다.
- 이들은 헥사고날 애플리케이션과 상호작용하는 외부 요소를 나타낸다.
- driving operation은 다양한 관점을 가정할 수 있다. 예를 들어 UI 애플리케이션을 들 수 있다.
- 혹은 헥사고날 시스템 간 통신을 통해서 서로가 서로의 driving, driven 관계가 될 수도 있다.
> - driving은 actor가 헥사고날 시스템의 행위를 유도하는 요청에서 비롯한다.
> - driven은 헥사고날 시스템에 의해서 DB나 다른 시스템 같은 보조 액터쪽으로 시작된 요청이다.

