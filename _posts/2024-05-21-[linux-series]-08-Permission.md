---
layout: post
categories: [LINUX]
---
from [Dictionary - Permission](https://github.com/newkayak12/Dictionary/blob/master/linux/Permission.md)
> 서버 반영/CICD 작업 중 권한 문제로 고생해서 정리

## Permission
![](/assets/img/permission.png)
user : 파일 소유주
group : 파일을 만든 소유주가 속한 그룹의 사용자
other : 기타 사용자




| 문자 값  |	파일|	디렉토리|
|:------|:---|:---|
| r(4)  |	파일에 대한 읽기 권한. 열기, 읽기 허용	|디렉토리 내의 파일을 나열할 수 있게 허용
| w(2)	 |파일에 대한 쓰기 권한. 쓰기, 잘라내기 허용 <br> 이름 변경이나 파일 삭제 허용하지 않음. <br>파일 삭제나 파일 이름 변경은 디렉토리 속성에 의해 결정됨|디렉토리 내의 파일들을 생성, 삭제, 이름변경이 가능하도록 허용
| x(1)	 |파일에 대한 실행 권한 파일이 프로그램으로 처리되고 파일이 실행되도록 허용 스크립트 언어에서 작성된 프로그램 파일들은 읽기 가능으로 설정 되어 있어야만 실행 가능함| 디렉토리 내에서 탐색을 위해 이동 할 수 있도록 허용 (디렉토리에 들어올 수 있도록 허용 )

![](/assets/img/permission2.png)
![](/assets/img/permission3.png)

## chmod : 허가권 변경
```dockerfile
-R, --recursive	특정 디렉터리 내의 파일과 디렉터리에 대해 재귀적으로 허가권 변경
-C, --changes	변경된 파일이나 디렉터리에 대한 자세한 정보를 출력
-f , --silent, --quite	대부분의 에러메시지 출력을 제한
--reference	모드 대신 파일에 지정한 모드를 사용 
```

## chown : 사용자 및 그룹 소유권 변경
```dockerfile
chown [options] owner:[group] files
```
option
```dockerfile
-R, --recursive	특정 디렉터리 내의 파일과 디렉터리에 대해 재귀적으로 허가권 변경
-C, --changes	변경된 파일이나 디렉터리에 대한 자세한 정보를 출력
-f , --silent, --quite	대부분의 에러메시지 출력을 제한
--reference	모드 대신 파일에 지정한 모드를 사용 
```
## chgrp : 파일이나 디렉토리의 그룹 소유권만 변경
chgrp [options] group file


https://inpa.tistory.com/entry/LINUX-📚-파일-권한-소유권허가권-💯-정리#