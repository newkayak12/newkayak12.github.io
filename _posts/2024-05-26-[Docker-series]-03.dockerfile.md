---
layout: post
categories: [DOCKER]
---


from [Dictionary - DockerFile](https://github.com/newkayak12/Dictionary/blob/master/docker/03.dockerfile.md)


# DockerFile

```
    개발한 애플리케이션을 컨테이너화할 때 가장 먼저 생각하는 방법은 아래와 같다.
    
    1. 아무것도 존재하지 않는 이미지(Ubuntu, CentOS 등)로 컨테이너 생성
    2. 애플리케이션을 위한 환경을 설치하고 소스코드 등을 복사해서 잘 동작하는 것을 확인
    3. 컨테이너를 이미지로 커밋
    
    이 방법을 사용하면 애플리케이션이 동작하는 환경을 구성하기 위해 일일이 수작업으로 패키지를 설치하고 소스 코드를 GIT에 복제 하거나
    호스트에서 복사해야한다. 물론 직접 컨테이너에서 애플리케이션을 구동해보고 이미지로 커밋(commit)하기 때문에 이미지의 동작을 보장할 수 있다는
    점도 있다. 
```
이 과정을 기록한 파일의 이름을 DockerFile이라고 한다.

```
 [
        FROM ubuntu:14.04
        MAINTAINER alicek106
        LABEL "pupose"="priactice"
        RUN apt-get update
        RUN apt-get install apache2 -y
        ADD test.html /var/www/html
        WORKDIR /var/ww/html
        RUN ["/bin/bash", "-c", "echo hello >> test2.html"]
        EXPOSE 80
        CMD apachectl -DFOREGROUND
    ]
    
    -----------------------
    
        {
        FROM : 생성할 이미지의 베이스가 될 이미지를 뜻한다. FROM 명령어는 Dockerfile을 작성할 때 반드시 한 번 이상 입력해야
        하며, 이미지 이름의 포맷은 docker run 명령어에서 이름을 사용했을 때와 같다. 사용하려는 이미지가 도커에 없다면 자동으로
        pull한다.
        
        MAINTAINER : 이미지를 생성한 개발자의 정보를 나타낸다. 단 docker 1.13.0 이후로 사용하지 않는다. 
        이후로는 LABEL maintainer "~"로 대체할 수 있다.
        
        LABEL : 이미지를 만들기 위해 컨테이너 내부에서 명령어를 실행한다. 예제에서는 apt-get update,
         apt-get install apache2를 실행했다. 단, Dockerfile을 이미지로 빌드하는 과정에는 별도의 입력이 불가능하기 때문에
         Y/N을 YES로 설정해야한다. 이미지를 빌드할 때 별도의 입력을 받아야하는 RUN이 있다면 build 명령어는 이를 오류로 간주한다.
         
        
        COPY : 호스트에 있는 파일/ 디렉토리를 이미지에 붙여 넣느다.
        
        ADD : 파일을 이미지에 추가한다. 추가하는 파일은 Dockerfile이 위치한 디렉토리인 컨텍스트(Context)에서 가져온다.
        ADD명령어는 JSON 배열의 형태로 ["추가할 파일 이름", ...,"컨테이너에 추가될 위치"]와 같이 사용할 수 있다. 추가할 파일은
        여러 개를 지정할 수 있으며, 배열의 마지막 원소가 컨테이너에 추가될 위치이다.
        
        추가적으로 URL로 파일을 붙여 넣을 수도 있다. 예를 들어 `~.tar.gz`와 같이 쓰면 자동으로 압축까지 해체한다. 
        
        
        WORKDIR : 명령어를 실행할 디렉토리를 나타낸다. 배시 셸에서 cd명령어를 입력하는 것과 같은 기능을 한다. 
        
        EXPOSE : Dockerfile의 빌드로 생성된 이미지에서 노출할 포트를 설정한다. 그러나 EXPOSE를 설정한 이미지로 컨테이너를 
        생성했다고 해서 반드시 이 포트가 바인딩되는 것은 아니며, 단지 컨테이너의 80번 포트를 사용할 것임을 나타내는 것일뿐이다.
        EXPOSE는 컨테이너를 생성하는 run 명령어에서 모든 노출된 컨테이너의 포트를 호스트에 퍼블리시하는 -P 플래그와 함께 사용한다.
        
        
        RUN :  명령어에 배열로 명령어를 입력하면 순서대로 실행한다. 
        
        CMD : CMD는 컨테이너가 시작될 때마다 실행할 명령어를 설정하며, Dockerfile에서 한 번만 사용할 수 있다.
        Dockerfile에 CMD를 명시함으로써 이미지에 apachectl -DFOREGROUND라는 커맨드를 내장하면 컨테이너를 생성할 때 별도의
        커맨드를 입력하지 않아도 이미지에 내장된 apachectl -DFOREGROUND 커맨드가 적용되어 컨테이너가 시작될 때 자동으로 아파치
        웹 서버가 실행된다. 
        
        ENTRYPOINT: 컨테이너가 시작될 때 항상 실행할 명령을 지정한다. `docker run`으로 실행할 때 추가 인자로 덮어 쓸 수 있다. 또한 CMD와 달리 배열형태로 
        지정하는게 아니면 기본 셸로 실행된다. 
    }
```

### RUN vs. CMD vs. ENTRYPOINT

1. RUN : 도커파일로 이미지를 빌드하는 순간 실행되는 명령어다. 따라서 주로 패키지 업데이트, 라이브러리 설치에 사용된다.
2. CMD : 이미지로 컨테이너를 생성할 때 최초록 수행된다. 
3. ENTRYPOINT : CMD와 유사하다 그러나 생성되고 최초로 실행될 때 수행되는 명령어를 지정한다. 