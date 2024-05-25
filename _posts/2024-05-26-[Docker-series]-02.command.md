---
layout: post
categories: [DOCKER]
---


from [Dictionary - Command](https://github.com/newkayak12/Dictionary/blob/master/docker/02.command.md)


# Command

## create
'docker run -i -t --name [컨테이너 이름] -p [호스트IP]:[호스트 포트]:[컨테이너 포트] [이미지]:[버전]'

## list
'docker ps' : 'docker ps'는 정지되지 않은 컨테이너만 출력합니다.

## remove
'docker rm -f [컨테이너 명]'
'docker conatiner prune' :  일괄 삭제

## link
'--link wordpressdb:mysql' :  IP를 몰라도 mysql이라는 호스트명으로 접근할 수 있도록 한다.

## 권한 수정

> sudo usermod -aG docker [userName]
> sudo service docker restart