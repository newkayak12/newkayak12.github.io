---
layout: post
categories: [DOCKER, WANTED]
---

# Docker Concept

## 컨테이너와 단일 애플리케이션 프로세스
- 컨테이너는 주로 하나의 애플리케이션 프로세스를 실행하기 위해서 설계됐음

1. 격리성
   - 컨테이너는 프로세스를 격리된 환경에서 실행함으로써 다른 컨테이너와 독립적으로 작동하도록 설계됨
   - 각 컨테이너는 자체 파일 시스템, 네트워크 인터페이스, 프로세스 공간을 가지고 있어서 컨테이너 간 영향을 미치지 않는다.
2. 확장성
   - 단일 프로세스를 실행하는 컨테이너는 ScalingOut이 쉽다.
   - 필요한 경우 동일 컨테이너를 여러 개 실행해서 부하 분산이 가능
3. 관리 용이성
   - 단일 프로세스를 실행하는 컨테이너는 관리가 용이하다.
   - 컨테이너 상태가 명확하여, 실행중인 프로세스를 쉽게 모니터링하고 관리할 수 있다.
   - 로그, 모니터링, 디버깅 등의 고나리 작업이 간단해진다.
4. 안정성 및 신뢰성
   - 단일 프로세스 컨테이너는 하나의 프로세스가 실패해도 다른 컨테이너에 영향을 주지 않으므로, 시스템 전체 안정성을 높일 수 있다.
   - 하나의 컨테이너가 실패하면, 그 컨테이너만 재시작하면 된다.
5. CI/CD
   - 단일 프로세스를 실행하는 컨테이너는 CI/CD 파이프라인에서 개별적으로 빌드, 테스트, 배포하기 쉽다.
   - 애플리케이션의 각 구성 요소를 독립적으로 개발, 배포할 수 있어서 배포 주기를 단축하고 변경 사항을 쉽게 관리할 수 있다.


## 도커 구성요소
### DockerDaemon
-> dockerd로 불리며 도커 엔진의 핵심 백그라운드 프로세스다. 컨테이너 생성, 관리, 모니터링, 삭제 등을 수행
-> 이미지 빌드, 컨테이너 실행 및 관리, 네트워킹 데이터 볼륨 관리 등의 작업을 처리함

### DockerClient
-> 도커 클라이언트는 docker 명령어로 데몬과 사용자 간 인터페이스

### DockerImage
-> 도커 이미지는 애플리케이션과 필요한 모든 종속성을 포함한 불변의 파일 시스템임(UFS). 이미지는 여러 layer 계층으로 구성되며, 각 게층은 이전 계층을 기반으로 한다.
-> 컨테이너 실행 환경을 제공한다. 이미지를 기반으로 컨테이너를 생성함

> UFS(UnionFileSystem)
> 여러 개의 파일 시스템을 하나의 파일 시스템에 마운트하는 기능이다.
> 여러 파일 시스템을 하나로 합치다보면 중복되는 파일이 있을 수 있는데, UFS이 경우 나중에 마운트된 파일로 덮어쓴다.(overlay)
> 

## DockerContainer
-> 도커 컨테이너는 도커 이미지를 실행한 상태이다. 컨테이너는 격리된 환경에서 애플리케이션을 실행하며, 필요한 리소스와 네트워스 설정을 포함한다.

## DockerRegistry
-> 도커 레지스트리는 도커 이미지를 저장하고 배포하는 역할을 한다. 도커 허브와 같은 퍼블릭 레지스트리가 있으며 private registry도 설정이 가능하다

## DockerEngine
1. build
-> 컨테이너를 실행하기 전에, 도커 엔진은 해당 애플리케이션을 실행하는데 필요한 모든 파일과 설정이 포함ㄷ회니 도커 이미지가 필요
2. run
-> 이미지가 준비되면, 도커 데몬은 지정된 이미지를 기반으로 docker run 명령어를 사용해서 컨테이너를 생성하고 실행한다.
3. manage
-> 사용자는 도커 CLI를 통해서 명령어로 실행 중인 컨테이너를 조회하고, 로그를 확인하며, 필요한 경우 컨테이너를 중지, 재시작 또는 삭제할 수 있다.

### 장점
1. 격리된 환경
2. 이식성
3. 효율성
4. 확장성


