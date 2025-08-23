---
layout: post
categories: [DOCKER]
---



from [Dictionary - Compose](https://github.com/newkayak12/Dictionary/blob/master/docker/04.dockerDaemon.md)


# Compose

## 사용 이유
```docker
    매번 run 명령어에 옵션을 설정해 CLI로 컨테이너를 생성하기보다는 여러 개의 컨테이너를 하나의 서비스로 정의해 컨테이너 묶음으로 관리하면 더 편한 것이다.
    이를 위해서 도커 컴포즈(Oocker Compose)는 컨테이너를 이용한 서비스의 개발과 CI를 위해 여러 개의 컨테이너를 하나의 프로젝트로서 다룰 수 있는 작업 
    환경을 제공한다.
    
    도커 컴포즈는 여러 개의 컨테이너의 옵션과 환경을 정의한 파일을 읽어 컨테이너를 순차적으로 생성하는 방식으로 동작한다. 도커 컴포즈의 설정 파일은 run
    명령어의 옵션을 그대로 사용할 수 있으며, 각 컨테이너의 의존성, 네트워크 볼륨 등을 함께 정의할 수 있다. 또한 스웜 모드의 서비스와 유사하게 설정 
    파일에 정의된 서비스의 컨테이너 수를 유동적으로 조절할수 있으며 컨테이너의 서비스 디스커버리도 자동으로 이뤄진다. 이러한 기능이 필요하지 않은 소규모
    컨테이너 개발 환경에서는 도커 엔진의 run 명령어로 컨테이너를 생성하는 것이 더 편리할 수 있다. 그렇지만 컨테이너의 수가 많아지고 정의해야 할 옵션이
    많아진다면 도커 컴포즈를 사용하는 것이 좋다.
```

```yaml
## 1) 버전 정의
## YAML 파일 포맷에는 버전 1, 2, 2.1, 3이 있다. 버전 3은 도커 스웜모드와 호환이 되는 버전이다.
## 버전 항목은 일반적으로 YAML 파일의 맨 윗부분에 명시한다. 
  version: '3.0'

## 2) 서비스 정의 
## 서비스는 도커 컴포즈로 생성할 컨테이너 옵션을 정의한다. 이 항목에 쓰인 각 서비스는 컨테이너로 구현되며, 하나의 프로젝트로서 도커 컴포즈에 의해 관리된다. 
## 서비스의 이름은 services의 하위 항목으로 정의하고, 컨테이너의 옵션은 서비스 이름의 하위 항목에 정의한다.

    services:
      my_container_1:
        image: ...
          links:
            - db
            - db:database
            - redis
          command: apachectl -DFOREGOURND
      my_container_2:
        image: ...
        environment:
          - MYSQL_ROOT_PASSWORD=mypassword
          - MYSQL_DATABASE_NAME=mydb
          ##또는
          MYSQL_ROOT_PASSWORD: mypassword
          MYSQL_DATABASE_NAME: mydb
        command:[apachectl, -DFOREGROUND]
        depends_on
          - mysql
        ports:
          - "8080"
          - "8081-8085"
          - "80:80"
       
## - image: 서비스의 컨테이너를 생성할 떄 쓰일 이미지의 이름을 설정한다. 이미 지름 포맷은 docker run과 같다.
##  만일 이미지가 도커에 존재하지 않으면 저장소에서 자동으로 pull한다.

## - links: docker run 명령어의 --link와 같으며, 다른 서비스에 서비스명만으로 접근할 수 있도록 설정한다. [SERVICE:ALIAS]의 형식을 사용하면 
##  서비스에 별칭으로도 접근할 수 있다.

## - environment: docker run 명령어의 --env, -e 옵션과 동일하다. 서비스의 컨테이너 내부에서 사용할 환경변수를 지정하며, 딕셔너리(Dictionary)나
##  배열 형태로 사용할 수 있다.
  
## - command : 컨테이너가 실행될 때 수행할 명령어를 설정하며, docker run 명령어의 마지막에 붙는 커맨드와 같다. Dockerfile의 RUN 과 같은 배열
##  형태로도 사용할 수 있다.
  
## - depends_on : 특정 컨테이너에 대한 의존 관계를 나타내며, 이 항목에 명시된 컨테이너가 먼저 생성되고 실행된다. links도 depends_on과 같이
##  컨테이너의 생서 ㅇ순서와 실행 순서를 정의하지만 depends_on은 서비스 이름으로만 접근할 수 있다는 점이 다르다.
  
  
  ## > 특정 서비스의 컨테이너만 생성하되 의존성이 없는 컨테이너를 생성하려면 --no-deps 옵션을 사용한다.
     "docker-compose up --no-deps web"

  {
    links, depends_on 모두 실행 순서만 설정할 뿐 컨테이너 내부의 애플리케이션이 준비된 상태인지에 대해서는 확인하지 않는다. 예를 들어서 데이터베이스 
    컨테이너와 웹 서버 컨테이너가 정해진 순서대로 실행됐더라도 데이터베이스가 초기화 중이라면 웹 서버 컨테이너가 정상적으로 동작하지 않을 수 있다. 이를 
    해결하는 방법으로 컨테이너에 셸 스크립트를 entrypoint로 지정하는 방법이 있다. YAML 파일의 entrypoint에서 지정할 수 있다.
    
      services:
        web:
          entrypont: ./sync_script.sh mysql:3306
    
    entrypoint에 저장된 sync_script.sh는 until 구문의 조건 안에 다른 컨테이너의 애플리케이션이 준비됐는지 확인하는 명령어를 입력한다. 예를 들어
    curl mysql:3306을 조건으로 넣는다면 mysql 데몬이 준비될 때까지 기다린다. 
        
        [
          until (상태를 확인할 수 있는 명령어); do
              echo "depend container is not available yet"
              sleep 1
          done
          echo "depends_on container is ready"
        ]
  }

## - ports:  docker run 명령어의 -p와 같으며 서비스의 컨테이너를 개방할 포트를 설정한다. 그러나 단일 호스트 환경에서 80:80과 같이 호스트의 특정 
##   포트를 서비스의 컨테이너에 연결하면 docker-compose scale 명령어로 서비스의 컨테이너 수를 늘릴 수 없습니다.
    services:
      web:
        image : alicek106/composetest:web
          ports:
            - "8080"
            - "8081-8085"
            - "80:80"
## - build: build 항목에 정의된 Dockerfile에서 이미지를 빌드해 서비스의 컨테이너를 생성하도록 설정한다. 
    services:
        web:
          build: ./composetest
          image: alicek106/composetest:web
##    또는 build 항목에서는 Dockerfile 사용될 컨텍스트나 Dockerfile의 이름, Dockerfile에서 사용될 인자 값을 설정할 수 있다. image 항목을 설정하지 않으면
##    이미지의 이름은 [프로젝트 이름]:[서비스 이름]이 된다.
    services:
      web: 
        build: ./composetest
        context: ./composetest
        dockerfile: myDockerfile
        args:
          HOST_NAME: web  
          HOST_CONFIG: self_config

      {
        build 항목을 YAML 파일에 정의해 프로젝트를 생성하고 난 뒤 Dokcerfile을 변경하고 다시 프로젝트를 생성해도 이미지를 새로 빌드하지 않는다. 
        'docker-compose up -d'에 '--build' 옵션을 추가하거나 docker-compose build 명령어를 사용해서 Dockerfile이 변경돼도 컨테이너를 생성할 때마다 
        빌드하도록 설정할 수 있다.
        
          'docker-compose up -d --build'
          'docker-compose build [yml 파일에서 빌드할 서비스 이름]'
      }

## - extends: 다른 YAML 파일이나 현재 YAML 파일에서 서비스 속성을 상속받게 설정한다. 다음과 같이 2개의 YAML 파일이 있을 때 docker-compose.yml의 web 서비스는
##    extend_compose.yml의 extend_web 서비스의 옵션을 그대로 갖게 된다. 즉, web 서비스의 컨테이너는 ubunutu:14.04 이미지의 80:80 포트로 설정된다. file
##    항목을 설정하지 않으면 현재 YAML 파일에서 extends할 서비스를 찾는다 .


####  설정을 상속받을 docker-compose.yml 파일
    
  version: '3.0'
    services:
      web:
        extends:
          file: extend_compose.yml
          service: extend_web
          
#### 설정을 상속해줄 extend_compose.yml 파일
  version: '3.0'
    services:
      extend_web:
      image: ubuntu:14.04
      ports:
        - "80:80"
  
#### 그러나 depends_on, links, volumes_from 항목은 각 컨테이너 사이의 의존성을 내포하므로 extends로 상속받을 수 없다.

## 3) 네트워크 정의 
## - driver: 도커 컴포즈는 생성된 컨테이너를 위해 기본적으로 브릿지 타입의 네트워크를 생성한다. 그러나 YAML 파일에서 driver 항목을 정의해서 서비스의 컨테이너가 
##  브릿지 네트워크가 아닌 다른 네트워크를 사용하도록 설정할 수 있다. 특정 드라이버에 필요한 옵션은 하위 항목인 driver_opts로 전달할 수 있다.
  
  version: '3.0'
  services:
    myservice:
      image: nginx
      networks:
        - mynetwork
  networks:
    mynetwork:
      driver: overlay
      driver_opts:
        subnet: "255.255.255.0"
        IPAddress: "10.0.0.2"

##   위의 예시는 docker-compose up -d 명령어로 컨테이너를 생성할 때 mynetwork라는 overlay 타입의 네트워크도 함께 생성하고,  myservice 서비스의 네트워크가
##   mynetwork 네트워크를 사용하도록 설정한다. 단, overlay 타입의 네트워크는 스웜 모드나 주키퍼를 사용하는 환경이어야만 생성할 수 있다.

## - ipam: IPAM( IP Address Manager )ㄹㅡㄹ 위해 사용할 수 있는 옵션으로 subnet, ip 범위 등을 설정할 수 있다. driver 항목에는 IPAM을 지원하는 드라이버의
##  이름을 입력한다.
  
    services:
        ...
    
    networks:
        ipam:
          driver: mydriver
          config:
            subnet: 172.20.0.0/16
            ip_range: 172.20.5.0/24
            gateway: 172.20.5.1

## - external : YAML 파일을 통해 프로젝트를 생성할 때마다 네트워크를 생성하는 것이 아닌, 기존의 네트워크를 사용하도록 설정한다. 이를 설정하려면 사용하려는 외부
##  네트워크의 이름을 하위 항목으로 입력한 뒤, external의 값을 treu로 설정한다. external 옵션은 준비된 네트워크를 사용하므로 driver, driver_opts, ipam 옵션과
##  함꼐 사용할 수 없다.
    
    services:
      web:
        image: alicek106/composetest:web
        networks:
          -alicek106_network
    networks:
      alicek106_network:
        external: true

##  위의 예제는 서비스의 컨테이너가 기존의 alicek106_network라는 이름의 네트워크를 사용하도록 설정한다.

## 4) 볼륨 정의
## - driver : 볼륨을 생성할 때 사용될 드라이버를 설정한다. 어떠한 설정도 하지 않으면 local로 설정되며 사용하는 드라이버에 따라 변경해야한다. 드라이버를 사용하기 위한 
## 추가 옵션은 하위 항목인 driver_opts를 통해 인자로 설정할 수 있다.

  version: '3.0'
  services:
    ...
  volumes:
    driver: flocker
      driver_opts:
        opt: "1"
        opt2: 2

## - external : 도커 컴포즈는 YAML 파일에서 volume, volumes-from 옵션 등을 사용하면 프로젝트마다 볼륨을 생성한다. 이때 external 옵션을 설정하면 볼륨을 
##  프로젝트 생성할 때마다 생성하지 않고 기존 볼류믕ㄹ 사용하도록 설정한다. 

  services:
    web:
      image: alicek106/composetest:web
      volumes:
        - myvolume:/var/www/html
  volumes:
    myvolume:
      external: true

## 위의 예제에서 myvolmue이라는 이름의 외부 볼륨을 web 서비스의 컨테이너에 마운트 한다. 


##  5) YAML 파일 검증하기
##  YAML 파일을 작성할 때 오타 검사나 파일 포맷이 적절한지를 검사하려면 'docker-compose config' 명령어를 사용한다. 기본적으로 현재 디렉토리의 
##  docker-compose.yml 파일을 검사하지만 docker-compose -f (yml 파일 경로) config와 같이 검사할 파일의 경로를 설정할 수 있다. 

    'docker-compose config'
```