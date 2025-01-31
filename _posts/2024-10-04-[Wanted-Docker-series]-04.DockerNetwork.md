---
layout: post
categories: [DOCKER, WANTED]
---

# Docker Network
- 컨테이너 간 통신을 가능하게 한다.
- 브릿지, 호스트, 오버레이 등의 종류가 있다.

## 기본 개념
- 컨테이너 간 서로 통신하고 외부 네트워크와 연결될 수 있도록 네트워크 환경을 구성하는 기술
- 각 컨테이너는 고유한 네트워크 네임스페이스를 가지고, 격리됨

## 필요성
1. 격리와 보안
   - 네트워크 네임스페이스로 컨테이너 간 네트워크 분리
   - 독립된 네트워크 환경 구성으로 서로 영향을 미치지 않음
2. 유연한 구성
   - 다양한 네트우커 브릿지로 네트워크를 유연하게 구성할 수 있다.
   - 컨테이너 간 통신, 외부 네트워크와의 통신, 다중 호스트 간의 통신을 손쉽게 설정할 수 있다.
3. 확장성
   - 도커 네트워킹을 통해 컨테이너 기반 애플리케이션의 네트워크를 쉽게 확장할 수 있다.
   - 오버레이 네트워크를 사용하면 다중 호스트 간의 통신을 지원하여 클러스터 환경에서도 유연하게 네트워크 확장이 가능

## 네트워크 특징
### 브릿지
- 브릿지 네트워크는 기본 네트워크 드라이브다. 호스트 내의 컨테이너 간 통신을 지원
- 가상의 브리지 인터페이스를 통해 각 컨테이너를 연결하여, 동일한 네트워크 세그먼트에 있는 것처럼 동작

1. 특징
   1. 격리된 환경
   2. 간편한 설정: 기본 설정으로 자동 생성
   3. 내부 통신 지원: 브리지 네트워크에 연결된 컨테이너 간에는 IP주소를 통해서 서로 통신할 수 있다.
      - 브리지 네트워크에 연결된 컨테이너 간에는 IP 주소를 통해서 서로 통신할 수 있다.
      - 각 컨테이너는 브리지 네트워크에 의해서 가상의 스위치에 연결된 것처럼 동작
        - 스위치는 컴퓨터 네트워크에서 여러 장치를 연결하여 데이터 패킷을 전달하는 장치다. 스위치는 네트워크 세그먼트 내의 장치들이 서로 데이터를 주고받을 수 있도록 도와준다.
      - 브리지 네트워크에서 가상 스위치는 실제 물리적인 스위치와 같은 역할을 하여, 컨테이너 간의 데이터를 전달하고 통신을 가능하게 한다.
2. 인터페이스 설명
   1. eth0: 컨테이너 내부에서 eth0는 외부 네트워크와 통신을 위한 가상 네트워크 인터페이스다. 이는 컨테이너가 브리지 네트워크를 통해서 외부와 통신할 수 있도록한다. eth0는 컨테이너 내에서 기본 네트워크 인터페이스로 사용된다.
   2. docker0: 호스트 시스템에서 기본 브리지 네트워크 인터페이스다. 이는 호스트와 모든 브리지 네트워크에 연결된 컨테이너 간의 통신을 가능하게 한다. 모든 브리지 네트워크에 연결된 컨테이너는 docker0를 통해서 서로 통신할 수 있다.
   3. veth: virtual ethernet pair로 작동한다. 하나의 인터페이스는 컨테이너 내에 존재하고, 다른 하나는 호스트 시스템에 존재한다.

### 호스트 네트워크
- 호스트 네트워크 모드에서는 컨테이너가 호스트의 네트워크 스택을 공유
- 컨테이너가 호스트의 IP주소를 직접 사용하며, 네트워크 인터페이스를 그대로 사용한다. 컨테이너가 호스트의 네트워크 환경을 그대로 사용하게 하여, 네트워크 성능을 극대화할 수 있지만, 격리도는 낮아짐

1. 특징
   1. 고성능: 네트워크 스택을 공유하기 때문에 네트워크 오버헤드가 줄어들어 성능이 향상
   2. 제한된 격리: 컨테이너가 호스트 네트워크를 공유하므로, 격리도가 떨어짐 (보안 문제)
   3. 단일 호스트 환경에서 유용: 단일 호스트 내에서 네트워크 성능을 극대화하고자 할 때 유용하다.

### 오버레이 네트워크
- 오버레이 네트워크는 다중 호스트 간의 네트워크를 구성하여, 클러스터 환경에서 컨테이너 간 통신을 지원한다.
- 가상 네트워크를 통해서 물리적으로 분산된 노드를 연결
1. 특징
   - 클러스터 환경 지원: 다중 호스트 간 통신을 지원하여, kubernetes와 같은 오케스트레이션 도구와 함계 사용됨
   - 확장성 : 네트워크를 쉽게 확장할 수 있어 대규모 애플리케이션 배포에 적합함
   - 보안: 네트워크 오버레이를 통해 트래픽을 암호화하여 보안을 강화할 수 있다.