---
layout: post
categories: [OTHERS]
---
from [Dictionary - Network](https://github.com/newkayak12/Dictionary/blob/master/cs/Network.md)



# Network

## Basic
1. LAN : Local Area Network
2. MAN : Metropolitan Area Network
3. WAN : Wide Area Network

## TCP/IP 4계층 - OSI 7계층
![](/assets/img/layer.png)

### TCP/IP 4계층
- L4 (애플리케이션 계층) : FTP/ HTTP/ SSH/ SMTP/ DNS -> 프로토콜 계층
- L3 (전송 계층): TCP/ UDP/ QUIC -> 송,수신자를 연결하는 계층
- L2 (인터넷 계층) : IP/ ARP/ ICMP -> 네트워크 패킷을 IP주소로 지정된 목적지로 전송하기 위해서 사용하는 계층 
- L1 (링크 계층) : ethernet -> 전선, 광섬유, 무선 등으로 실질적으로 데이터를 전달하며 장치 간의 신호를 주고 받는 규칙을 정하는 계층 

### OSI 7
- L7 (응용 계층) : HTTP/ FTP/ SMTP/ POP3/ IMAP/ Telnet과 같은 프로토콜이 있다. -> 응용 서비스를 수행 (L7 스위치) 
- L6 (표현 계층) : 코드 간의 번역을 담당하며, 사용자 시스템에서 데이터의 형식상 차이를 다루는 부담을 덜어준다. -> MIME 인코딩, 암호화 같은 동작을 수행 (압축, 포장, 암호화)
- L5 (세션 계층) : 데이터가 통신하기 위한 노리적 연결을 한다. -> 양 끝단의 응용 프로세스가 통신을 관리하기 위한 방법을 제공 (duplex, half-duplex, full-duplex), TCP/IP 세션을 만들고 없애는 책임을 가진다.
- L4 (전송 계층) : 통신을 활성화 하기 위한 계층 단대단 오류제어 및 흐름 제어(UDP/TCP) -> 특정 연결의 유효성을 제어하고, 일부 프로토콜은 상태 개념이 있으며 연결 기반이다. (이는 전송계층이 패킷들의 전송이 유효한지 확인하고 실패한 패킷들을 다시 전송한다는 것이다.)
- L3 (네트워크 계층) : 라우팅이 가장 중요한 기능이다. -> IP주소 부여, 라우팅 (라우터, L3 스위치) 
- L2 (데이터 링크 계층) : 물리 계층을 통해 송수신되는 정보의 오류와 흐름을 관리하여 안전한 정보 전달을 수행할 수 있도록 도와주는 역할을 한다. -> mac을 가지고 통신한다. 이 계층에서 전송되는 단위를 프레임이라고 한다. (L2 스위치, 브리지)
- L1 (물리 계층) : 전기적, 기계적 기능적인 특성을 이용해서 통신 케이블로 데이터를 전송한다. -> 단순 전기적 신호를 변환해서 주고 받는다. ( NIC, 리피터, AP) 
